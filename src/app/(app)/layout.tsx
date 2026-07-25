import AuthProvider from "@/components/auth/AuthProvider";
import DashboardSidebar from "@/components/dashboard/DashboardSidebar";
import NotificationController from "@/components/notifications/NotificationController";
import NotificationProvider from "@/components/notifications/NotificationProvider";
import NetworkStatusBanner from "@/components/network/NetworkStatusBanner";
import NetworkStatusProvider from "@/components/network/NetworkStatusProvider";

type AppLayoutProps = {
  children: React.ReactNode;
};

export default function AppLayout({
  children,
}: AppLayoutProps) {
  return (
    <AuthProvider>
  <NetworkStatusProvider>
    <NotificationProvider>
      <div className="min-h-screen bg-slate-50 dark:bg-slate-950 md:flex">
        <DashboardSidebar />

        <div className="min-w-0 flex-1">
          <NetworkStatusBanner />

          {children}
        </div>

        <NotificationController />
      </div>
    </NotificationProvider>
  </NetworkStatusProvider>
</AuthProvider>
  );
}