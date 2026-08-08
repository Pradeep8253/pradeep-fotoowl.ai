import { API_BASE_URL, ENDPOINTS } from './constants.js';
import { MediaError, ERROR_CODES } from './errors.js';
import { EventEmitter } from './emitter.js';
import { Cache } from './cache.js';
import { normalizePhoto, normalizeVideo, normalizeSearchResponse } from './normalize.js';

export function createMediaClient(options = {}) {
  const apiKey = options.apiKey;
  const events = new EventEmitter();
  const cache = new Cache(options.cacheTtl || 60000);
  
  // Track in-flight promises to deduplicate identical concurrent requests
  const pendingRequests = new Map();

  // Add default logger if requested (or we can just leave it to the consumer)
  if (options.enableLogging) {
    events.subscribe((event) => {
      console.log(`[Media Event] ${event.type}: ${event.mediaType} #${event.mediaId}`, event);
    });
  }

  async function fetchWithRetry(url, requestOptions, cacheKey) {
    if (pendingRequests.has(cacheKey)) {
      return pendingRequests.get(cacheKey);
    }

    const promise = (async () => {
      try {
        const response = await fetch(url, {
          ...requestOptions,
          headers: {
            Authorization: apiKey,
            'Content-Type': 'application/json',
            ...requestOptions.headers,
          },
        });

        if (!response.ok) {
          let code = ERROR_CODES.SERVER_ERROR;
          if (response.status === 400) code = ERROR_CODES.UNKNOWN;
          if (response.status === 401) code = ERROR_CODES.UNAUTHORIZED;
          if (response.status === 403) code = ERROR_CODES.UNAUTHORIZED;
          if (response.status === 404) code = ERROR_CODES.NOT_FOUND;
          if (response.status === 429) code = ERROR_CODES.RATE_LIMITED;

          let details = null;
          try {
            details = await response.json();
          } catch (e) {
            // ignore JSON parse error for error body
          }

          throw new MediaError({
            message: `Pexels API error: ${response.statusText}`,
            code,
            status: response.status,
            details,
          });
        }

        const data = await response.json();
        return data;
      } catch (error) {
        if (error.name === 'AbortError') {
          throw new MediaError({
            message: 'Request was cancelled',
            code: ERROR_CODES.ABORTED,
          });
        }
        if (error instanceof MediaError) {
          throw error;
        }
        throw new MediaError({
          message: error.message || 'Network error',
          code: ERROR_CODES.NETWORK_ERROR,
        });
      } finally {
        pendingRequests.delete(cacheKey);
      }
    })();

    pendingRequests.set(cacheKey, promise);
    return promise;
  }

  async function executeRequest(endpoint, params = {}, type = 'photo', abortSignal = null) {
    if (!apiKey) {
      throw new MediaError({
        message: 'API key is not configured',
        code: ERROR_CODES.UNAUTHORIZED,
      });
    }

    const searchParams = new URLSearchParams();
    Object.entries(params).forEach(([key, value]) => {
      if (value !== undefined && value !== null) {
        searchParams.append(key, value);
      }
    });

    const queryString = searchParams.toString();
    const url = `${API_BASE_URL}${endpoint}${queryString ? `?${queryString}` : ''}`;
    
    // Create a stable cache key
    const cacheKey = `${type}:${endpoint}:${queryString}`;

    if (cache.has(cacheKey)) {
      return cache.get(cacheKey);
    }

    const rawData = await fetchWithRetry(url, { signal: abortSignal }, cacheKey);
    
    let result;
    if (endpoint === ENDPOINTS.PHOTO_SEARCH || endpoint === ENDPOINTS.VIDEO_SEARCH) {
      result = normalizeSearchResponse(rawData, type);
    } else if (endpoint === ENDPOINTS.PHOTO_CURATED || endpoint === ENDPOINTS.VIDEO_POPULAR) {
      result = normalizeSearchResponse(rawData, type);
    } else if (type === 'video') {
      result = normalizeVideo(rawData);
    } else {
      result = normalizePhoto(rawData);
    }

    cache.set(cacheKey, result);
    return result;
  }

  return {
    events,
    cache,
    
    async search({ query, page = 1, perPage = 15, type = 'photo', signal }) {
      if (!query) return { items: [], page, perPage, totalResults: 0, nextPage: null };
      
      const endpoint = type === 'video' ? ENDPOINTS.VIDEO_SEARCH : ENDPOINTS.PHOTO_SEARCH;
      return executeRequest(endpoint, { query, page, per_page: perPage }, type, signal);
    },

    async curated({ page = 1, perPage = 15, type = 'photo', signal }) {
      const endpoint = type === 'video' ? ENDPOINTS.VIDEO_POPULAR : ENDPOINTS.PHOTO_CURATED;
      return executeRequest(endpoint, { page, per_page: perPage }, type, signal);
    },

    async getById(id, type = 'photo', signal) {
      const endpoint = type === 'video' ? ENDPOINTS.VIDEO_GET(id) : ENDPOINTS.PHOTO_GET(id);
      return executeRequest(endpoint, {}, type, signal);
    },

    // Emits a view event
    view(mediaItem) {
      if (!mediaItem || !mediaItem.id) return;
      events.emit({
        type: 'view',
        mediaId: mediaItem.id,
        mediaType: mediaItem.type || 'photo',
        timestamp: Date.now(),
      });
    },

    // Emits a download event
    download(mediaItem) {
      if (!mediaItem || !mediaItem.id) return;
      events.emit({
        type: 'download',
        mediaId: mediaItem.id,
        mediaType: mediaItem.type || 'photo',
        timestamp: Date.now(),
      });
    }
  };
}
