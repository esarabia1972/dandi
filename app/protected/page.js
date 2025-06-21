'use client';

import { useState, useEffect } from 'react';
import { useSearchParams } from 'next/navigation';

export default function ProtectedPage() {
  const searchParams = useSearchParams();
  const keyFromQuery = searchParams.get('key') || '';

  const [validated, setValidated] = useState(null); // null = still checking, true/false result.
  const [toast, setToast] = useState(null);

  useEffect(() => {
    const validate = async () => {
      if (!keyFromQuery) {
        setValidated(false);
        setToast({ type: 'error', msg: 'No API key provided' });
        return;
      }
      try {
        const res = await fetch('/api/validate-key', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ key: keyFromQuery }),
        });
        const data = await res.json();
        if (data.valid) {
          setValidated(true);
          setToast({ type: 'success', msg: 'Valid API key, /protected can be accessed' });
        } else {
          setValidated(false);
          setToast({ type: 'error', msg: 'Invalid API Key' });
        }
      } catch (err) {
        setValidated(false);
        setToast({ type: 'error', msg: 'Something went wrong' });
      }
    };

    validate();
  }, [keyFromQuery]);

  useEffect(() => {
    if (toast) {
      const t = setTimeout(() => setToast(null), 3000);
      return () => clearTimeout(t);
    }
  }, [toast]);

  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-[#fafafa] p-4">
      {toast && (
        <div
          className={`fixed top-6 left-1/2 -translate-x-1/2 z-50 px-6 py-3 rounded-xl shadow-lg flex items-center gap-3 animate-slide-down ${toast.type === 'error' ? 'bg-red-600' : 'bg-green-600'} text-white`}
        >
          <span className="font-medium">{toast.msg}</span>
        </div>
      )}

      <div className="bg-white rounded-2xl shadow-lg p-8 w-full max-w-md text-center">
        <h1 className="text-2xl font-semibold mb-6 text-gray-900">Protected Area</h1>
        {validated === null && <p className="text-gray-700">Validating API key...</p>}
        {validated === true && <p className="text-green-600 font-medium">Access granted!</p>}
        {validated === false && <p className="text-red-600 font-medium">Access denied.</p>}

        <button
          onClick={() => window.history.back()}
          className="mt-6 inline-flex items-center px-4 py-2 text-sm font-medium border border-gray-300 rounded-lg text-gray-700 hover:bg-gray-50"
        >
          Try another one!
        </button>
      </div>
    </div>
  );
} 