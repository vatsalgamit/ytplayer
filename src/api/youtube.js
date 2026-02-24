import axios from 'axios';

const API_KEY = import.meta.env.VITE_YOUTUBE_API_KEY;
const BASE_URL = 'https://www.googleapis.com/youtube/v3';

export const searchVideos = async (query, pageToken = '') => {
  const response = await axios.get(`${BASE_URL}/search`, {
    params: {
      part: 'snippet',
      q: query,
      type: 'video',
      maxResults: 20,
      key: API_KEY,
      pageToken,
    },
  });
  return response.data;
};

export const getVideoDetails = async (videoIds) => {
  const response = await axios.get(`${BASE_URL}/videos`, {
    params: {
      part: 'snippet,statistics,contentDetails',
      id: videoIds.join(','),
      key: API_KEY,
    },
  });
  return response.data;
};

export const formatViewCount = (count) => {
  if (!count) return '0 views';
  const num = parseInt(count);
  if (num >= 1_000_000) return `${(num / 1_000_000).toFixed(1)}M views`;
  if (num >= 1_000) return `${(num / 1_000).toFixed(1)}K views`;
  return `${num} views`;
};

export const formatDuration = (iso) => {
  if (!iso) return '';
  const match = iso.match(/PT(?:(\d+)H)?(?:(\d+)M)?(?:(\d+)S)?/);
  if (!match) return '';
  const h = parseInt(match[1] || 0);
  const m = parseInt(match[2] || 0);
  const s = parseInt(match[3] || 0);
  if (h > 0) return `${h}:${String(m).padStart(2, '0')}:${String(s).padStart(2, '0')}`;
  return `${m}:${String(s).padStart(2, '0')}`;
};
