# `@media/media-ui-react`

The `media-ui-react` package is a pure, headless React component library designed for displaying media items. 

It provides robust behavior, state management, and accessibility (a11y) out of the box, but ships with **zero CSS styling**. It uses the "Prop Getters" pattern, allowing you to completely control the visual presentation of the components while inheriting essential functional behaviors like Intersection Observers and keyboard navigation.

## Design Philosophy

- **Decoupled**: Completely unaware of `@media/media-core` or Pexels API data structures. It only expects standard data shapes via props.
- **Headless**: Returns state and prop-getters, allowing the consumer (your app) to supply the actual DOM markup and CSS styles.
- **Accessible**: Manages focus trapping, ARIA attributes, and keyboard interactions (e.g., `Escape` to close modals, arrow keys for navigation).

## Components & Hooks

### 1. Grid (`<MediaGrid>` / `useMediaGrid`)
A performant, infinite-scrolling grid for rendering lists of media items.
- Automatically observes the last item in the list using `IntersectionObserver` to trigger `onLoadMore`.

### 2. Lightbox (`<Lightbox>` / `useLightbox`)
An accessible full-screen modal overlay for viewing high-resolution media.
- Traps focus inside the modal.
- Supports keyboard navigation (Next/Prev/Close).
- Manages its own open/close state or accepts controlled props.

### 3. Reel Swiper (`<ReelSwiper>` / `useReelSwiper`)
A vertical, snap-scrolling video feed (similar to TikTok or Instagram Reels).
- Uses `IntersectionObserver` to detect which video is currently active in the viewport.
- Exposes functions to programmatically scroll to the next or previous reel.

## Usage Example

```tsx
import { ReelSwiper } from '@media/media-ui-react';

function AppReels({ items }) {
  return (
    <ReelSwiper
      items={items}
      onActiveChange={(index, item) => console.log('Active video:', item.id)}
      containerProps={{ className: 'my-custom-scroll-container' }}
      renderItem={(item, props) => (
        <div key={item.id} className="my-custom-reel-item" {...props}>
          <video src={item.url} autoPlay loop muted />
        </div>
      )}
    />
  );
}
```
