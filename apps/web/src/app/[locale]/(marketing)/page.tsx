import Link from "next/link";

export const metadata = {
  title: "CREFinderAI",
};

export default function Marketing() {
  return (
    <div className="min-h-screen bg-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="text-center">
          <h1 className="text-4xl font-bold text-gray-900 mb-8">
            Welcome to CREFinderAI
          </h1>
          <p className="text-xl text-gray-600 mb-8">
            Your comprehensive commercial real estate solution
          </p>
          <div className="space-x-4">
            <Link href="/en/login" className="inline-block bg-blue-600 hover:bg-blue-700 text-white px-6 py-3 rounded-md font-medium">
              Sign In
            </Link>
            <Link href="/en/signup" className="inline-block border border-gray-300 text-gray-700 px-6 py-3 rounded-md font-medium hover:bg-gray-50">
              Sign Up
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}
