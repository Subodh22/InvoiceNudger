'use client';

import { useState } from 'react';
import Link from 'next/link';

export default function DirectTestPage() {
  const [email, setEmail] = useState('');
  const [status, setStatus] = useState<'idle' | 'loading' | 'success' | 'error'>('idle');
  const [response, setResponse] = useState<any>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!email) {
      setStatus('error');
      setResponse({ error: 'Please enter an email address' });
      return;
    }
    
    try {
      setStatus('loading');
      
      // Use the direct test API endpoint
      const apiUrl = `/api/test-send?to=${encodeURIComponent(email)}`;
      const response = await fetch(apiUrl);
      const data = await response.json();
      
      setResponse(data);
      setStatus(response.ok ? 'success' : 'error');
    } catch (error) {
      setStatus('error');
      setResponse({ error: (error as Error).message });
      console.error('Error sending test email:', error);
    }
  };

  return (
    <div className="container mx-auto py-10 px-4">
      <h1 className="text-2xl font-bold mb-2 text-center">Invoice Nudger Direct Test</h1>
      <p className="text-center mb-8 text-gray-600">Tests email sending with direct API key</p>
      
      <div className="max-w-md mx-auto p-6 bg-white rounded-lg shadow-md">
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label htmlFor="email" className="block text-sm font-medium text-gray-700">
              Send test email to:
            </label>
            <input
              type="email"
              id="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500"
              placeholder="your@email.com"
              required
            />
          </div>
          
          <button
            type="submit"
            disabled={status === 'loading'}
            className="w-full flex justify-center py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {status === 'loading' ? 'Sending...' : 'Send Test Email'}
          </button>
        </form>
        
        {response && (
          <div
            className={`mt-4 p-3 rounded-md ${
              status === 'success' ? 'bg-green-100 text-green-800' : 
              status === 'error' ? 'bg-red-100 text-red-800' : 
              'bg-blue-100 text-blue-800'
            }`}
          >
            <pre className="whitespace-pre-wrap text-xs overflow-auto">
              {JSON.stringify(response, null, 2)}
            </pre>
          </div>
        )}
        
        <div className="mt-4 text-center">
          <Link href="/dashboard" className="text-blue-600 hover:text-blue-800 text-sm">
            Back to Dashboard
          </Link>
        </div>
      </div>
    </div>
  );
} 