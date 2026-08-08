import { useState, useEffect, useRef } from 'react';
import { useMediaClient } from './MediaProvider.jsx';

export function useMediaItem(id, type = 'photo') {
  const client = useMediaClient();
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const abortControllerRef = useRef(null);

  useEffect(() => {
    if (!id) return;

    if (abortControllerRef.current) {
      abortControllerRef.current.abort();
    }
    const controller = new AbortController();
    abortControllerRef.current = controller;

    let isMounted = true;

    const fetchItem = async () => {
      setLoading(true);
      setError(null);
      try {
        const result = await client.getById(id, type, controller.signal);
        if (isMounted) {
          setData(result);
        }
      } catch (err) {
        if (isMounted && err.code !== 'ABORTED') {
          setError(err);
        }
      } finally {
        if (isMounted && !controller.signal.aborted) {
          setLoading(false);
        }
      }
    };

    fetchItem();

    return () => {
      isMounted = false;
      controller.abort();
    };
  }, [client, id, type]);

  return { data, loading, error };
}
