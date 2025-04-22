import Link from "next/link";
import EmailForm from "../components/EmailForm";

export default function EmailTestPage() {
  return (
    <div className="min-h-screen bg-gray-50 flex flex-col py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-md mx-auto w-full">
        <div className="flex justify-between items-center mb-8">
          <h1 className="text-3xl font-bold text-gray-900">Test Email</h1>
          <Link href="/" className="text-blue-600 hover:text-blue-800">
            Back to Home
          </Link>
        </div>
        
        <EmailForm />
      </div>
    </div>
  );
} 