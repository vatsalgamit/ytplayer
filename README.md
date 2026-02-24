<div align="center">

# 🎬 YTPlayer

### A sleek YouTube search & player built with vibe coding ✨

![React](https://img.shields.io/badge/React-19-61DAFB?style=for-the-badge&logo=react&logoColor=black)
![Vite](https://img.shields.io/badge/Vite-7-646CFF?style=for-the-badge&logo=vite&logoColor=white)
![YouTube API](https://img.shields.io/badge/YouTube%20Data%20API-v3-FF0000?style=for-the-badge&logo=youtube&logoColor=white)
![License](https://img.shields.io/badge/License-MIT-green?style=for-the-badge)

<br/>

> *Built with 🎧 vibe coding — where the music never stops and the code just flows.*

</div>

---

## ✨ Features

| Feature | Description |
|---|---|
| 🔍 **Search** | Search millions of YouTube videos instantly via YouTube Data API v3 |
| 🎬 **Theater Player** | Full-width cinematic player that opens above the results grid |
| ⏯ **Full Controls** | Play, Pause, Stop, draggable seek bar with time labels |
| 🔊 **Volume** | Volume slider + mute toggle |
| 🗃 **Mini Player** | Minimize to a floating pip-style player in the bottom-right corner |
| 🖥 **Picture-in-Picture** | Pop the video out into the browser's native PiP window |
| 🔒 **HTTPS** | Runs over HTTPS locally via self-signed cert (PiP-compatible) |
| 📱 **Responsive** | Adapts seamlessly to mobile screens |

---

## 🚀 Getting Started

### Prerequisites

- Node.js 18+
- A [YouTube Data API v3](https://console.cloud.google.com/apis/library/youtube.googleapis.com) key

### Installation

```bash
# Clone the repo
git clone https://github.com/vatsalgamit/ytplayer.git
cd ytplayer

# Install dependencies
npm install
```

### Configuration

Create a `.env` file in the root directory:

```env
VITE_YOUTUBE_API_KEY=your_youtube_api_key_here
```

> ⚠️ **Never commit your `.env` file.** It's already in `.gitignore`.

### Run Locally

```bash
npm run dev -- --host
```

Open **https://localhost:5173** in your browser.

> Since it uses a self-signed certificate, click **"Advanced → Proceed anyway"** on the browser warning.

### Build for Production

```bash
npm run build
```

---

## 🗂 Project Structure

```
ytplayer/
├── public/
├── src/
│   ├── api/
│   │   └── youtube.js          # YouTube Data API v3 helper functions
│   ├── components/
│   │   ├── SearchBar.jsx       # Search input + button
│   │   ├── VideoCard.jsx       # Thumbnail card with title, channel, views
│   │   ├── VideoList.jsx       # Responsive grid with skeleton loading
│   │   └── VideoPlayer.jsx     # Iframe player + seek bar + controls + PiP
│   ├── App.jsx                 # Root layout & state management
│   ├── App.css                 # Component styles (dark premium theme)
│   └── index.css               # Global CSS variables & reset
├── .env                        # API key (gitignored)
├── vite.config.js              # Vite + HTTPS config
└── README.md
```

---

## 🎛 Player Controls

Once a video is playing, you get full control:

- **▶ / ⏸** — Play / Pause
- **⏹** — Stop and reset to beginning
- **🎚 Seek bar** — Click or drag to jump to any point in the video
- **🔊 Volume** — Slider to adjust + mute button
- **↙ Minimize** — Shrinks to a floating mini player at the bottom-right
- **↗ Maximize** — Brings the player back to full theater mode
- **📺 PiP** — Opens the video in browser Picture-in-Picture
- **⛶ Fullscreen** — Expands the video frame to full screen

---

## 🛠 Tech Stack

- **[React 19](https://react.dev/)** — UI framework
- **[Vite 7](https://vite.dev/)** — Lightning-fast build tool
- **[Axios](https://axios-http.com/)** — HTTP requests
- **[react-icons](https://react-icons.github.io/react-icons/)** — Icon library
- **[YouTube IFrame Player API](https://developers.google.com/youtube/iframe_api_reference)** — Programmatic video control
- **[@vitejs/plugin-basic-ssl](https://github.com/vitejs/vite-plugin-basic-ssl)** — Local HTTPS

---

## ⚡ Vibe Coding

> This project was built with **vibe coding** — a flow-state-first approach to development where creativity, speed, and instinct drive the process. No overengineering. Just good vibes and clean code. 🎧

---

## 📄 License

MIT © [Vatsal Gamit](https://github.com/vatsalgamit)
