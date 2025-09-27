import LoginForm from '@/components/auth/LoginForm';

export const metadata = {
  title: 'Login | Mentamind Corporate Wellness Suite',
  description: 'Sign in to your Mentamind account',
};

export default function LoginPage() {
  return (
    <div className="flex items-center justify-center min-h-screen bg-gray-100">
      <div className="w-full max-w-4xl px-4 py-12 mx-auto sm:px-6 lg:px-8">
        <div className="flex flex-col md:flex-row">
          {/* Left side - Branding */}
          <div className="flex flex-col justify-center flex-1 p-6 mb-8 text-center bg-indigo-700 rounded-lg md:mb-0 md:rounded-r-none md:rounded-l-lg">
            <h1 className="text-3xl font-bold text-white">Mentamind</h1>
            <h2 className="mt-2 text-xl font-semibold text-indigo-100">Corporate Wellness Suite</h2>
            <p className="mt-4 text-indigo-200">
              Empowering organizations to build a culture of well-being and mental health.
            </p>
            <div className="mt-8">
              <div className="p-4 bg-indigo-600 rounded-lg">
                <blockquote className="italic text-white">
                  "Mentamind has transformed our workplace culture and improved employee satisfaction."
                </blockquote>
                <p className="mt-2 text-sm text-indigo-200">- HR Director, Fortune 500 Company</p>
              </div>
            </div>
          </div>
          
          {/* Right side - Login form */}
          <div className="flex items-center justify-center flex-1">
            <LoginForm />
          </div>
        </div>
      </div>
    </div>
  );
}
