import DashboardHeader from "@/components/dashboard/DashboardHeader";
import DashboardOverview from "@/components/dashboard/DashboardOverview";
import DashboardSidebar from "@/components/dashboard/DashboardSidebar";

export default function DashboardPage() {
  return (
    <div className="min-h-screen bg-slate-50 md:flex">
      <DashboardSidebar />

      <div className="min-w-0 flex-1">
        <DashboardHeader />
        <DashboardOverview />
      </div>
    </div>
  );
}