import DashboardSidebar from "@/components/dashboard/DashboardSidebar";
import NotificationController from "@/components/notifications/NotificationController";

type AppLayoutProps = {
  children: React.ReactNode;
};

export default function AppLayout({
  children,
}: AppLayoutProps) {
  return (
    <div className="min-h-screen bg-slate-50 dark:bg-slate-950 md:flex">
      <DashboardSidebar />

      <div className="min-w-0 flex-1">
        {children}
      </div>

      <NotificationController />
    </div>
  );
}