export const API_BASE_URL = 'https://api.pexels.com';

export const ENDPOINTS = {
  PHOTO_SEARCH: '/v1/search',
  PHOTO_CURATED: '/v1/curated',
  PHOTO_GET: (id) => `/v1/photos/${id}`,
  VIDEO_SEARCH: '/videos/search',
  VIDEO_POPULAR: '/videos/popular',
  VIDEO_GET: (id) => `/videos/videos/${id}`,
};
