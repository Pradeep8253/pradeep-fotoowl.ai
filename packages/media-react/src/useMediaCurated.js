import { useState, useEffect, useRef, useCallback } from 'react';
import { useMediaClient } from './MediaProvider.jsx';

export function useMediaCurated(initialParams = { type: 'photo', perPage: 15, immediate: true }) {
  const client = useMediaClient();
  const [data, setData] = useState({
    items: [],
    page: 1,
    perPage: initialParams.perPage || 15,
    hasMore: true,
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  
  const currentParams = useRef({ type: initialParams.type || 'photo', perPage: data.perPage });
  const abortControllerRef = useRef(null);

  const fetchCurated = useCallback(async (page = 1, options = {}) => {
    const type = options.type || currentParams.current.type;
    const perPage = options.perPage || currentParams.current.perPage;
    
    currentParams.current = { type, perPage };

    if (abortControllerRef.current) {
      abortControllerRef.current.abort();
    }
    const controller = new AbortController();
    abortControllerRef.current = controller;

    setLoading(true);
    setError(null);

    try {
      const response = await client.curated({
        type,
        page,
        perPage,
        signal: controller.signal,
      });

      setData(prev => {
        if (page === 1) {
          return {
            items: response.items,
            page: 1,
            perPage,
            hasMore: !!response.nextPage,
          };
        }
        
        const newItems = response.items.filter(newItem => 
          !prev.items.some(existing => existing.id === newItem.id)
        );

        return {
          ...prev,
          items: [...prev.items, ...newItems],
          page,
          hasMore: !!response.nextPage,
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
  }, [client]);

  const loadMore = useCallback(() => {
    if (loading || !data.hasMore) return;
    fetchCurated(data.page + 1);
  }, [loading, data.hasMore, data.page, fetchCurated]);

  const refresh = useCallback((options) => {
    fetchCurated(1, options);
  }, [fetchCurated]);

  useEffect(() => {
    if (initialParams.immediate) {
      fetchCurated(1);
    }
    return () => {
      if (abortControllerRef.current) {
        abortControllerRef.current.abort();
      }
    };
  }, []); // eslint-disable-line react-hooks/exhaustive-deps

  return {
    items: data.items,
    loading,
    error,
    hasMore: data.hasMore,
    page: data.page,
    loadMore,
    refresh,
  };
}
