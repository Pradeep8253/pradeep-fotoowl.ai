'use client';

import React, { useState } from 'react';
import { useMediaSearch, useMediaClient } from '@media/media-react';
import { MediaGrid, Lightbox, ReelSwiper } from '@media/media-ui-react';
import { SearchBar } from './SearchBar.jsx';
import { MediaCard } from './MediaCard.jsx';
import { LoadingState, ErrorState, EmptyState } from './States.jsx';

export function MediaExplorer() {
  const { items, loading, error, hasMore, search, loadMore } = useMediaSearch();
  const client = useMediaClient();
  
  const [currentQuery, setCurrentQuery] = useState('');
  const [currentType, setCurrentType] = useState('photo');
  
  const [lightboxOpen, setLightboxOpen] = useState(false);
  const [lightboxIndex, setLightboxIndex] = useState(0);

  const [isMuted, setIsMuted] = useState(true);

  const handleSearch = ({ query, type }) => {
    setCurrentQuery(query);
    setCurrentType(type);
    search({ query, type });
  };

  const handleItemClick = (item, index) => {
    client.view(item); // Emit view event
    setLightboxIndex(index);
    setLightboxOpen(true);
  };

  const handleLightboxActiveChange = (index) => {
    if (items[index]) {
      client.view(items[index]);
    }
    // Load more if we are near the end of the lightbox items
    if (index >= items.length - 3 && hasMore && !loading) {
      loadMore();
    }
  };

  const handleReelActiveChange = (index, item) => {
    if (item) {
      client.view(item);
    }
    if (index >= items.length - 2 && hasMore && !loading) {
      loadMore();
    }
  };

  return (
    <div className="app-container">
      <header className="header">
        <h1 className="title">Media Explorer</h1>
        <SearchBar onSearch={handleSearch} initialQuery={currentQuery} initialType={currentType} />
      </header>

      <main style={{ flex: 1, display: 'flex', flexDirection: 'column' }}>
        {error && <ErrorState error={error} />}
        
        {!error && items.length === 0 && currentQuery && !loading && (
          <EmptyState query={currentQuery} />
        )}
        
        {!error && items.length === 0 && loading && (
          <LoadingState />
        )}

        {items.length > 0 && currentType === 'photo' && (
          <div className="grid-view">
            <MediaGrid
              items={items}
              hasMore={hasMore}
              loading={loading}
              onLoadMore={loadMore}
              containerProps={{ className: 'media-grid' }}
              renderItem={(item, props, index) => (
                <MediaCard 
                  key={item.id} 
                  item={item} 
                  cardProps={props}
                  onClick={() => handleItemClick(item, index)} 
                />
              )}
              renderLoading={() => (
                <button className="load-more-btn">
                  <div className="loading-spinner" />
                </button>
              )}
            />
          </div>
        )}

        {items.length > 0 && currentType === 'video' && (
          <div className="reels-container">
            <div className="reels-wrapper">
              <ReelSwiper
                items={items}
                onActiveChange={handleReelActiveChange}
                containerProps={{ className: 'reels-scroll-container' }}
                renderItem={(item, props) => {
                  const initial = item.photographer ? item.photographer.charAt(0).toUpperCase() : '?';
                  return (
                    <div key={item.id} className="reel-item" {...props}>
                      <div className="reel-bg-blur" style={{ backgroundImage: `url(${item.thumbnail})` }} />
                      <video 
                        src={item.src} 
                        className="reel-video"
                        poster={item.thumbnail}
                        autoPlay
                        muted={isMuted}
                        loop
                        playsInline
                        onClick={() => setIsMuted(!isMuted)}
                      />
                      <div className="reel-overlay">
                        <div className="reel-info-container">
                          <div className="reel-user-info">
                            <div className="reel-author-tag">
                              <div className="reel-avatar">{initial}</div>
                              <span>@{item.photographer.replace(/\s+/g, '').toLowerCase()}</span>
                            </div>
                            <p style={{ fontSize: '0.9rem', color: '#ccc', textShadow: '0 1px 2px rgba(0,0,0,0.5)' }}>
                              High-quality video from Pexels
                            </p>
                          </div>
                          
                          <div className="reel-side-actions">
                            <button 
                              className="reel-action-btn" 
                              onClick={() => setIsMuted(!isMuted)}
                              aria-label={isMuted ? 'Unmute' : 'Mute'}
                            >
                              <span className="reel-action-icon">{isMuted ? '🔇' : '🔊'}</span>
                            </button>
                            <button className="reel-action-btn" aria-label="Like">
                              <span className="reel-action-icon">❤️</span>
                            </button>
                            <button 
                              className="reel-action-btn" 
                              onClick={() => client.download(item)}
                              aria-label="Download"
                            >
                              <span className="reel-action-icon">⬇️</span>
                            </button>
                            <button className="reel-action-btn" aria-label="Share">
                              <span className="reel-action-icon">↗️</span>
                            </button>
                          </div>
                        </div>
                      </div>
                    </div>
                  );
                }}
              />
            </div>
          </div>
        )}
      </main>

      <Lightbox
        isOpen={lightboxOpen}
        items={items}
        initialIndex={lightboxIndex}
        onClose={() => setLightboxOpen(false)}
        onActiveChange={handleLightboxActiveChange}
        rootProps={{ className: 'lightbox-dialog' }}
        renderOverlay={(props) => <div className="lightbox-overlay" {...props} />}
        renderCloseButton={(props) => (
          <button className="lightbox-btn lightbox-close" {...props}>✕</button>
        )}
        renderPreviousButton={(props) => (
          <button className="lightbox-btn lightbox-prev" {...props}>←</button>
        )}
        renderNextButton={(props) => (
          <button className="lightbox-btn lightbox-next" {...props}>→</button>
        )}
        renderItem={(item) => (
          <div className="lightbox-content">
            {item.type === 'video' ? (
              <video src={item.src} className="lightbox-video" controls autoPlay />
            ) : (
              <img src={item.src.large2x || item.src.large} alt={item.alt} className="lightbox-img" />
            )}
          </div>
        )}
      />
    </div>
  );
}
