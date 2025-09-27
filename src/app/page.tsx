import Image from "next/image";
import Link from "next/link";

export default function Home() {
  return (
    <div className="flex flex-col min-h-screen">
      {/* Navigation */}
      <header className="bg-white shadow-sm">
        <div className="container flex items-center justify-between px-4 py-4 mx-auto sm:px-6 lg:px-8">
          <div className="flex items-center">
            <span className="text-2xl font-bold text-indigo-600">Mentamind</span>
          </div>
          <nav className="hidden space-x-10 md:flex">
            <a href="#features" className="text-base font-medium text-gray-500 hover:text-indigo-600">
              Features
            </a>
            <a href="#benefits" className="text-base font-medium text-gray-500 hover:text-indigo-600">
              Benefits
            </a>
            <a href="#testimonials" className="text-base font-medium text-gray-500 hover:text-indigo-600">
              Testimonials
            </a>
            <a href="#pricing" className="text-base font-medium text-gray-500 hover:text-indigo-600">
              Pricing
            </a>
          </nav>
          <div className="flex items-center space-x-4">
            <Link href="/auth/login" className="text-base font-medium text-indigo-600 hover:text-indigo-500">
              Sign in
            </Link>
            <Link
              href="/auth/register"
              className="inline-flex items-center justify-center px-4 py-2 text-base font-medium text-white bg-indigo-600 border border-transparent rounded-md shadow-sm hover:bg-indigo-700"
            >
              Sign up
            </Link>
          </div>
        </div>
      </header>

      {/* Hero Section */}
      <div className="relative overflow-hidden bg-white">
        <div className="container px-4 py-16 mx-auto sm:px-6 lg:px-8 lg:py-24">
          <div className="grid items-center grid-cols-1 gap-12 lg:grid-cols-2">
            <div>
              <h1 className="text-4xl font-extrabold tracking-tight text-gray-900 sm:text-5xl md:text-6xl">
                <span className="block">Corporate Wellness</span>
                <span className="block text-indigo-600">Reimagined</span>
              </h1>
              <p className="max-w-lg mt-6 text-xl text-gray-500">
                Mentamind's Corporate Wellness Suite helps organizations reduce burnout, improve productivity, and create a culture of well-being.
              </p>
              <div className="mt-10">
                <Link
                  href="/auth/register"
                  className="inline-flex items-center justify-center px-5 py-3 text-base font-medium text-white bg-indigo-600 border border-transparent rounded-md hover:bg-indigo-700"
                >
                  Get started
                </Link>
                <a
                  href="#features"
                  className="inline-flex items-center justify-center px-5 py-3 ml-3 text-base font-medium text-indigo-700 bg-indigo-100 border border-transparent rounded-md hover:bg-indigo-200"
                >
                  Learn more
                </a>
              </div>
            </div>
            <div className="relative">
              <div className="aspect-w-5 aspect-h-3 lg:aspect-w-16 lg:aspect-h-9">
                <div className="p-8 bg-indigo-100 rounded-lg shadow-lg">
                  <div className="p-4 bg-white rounded-lg shadow">
                    <h3 className="text-lg font-semibold text-gray-900">Wellness Dashboard</h3>
                    <div className="mt-4 space-y-2">
                      <div className="w-full h-4 bg-indigo-100 rounded"></div>
                      <div className="w-3/4 h-4 bg-indigo-100 rounded"></div>
                      <div className="grid grid-cols-3 gap-2 mt-4">
                        <div className="p-2 bg-indigo-50 rounded">
                          <div className="w-full h-8 bg-indigo-100 rounded"></div>
                        </div>
                        <div className="p-2 bg-indigo-50 rounded">
                          <div className="w-full h-8 bg-indigo-100 rounded"></div>
                        </div>
                        <div className="p-2 bg-indigo-50 rounded">
                          <div className="w-full h-8 bg-indigo-100 rounded"></div>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Features Section */}
      <div id="features" className="py-16 bg-gray-50">
        <div className="container px-4 mx-auto sm:px-6 lg:px-8">
          <div className="text-center">
            <h2 className="text-3xl font-extrabold tracking-tight text-gray-900 sm:text-4xl">
              Comprehensive Wellness Solutions
            </h2>
            <p className="max-w-2xl mx-auto mt-4 text-xl text-gray-500">
              Our two-sided platform provides powerful tools for both HR professionals and employees.
            </p>
          </div>

          <div className="grid grid-cols-1 gap-8 mt-12 sm:grid-cols-2 lg:grid-cols-3">
            {/* Feature 1 */}
            <div className="p-6 bg-white rounded-lg shadow">
              <div className="flex items-center justify-center w-12 h-12 mx-auto bg-indigo-100 rounded-md">
                <svg className="w-6 h-6 text-indigo-600" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z"></path>
                </svg>
              </div>
              <h3 className="mt-4 text-lg font-medium text-center text-gray-900">Wellness Analytics Dashboard</h3>
              <p className="mt-2 text-base text-center text-gray-500">
                Get actionable insights on workforce well-being with organization-wide wellness index, heatmaps, and burnout risk indicators.
              </p>
            </div>

            {/* Feature 2 */}
            <div className="p-6 bg-white rounded-lg shadow">
              <div className="flex items-center justify-center w-12 h-12 mx-auto bg-indigo-100 rounded-md">
                <svg className="w-6 h-6 text-indigo-600" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z"></path>
                </svg>
              </div>
              <h3 className="mt-4 text-lg font-medium text-center text-gray-900">Employee Management</h3>
              <p className="mt-2 text-base text-center text-gray-500">
                Streamline employee onboarding, integrate with your HRMS, and manage role-based access to wellness resources.
              </p>
            </div>

            {/* Feature 3 */}
            <div className="p-6 bg-white rounded-lg shadow">
              <div className="flex items-center justify-center w-12 h-12 mx-auto bg-indigo-100 rounded-md">
                <svg className="w-6 h-6 text-indigo-600" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z"></path>
                </svg>
              </div>
              <h3 className="mt-4 text-lg font-medium text-center text-gray-900">Wellness Programs</h3>
              <p className="mt-2 text-base text-center text-gray-500">
                12-week structured programs for stress management, focus, sleep, and resilience with gamified progression.
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Benefits Section */}
      <div id="benefits" className="py-16 bg-white">
        <div className="container px-4 mx-auto sm:px-6 lg:px-8">
          <div className="text-center">
            <h2 className="text-3xl font-extrabold tracking-tight text-gray-900 sm:text-4xl">
              Benefits for Your Organization
            </h2>
            <p className="max-w-2xl mx-auto mt-4 text-xl text-gray-500">
              Investing in employee wellness delivers measurable returns for your business.
            </p>
          </div>

          <div className="grid grid-cols-1 gap-8 mt-12 sm:grid-cols-2">
            <div className="relative p-8 bg-indigo-700 rounded-lg">
              <h3 className="text-xl font-bold text-white">For HR & Management</h3>
              <ul className="mt-4 space-y-3 text-white">
                <li className="flex items-start">
                  <svg className="flex-shrink-0 w-5 h-5 text-indigo-300" fill="currentColor" viewBox="0 0 20 20" xmlns="http://www.w3.org/2000/svg">
                    <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd"></path>
                  </svg>
                  <span className="ml-2">Improved retention and reduced turnover</span>
                </li>
                <li className="flex items-start">
                  <svg className="flex-shrink-0 w-5 h-5 text-indigo-300" fill="currentColor" viewBox="0 0 20 20" xmlns="http://www.w3.org/2000/svg">
                    <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd"></path>
                  </svg>
                  <span className="ml-2">Reduced sick leave and absenteeism</span>
                </li>
                <li className="flex items-start">
                  <svg className="flex-shrink-0 w-5 h-5 text-indigo-300" fill="currentColor" viewBox="0 0 20 20" xmlns="http://www.w3.org/2000/svg">
                    <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd"></path>
                  </svg>
                  <span className="ml-2">Board-ready wellness reports and analytics</span>
                </li>
                <li className="flex items-start">
                  <svg className="flex-shrink-0 w-5 h-5 text-indigo-300" fill="currentColor" viewBox="0 0 20 20" xmlns="http://www.w3.org/2000/svg">
                    <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd"></path>
                  </svg>
                  <span className="ml-2">Enhanced employer branding and culture</span>
                </li>
              </ul>
            </div>

            <div className="relative p-8 bg-indigo-50 rounded-lg">
              <h3 className="text-xl font-bold text-gray-900">For Employees</h3>
              <ul className="mt-4 space-y-3 text-gray-600">
                <li className="flex items-start">
                  <svg className="flex-shrink-0 w-5 h-5 text-indigo-600" fill="currentColor" viewBox="0 0 20 20" xmlns="http://www.w3.org/2000/svg">
                    <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd"></path>
                  </svg>
                  <span className="ml-2">Private, stigma-free mental health support</span>
                </li>
                <li className="flex items-start">
                  <svg className="flex-shrink-0 w-5 h-5 text-indigo-600" fill="currentColor" viewBox="0 0 20 20" xmlns="http://www.w3.org/2000/svg">
                    <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd"></path>
                  </svg>
                  <span className="ml-2">24/7 access to AI-powered wellness tools</span>
                </li>
                <li className="flex items-start">
                  <svg className="flex-shrink-0 w-5 h-5 text-indigo-600" fill="currentColor" viewBox="0 0 20 20" xmlns="http://www.w3.org/2000/svg">
                    <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd"></path>
                  </svg>
                  <span className="ml-2">Guided meditation and journaling resources</span>
                </li>
                <li className="flex items-start">
                  <svg className="flex-shrink-0 w-5 h-5 text-indigo-600" fill="currentColor" viewBox="0 0 20 20" xmlns="http://www.w3.org/2000/svg">
                    <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd"></path>
                  </svg>
                  <span className="ml-2">Access to professional therapists when needed</span>
                </li>
              </ul>
            </div>
          </div>
        </div>
      </div>

      {/* CTA Section */}
      <div className="py-16 bg-indigo-700">
        <div className="container px-4 mx-auto text-center sm:px-6 lg:px-8">
          <h2 className="text-3xl font-extrabold tracking-tight text-white sm:text-4xl">
            Ready to transform your workplace wellness?
          </h2>
          <p className="max-w-2xl mx-auto mt-4 text-xl text-indigo-100">
            Join thousands of organizations prioritizing employee mental health and well-being.
          </p>
          <div className="mt-8">
            <Link
              href="/auth/register"
              className="inline-flex items-center justify-center px-5 py-3 text-base font-medium text-indigo-700 bg-white border border-transparent rounded-md hover:bg-indigo-50"
            >
              Get started today
            </Link>
          </div>
        </div>
      </div>

      {/* Footer */}
      <footer className="bg-gray-800">
        <div className="container px-4 py-12 mx-auto sm:px-6 lg:px-8">
          <div className="grid grid-cols-2 gap-8 md:grid-cols-4">
            <div>
              <h3 className="text-sm font-semibold tracking-wider text-white uppercase">Product</h3>
              <ul className="mt-4 space-y-4">
                <li>
                  <a href="#" className="text-base text-gray-300 hover:text-white">Features</a>
                </li>
                <li>
                  <a href="#" className="text-base text-gray-300 hover:text-white">Pricing</a>
                </li>
                <li>
                  <a href="#" className="text-base text-gray-300 hover:text-white">FAQ</a>
                </li>
              </ul>
            </div>
            <div>
              <h3 className="text-sm font-semibold tracking-wider text-white uppercase">Company</h3>
              <ul className="mt-4 space-y-4">
                <li>
                  <a href="#" className="text-base text-gray-300 hover:text-white">About</a>
                </li>
                <li>
                  <a href="#" className="text-base text-gray-300 hover:text-white">Blog</a>
                </li>
                <li>
                  <a href="#" className="text-base text-gray-300 hover:text-white">Contact</a>
                </li>
              </ul>
            </div>
            <div>
              <h3 className="text-sm font-semibold tracking-wider text-white uppercase">Resources</h3>
              <ul className="mt-4 space-y-4">
                <li>
                  <a href="#" className="text-base text-gray-300 hover:text-white">Guides</a>
                </li>
                <li>
                  <a href="#" className="text-base text-gray-300 hover:text-white">Research</a>
                </li>
                <li>
                  <a href="#" className="text-base text-gray-300 hover:text-white">Webinars</a>
                </li>
              </ul>
            </div>
            <div>
              <h3 className="text-sm font-semibold tracking-wider text-white uppercase">Legal</h3>
              <ul className="mt-4 space-y-4">
                <li>
                  <a href="#" className="text-base text-gray-300 hover:text-white">Privacy</a>
                </li>
                <li>
                  <a href="#" className="text-base text-gray-300 hover:text-white">Terms</a>
                </li>
                <li>
                  <a href="#" className="text-base text-gray-300 hover:text-white">Security</a>
                </li>
              </ul>
            </div>
          </div>
          <div className="pt-8 mt-8 border-t border-gray-700">
            <p className="text-base text-gray-400">
              &copy; 2025 Mentamind, Inc. All rights reserved.
            </p>
          </div>
        </div>
      </footer>
    </div>
  );
}
