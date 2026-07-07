# 🎵 Wavelength — Music Player

A music player with a live Web Audio API spectrum visualizer, full playlist controls (shuffle, repeat, seek), and keyboard shortcuts — built with React + Vite.

**[Live Demo →](https://your-vercel-url.vercel.app)** · **[Portfolio →](https://isaramdev.com)**

---

## Features

- **Live spectrum visualizer** — canvas-based, driven by `AnalyserNode.getByteFrequencyData()`
- **Full transport controls** — play/pause, next/prev, shuffle, repeat (off/all/one)
- **Seekable progress bar** — click or drag anywhere on the track
- **Volume control** — slider + mute toggle with dynamic icon
- **Keyboard shortcuts** — `Space` play/pause, `←/→` seek ±5s, `↑/↓` volume ±5%
- **Per-track visual identity** — each track has a gradient that drives the visualizer, album art disc, and progress bar
- **Spinning album art** — animates while playing, like a vinyl record
- **Playlist sidebar** — click any track to play; active track shows an animated equalizer
- **Graceful idle state** — ambient wave animation when paused or before first interaction

---

## Getting Started

```bash
npm install
npm run dev   # http://localhost:5173
```

Uses [SoundHelix](https://www.soundhelix.com)'s public royalty-free demo tracks by default. To use your own music, drop files in `public/audio/` and update `src/lib/tracks.js`.

---

## Tech Stack

| | Choice | Why |
|---|---|---|
| Build | Vite | Fast HMR |
| UI | React 18 | Hooks-based architecture |
| Audio | Web Audio API | `AnalyserNode` for real-time frequency analysis |
| Visualization | Canvas 2D | 60fps bars via `requestAnimationFrame` |
| State | `useReducer` | Playlist order, shuffle, repeat |
| Styling | Tailwind CSS | Utility-first |

---

## Architecture Decisions

### One persistent `<audio>` element
`useAudioPlayer` creates a single `HTMLAudioElement` via a lazy ref on first render and never recreates it — only its `.src` changes between tracks. This matters because `AudioContext.createMediaElementSource()` can be called **at most once** per element; reusing the same element keeps the Web Audio graph valid across the entire playlist.

### The analyser graph
```
<audio> ──▶ MediaElementSource ──▶ AnalyserNode ──▶ AudioContext.destination
```
`useAudioAnalyser` builds this graph lazily, the first time `ensureContext()` is called (from the play button). This also handles the browser's autoplay policy: `AudioContext` starts `suspended` until a user gesture, so `ensureContext()` resumes it on every call.

### CORS and the visualizer — a real-world gotcha
The demo tracks are served cross-origin from SoundHelix without CORS headers. Audio **playback** through a Web Audio graph works fine regardless of CORS — but `AnalyserNode.getByteFrequencyData()` on a cross-origin "tainted" source returns an **all-zero array** (a browser security measure to prevent reading remote audio data, similar to the canvas `tainted` flag for cross-origin images).

`Visualizer.jsx` detects this (`rawData.some(v => v > 2)`) and falls back to a gentle ambient sine-wave animation when no real signal is available — so the UI never shows a flat, dead row of bars. **To get the live spectrum working with real data**, self-host audio files (same-origin) or serve them from a host that sends `Access-Control-Allow-Origin`.

### Shuffle as a separate `playOrder` array
Rather than shuffling the track list itself (which would reorder the visible playlist), `usePlaylist` keeps a `playOrder` array of indices into `TRACKS`. Shuffling permutes `playOrder`; `position` is an index into `playOrder`. The sidebar always renders `TRACKS` in original order — only playback order changes.

### Native `loop` for "repeat one"
Instead of manually detecting end-of-track and re-seeking for repeat-one, `useAudioPlayer` sets the native `audio.loop = true`. The browser handles looping internally and the `'ended'` event never fires — so `onEnded` (which advances the playlist) is naturally skipped without any extra branching.

### Autoplay-on-skip
Browsers block `audio.play()` calls that aren't triggered by a user gesture. `hasInteractedRef` tracks whether the user has pressed play at least once; only then does skipping to the next/previous track auto-continue playback. Before that first interaction, skipping just changes the selection — pressing play starts it.

---

## Project Structure

```
src/
├── components/
│   ├── Visualizer.jsx     # Canvas spectrum analyzer + idle fallback
│   ├── NowPlaying.jsx     # Album art disc + track info
│   ├── ProgressBar.jsx    # Seekable progress
│   ├── PlayerControls.jsx # Transport buttons
│   ├── VolumeControl.jsx  # Volume slider + mute
│   ├── Playlist.jsx       # Track list sidebar
│   └── icons.jsx          # Shared SVG icons
├── hooks/
│   ├── useAudioPlayer.js    # <audio> element lifecycle
│   ├── useAudioAnalyser.js  # Web Audio analyser graph
│   └── usePlaylist.js       # Playlist order, shuffle, repeat (useReducer)
├── lib/
│   ├── tracks.js          # Playlist data + gradients
│   └── format.js          # Time formatting
└── App.jsx                 # Layout, wiring, keyboard shortcuts
```

---

## Potential Next Steps

- [ ] Circular/waveform visualizer mode toggle
- [ ] Drag-to-reorder playlist
- [ ] Persist volume/shuffle/repeat to `localStorage`
- [ ] Lyrics panel synced to playback time
- [ ] Crossfade between tracks

---

## License

MIT
