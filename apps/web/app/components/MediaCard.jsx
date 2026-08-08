'use client';

import React from 'react';
import { useMediaClient } from '@media/media-react';

export function MediaCard({ item, onClick, cardProps = {} }) {
  const client = useMediaClient();

  const handleDownload = (e) => {
    e.stopPropagation();
    client.download(item);
    
    // Simulate actual download opening
    const url = item.type === 'video' ? item.src : item.src.original;
    if (url) window.open(url, '_blank');
  };

  return (
    <article 
      className="media-card" 
      onClick={() => onClick(item)}
      {...cardProps}
    >
      <img 
        src={item.thumbnail} 
        alt={item.alt || item.photographer}
        className="media-thumbnail"
        loading="lazy"
      />
      <div className="media-overlay">
        <div>
          <div className="media-author">{item.photographer}</div>
          <div className="media-type-badge">{item.type}</div>
        </div>
        <button 
          className="action-btn"
          onClick={handleDownload}
          aria-label="Download"
        >
          Download
        </button>
      </div>
    </article>
  );
}
