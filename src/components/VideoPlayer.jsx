import { useState, useRef, useEffect } from 'react';
import {
    FiPlay, FiPause, FiSquare, FiVolume2, FiVolumeX,
    FiMaximize2, FiMinimize2, FiX,
} from 'react-icons/fi';
import { MdOutlinePictureInPicture, MdFullscreen } from 'react-icons/md';

/* ─── helpers ──────────────────────────────────────────────── */
const fmt = (s) => {
    if (!s || isNaN(s)) return '0:00';
    const h = Math.floor(s / 3600);
    const m = Math.floor((s % 3600) / 60);
    const sec = Math.floor(s % 60);
    if (h > 0) return `${h}:${String(m).padStart(2, '0')}:${String(sec).padStart(2, '0')}`;
    return `${m}:${String(sec).padStart(2, '0')}`;
};

export default function VideoPlayer({ video, onClose, minimized, onToggleMinimize }) {
    const playerRef = useRef(null);
    const tickRef = useRef(null);
    const seekRef = useRef(null);  // is user dragging?

    const [playing, setPlaying] = useState(false);
    const [muted, setMuted] = useState(false);
    const [volume, setVolume] = useState(80);
    const [current, setCurrent] = useState(0);
    const [duration, setDuration] = useState(0);
    const [pipActive, setPipActive] = useState(false);
    const [playerReady, setPlayerReady] = useState(false);

    const videoId = video?.id;
    const title = video?.snippet?.title;

    /* load YT IFrame API script once */
    useEffect(() => {
        if (!window.YT) {
            const tag = document.createElement('script');
            tag.src = 'https://www.youtube.com/iframe_api';
            document.head.appendChild(tag);
        }
    }, []);

    /* init player whenever videoId changes */
    useEffect(() => {
        if (!videoId) return;
        setPlaying(false);
        setPlayerReady(false);
        setCurrent(0);
        setDuration(0);
        clearInterval(tickRef.current);

        const init = () => {
            if (playerRef.current) {
                try { playerRef.current.destroy(); } catch (_) { }
            }
            playerRef.current = new window.YT.Player('yt-player', {
                videoId,
                playerVars: { autoplay: 1, controls: 0, modestbranding: 1, rel: 0, fs: 0 },
                events: {
                    onReady(e) {
                        setPlayerReady(true);
                        e.target.setVolume(volume);
                        e.target.playVideo();
                        setDuration(e.target.getDuration());
                    },
                    onStateChange(e) {
                        const isPlaying = e.data === window.YT.PlayerState.PLAYING;
                        setPlaying(isPlaying);

                        // update duration once buffered
                        const dur = e.target.getDuration();
                        if (dur > 0) setDuration(dur);

                        // start / stop polling
                        clearInterval(tickRef.current);
                        if (isPlaying) {
                            tickRef.current = setInterval(() => {
                                if (!seekRef.current && playerRef.current?.getCurrentTime) {
                                    setCurrent(playerRef.current.getCurrentTime());
                                }
                            }, 500);
                        }
                    },
                },
            });
        };

        if (window.YT?.Player) {
            init();
        } else {
            window.onYouTubeIframeAPIReady = init;
        }

        return () => {
            clearInterval(tickRef.current);
            try { playerRef.current?.destroy(); } catch (_) { }
            playerRef.current = null;
            setPlayerReady(false);
        };
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [videoId]);

    /* ── controls ── */
    const play = () => { playerRef.current?.playVideo(); setPlaying(true); };
    const pause = () => { playerRef.current?.pauseVideo(); setPlaying(false); };
    const stop = () => { playerRef.current?.stopVideo(); setPlaying(false); setCurrent(0); };

    const toggleMute = () => {
        if (!playerRef.current) return;
        if (muted) { playerRef.current.unMute(); playerRef.current.setVolume(volume); }
        else { playerRef.current.mute(); }
        setMuted(!muted);
    };

    const handleVolume = (e) => {
        const v = Number(e.target.value);
        setVolume(v);
        if (playerRef.current) {
            playerRef.current.setVolume(v);
            if (v === 0) { playerRef.current.mute(); setMuted(true); }
            else { playerRef.current.unMute(); setMuted(false); }
        }
    };

    /* ── timeline (seek) ── */
    const handleSeekStart = () => { seekRef.current = true; };

    const handleSeekChange = (e) => {
        setCurrent(Number(e.target.value));
    };

    const handleSeekEnd = (e) => {
        seekRef.current = false;
        const t = Number(e.target.value);
        playerRef.current?.seekTo(t, true);
        setCurrent(t);
    };

    /* ── Picture-in-Picture ── */
    const handlePiP = async () => {
        try {
            let videoEl = null;
            // try accessing the video inside the iframe
            const iframe = document.getElementById('yt-player')?.querySelector('iframe')
                || document.getElementById('yt-player');
            if (iframe) {
                try {
                    const doc = iframe.contentDocument || iframe.contentWindow?.document;
                    videoEl = doc?.querySelector('video');
                } catch (_) { }
            }
            if (!videoEl) {
                // fallback: search all iframes
                for (const f of document.querySelectorAll('iframe')) {
                    try {
                        const doc = f.contentDocument || f.contentWindow?.document;
                        const v = doc?.querySelector('video');
                        if (v) { videoEl = v; break; }
                    } catch (_) { }
                }
            }
            if (videoEl) {
                if (!pipActive) {
                    await videoEl.requestPictureInPicture();
                    setPipActive(true);
                    videoEl.addEventListener('leavepictureinpicture', () => setPipActive(false), { once: true });
                } else {
                    if (document.pictureInPictureElement) await document.exitPictureInPicture();
                    setPipActive(false);
                }
            } else {
                alert('PiP not available — try Chrome and ensure the video has started playing.');
            }
        } catch (err) {
            console.warn('PiP error:', err);
            alert('Picture-in-Picture failed: ' + err.message);
        }
    };

    /* ── fullscreen ── */
    const handleFullscreen = () => {
        const wrapper = document.querySelector('.iframe-wrapper');
        if (!wrapper) return;
        if (document.fullscreenElement) {
            document.exitFullscreen();
        } else {
            wrapper.requestFullscreen?.();
        }
    };

    const progress = duration > 0 ? (current / duration) * 100 : 0;

    if (!video) return null;

    return (
        <div className={`video-player-container ${minimized ? 'minimized' : ''}`}>

            {/* ── Header ── */}
            <div className="player-header">
                <span className="player-title" title={title}>{title}</span>
                <div className="player-header-actions">
                    <button className="icon-btn" onClick={onToggleMinimize}
                        title={minimized ? 'Maximize' : 'Minimize'}>
                        {minimized ? <FiMaximize2 /> : <FiMinimize2 />}
                    </button>
                    <button className="icon-btn close-btn" onClick={onClose} title="Close">
                        <FiX />
                    </button>
                </div>
            </div>

            {/* ── IFrame ── */}
            <div className="iframe-wrapper">
                <div id="yt-player" />
            </div>

            {/* ── Timeline + Controls ── */}
            {!minimized && (
                <div className="player-controls">

                    {/* Seek bar row */}
                    <div className="seek-row">
                        <span className="time-label">{fmt(current)}</span>
                        <div className="seek-track">
                            <div className="seek-fill" style={{ width: `${progress}%` }} />
                            <input
                                type="range"
                                className="seek-slider"
                                min={0}
                                max={duration || 100}
                                step={0.5}
                                value={current}
                                onMouseDown={handleSeekStart}
                                onTouchStart={handleSeekStart}
                                onChange={handleSeekChange}
                                onMouseUp={handleSeekEnd}
                                onTouchEnd={handleSeekEnd}
                                title="Seek"
                            />
                        </div>
                        <span className="time-label">{fmt(duration)}</span>
                    </div>

                    {/* Buttons row */}
                    <div className="buttons-row">
                        <div className="controls-left">
                            {playing
                                ? <button className="ctrl-btn" onClick={pause} title="Pause"><FiPause /></button>
                                : <button className="ctrl-btn" onClick={play} title="Play"><FiPlay /></button>
                            }
                            <button className="ctrl-btn stop-btn" onClick={stop} title="Stop"><FiSquare /></button>
                        </div>

                        <div className="controls-volume">
                            <button className="ctrl-btn" onClick={toggleMute} title={muted ? 'Unmute' : 'Mute'}>
                                {muted ? <FiVolumeX /> : <FiVolume2 />}
                            </button>
                            <input
                                type="range"
                                min={0} max={100} step={1}
                                value={muted ? 0 : volume}
                                onChange={handleVolume}
                                className="volume-slider"
                                title="Volume"
                            />
                        </div>

                        <div className="controls-right">
                            <button className={`ctrl-btn pip-btn ${pipActive ? 'active' : ''}`}
                                onClick={handlePiP} title="Picture in Picture">
                                <MdOutlinePictureInPicture />
                            </button>
                            <button className="ctrl-btn" onClick={handleFullscreen} title="Fullscreen">
                                <MdFullscreen />
                            </button>
                        </div>
                    </div>

                </div>
            )}
        </div>
    );
}
