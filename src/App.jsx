import { useState, useEffect, useCallback, useRef } from 'react'
import { usePlaylist }      from './hooks/usePlaylist'
import { useAudioPlayer }   from './hooks/useAudioPlayer'
import { useAudioAnalyser } from './hooks/useAudioAnalyser'

import Visualizer      from './components/Visualizer'
import NowPlaying      from './components/NowPlaying'
import ProgressBar     from './components/ProgressBar'
import PlayerControls  from './components/PlayerControls'
import VolumeControl   from './components/VolumeControl'
import Playlist        from './components/Playlist'
import { WaveformIcon } from './components/icons'

export default function App() {
  const playlist = usePlaylist()
  const [volume, setVolume] = useState(0.7)
  const [muted, setMuted]   = useState(false)

  const audio = useAudioPlayer({
    src:     playlist.currentTrack.src,
    volume,
    muted,
    loop:    playlist.repeat === 'one',
    onEnded: playlist.next,
  })

  const { ensureContext, getFrequencyData } = useAudioAnalyser(audio.audioEl)

  const hasInteractedRef = useRef(false)
  const isFirstRender    = useRef(true)

  useEffect(() => {
    if (isFirstRender.current) { isFirstRender.current = false; return }
    if (hasInteractedRef.current) audio.play()
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [playlist.trackIndex])

  const togglePlay = useCallback(() => {
    ensureContext()
    hasInteractedRef.current = true
    audio.isPlaying ? audio.pause() : audio.play()
  }, [audio, ensureContext])

  const handleSelect = useCallback((index) => {
    ensureContext()
    hasInteractedRef.current = true
    playlist.select(index)
  }, [playlist, ensureContext])

  const handleNext = useCallback(() => {
    ensureContext()
    hasInteractedRef.current = true
    playlist.next()
  }, [playlist, ensureContext])

  const handlePrev = useCallback(() => {
    ensureContext()
    hasInteractedRef.current = true
    playlist.prev()
  }, [playlist, ensureContext])

  useEffect(() => {
    function onKeyDown(e) {
      if (['INPUT', 'TEXTAREA'].includes(e.target.tagName)) return
      switch (e.code) {
        case 'Space':      e.preventDefault(); togglePlay(); break
        case 'ArrowRight': audio.seek(audio.currentTime + 5); break
        case 'ArrowLeft':  audio.seek(audio.currentTime - 5); break
        case 'ArrowUp':    e.preventDefault(); setVolume((v) => Math.min(1, +(v + 0.05).toFixed(2))); break
        case 'ArrowDown':  e.preventDefault(); setVolume((v) => Math.max(0, +(v - 0.05).toFixed(2))); break
        default: break
      }
    }
    window.addEventListener('keydown', onKeyDown)
    return () => window.removeEventListener('keydown', onKeyDown)
  }, [audio, togglePlay])

  const { currentTrack, trackIndex, tracks } = playlist

  return (
    <div className="h-screen overflow-hidden bg-surface-0 text-text-primary flex flex-col">
      <header className="flex items-center justify-between px-5 sm:px-8 py-4 border-b border-border flex-shrink-0">
        <div className="flex items-center gap-2.5">
          <div
            className="w-8 h-8 rounded-lg flex items-center justify-center transition-colors duration-500"
            style={{ background: `linear-gradient(135deg, ${currentTrack.gradient[0]}, ${currentTrack.gradient[1]})` }}
          >
            <WaveformIcon className="text-white" />
          </div>
          <div>
            <h1 className="text-sm font-semibold leading-none">Wavelength</h1>
            <p className="text-[10px] text-text-muted mt-0.5">Web Audio Player</p>
          </div>
        </div>
        <span className="text-[10px] text-text-muted font-mono hidden md:block">
          space play/pause · ←/→ seek · ↑/↓ volume
        </span>
      </header>

      <main className="flex-1 flex flex-col lg:flex-row overflow-hidden">
        <section className="flex-1 flex flex-col p-4 sm:p-6 lg:p-8 gap-5 overflow-y-auto">
          <div className="flex-1 rounded-2xl border border-border bg-surface-1 overflow-hidden relative min-h-[140px]">
            <Visualizer
              getFrequencyData={getFrequencyData}
              isPlaying={audio.isPlaying}
              gradient={currentTrack.gradient}
            />
            {!hasInteractedRef.current && (
              <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
                <p className="text-text-muted text-sm">Press play to start</p>
              </div>
            )}
          </div>

          <NowPlaying
            track={currentTrack}
            isPlaying={audio.isPlaying}
            trackNumber={trackIndex + 1}
            total={tracks.length}
          />

          <ProgressBar
            currentTime={audio.currentTime}
            duration={audio.duration}
            onSeek={audio.seek}
            gradient={currentTrack.gradient}
          />

          <div className="flex items-center justify-between gap-4">
            <PlayerControls
              isPlaying={audio.isPlaying}
              isLoading={audio.isLoading}
              onTogglePlay={togglePlay}
              onNext={handleNext}
              onPrev={handlePrev}
              shuffle={playlist.shuffle}
              onToggleShuffle={playlist.toggleShuffle}
              repeat={playlist.repeat}
              onCycleRepeat={playlist.cycleRepeat}
              gradient={currentTrack.gradient}
            />
            <VolumeControl
              volume={volume}
              muted={muted}
              onVolumeChange={setVolume}
              onToggleMute={() => setMuted((m) => !m)}
            />
          </div>
        </section>

        <aside className="w-full lg:w-80 flex-shrink-0 border-t lg:border-t-0 lg:border-l border-border bg-surface-1/40 p-4 sm:p-5 overflow-y-auto">
          <p className="text-xs font-semibold text-text-muted uppercase tracking-widest mb-3 px-1">
            Playlist · {tracks.length} tracks
          </p>
          <Playlist
            tracks={tracks}
            currentIndex={trackIndex}
            isPlaying={audio.isPlaying}
            onSelect={handleSelect}
          />
        </aside>
      </main>
    </div>
  )
}
