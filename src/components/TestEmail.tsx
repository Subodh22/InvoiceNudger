import { useState } from 'react';

export default function TestEmail() {
  const [email, setEmail] = useState('');
  const [status, setStatus] = useState<'idle' | 'loading' | 'success' | 'error'>('idle');
  const [message, setMessage] = useState('');

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!email) {
      setStatus('error');
      setMessage('Please enter an email address');
      return;
    }
    
    try {
      setStatus('loading');
      setMessage('Sending test email...');
      
      const response = await fetch('/api/email/send', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          to: email,
          subject: 'Test Email from Invoice Nudger',
          html: `
            <h1>This is a test email from Invoice Nudger</h1>
            <p>If you're seeing this, the Resend integration is working correctly!</p>
            <p>This email was sent using the Resend API with key: re_Ej...CU</p>
          `,
        }),
      });
      
      const data = await response.json();
      
      if (!response.ok) {
        throw new Error(data.error || 'Failed to send test email');
      }
      
      setStatus('success');
      setMessage(`Email sent successfully to ${email}`);
    } catch (error) {
      setStatus('error');
      setMessage(`Error: ${(error as Error).message}`);
      console.error('Error sending test email:', error);
    }
  };

  return (
    <div className="max-w-md mx-auto p-6 bg-white rounded-lg shadow-md">
      <h2 className="text-xl font-bold mb-4">Test Email Integration</h2>
      <p className="text-sm text-gray-600 mb-4">
        Use this form to test the Resend email integration.
      </p>
      
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
      
      {message && (
        <div
          className={`mt-4 p-3 rounded-md ${
            status === 'success' ? 'bg-green-100 text-green-800' : 
            status === 'error' ? 'bg-red-100 text-red-800' : 
            'bg-blue-100 text-blue-800'
          }`}
        >
          {message}
        </div>
      )}
    </div>
  );
} 