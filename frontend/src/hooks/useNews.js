import { useState, useEffect, useCallback } from 'react';

const API = '/api';

export function useArticles(filters = {}) {
  const [articles, setArticles] = useState([]);
  const [total, setTotal] = useState(0);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const fetch = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const params = new URLSearchParams();
      if (filters.source) params.set('source', filters.source);
      if (filters.category) params.set('category', filters.category);
      if (filters.limit) params.set('limit', filters.limit);
      if (filters.offset) params.set('offset', filters.offset);

      const res = await window.fetch(`${API}/articles?${params}`);
      if (!res.ok) throw new Error('Failed to fetch articles');
      const data = await res.json();
      setArticles(data.articles || []);
      setTotal(data.total || 0);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  }, [filters.source, filters.category, filters.limit, filters.offset]);

  useEffect(() => { fetch(); }, [fetch]);

  return { articles, total, loading, error, refetch: fetch };
}

export function useBrief() {
  const [brief, setBrief] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [regenerating, setRegenerating] = useState(false);

  const fetchBrief = async () => {
    setLoading(true);
    setError(null);
    try {
      const res = await window.fetch(`${API}/brief`);
      if (!res.ok) throw new Error('Failed to fetch brief');
      const data = await res.json();
      if (typeof data.key_themes === 'string') {
        try { data.key_themes = JSON.parse(data.key_themes); } catch {}
      }
      setBrief(data);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  const regenerate = async () => {
    setRegenerating(true);
    try {
      const res = await window.fetch(`${API}/brief/regenerate`, { method: 'POST' });
      if (!res.ok) throw new Error('Failed to regenerate brief');
      const data = await res.json();
      if (typeof data.key_themes === 'string') {
        try { data.key_themes = JSON.parse(data.key_themes); } catch {}
      }
      setBrief(data);
    } catch (err) {
      setError(err.message);
    } finally {
      setRegenerating(false);
    }
  };

  useEffect(() => { fetchBrief(); }, []);

  return { brief, loading, error, regenerate, regenerating };
}

export function useConnections() {
  const [connections, setConnections] = useState([]);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);

  const fetchConnections = async () => {
    setLoading(true);
    try {
      const res = await window.fetch(`${API}/connections`);
      if (!res.ok) throw new Error('Failed');
      const data = await res.json();
      setConnections(data);
    } catch {
      setConnections([]);
    } finally {
      setLoading(false);
    }
  };

  const refresh = async () => {
    setRefreshing(true);
    try {
      const res = await window.fetch(`${API}/connections/refresh`, { method: 'POST' });
      if (!res.ok) throw new Error('Failed');
      const data = await res.json();
      if (data.length > 0) setConnections(data);
      else fetchConnections();
    } catch {
      fetchConnections();
    } finally {
      setRefreshing(false);
    }
  };

  useEffect(() => { fetchConnections(); }, []);

  return { connections, loading, refreshing, refresh };
}

export function useSources() {
  const [sources, setSources] = useState([]);
  useEffect(() => {
    window.fetch(`${API}/sources`)
      .then(r => r.json())
      .then(setSources)
      .catch(() => setSources([]));
  }, []);
  return sources;
}

export function useStats() {
  const [stats, setStats] = useState(null);
  const fetch = async () => {
    try {
      const res = await window.fetch(`${API}/stats`);
      const data = await res.json();
      setStats(data);
    } catch {}
  };
  useEffect(() => { fetch(); }, []);
  return stats;
}

export async function triggerRefresh() {
  await window.fetch(`${API}/refresh`, { method: 'POST' });
}

export async function analyzeArticle(id) {
  const res = await window.fetch(`${API}/article/${id}/analyze`, { method: 'POST' });
  if (!res.ok) throw new Error('Analysis failed');
  return res.json();
}
