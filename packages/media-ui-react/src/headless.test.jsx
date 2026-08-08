import { describe, it, expect, vi } from 'vitest';
import { renderHook, act } from '@testing-library/react';
import { useLightbox } from './lightbox/useLightbox.js';
import { useMediaGrid } from './grid/useMediaGrid.js';

describe('useLightbox', () => {
  it('initializes correctly', () => {
    const { result } = renderHook(() => useLightbox({ items: [1, 2, 3] }));
    expect(result.current.isOpen).toBe(false);
    expect(result.current.activeIndex).toBe(0);
  });

  it('opens and closes', () => {
    const { result } = renderHook(() => useLightbox({ items: [1, 2, 3] }));
    act(() => {
      result.current.open(1);
    });
    expect(result.current.isOpen).toBe(true);
    expect(result.current.activeIndex).toBe(1);

    act(() => {
      result.current.close();
    });
    expect(result.current.isOpen).toBe(false);
  });
});

describe('useMediaGrid', () => {
  it('provides accessible props', () => {
    const { result } = renderHook(() => useMediaGrid({ items: [] }));
    const containerProps = result.current.getContainerProps();
    expect(containerProps.role).toBe('grid');
  });
});
