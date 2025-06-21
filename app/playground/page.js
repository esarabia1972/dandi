'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';

export default function PlaygroundPage() {
  const [apiKey, setApiKey] = useState('');
  const router = useRouter();

  const handleSubmit = (e) => {
    e.preventDefault();
    if (apiKey.trim() === '') return;
    router.push(`/protected?key=${encodeURIComponent(apiKey.trim())}`);
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-[#fafafa] p-4">
      <div className="bg-white rounded-2xl shadow-lg p-8 w-full max-w-md">
        <h1 className="text-2xl font-semibold mb-6 text-gray-900 text-center">API Playground</h1>
        <form onSubmit={handleSubmit}>
          <label className="block text-sm font-medium text-gray-700 mb-1" htmlFor="apiKey">Your API Key</label>
          <input
            type="text"
            id="apiKey"
            value={apiKey}
            onChange={(e) => setApiKey(e.target.value)}
            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 mb-4"
            placeholder="Paste your API key here"
            required
          />
          <button
            type="submit"
            className="w-full bg-blue-600 hover:bg-blue-700 text-white font-medium py-2 px-4 rounded-lg"
          >
            Continue
          </button>
        </form>
      </div>
    </div>
  );
} 