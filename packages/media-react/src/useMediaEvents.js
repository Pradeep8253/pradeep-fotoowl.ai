import { useEffect } from 'react';
import { useMediaClient } from './MediaProvider.jsx';

export function useMediaEvents(listener) {
  const client = useMediaClient();

  useEffect(() => {
    if (typeof listener !== 'function') return;
    
    const unsubscribe = client.events.subscribe(listener);
    return () => unsubscribe();
  }, [client, listener]);
}
