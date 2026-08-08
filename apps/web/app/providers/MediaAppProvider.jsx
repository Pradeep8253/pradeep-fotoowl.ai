'use client';

import React, { useMemo } from 'react';
import { MediaProvider } from '@media/media-react';
import { createMediaClient } from '@media/media-core';

export function MediaAppProvider({ children }) {
  const client = useMemo(() => {
    // In a real application, you might want to proxy requests through a Next.js API route
    // to hide the API key completely. Here we use NEXT_PUBLIC to satisfy the take-home
    // requirement while pointing out the trade-off.
    const apiKey = process.env.NEXT_PUBLIC_PEXELS_API_KEY;
    return createMediaClient({ 
      apiKey,
      enableLogging: process.env.NODE_ENV === 'development',
    });
  }, []);

  return <MediaProvider client={client}>{children}</MediaProvider>;
}
