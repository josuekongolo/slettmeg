import DashboardSidebar from "@/components/layout/DashboardSidebar";

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="min-h-screen bg-background">
      <DashboardSidebar />
      <main className="md:ml-64 min-h-screen">
        <div className="container mx-auto p-6 pt-20 md:pt-6">{children}</div>
      </main>
    </div>
  );
}
