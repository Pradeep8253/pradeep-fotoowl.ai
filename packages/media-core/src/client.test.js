import { describe, it, expect, vi, beforeEach } from 'vitest';
import { createMediaClient } from './client.js';
import { ERROR_CODES } from './errors.js';

// Mock fetch
global.fetch = vi.fn();

describe('MediaCore Client', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it('should throw if no API key is provided on request', async () => {
    const client = createMediaClient();
    await expect(client.search({ query: 'nature' })).rejects.toThrow('API key is not configured');
  });

  it('should call Pexels search endpoint', async () => {
    const client = createMediaClient({ apiKey: 'test-key' });
    fetch.mockResolvedValueOnce({
      ok: true,
      json: async () => ({ photos: [{ id: 1, src: {} }] }),
    });

    await client.search({ query: 'nature' });
    
    expect(fetch).toHaveBeenCalledWith(
      expect.stringContaining('/v1/search?query=nature'),
      expect.objectContaining({
        headers: expect.objectContaining({
          Authorization: 'test-key',
        }),
      })
    );
  });

  it('should cache identical requests', async () => {
    const client = createMediaClient({ apiKey: 'test-key' });
    fetch.mockResolvedValueOnce({
      ok: true,
      json: async () => ({ photos: [] }),
    });

    await client.search({ query: 'nature' });
    await client.search({ query: 'nature' });

    // Should only be called once due to caching
    expect(fetch).toHaveBeenCalledTimes(1);
  });

  it('should deduplicate in-flight requests', async () => {
    const client = createMediaClient({ apiKey: 'test-key' });
    
    let resolveFetch;
    const fetchPromise = new Promise(resolve => {
      resolveFetch = resolve;
    });

    fetch.mockReturnValueOnce(fetchPromise);

    const req1 = client.search({ query: 'nature' });
    const req2 = client.search({ query: 'nature' });

    resolveFetch({
      ok: true,
      json: async () => ({ photos: [] }),
    });

    await Promise.all([req1, req2]);

    // Same cache key while in-flight -> fetch only once
    expect(fetch).toHaveBeenCalledTimes(1);
  });

  it('should normalize errors', async () => {
    const client = createMediaClient({ apiKey: 'test-key' });
    fetch.mockResolvedValueOnce({
      ok: false,
      status: 401,
      statusText: 'Unauthorized',
      json: async () => ({ error: 'Invalid API key' }),
    });

    try {
      await client.search({ query: 'nature' });
      expect.fail('Should have thrown');
    } catch (error) {
      expect(error.name).toBe('MediaError');
      expect(error.code).toBe(ERROR_CODES.UNAUTHORIZED);
    }
  });

  it('should emit view events', () => {
    const client = createMediaClient({ apiKey: 'test-key' });
    const listener = vi.fn();
    client.events.subscribe(listener);

    client.view({ id: 123, type: 'photo' });

    expect(listener).toHaveBeenCalledWith(
      expect.objectContaining({
        type: 'view',
        mediaId: 123,
      })
    );
  });
});
