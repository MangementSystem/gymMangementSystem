"use client";

import { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { AppDispatch, RootState } from "@/lib/redux/store";
import { fetchMembers } from "@/lib/redux/slices/membersSlice";
import { Button } from "@/components/ui/button";

export default function MembersPage() {
  const dispatch = useDispatch<AppDispatch>();
  const { list, loading } = useSelector((state: RootState) => state.members);

  useEffect(() => {
    dispatch(fetchMembers());
  }, [dispatch]);

  return (
    <div className="p-6">
      <div className="flex justify-between items-center mb-4">
        <h1 className="text-2xl font-bold">الأعضاء</h1>
        <Button>➕ عضو جديد</Button>
      </div>

      {loading ? (
        <p>جاري التحميل...</p>
      ) : (
        <table className="min-w-full border">
          <thead>
            <tr className="bg-gray-100">
              <th className="p-2 border">الاسم</th>
              <th className="p-2 border">الحالة</th>
              <th className="p-2 border">الخطة</th>
            </tr>
          </thead>
          <tbody>
            {list.map((m: any) => (
              <tr key={m.id}>
                <td className="border p-2">{m.name}</td>
                <td className="border p-2">{m.status}</td>
                <td className="border p-2">{m.plan?.name}</td>
              </tr>
            ))}
          </tbody>
        </table>
      )}
    </div>
  );
}
