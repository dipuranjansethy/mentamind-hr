import Sidebar from '@/components/dashboard/Sidebar';
import ProtectedRoute from '@/components/auth/ProtectedRoute';

export const metadata = {
  title: 'Dashboard | Mentamind Corporate Wellness Suite',
  description: 'HR/Admin Dashboard for Mentamind Corporate Wellness Suite',
};

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <ProtectedRoute allowedRoles={['admin', 'hr']}>
      <div className="flex h-screen bg-gray-100">
        <Sidebar />
        
        <div className="flex flex-col flex-1 md:pl-64">
          <main className="flex-1">
            {children}
          </main>
        </div>
      </div>
    </ProtectedRoute>
  );
}
