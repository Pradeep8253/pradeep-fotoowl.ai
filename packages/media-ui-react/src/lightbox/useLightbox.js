import { useState, useCallback, useEffect, useRef } from 'react';

export function useLightbox({ items = [], initialIndex = -1, onClose, onActiveChange }) {
  const [isOpen, setIsOpen] = useState(initialIndex >= 0);
  const [activeIndex, setActiveIndex] = useState(initialIndex >= 0 ? initialIndex : 0);
  const triggerRef = useRef(null); // stores the element that opened the lightbox

  const open = useCallback((index, triggerElement = null) => {
    if (triggerElement) {
      triggerRef.current = triggerElement;
    } else if (document.activeElement) {
      triggerRef.current = document.activeElement;
    }
    setActiveIndex(index >= 0 && index < items.length ? index : 0);
    setIsOpen(true);
  }, [items.length]);

  const close = useCallback(() => {
    setIsOpen(false);
    if (onClose) onClose();
    
    // Restore focus
    if (triggerRef.current && typeof triggerRef.current.focus === 'function') {
      setTimeout(() => triggerRef.current.focus(), 0);
    }
  }, [onClose]);

  const next = useCallback(() => {
    setActiveIndex((prev) => {
      const nextIndex = prev < items.length - 1 ? prev + 1 : prev;
      if (nextIndex !== prev && onActiveChange) onActiveChange(nextIndex);
      return nextIndex;
    });
  }, [items.length, onActiveChange]);

  const previous = useCallback(() => {
    setActiveIndex((prev) => {
      const prevIndex = prev > 0 ? prev - 1 : prev;
      if (prevIndex !== prev && onActiveChange) onActiveChange(prevIndex);
      return prevIndex;
    });
  }, [onActiveChange]);

  // Keyboard navigation
  useEffect(() => {
    if (!isOpen) return;

    const handleKeyDown = (e) => {
      switch (e.key) {
        case 'Escape':
          e.preventDefault();
          close();
          break;
        case 'ArrowRight':
          e.preventDefault();
          next();
          break;
        case 'ArrowLeft':
          e.preventDefault();
          previous();
          break;
        default:
          break;
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    // Prevent background scrolling
    document.body.style.overflow = 'hidden';

    return () => {
      window.removeEventListener('keydown', handleKeyDown);
      document.body.style.overflow = '';
    };
  }, [isOpen, close, next, previous]);

  const activeItem = items[activeIndex];

  const getRootProps = (props = {}) => ({
    role: 'dialog',
    'aria-modal': 'true',
    'aria-label': 'Image Lightbox',
    ...props,
  });

  const getOverlayProps = (props = {}) => ({
    onClick: close,
    ...props,
  });

  const getCloseButtonProps = (props = {}) => ({
    'aria-label': 'Close',
    onClick: close,
    ...props,
  });

  const getNextButtonProps = (props = {}) => ({
    'aria-label': 'Next',
    onClick: next,
    disabled: activeIndex >= items.length - 1,
    ...props,
  });

  const getPreviousButtonProps = (props = {}) => ({
    'aria-label': 'Previous',
    onClick: previous,
    disabled: activeIndex <= 0,
    ...props,
  });

  return {
    isOpen,
    activeIndex,
    activeItem,
    open,
    close,
    next,
    previous,
    getRootProps,
    getOverlayProps,
    getCloseButtonProps,
    getNextButtonProps,
    getPreviousButtonProps,
  };
}
