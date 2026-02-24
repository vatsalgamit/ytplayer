import VideoCard from './VideoCard';

export default function VideoList({ videos, onSelect, selectedId, loading }) {
    if (loading) {
        return (
            <div className="video-grid">
                {Array.from({ length: 8 }).map((_, i) => (
                    <div key={i} className="video-card skeleton">
                        <div className="skeleton-thumb" />
                        <div className="video-card-info">
                            <div className="skeleton-line tall" />
                            <div className="skeleton-line" />
                            <div className="skeleton-line short" />
                        </div>
                    </div>
                ))}
            </div>
        );
    }

    if (!videos.length) {
        return (
            <div className="empty-state">
                <div className="empty-icon">🎬</div>
                <h2>Search for videos above</h2>
                <p>Millions of videos are waiting for you</p>
            </div>
        );
    }

    return (
        <div className="video-grid">
            {videos.map((video) => (
                <VideoCard
                    key={video.id}
                    video={video}
                    onSelect={onSelect}
                    isActive={video.id === selectedId}
                />
            ))}
        </div>
    );
}
