---
name: media-ui
description: Instructions for AI agents on how to consume the headless media-ui-react component library.
---

# `media-ui-react` AI Consumption Guide

This package provides pure, headless UI components and hooks. It does NOT fetch data, and it is completely unaware of the `media-core` or `media-react` SDKs.

## Rules and Guidelines

1. **Headless Philosophy**:
   The components in this package do not ship with CSS. They provide behavior, state management, and accessibility props via "prop getters". You, as the consumer (e.g., Next.js app), must provide all CSS, layout, and visual styling.

2. **Available Hooks & Components**:
   - `useMediaGrid` / `<MediaGrid>`: For infinite scrolling grids.
   - `useLightbox` / `<Lightbox>`: For accessible full-screen modal overlays.
   - `useReelSwiper` / `<ReelSwiper>`: For TikTok/Reels style vertical scrolling videos using CSS snap.

3. **Prop Getters**:
   Hooks return prop getters like `getContainerProps()`, `getItemProps()`. You MUST spread these onto the DOM elements to ensure accessibility and correct behavior.

4. **Accessibility (a11y)**:
   The UI components already handle `role`, `aria-*` tags, focus management, and keyboard navigation (e.g., `Escape` to close lightbox). Do not override these unless strictly necessary.

5. **Styling Contract**:
   Since there is no default styling, you must provide styles in your app. For example, for `<ReelSwiper>`, the consumer must apply `overflowY: 'scroll'` and `scrollSnapType: 'y mandatory'` (the hook provides default styles for this, but custom styling can override them).

## Example: Lightbox

```jsx
import { useLightbox, Lightbox } from '@media/media-ui-react';

function App({ items }) {
  const [isOpen, setIsOpen] = useState(false);
  const [index, setIndex] = useState(0);

  return (
    <Lightbox 
      isOpen={isOpen}
      items={items}
      initialIndex={index}
      onClose={() => setIsOpen(false)}
      renderItem={(item) => <img src={item.url} alt={item.alt} />}
      renderCloseButton={(props) => <button {...props}>Close</button>}
    />
  );
}
```
