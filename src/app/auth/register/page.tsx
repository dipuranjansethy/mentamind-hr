import RegisterForm from '@/components/auth/RegisterForm';

export const metadata = {
  title: 'Register | Mentamind Corporate Wellness Suite',
  description: 'Create a new Mentamind account for your organization',
};

export default function RegisterPage() {
  return (
    <div className="flex items-center justify-center min-h-screen bg-gray-100">
      <div className="w-full max-w-4xl px-4 py-12 mx-auto sm:px-6 lg:px-8">
        <div className="flex flex-col md:flex-row">
          {/* Left side - Branding */}
          <div className="flex flex-col justify-center flex-1 p-6 mb-8 text-center bg-indigo-700 rounded-lg md:mb-0 md:rounded-r-none md:rounded-l-lg">
            <h1 className="text-3xl font-bold text-white">Mentamind</h1>
            <h2 className="mt-2 text-xl font-semibold text-indigo-100">Corporate Wellness Suite</h2>
            <p className="mt-4 text-indigo-200">
              Join thousands of organizations prioritizing employee mental health and well-being.
            </p>
            <div className="mt-6 space-y-4">
              <div className="flex items-center p-3 bg-indigo-600 rounded-lg">
                <div className="flex items-center justify-center w-10 h-10 mr-3 bg-indigo-500 rounded-full">
                  <svg xmlns="http://www.w3.org/2000/svg" className="w-6 h-6 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                  </svg>
                </div>
                <span className="text-sm text-white">Reduce employee burnout by up to 40%</span>
              </div>
              <div className="flex items-center p-3 bg-indigo-600 rounded-lg">
                <div className="flex items-center justify-center w-10 h-10 mr-3 bg-indigo-500 rounded-full">
                  <svg xmlns="http://www.w3.org/2000/svg" className="w-6 h-6 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                  </svg>
                </div>
                <span className="text-sm text-white">Improve productivity and employee retention</span>
              </div>
              <div className="flex items-center p-3 bg-indigo-600 rounded-lg">
                <div className="flex items-center justify-center w-10 h-10 mr-3 bg-indigo-500 rounded-full">
                  <svg xmlns="http://www.w3.org/2000/svg" className="w-6 h-6 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                  </svg>
                </div>
                <span className="text-sm text-white">Get actionable insights on workforce well-being</span>
              </div>
            </div>
          </div>
          
          {/* Right side - Register form */}
          <div className="flex items-center justify-center flex-1">
            <RegisterForm />
          </div>
        </div>
      </div>
    </div>
  );
}
