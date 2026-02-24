import { formatViewCount, formatDuration } from '../api/youtube';
import { FiPlay } from 'react-icons/fi';

export default function VideoCard({ video, onSelect, isActive }) {
    const { snippet, statistics, contentDetails } = video;
    const thumb = snippet?.thumbnails?.medium?.url || snippet?.thumbnails?.default?.url;
    const duration = formatDuration(contentDetails?.duration);
    const views = formatViewCount(statistics?.viewCount);

    return (
        <div
            className={`video-card ${isActive ? 'active' : ''}`}
            onClick={() => onSelect(video)}
        >
            <div className="video-card-thumb">
                <img src={thumb} alt={snippet?.title} loading="lazy" />
                {duration && <span className="duration-badge">{duration}</span>}
                <div className="play-overlay">
                    <FiPlay />
                </div>
            </div>
            <div className="video-card-info">
                <h3 className="video-title" title={snippet?.title}>{snippet?.title}</h3>
                <p className="channel-name">{snippet?.channelTitle}</p>
                <p className="views">{views}</p>
            </div>
        </div>
    );
}
