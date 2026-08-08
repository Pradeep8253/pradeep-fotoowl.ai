export function normalizePhoto(photo) {
  return {
    id: photo.id,
    type: 'photo',
    width: photo.width,
    height: photo.height,
    url: photo.url,
    photographer: photo.photographer,
    photographerUrl: photo.photographer_url,
    alt: photo.alt || '',
    src: {
      original: photo.src.original,
      large: photo.src.large,
      large2x: photo.src.large2x,
      medium: photo.src.medium,
      small: photo.src.small,
      portrait: photo.src.portrait,
      landscape: photo.src.landscape,
      tiny: photo.src.tiny,
    },
    // Useful for common components requiring a single poster image
    thumbnail: photo.src.medium,
  };
}

export function normalizeVideo(video) {
  // Sort files by quality: hd -> sd
  const files = [...(video.video_files || [])].sort((a, b) => {
    if (a.quality === 'hd' && b.quality !== 'hd') return -1;
    if (b.quality === 'hd' && a.quality !== 'hd') return 1;
    return b.width - a.width; // fallback to largest resolution
  });

  return {
    id: video.id,
    type: 'video',
    width: video.width,
    height: video.height,
    duration: video.duration,
    url: video.url,
    photographer: video.user?.name || 'Unknown',
    photographerUrl: video.user?.url || '',
    alt: '',
    videoFiles: files.map(file => ({
      id: file.id,
      quality: file.quality,
      fileType: file.file_type,
      width: file.width,
      height: file.height,
      link: file.link,
    })),
    // Best available video source
    src: files.length > 0 ? files[0].link : '',
    thumbnail: video.image,
  };
}

export function normalizeSearchResponse(response, type) {
  const items = type === 'video' 
    ? (response.videos || []).map(normalizeVideo)
    : (response.photos || []).map(normalizePhoto);

  return {
    page: response.page,
    perPage: response.per_page,
    totalResults: response.total_results,
    nextPage: response.next_page || null,
    items,
  };
}
