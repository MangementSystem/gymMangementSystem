import Link from "next/link";

export const Sidebar = () => {
  return (
    <aside className="w-64 bg-white border-r h-screen p-4">
      <h2 className="text-xl font-bold mb-6">Gym Dashboard</h2>
      <nav className="flex flex-col gap-2">
        <Link href="/">Dashboard</Link>
        <Link href="/members">Members</Link>
        <Link href="/plans">Plans</Link>
        <Link href="/transactions">Transactions</Link>
        <Link href="/settings">Settings</Link>
      </nav>
    </aside>
  );
};
