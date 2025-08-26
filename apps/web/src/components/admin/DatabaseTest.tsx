'use client';

import { useEffect, useState } from 'react';

type Status = {
  success: boolean;
  message: string;
  details?: any;
} | null;

export default function DatabaseTest() {
  const [status, setStatus] = useState<Status>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const test = async () => {
      try {
        const res = await fetch('/api/test-db');
        const json = await res.json();
        setStatus(json);
      } catch (err) {
        setStatus({ success: false, message: err instanceof Error ? err.message : 'Failed to test connection' });
      } finally {
        setLoading(false);
      }
    };
    test();
  }, []);

  if (loading) return <div>Testing database connection...</div>;

  return (
    <div className="p-4 border rounded-lg">
      <h2 className="text-lg font-semibold mb-2">Database Connection Status</h2>
      <div className={`p-2 rounded ${status?.success ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'}`}>
        {status?.success ? '✅ Connected' : '❌ Connection Failed'}
      </div>
      <p className="mt-2">{status?.message}</p>
      {status?.details && (
        <details className="mt-2">
          <summary className="cursor-pointer">Details</summary>
          <pre className="mt-1 p-2 bg-gray-100 rounded text-sm overflow-auto">
            {JSON.stringify(status.details, null, 2)}
          </pre>
        </details>
      )}
    </div>
  );
}


