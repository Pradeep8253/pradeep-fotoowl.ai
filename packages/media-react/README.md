# `@media/media-react`

The `media-react` package provides React bindings for `@media/media-core`. It exposes a Context Provider and a suite of custom hooks to easily integrate Pexels data into any React application while keeping business logic out of your UI components.

## Setup

Wrap your application (or the part of it that needs media access) in the `<MediaProvider>`:

```tsx
import { MediaProvider } from '@media/media-react';
import { createMediaClient } from '@media/media-core';

const client = createMediaClient({ apiKey: 'YOUR_API_KEY' });

function App() {
  return (
    <MediaProvider client={client}>
      <YourApp />
    </MediaProvider>
  );
}
```

## Available Hooks

### `useMediaSearch(query, type)`
Automatically fetches and manages state for search results. Handles loading states, pagination (`loadMore`), and request cancellation automatically.

```tsx
const { items, loading, error, hasMore, loadMore } = useMediaSearch('nature', 'photo');
```

### `useMediaCurated(type)`
Fetches trending/curated media. Shares the same return signature as `useMediaSearch`.

### `useMediaItem(id, type)`
Fetches a specific media item by its ID.

### `useMediaClient()`
Returns the underlying `media-core` client instance. Useful for triggering manual events like downloads.

```tsx
const client = useMediaClient();

const handleDownload = () => {
  client.download(item);
};
```
