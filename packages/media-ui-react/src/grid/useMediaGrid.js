import { useEffect, useRef, useCallback } from 'react';

export function useMediaGrid({ items = [], onLoadMore, hasMore, loading }) {
  const observerRef = useRef(null);
  const loadMoreRef = useRef(null);

  const handleObserver = useCallback((entries) => {
    const target = entries[0];
    if (target.isIntersecting && hasMore && !loading && onLoadMore) {
      onLoadMore();
    }
  }, [hasMore, loading, onLoadMore]);

  useEffect(() => {
    const options = {
      root: null,
      rootMargin: '100px',
      threshold: 0,
    };
    
    observerRef.current = new IntersectionObserver(handleObserver, options);
    
    if (loadMoreRef.current) {
      observerRef.current.observe(loadMoreRef.current);
    }
    
    return () => {
      if (observerRef.current) observerRef.current.disconnect();
    };
  }, [handleObserver]);

  const getContainerProps = (props = {}) => ({
    role: 'grid',
    'aria-label': 'Media Grid',
    ...props,
    style: {
      display: 'grid',
      // The consumer should provide specific grid templates in their CSS,
      // but we provide a sensible default if they use inline styles
      ...props.style,
    },
  });

  const getItemProps = (item, props = {}) => ({
    role: 'gridcell',
    'aria-label': item.alt || item.photographer || 'Media item',
    tabIndex: 0,
    ...props,
  });

  const getLoadMoreProps = (props = {}) => ({
    ref: loadMoreRef,
    role: 'button',
    'aria-busy': loading,
    'aria-hidden': !hasMore,
    onClick: () => {
      if (hasMore && !loading && onLoadMore) {
        onLoadMore();
      }
    },
    ...props,
    style: {
      // Typically the load more element spans all columns
      gridColumn: '1 / -1',
      ...props.style,
    },
  });

  return {
    getContainerProps,
    getItemProps,
    getLoadMoreProps,
  };
}
