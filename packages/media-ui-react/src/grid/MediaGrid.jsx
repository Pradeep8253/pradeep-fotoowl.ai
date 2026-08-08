import React from 'react';
import { useMediaGrid } from './useMediaGrid.js';

export function MediaGrid({ 
  items, 
  onLoadMore, 
  hasMore, 
  loading, 
  renderItem, 
  renderLoading, 
  renderEmpty,
  containerProps = {},
  ...props
}) {
  const { getContainerProps, getItemProps, getLoadMoreProps } = useMediaGrid({
    items,
    onLoadMore,
    hasMore,
    loading,
  });

  if (!items || items.length === 0) {
    if (loading && renderLoading) return renderLoading();
    if (renderEmpty) return renderEmpty();
    return null;
  }

  return (
    <div {...getContainerProps(containerProps)} {...props}>
      {items.map((item, index) => renderItem(item, getItemProps(item), index))}
      
      {hasMore && (
        <div {...getLoadMoreProps()}>
          {loading && renderLoading ? renderLoading() : null}
        </div>
      )}
    </div>
  );
}
