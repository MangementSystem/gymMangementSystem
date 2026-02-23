'use client';

import { useState } from 'react';
import { useCreateTransactionMutation, useGetTransactionsQuery } from '@/lib/api/transactionsApi';
import { selectCurrentOrganization, addNotification } from '@/lib/redux/slices/uiSlice';
import { useAppDispatch, useAppSelector } from '@/lib/redux/hooks';
import { CreditCard, DollarSign, Plus, TrendingUp } from 'lucide-react';

export default function TransactionsPage() {
  const currentOrganization = useAppSelector(selectCurrentOrganization);
  const [openCreate, setOpenCreate] = useState(false);
  const [form, setForm] = useState({
    type: 'membership',
    category: 'membership',
    amount: 0,
    status: 'completed',
    description: '',
  });

  const { data: transactions, isLoading } = useGetTransactionsQuery({
    organizationId: currentOrganization || undefined,
  });
  const [createTransaction, { isLoading: isCreating }] = useCreateTransactionMutation();

  const totalAmount =
    transactions?.reduce((sum, transaction) => sum + Number(transaction.amount), 0) || 0;

  const dispatch = useAppDispatch();
  const handleCreate = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    if (!currentOrganization) {
      dispatch(addNotification({ type: 'error', message: 'No organization selected' }));
      return;
    }

    try {
      await createTransaction({
        organizationId: currentOrganization,
        type: form.type,
        category: form.category,
        amount: Number(form.amount),
        status: form.status,
        description: form.description || undefined,
      }).unwrap();

      dispatch(addNotification({ type: 'success', message: 'Transaction created successfully' }));
      setOpenCreate(false);
      setForm({
        type: 'membership',
        category: 'membership',
        amount: 0,
        status: 'completed',
        description: '',
      });
    } catch (err: any) {
      dispatch(
        addNotification({
          type: 'error',
          message: err.data?.message || 'Failed to create transaction',
        }),
      );
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-black via-gray-900 to-black p-8">
      <div className="mb-8 flex items-center justify-between">
        <div>
          <h1 className="mb-2 text-4xl font-black text-transparent bg-clip-text bg-gradient-to-r from-yellow-400 via-orange-500 to-red-500">
            Transactions
          </h1>
          <p className="font-bold text-gray-400">Track all payments, renewals, and adjustments</p>
        </div>
        <button
          onClick={() => setOpenCreate(true)}
          className="flex items-center gap-2 rounded-lg bg-gradient-to-r from-yellow-400 to-orange-500 px-6 py-3 font-black text-black shadow-lg shadow-yellow-500/50 transition-all hover:scale-105"
        >
          <Plus className="h-5 w-5" />
          Add Transaction
        </button>
      </div>

      <div className="mb-8 grid grid-cols-1 gap-6 md:grid-cols-3">
        <div className="rounded-xl border border-yellow-500/20 bg-gradient-to-br from-gray-900/50 to-black p-6">
          <div className="mb-2 flex items-center gap-2 text-gray-400">
            <CreditCard className="h-5 w-5 text-yellow-400" />
            <span className="font-bold">Total Transactions</span>
          </div>
          <p className="text-4xl font-black text-white">{transactions?.length || 0}</p>
        </div>
        <div className="rounded-xl border border-yellow-500/20 bg-gradient-to-br from-gray-900/50 to-black p-6">
          <div className="mb-2 flex items-center gap-2 text-gray-400">
            <DollarSign className="h-5 w-5 text-green-400" />
            <span className="font-bold">Total Amount</span>
          </div>
          <p className="text-4xl font-black text-white">${totalAmount.toFixed(2)}</p>
        </div>
        <div className="rounded-xl border border-yellow-500/20 bg-gradient-to-br from-gray-900/50 to-black p-6">
          <div className="mb-2 flex items-center gap-2 text-gray-400">
            <TrendingUp className="h-5 w-5 text-blue-400" />
            <span className="font-bold">Completed</span>
          </div>
          <p className="text-4xl font-black text-white">
            {transactions?.filter((transaction) => transaction.status === 'completed').length || 0}
          </p>
        </div>
      </div>

      <div className="overflow-x-auto rounded-xl border border-yellow-500/20 bg-gradient-to-br from-gray-900/50 to-black">
        <table className="w-full">
          <thead className="border-b border-yellow-500/20 bg-yellow-500/10">
            <tr>
              <th className="px-6 py-4 text-left font-black text-yellow-400">Date</th>
              <th className="px-6 py-4 text-left font-black text-yellow-400">Type</th>
              <th className="px-6 py-4 text-left font-black text-yellow-400">Category</th>
              <th className="px-6 py-4 text-left font-black text-yellow-400">Status</th>
              <th className="px-6 py-4 text-right font-black text-yellow-400">Amount</th>
            </tr>
          </thead>
          <tbody>
            {isLoading ? (
              <tr>
                <td colSpan={5} className="px-6 py-10 text-center text-gray-400">
                  Loading transactions...
                </td>
              </tr>
            ) : transactions?.length ? (
              transactions.map((transaction) => (
                <tr
                  key={transaction.id}
                  className="border-b border-yellow-500/10 transition-all hover:bg-yellow-500/5"
                >
                  <td className="px-6 py-4 text-gray-300">
                    {new Date(transaction.created_at).toLocaleDateString()}
                  </td>
                  <td className="px-6 py-4 font-bold capitalize text-white">{transaction.type}</td>
                  <td className="px-6 py-4 text-gray-400">{transaction.category}</td>
                  <td className="px-6 py-4">
                    <span className="rounded-full bg-blue-500/20 px-3 py-1 text-xs font-black text-blue-400">
                      {transaction.status || 'pending'}
                    </span>
                  </td>
                  <td className="px-6 py-4 text-right font-black text-green-400">
                    ${Number(transaction.amount).toFixed(2)}
                  </td>
                </tr>
              ))
            ) : (
              <tr>
                <td colSpan={5} className="px-6 py-10 text-center text-gray-400">
                  No transactions found
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>

      {openCreate && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 p-4 backdrop-blur-sm">
          <div className="w-full max-w-md rounded-2xl border border-yellow-500/30 bg-gradient-to-br from-gray-900 to-black p-8">
            <h2 className="mb-6 text-2xl font-black text-white">Create Transaction</h2>
            <form onSubmit={handleCreate} className="space-y-4">
              <div>
                <label className="block text-sm font-bold text-gray-400 mb-1">Type</label>
                <select
                  value={form.type}
                  onChange={(event) => setForm((prev) => ({ ...prev, type: event.target.value }))}
                  className="w-full rounded-lg border border-yellow-500/20 bg-black/50 px-4 py-3 text-white outline-none focus:border-yellow-500"
                  required
                >
                  <option value="income">Income</option>
                  <option value="expense">Expense</option>
                  <option value="membership">Membership Payment</option>
                </select>
              </div>
              <div>
                <label className="block text-sm font-bold text-gray-400 mb-1">Category</label>
                <select
                  value={form.category}
                  onChange={(event) =>
                    setForm((prev) => ({ ...prev, category: event.target.value }))
                  }
                  className="w-full rounded-lg border border-yellow-500/20 bg-black/50 px-4 py-3 text-white outline-none focus:border-yellow-500"
                  required
                >
                  <option value="membership">Membership</option>
                  <option value="merchandise">Merchandise</option>
                  <option value="maintenance">Maintenance</option>
                  <option value="utilities">Utilities</option>
                  <option value="other">Other</option>
                </select>
              </div>
              <div>
                <label className="block text-sm font-bold text-gray-400 mb-1">Amount</label>
                <input
                  type="number"
                  min="0"
                  step="0.01"
                  value={form.amount}
                  onChange={(event) =>
                    setForm((prev) => ({ ...prev, amount: Number(event.target.value) }))
                  }
                  placeholder="0.00"
                  className="w-full rounded-lg border border-yellow-500/20 bg-black/50 px-4 py-3 text-white outline-none focus:border-yellow-500"
                  required
                />
              </div>
              <div>
                <label className="block text-sm font-bold text-gray-400 mb-1">Status</label>
                <select
                  value={form.status}
                  onChange={(event) => setForm((prev) => ({ ...prev, status: event.target.value }))}
                  className="w-full rounded-lg border border-yellow-500/20 bg-black/50 px-4 py-3 text-white outline-none focus:border-yellow-500"
                >
                  <option value="completed">Completed</option>
                  <option value="pending">Pending</option>
                  <option value="failed">Failed</option>
                  <option value="refunded">Refunded</option>
                </select>
              </div>
              <div>
                <label className="block text-sm font-bold text-gray-400 mb-1">
                  Description (Optional)
                </label>
                <textarea
                  value={form.description}
                  onChange={(event) =>
                    setForm((prev) => ({ ...prev, description: event.target.value }))
                  }
                  placeholder="e.g. Monthly maintenance fee"
                  className="w-full rounded-lg border border-yellow-500/20 bg-black/50 px-4 py-3 text-white outline-none focus:border-yellow-500"
                  rows={3}
                />
              </div>
              <div className="flex gap-3 pt-2">
                <button
                  type="button"
                  onClick={() => setOpenCreate(false)}
                  className="flex-1 rounded-lg bg-gray-800 py-3 font-bold text-white transition-all hover:bg-gray-700"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={isCreating || !currentOrganization}
                  className="flex-1 rounded-lg bg-gradient-to-r from-yellow-400 to-orange-500 py-3 font-black text-black transition-all hover:scale-105 disabled:opacity-50"
                >
                  {isCreating ? 'Saving...' : 'Save'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
