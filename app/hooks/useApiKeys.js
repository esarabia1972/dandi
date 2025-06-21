import { useState, useEffect, useCallback } from 'react';

/**
 * useApiKeys – a small helper hook that centralises all CRUD interactions
 * with the `/api/keys` endpoints so UI components can stay focused on
 * rendering concerns only.
 */
export default function useApiKeys() {
  const [apiKeys, setApiKeys] = useState([]);
  const [loading, setLoading] = useState(true);

  /** Fetch helpers */
  const fetchApiKeys = useCallback(async () => {
    try {
      const res = await fetch('/api/keys');
      const data = await res.json();
      setApiKeys(Array.isArray(data) ? data : data.apiKeys ?? []);
    } catch (err) {
      /* eslint-disable no-console */
      console.error('Error fetching API keys:', err);
      /* eslint-enable no-console */
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchApiKeys();
  }, [fetchApiKeys]);

  /**
   * CRUD helpers return a tuple `{ ok, error }` so the caller can decide how
   * to surface feedback (toast, modal, etc.). Each successful mutation also
   * refreshes the local cache by re-fetching the latest list from the server.
   */
  const createApiKey = async ({ name, key, type, usage }) => {
    try {
      const res = await fetch('/api/keys', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          name,
          key,
          type: type || undefined,
          usage: usage !== '' ? Number(usage) : undefined,
        }),
      });

      if (res.ok) {
        await fetchApiKeys();
        return { ok: true };
      }

      const err = await res.json();
      return { ok: false, error: err.error || 'Failed to create key' };
    } catch (error) {
      console.error('Error creating API key:', error);
      return { ok: false, error: 'Failed to create key' };
    }
  };

  const deleteApiKey = async (id) => {
    try {
      const res = await fetch(`/api/keys/${id}`, { method: 'DELETE' });
      if (res.ok) {
        await fetchApiKeys();
        return { ok: true };
      }
      const err = await res.json();
      return { ok: false, error: err.error || 'Failed to delete key' };
    } catch (error) {
      console.error('Error deleting API key:', error);
      return { ok: false, error: 'Failed to delete key' };
    }
  };

  const updateApiKey = async ({ id, name, key: keyVal, type: typeVal, usage }) => {
    try {
      const res = await fetch(`/api/keys/${id}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          name,
          key: keyVal,
          type: typeVal || undefined,
          usage: usage !== '' ? Number(usage) : undefined,
        }),
      });

      if (res.ok) {
        await fetchApiKeys();
        return { ok: true };
      }
      const err = await res.json();
      return { ok: false, error: err.error || 'Failed to update key' };
    } catch (error) {
      console.error('Error updating API key:', error);
      return { ok: false, error: 'Failed to update key' };
    }
  };

  return {
    apiKeys,
    loading,
    createApiKey,
    deleteApiKey,
    updateApiKey,
  };
} 