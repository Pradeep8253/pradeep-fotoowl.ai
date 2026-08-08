import { useEffect, useRef, useState, useCallback } from 'react';

export function useReelSwiper({ items = [], onActiveChange }) {
  const containerRef = useRef(null);
  const [activeIndex, setActiveIndex] = useState(0);

  // Use IntersectionObserver to track which item is mostly in view
  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            const index = Number(entry.target.getAttribute('data-index'));
            if (!isNaN(index) && index !== activeIndex) {
              setActiveIndex(index);
              if (onActiveChange) {
                onActiveChange(index, items[index]);
              }
            }
          }
        });
      },
      {
        root: containerRef.current,
        threshold: 0.6, // trigger when 60% of item is in view
      }
    );

    const items = containerRef.current?.querySelectorAll('[data-index]');
    items?.forEach((item) => observer.observe(item));

    return () => {
      items?.forEach((item) => observer.unobserve(item));
      observer.disconnect();
    };
  }, [items, activeIndex, onActiveChange]);

  const scrollTo = useCallback((index) => {
    if (!containerRef.current) return;
    const targetElement = containerRef.current.querySelector(`[data-index="${index}"]`);
    if (targetElement) {
      targetElement.scrollIntoView({ behavior: 'smooth' });
    }
  }, []);

  const next = useCallback(() => {
    if (activeIndex < items.length - 1) {
      scrollTo(activeIndex + 1);
    }
  }, [activeIndex, items.length, scrollTo]);

  const previous = useCallback(() => {
    if (activeIndex > 0) {
      scrollTo(activeIndex - 1);
    }
  }, [activeIndex, scrollTo]);

  const getContainerProps = (props = {}) => ({
    ref: containerRef,
    style: {
      overflowY: 'scroll',
      scrollSnapType: 'y mandatory',
      height: '100%',
      ...props.style,
    },
    ...props,
  });

  const getItemProps = (item, index, props = {}) => ({
    'data-index': index,
    style: {
      scrollSnapAlign: 'start',
      height: '100%',
      ...props.style,
    },
    ...props,
  });

  return {
    activeIndex,
    activeItem: items[activeIndex],
    next,
    previous,
    scrollTo,
    getContainerProps,
    getItemProps,
  };
}
