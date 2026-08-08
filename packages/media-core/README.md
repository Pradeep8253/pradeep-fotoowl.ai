# `@media/media-core`

The `media-core` package is a framework-agnostic, zero-UI Software Development Kit (SDK) for interacting with the Pexels API. It handles all network requests, caching, response normalization, and event emission without any dependency on React, React Native, or the DOM.

## Features

- **Framework Agnostic**: Pure TypeScript/JavaScript implementation.
- **Typed Contracts**: Fully typed request and response objects.
- **Normalized Data**: Maps Pexels API responses into clean, consistent `Photo` and `Video` entities.
- **Caching & Deduplication**: Built-in memory cache to prevent redundant network calls.
- **Event Emitter**: Emits `view` and `download` events for easy analytics integration.
- **Cancellation**: Supports `AbortController` to cancel inflight requests when components unmount.

## Initialization

You must initialize the client with your Pexels API key before making requests:

```typescript
import { createMediaClient } from '@media/media-core';

const client = createMediaClient({
  apiKey: 'YOUR_API_KEY'
});
```

## API Methods

### `client.search({ query, type, page, perPage })`
Searches for photos or videos based on a query.
- `type`: `'photo'` or `'video'`

### `client.getCurated({ type, page, perPage })`
Fetches curated photos or popular videos.

### `client.getItem({ id, type })`
Fetches a single photo or video by its unique ID.

## Event System

The SDK includes a built-in event emitter for tracking media interactions:

```typescript
// Subscribe to download events
const unsubscribe = client.on('download', (item) => {
  console.log('User downloaded:', item.id);
});

// Trigger an event
client.download(item);

// Cleanup
unsubscribe();
```
