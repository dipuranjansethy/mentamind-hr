import EmployeeNavbar from '@/components/employee/EmployeeNavbar';
import ProtectedRoute from '@/components/auth/ProtectedRoute';

export const metadata = {
  title: 'Employee Wellness App | Mentamind',
  description: 'Employee wellness tools and resources',
};

export default function EmployeeLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <ProtectedRoute allowedRoles={['employee']}>
      <div className="flex h-screen bg-gray-50">
        <EmployeeNavbar />
        
        <div className="flex flex-col flex-1 md:pl-64">
          <main className="flex-1">
            {children}
          </main>
        </div>
      </div>
    </ProtectedRoute>
  );
}
