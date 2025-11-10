import { Member } from "@/lib/types/member";

interface MembersTableProps {
  members: Member[];
}

export const MembersTable = ({ members }: MembersTableProps) => {
  return (
    <table className="min-w-full border border-gray-200">
      <thead className="bg-gray-100">
        <tr>
          <th className="p-2 border">Name</th>
          <th className="p-2 border">Email</th>
          <th className="p-2 border">Status</th>
          <th className="p-2 border">Plan</th>
        </tr>
      </thead>
      <tbody>
        {members.map((m) => (
          <tr key={m.id} className="hover:bg-gray-50">
            <td className="p-2 border">{m.name}</td>
            <td className="p-2 border">{m.email}</td>
            <td className="p-2 border">{m.status}</td>
            <td className="p-2 border">{m.plan?.name}</td>
          </tr>
        ))}
      </tbody>
    </table>
  );
};
