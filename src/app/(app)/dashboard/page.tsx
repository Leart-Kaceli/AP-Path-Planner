import DashboardHeader from "@/components/dashboard/DashboardHeader";
import DashboardOverview from "@/components/dashboard/DashboardOverview";
import DashboardQuickActions from "@/components/dashboard/DashboardQuickActions";

export default function DashboardPage() {
  return (
  <>
    <DashboardHeader />

    <DashboardQuickActions />

    <DashboardOverview />
  </>
);
}