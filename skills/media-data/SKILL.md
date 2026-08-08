---
name: media-data
description: Instructions for AI agents on how to consume the media-react SDK.
---

# `media-react` AI Consumption Guide

This SDK provides data hooks for interacting with the media core (Pexels API wrapper).

## Rules and Guidelines

1. **MediaProvider**: 
   The application must be wrapped in a `<MediaProvider client={client}>`. Do not use any hooks from `@media/media-react` outside of this provider.

2. **API Key Configuration**:
   The client instance should be created using `createMediaClient({ apiKey })` from `@media/media-core`. Keep the API key secure (e.g., in `.env`). Do not expose the API key in UI components.

3. **Hooks Available**:
   - `useMediaClient()`: Returns the client instance. Use this if you need manual access to `client.events.subscribe`, `client.view()`, or `client.download()`.
   - `useMediaSearch()`: Returns `{ items, loading, error, hasMore, page, search, loadMore }`. 
   - `useMediaCurated()`: Returns `{ items, loading, error, hasMore, page, loadMore, refresh }`.
   - `useMediaItem(id, type)`: Returns `{ data, loading, error }`.
   - `useMediaEvents(listener)`: Automates subscription to `view` and `download` events and handles cleanup.

4. **Event Tracking**:
   You should track meaningful views by calling `client.view(item)`. You should track downloads via `client.download(item)`.

5. **Dependency Boundaries**:
   `@media/media-react` is strictly a data layer. It has zero knowledge of visual styling or headless UI components. Do not import `media-core` directly in UI components (except for type checking or client initialization in the root layout).

## Example: Searching

```jsx
import { useMediaSearch } from '@media/media-react';

function SearchComponent() {
  const { items, loading, search, loadMore, hasMore } = useMediaSearch();

  // Trigger search: search({ query: 'nature', type: 'photo' })
  // Trigger load more: if (hasMore) loadMore()
}
```
