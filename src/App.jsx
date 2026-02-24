import { useState, useCallback } from 'react';
import SearchBar from './components/SearchBar';
import VideoList from './components/VideoList';
import VideoPlayer from './components/VideoPlayer';
import { searchVideos, getVideoDetails } from './api/youtube';
import { FiYoutube } from 'react-icons/fi';
import './App.css';

export default function App() {
  const [videos, setVideos] = useState([]);
  const [selectedVideo, setSelectedVideo] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [playerMinimized, setPlayerMinimized] = useState(false);

  const handleSearch = useCallback(async (query) => {
    setLoading(true);
    setError('');
    try {
      const data = await searchVideos(query);
      const ids = data.items.map((item) => item.id.videoId).filter(Boolean);
      if (ids.length === 0) { setVideos([]); return; }
      const details = await getVideoDetails(ids);
      setVideos(details.items);
    } catch (err) {
      console.error(err);
      setError(
        err?.response?.data?.error?.message ||
        'Failed to fetch videos. Please check your API key.'
      );
      setVideos([]);
    } finally {
      setLoading(false);
    }
  }, []);

  const handleSelectVideo = (video) => {
    setSelectedVideo(video);
    setPlayerMinimized(false);
    // Scroll to top so player is visible
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleClosePlayer = () => {
    setSelectedVideo(null);
    setPlayerMinimized(false);
  };

  return (
    <div className="app">
      {/* ── Header ── */}
      <header className="app-header">
        <div className="logo">
          <FiYoutube className="logo-icon" />
          <span>YTPlayer</span>
        </div>
        <SearchBar onSearch={handleSearch} loading={loading} />
      </header>

      {/* ── Theater Player (full-width top area) ── */}
      {selectedVideo && !playerMinimized && (
        <section className="theater-section">
          <VideoPlayer
            video={selectedVideo}
            onClose={handleClosePlayer}
            minimized={false}
            onToggleMinimize={() => setPlayerMinimized(true)}
          />
        </section>
      )}

      {/* ── Results Grid ── */}
      <main className="app-main">
        {error && <div className="error-banner">⚠️ {error}</div>}
        <VideoList
          videos={videos}
          onSelect={handleSelectVideo}
          selectedId={selectedVideo?.id}
          loading={loading}
        />
      </main>

      {/* ── Minimized floating player ── */}
      {selectedVideo && playerMinimized && (
        <VideoPlayer
          video={selectedVideo}
          onClose={handleClosePlayer}
          minimized={true}
          onToggleMinimize={() => setPlayerMinimized(false)}
        />
      )}
    </div>
  );
}
