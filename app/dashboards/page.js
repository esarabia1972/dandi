'use client';

import { useState } from 'react';
import useApiKeys from '@/app/hooks/useApiKeys';

export default function Dashboard() {
  const {
    apiKeys,
    createApiKey,
    deleteApiKey,
    updateApiKey,
  } = useApiKeys();
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [newKeyName, setNewKeyName] = useState('');
  const [newKeyValue, setNewKeyValue] = useState('');
  const [newKeyUsage, setNewKeyUsage] = useState('');
  const [newKeyType, setNewKeyType] = useState('');
  const [showKey, setShowKey] = useState({});
  const [toast, setToast] = useState(null);
  const [editModal, setEditModal] = useState(null);

  const showToast = (msg, type = 'success') => {
    setToast({ msg, type });
    setTimeout(() => setToast(null), 3000);
  };

  const copyToClipboard = async (text) => {
    try {
      if (navigator.clipboard && window.isSecureContext) {
        await navigator.clipboard.writeText(text);
      } else {
        const textarea = document.createElement('textarea');
        textarea.value = text;
        textarea.style.position = 'fixed';
        textarea.style.left = '-9999px';
        textarea.style.top = '-9999px';
        document.body.appendChild(textarea);
        textarea.focus();
        textarea.select();
        document.execCommand('copy');
        document.body.removeChild(textarea);
      }
      showToast('Copied API Key to clipboard', 'success');
    } catch (error) {
      console.error('Failed to copy to clipboard:', error);
    }
  };

  const toggleKeyVisibility = (keyId) => {
    setShowKey(prev => ({
      ...prev,
      [keyId]: !prev[keyId]
    }));
  };

  /* ------------------------------------------------------------------
   * Handlers – wrap the hook's CRUD helpers so we can keep toast and
   * form-state logic local to this component.
   * ------------------------------------------------------------------ */

  const handleCreateKey = async (e) => {
    e.preventDefault();
    const { ok, error } = await createApiKey({
      name: newKeyName,
      key: newKeyValue,
      type: newKeyType,
      usage: newKeyUsage,
    });

    if (ok) {
      setNewKeyName('');
      setNewKeyValue('');
      setNewKeyType('');
      setNewKeyUsage('');
      setShowCreateModal(false);
      showToast('API Key created', 'success');
    } else {
      showToast(error, 'error');
    }
  };

  const handleDeleteKey = async (id) => {
    if (!confirm('Are you sure you want to delete this API key?')) return;
    const { ok, error } = await deleteApiKey(id);
    if (ok) {
      showToast('API Key deleted', 'error');
    } else {
      showToast(error, 'error');
    }
  };

  const handleUpdateKey = async (id, name, keyVal, typeVal, usageVal) => {
    const { ok, error } = await updateApiKey({
      id,
      name,
      key: keyVal,
      type: typeVal,
      usage: usageVal,
    });
    if (ok) {
      showToast('API Key updated', 'success');
    } else {
      showToast(error, 'error');
    }
  };

  return (
    <div className="min-h-screen bg-[#fafafa] p-8">
      {/* Toast */}
      {toast && (
        <div className={`fixed top-6 left-1/2 -translate-x-1/2 z-50 px-6 py-3 rounded-xl shadow-lg flex items-center gap-3 animate-slide-down ${toast.type==='error' ? 'bg-red-600' : 'bg-green-600'} text-white`}>
          <svg className="w-5 h-5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" /></svg>
          <span className="font-medium">{toast.msg}</span>
          <button className="ml-2" onClick={() => setToast(null)}>
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" /></svg>
          </button>
        </div>
      )}
      <div className="max-w-6xl mx-auto">
        {/* Header */}
        <div className="flex items-center justify-between mb-8">
          <div className="flex items-center gap-2">
            <h1 className="text-2xl font-semibold text-[#1a1a1a]">Overview</h1>
          </div>
          <div className="flex items-center gap-4">
            <div className="flex items-center gap-2">
              <div className="w-2 h-2 bg-green-500 rounded-full"></div>
              <span className="text-sm text-gray-600">Operational</span>
            </div>
          </div>
        </div>

        {/* Current Plan Card */}
        <div className="w-full rounded-2xl p-8 mb-8 bg-gradient-to-r from-[#f8d7da] via-[#e4b7c5] to-[#b8c7e8]">
          <div className="flex justify-between items-start mb-8">
            <div>
              <h2 className="text-sm font-medium text-white/80 mb-2">CURRENT PLAN</h2>
              <h3 className="text-4xl font-semibold text-white">Researcher</h3>
            </div>
            <button className="bg-white/20 text-white px-4 py-2 rounded-lg hover:bg-white/30 transition-colors">
              Manage Plan
            </button>
          </div>
          <div>
            <h4 className="text-white/80 text-sm mb-2 flex items-center gap-2">
              API Usage
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
            </h4>
            <div className="bg-white/20 rounded-full h-2 mb-2">
              <div className="bg-white rounded-full h-2 w-0"></div>
            </div>
            <div className="flex justify-between items-center">
              <div className="flex items-center gap-2">
                <div className="w-6 h-3 bg-white/20 rounded-full">
                  <div className="w-3 h-3 bg-white rounded-full"></div>
                </div>
                <span className="text-sm text-white/80">Pay as you go</span>
              </div>
              <span className="text-sm text-white">0/1,000 Credits</span>
            </div>
          </div>
        </div>

        {/* API Keys Section */}
        <div className="bg-white rounded-2xl shadow-sm">
          <div className="p-6 border-b border-gray-100">
            <div className="flex justify-between items-center">
              <h2 className="text-xl font-semibold text-gray-900">API Keys</h2>
              <button
                onClick={() => setShowCreateModal(true)}
                className="flex items-center gap-2 text-gray-600 hover:text-gray-900"
              >
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
                </svg>
              </button>
            </div>
            <p className="text-sm text-gray-500 mt-1">
              The key is used to authenticate your requests to the Research API.
            </p>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="text-left text-sm text-gray-500">
                  <th className="px-6 py-3 font-medium">NAME</th>
                  <th className="px-6 py-3 font-medium">TYPE</th>
                  <th className="px-6 py-3 font-medium">USAGE</th>
                  <th className="px-6 py-3 font-medium">KEY</th>
                  <th className="px-6 py-3 font-medium">OPTIONS</th>
                </tr>
              </thead>
              <tbody>
                {apiKeys.map((key) => (
                  <tr key={key.id} className="border-t border-gray-100">
                    <td className="px-6 py-4 text-sm text-gray-900">{key.name}</td>
                    <td className="px-6 py-4 text-sm text-gray-500">dev</td>
                    <td className="px-6 py-4 text-sm text-gray-500">0</td>
                    <td className="px-6 py-4">
                      <div className="flex items-center gap-2">
                        <code className="text-sm font-mono bg-gray-50 px-2 py-1 rounded">
                          {showKey[key.id] ? key.key : `${key.key.substring(0, 12)}...`}
                        </code>
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      <div className="flex items-center gap-3">
                        <button
                          onClick={() => toggleKeyVisibility(key.id)}
                          className="text-gray-400 hover:text-gray-600"
                          title={showKey[key.id] ? "Hide key" : "Show key"}
                        >
                          <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            {showKey[key.id] ? (
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13.875 18.825A10.05 10.05 0 0112 19c-4.478 0-8.268-2.943-9.543-7a9.97 9.97 0 011.563-3.029m5.858.908a3 3 0 114.243 4.243M9.878 9.878l4.242 4.242M9.878 9.878L3 3m6.878 6.878L21 21" />
                            ) : (
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                            )}
                          </svg>
                        </button>
                        <button
                          onClick={() => copyToClipboard(key.key)}
                          className="text-gray-400 hover:text-gray-600"
                          title="Copy to clipboard"
                        >
                          <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 16H6a2 2 0 01-2-2V6a2 2 0 012-2h8a2 2 0 012 2v2m-6 12h8a2 2 0 002-2v-8a2 2 0 00-2-2h-8a2 2 0 00-2 2v8a2 2 0 002 2z" />
                          </svg>
                        </button>
                        <button
                          onClick={() => setEditModal({ ...key })}
                          className="text-gray-400 hover:text-gray-600"
                          title="Edit key"
                        >
                          <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15.232 5.232l3.536 3.536m-2.036-5.036a2.5 2.5 0 113.536 3.536L7 21H3v-4L16.732 3.732z"/></svg>
                        </button>
                        <button
                          onClick={() => handleDeleteKey(key.id)}
                          className="text-gray-400 hover:text-gray-600"
                          title="Delete key"
                        >
                          <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                          </svg>
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>

      {/* Edit Modal */}
      {editModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-2xl p-6 w-[400px]">
            <h3 className="text-lg font-semibold text-gray-900 mb-4">Edit API Key</h3>
            <form onSubmit={async (e) => { e.preventDefault(); await handleUpdateKey(editModal.id, editModal.name, editModal.key, editModal.type, editModal.usage); setEditModal(null); }}>
              <div className="mb-4">
                <label className="block text-sm font-medium text-gray-700 mb-1">Key Name</label>
                <input type="text" value={editModal.name} onChange={(e)=>setEditModal({...editModal,name:e.target.value})} className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500" required />
              </div>
              <div className="mb-4">
                <label className="block text-sm font-medium text-gray-700 mb-1">Key Value</label>
                <input type="text" value={editModal.key} onChange={(e)=>setEditModal({...editModal,key:e.target.value})} className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500" required />
              </div>
              <div className="mb-4">
                <label className="block text-sm font-medium text-gray-700 mb-1">Type (optional)</label>
                <input type="text" value={editModal.type||''} onChange={(e)=>setEditModal({...editModal,type:e.target.value})} className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500" />
              </div>
              <div className="mb-4">
                <label className="block text-sm font-medium text-gray-700 mb-1">Usage (optional)</label>
                <input type="number" min="0" value={editModal.usage??''} onChange={(e)=>setEditModal({...editModal,usage:e.target.value})} className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500" />
              </div>
              <div className="flex justify-end gap-3">
                <button type="button" onClick={()=>setEditModal(null)} className="px-4 py-2 text-sm font-medium text-gray-700 bg-gray-100 rounded-lg hover:bg-gray-200">Cancel</button>
                <button type="submit" className="px-4 py-2 text-sm font-medium text-white bg-blue-600 rounded-lg hover:bg-blue-700">Save</button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Create Modal */}
      {showCreateModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center">
          <div className="bg-white rounded-2xl p-6 w-[400px]">
            <h3 className="text-lg font-semibold text-gray-900 mb-4">Create New API Key</h3>
            <form onSubmit={handleCreateKey}>
              <div className="mb-4">
                <label className="block text-sm font-medium text-gray-700 mb-1">Key Name</label>
                <input
                  type="text"
                  id="keyName"
                  value={newKeyName}
                  onChange={(e) => setNewKeyName(e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                  placeholder="Enter a name for your API key"
                  required
                />
              </div>
              <div className="mb-4">
                <label className="block text-sm font-medium text-gray-700 mb-1">Key Value (optional)</label>
                <input type="text" value={newKeyValue} onChange={(e)=>setNewKeyValue(e.target.value)} className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500" placeholder="Leave blank to auto-generate" />
              </div>
              <div className="mb-4">
                <label className="block text-sm font-medium text-gray-700 mb-1">Type (optional)</label>
                <input type="text" value={newKeyType} onChange={(e)=>setNewKeyType(e.target.value)} className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500" />
              </div>
              <div className="mb-4">
                <label className="block text-sm font-medium text-gray-700 mb-1">Usage (optional)</label>
                <input type="number" min="0" value={newKeyUsage} onChange={(e)=>setNewKeyUsage(e.target.value)} className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500" />
              </div>
              <div className="flex justify-end gap-3">
                <button
                  type="button"
                  onClick={() => setShowCreateModal(false)}
                  className="px-4 py-2 text-sm font-medium text-gray-700 bg-gray-100 rounded-lg hover:bg-gray-200"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 text-sm font-medium text-white bg-blue-600 rounded-lg hover:bg-blue-700"
                >
                  Create
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
} 