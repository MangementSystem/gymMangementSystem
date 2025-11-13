"use client";
import { useSelector } from "react-redux";
import { RootState } from "@/lib/redux/store";
import { Card } from "@/components/ui/card";
import DashboardPage from "@/components/tables/Dashboard";

export default function Dashboard() {
  const members = useSelector((state: RootState) => state.members.list);

  return (
    <>
    {/* <main className="p-6 grid grid-cols-1 md:grid-cols-3 gap-4">
      <Card>
        <h2 className="text-lg font-semibold">عدد الأعضاء</h2>
        <p className="text-3xl font-bold">{members.length}</p>
      </Card>

      <Card>
        <h2 className="text-lg font-semibold">الإيرادات الشهرية</h2>
        <p className="text-3xl font-bold">12,340 ريال</p>
      </Card>

      <Card>
        <h2 className="text-lg font-semibold">الاشتراكات المنتهية</h2>
        <p className="text-3xl font-bold">7</p>
      </Card>
    </main> */}
    <DashboardPage />
    </>
  );
}
