import React, { createContext, useContext } from 'react';

const MediaContext = createContext(null);

export function MediaProvider({ client, children }) {
  if (!client) {
    throw new Error('MediaProvider requires a valid media client instance');
  }

  return (
    <MediaContext.Provider value={client}>
      {children}
    </MediaContext.Provider>
  );
}

export function useMediaClient() {
  const context = useContext(MediaContext);
  if (context === null) {
    throw new Error('useMediaClient must be used within a MediaProvider');
  }
  return context;
}
