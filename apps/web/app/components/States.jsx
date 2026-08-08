import React from 'react';

export function LoadingState() {
  return (
    <div className="state-message">
      <div className="loading-spinner" />
      <p style={{ marginTop: '1rem' }}>Loading amazing content...</p>
    </div>
  );
}

export function ErrorState({ error }) {
  return (
    <div className="state-message" style={{ borderColor: '#ef4444', color: '#ef4444' }}>
      <h3>Oops! Something went wrong</h3>
      <p>{error?.message || 'Unable to load media. Please try again.'}</p>
    </div>
  );
}

export function EmptyState({ query }) {
  return (
    <div className="state-message">
      <h3>No results found</h3>
      <p>We couldn't find any media for "{query}". Try another search term.</p>
    </div>
  );
}
