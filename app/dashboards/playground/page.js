'use client';

import { useState } from 'react';

export default function PlaygroundPage() {
  const [repoUrl, setRepoUrl] = useState('');
  const [apiKey, setApiKey] = useState('');
  const [summary, setSummary] = useState('');
  const [loading, setLoading] = useState(false);
  const [toast, setToast] = useState(null);

  const showToast = (msg, type = 'success') => {
    setToast({ msg, type });
    setTimeout(() => setToast(null), 4000);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!apiKey.trim()) {
      showToast('Please enter your Dandi API key.', 'error');
      return;
    }
    if (!repoUrl.trim()) {
      showToast('Please enter a GitHub repository URL.', 'error');
      return;
    }

    setLoading(true);
    setSummary('');

    try {
      const res = await fetch('/api/github-summarizer', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'x-api-key': apiKey.trim(),
        },
        body: JSON.stringify({ repoUrl }),
      });

      const data = await res.json();
      if (!res.ok) {
        throw new Error(data.error || 'Failed to fetch summary');
      }

      setSummary(data.summary);
      showToast('Summary generated successfully!', 'success');
    } catch (err) {
      showToast(err.message, 'error');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="p-4 sm:p-6 lg:p-8 relative">
      {toast && (
        <div
          className={`fixed top-6 left-1/2 -translate-x-1/2 z-50 px-6 py-3 rounded-xl shadow-lg flex items-center gap-3 animate-slide-down ${
            toast.type === 'error' ? 'bg-red-600' : 'bg-green-600'
          } text-white`}
        >
          <span className="font-medium">{toast.msg}</span>
          <button className="ml-2" onClick={() => setToast(null)}>
            &times;
          </button>
        </div>
      )}
      <div className="max-w-4xl mx-auto">
        <h1 className="text-3xl font-bold text-gray-900 mb-4">API Playground</h1>
        <p className="text-gray-600 mb-8">
          Enter a valid API key from your dashboard and a GitHub URL to generate a summary.
        </p>

        <div className="bg-white rounded-2xl shadow-lg p-8">
          <form onSubmit={handleSubmit}>
            <div className="mb-4">
              <label className="block text-sm font-medium text-gray-700 mb-2" htmlFor="apiKey">
                Your Dandi API Key
              </label>
              <input
                type="text"
                id="apiKey"
                value={apiKey}
                onChange={(e) => setApiKey(e.target.value)}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                placeholder="dandi_xxxxxxxx"
                required
              />
            </div>

            <div className="mb-6">
              <label className="block text-sm font-medium text-gray-700 mb-2" htmlFor="repoUrl">
                GitHub Repository URL
              </label>
              <input
                type="text"
                id="repoUrl"
                value={repoUrl}
                onChange={(e) => setRepoUrl(e.target.value)}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                placeholder="https://github.com/owner/repo"
                required
              />
            </div>

            <button
              type="submit"
              className="w-full bg-blue-600 hover:bg-blue-700 text-white font-medium py-2.5 px-4 rounded-lg flex items-center justify-center disabled:bg-gray-400"
              disabled={loading}
            >
              {loading ? 'Summarizing...' : 'Get Summary'}
            </button>
          </form>

          {summary && (
            <div className="mt-8">
              <h2 className="text-2xl font-semibold text-gray-900 mb-4">Summary</h2>
              <div className="bg-gray-50 rounded-lg p-6 whitespace-pre-wrap font-mono text-sm">
                {JSON.stringify(summary, null, 2)}
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
