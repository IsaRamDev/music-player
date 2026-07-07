import { useRef } from 'react'
import { formatTime } from '../lib/format'

/**
 * Seekable progress bar. Clicking/dragging anywhere on the track computes
 * the ratio from the click position and seeks the audio element directly.
 */
export default function ProgressBar({ currentTime, duration, onSeek, gradient }) {
  const trackRef = useRef(null)
  const pct = duration ? (currentTime / duration) * 100 : 0

  const seekFromEvent = (e) => {
    const rect = trackRef.current.getBoundingClientRect()
    const ratio = Math.min(Math.max((e.clientX - rect.left) / rect.width, 0), 1)
    onSeek(ratio * duration)
  }

  const handlePointerDown = (e) => {
    seekFromEvent(e)
    const onMove = (ev) => seekFromEvent(ev)
    const onUp   = () => {
      window.removeEventListener('pointermove', onMove)
      window.removeEventListener('pointerup', onUp)
    }
    window.addEventListener('pointermove', onMove)
    window.addEventListener('pointerup', onUp)
  }

  return (
    <div className="flex items-center gap-3 w-full">
      <span className="text-[11px] font-mono text-text-secondary w-9 text-right tabular-nums">
        {formatTime(currentTime)}
      </span>

      <div
        ref={trackRef}
        onPointerDown={handlePointerDown}
        className="flex-1 h-1.5 bg-surface-3 rounded-full cursor-pointer group relative"
        role="slider"
        tabIndex={0}
        aria-label="Seek"
        aria-valuemin={0}
        aria-valuemax={Math.floor(duration) || 0}
        aria-valuenow={Math.floor(currentTime)}
      >
        <div
          className="h-full rounded-full"
          style={{
            width: `${pct}%`,
            background: `linear-gradient(90deg, ${gradient[0]}, ${gradient[1]})`,
          }}
        />
        <div
          className="absolute top-1/2 -translate-y-1/2 w-3 h-3 rounded-full bg-white shadow opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none"
          style={{ left: `calc(${pct}% - 6px)` }}
        />
      </div>

      <span className="text-[11px] font-mono text-text-secondary w-9 tabular-nums">
        {formatTime(duration)}
      </span>
    </div>
  )
}
