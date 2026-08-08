import React from 'react';
import { useReelSwiper } from './useReelSwiper.js';

export function ReelSwiper({
  items,
  onActiveChange,
  renderItem,
  containerProps = {},
}) {
  const { getContainerProps, getItemProps } = useReelSwiper({ items, onActiveChange });

  if (!items || items.length === 0) return null;

  return (
    <div {...getContainerProps(containerProps)}>
      {items.map((item, index) => 
        renderItem(item, getItemProps(item, index), index)
      )}
    </div>
  );
}
