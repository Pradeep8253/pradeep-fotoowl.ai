import { useState, useEffect, useRef, useCallback } from 'react';
import { useMediaClient } from './MediaProvider.jsx';

export function useMediaSearch() {
  const client = useMediaClient();
  const [data, setData] = useState({
    items: [],
    page: 1,
    perPage: 15,
    hasMore: false,
    totalResults: 0,
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  
  // Track current query parameters to detect changes
  const currentQueryParams = useRef({ query: '', type: 'photo' });
  const abortControllerRef = useRef(null);

  const search = useCallback(async (params) => {
    // Determine query string and options
    const query = typeof params === 'string' ? params : params.query;
    const type = typeof params === 'string' ? 'photo' : (params.type || 'photo');
    const perPage = (typeof params === 'object' && params.perPage) ? params.perPage : 15;

    if (!query) {
      setData({ items: [], page: 1, perPage, hasMore: false, totalResults: 0 });
      return;
    }

    currentQueryParams.current = { query, type, perPage };

    // Cancel previous request
    if (abortControllerRef.current) {
      abortControllerRef.current.abort();
    }
    const controller = new AbortController();
    abortControllerRef.current = controller;

    setLoading(true);
    setError(null);

    try {
      const response = await client.search({
        query,
        type,
        page: 1,
        perPage,
        signal: controller.signal,
      });

      setData({
        items: response.items,
        page: 1,
        perPage,
        hasMore: !!response.nextPage,
        totalResults: response.totalResults,
      });
    } catch (err) {
      if (err.code !== 'ABORTED') {
        setError(err);
        setData(prev => ({ ...prev, items: [], hasMore: false }));
      }
    } finally {
      if (!controller.signal.aborted) {
        setLoading(false);
      }
    }
  }, [client]);

  const loadMore = useCallback(async () => {
    if (loading || !data.hasMore || !currentQueryParams.current.query) return;

    if (abortControllerRef.current) {
      abortControllerRef.current.abort();
    }
    const controller = new AbortController();
    abortControllerRef.current = controller;

    setLoading(true);
    setError(null);
    
    const nextPage = data.page + 1;
    const { query, type, perPage } = currentQueryParams.current;

    try {
      const response = await client.search({
        query,
        type,
        page: nextPage,
        perPage,
        signal: controller.signal,
      });

      setData(prev => {
        // Prevent duplicate items (just in case API returns overlapping results)
        const newItems = response.items.filter(newItem => 
          !prev.items.some(existing => existing.id === newItem.id)
        );

        return {
          ...prev,
          items: [...prev.items, ...newItems],
          page: nextPage,
          hasMore: !!response.nextPage,
          totalResults: response.totalResults,
        };
      });
    } catch (err) {
      if (err.code !== 'ABORTED') {
        setError(err);
      }
    } finally {
      if (!controller.signal.aborted) {
        setLoading(false);
      }
    }
  }, [client, loading, data.hasMore, data.page]);

  // Cleanup on unmount
  useEffect(() => {
    return () => {
      if (abortControllerRef.current) {
        abortControllerRef.current.abort();
      }
    };
  }, []);

  return {
    items: data.items,
    loading,
    error,
    hasMore: data.hasMore,
    page: data.page,
    totalResults: data.totalResults,
    search,
    loadMore,
  };
}
