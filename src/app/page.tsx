import { redirect } from 'next/navigation';
import Link from 'next/link';
import EmailForm from './components/EmailForm';

export default function Home() {
  return (
    <main className="flex min-h-screen flex-col items-center justify-center p-8 bg-gray-50">
      <div className="max-w-2xl mx-auto text-center">
        <h1 className="text-4xl font-bold text-gray-900 mb-8">
          Invoice Nudger
        </h1>
        <p className="text-xl text-gray-600 mb-8">
          The automated solution for freelancers to send professional payment reminders
          and get paid faster without the awkward conversations.
        </p>
        
        <div className="space-y-4">
          <div className="bg-white p-6 rounded-lg shadow-md">
            <h2 className="text-2xl font-semibold mb-4">Features</h2>
            <ul className="text-left space-y-2">
              <li className="flex items-start">
                <svg className="h-6 w-6 text-green-500 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                </svg>
                <span>Automated, escalating reminder sequences</span>
              </li>
              <li className="flex items-start">
                <svg className="h-6 w-6 text-green-500 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                </svg>
                <span>Professional email templates</span>
              </li>
              <li className="flex items-start">
                <svg className="h-6 w-6 text-green-500 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                </svg>
                <span>Client and invoice management</span>
              </li>
              <li className="flex items-start">
                <svg className="h-6 w-6 text-green-500 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                </svg>
                <span>Customizable reminder schedules</span>
              </li>
            </ul>
          </div>
        </div>
        
        <div className="mt-8 flex justify-center gap-4">
          <Link href="/dashboard" className="inline-flex items-center px-6 py-3 border border-transparent text-base font-medium rounded-md shadow-sm text-white bg-blue-600 hover:bg-blue-700">
            Go to Dashboard
          </Link>
          <Link href="/auth/login" className="inline-flex items-center px-6 py-3 border border-gray-300 bg-white text-base font-medium rounded-md shadow-sm text-gray-700 hover:bg-gray-50">
            Sign In
          </Link>
        </div>
        
        <div className="mt-12 max-w-md mx-auto">
          <h2 className="text-2xl font-semibold mb-6">Test Email Service</h2>
          <EmailForm />
        </div>
      </div>
    </main>
  );
}
