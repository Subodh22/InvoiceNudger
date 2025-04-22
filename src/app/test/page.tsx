'use client';

import TestEmail from '@/components/TestEmail';

export default function TestPage() {
  return (
    <div className="container mx-auto py-10 px-4">
      <h1 className="text-2xl font-bold mb-8 text-center">
        Invoice Nudger Testing Page
      </h1>
      
      <div className="grid grid-cols-1 gap-8">
        <TestEmail />
        
        <div className="max-w-md mx-auto p-6 bg-white rounded-lg shadow-md">
          <h2 className="text-xl font-bold mb-4">Environment Variables</h2>
          <p className="text-sm text-gray-600 mb-4">
            Checking if environment variables are properly loaded.
          </p>
          
          <div className="space-y-2">
            <div>
              <span className="font-medium">Resend API Key:</span>{' '}
              <span className="font-mono">
                {process.env.NEXT_PUBLIC_RESEND_API_KEY 
                  ? `${process.env.NEXT_PUBLIC_RESEND_API_KEY.substring(0, 5)}...` 
                  : 'Not available as public var (expected, using server-side)'}
              </span>
            </div>
            
            <div>
              <span className="font-medium">Firebase Project ID:</span>{' '}
              <span className="font-mono">
                {process.env.NEXT_PUBLIC_FIREBASE_PROJECT_ID || 'Not set'}
              </span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
} 