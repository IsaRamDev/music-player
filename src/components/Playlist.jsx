import { PlayingBars } from './icons'

/**
 * Track list. Clicking any track selects and plays it (handled by parent).
 * The active track shows an animated equalizer icon instead of its number.
 */
export default function Playlist({ tracks, currentIndex, isPlaying, onSelect }) {
  return (
    <div className="space-y-1">
      {tracks.map((track, i) => {
        const active = i === currentIndex
        return (
          <button
            key={track.id}
            onClick={() => onSelect(i)}
            className={`w-full flex items-center gap-3 px-3 py-2.5 rounded-xl text-left transition-colors ${
              active ? 'bg-surface-2' : 'hover:bg-surface-1'
            }`}
          >
            {/* Index / equalizer */}
            <div
              className="w-9 h-9 rounded-lg flex-shrink-0 flex items-center justify-center"
              style={{ background: `linear-gradient(135deg, ${track.gradient[0]}, ${track.gradient[1]})` }}
            >
              {active && isPlaying ? (
                <PlayingBars />
              ) : (
                <span className="text-white text-xs font-mono font-medium">
                  {String(i + 1).padStart(2, '0')}
                </span>
              )}
            </div>

            {/* Title / artist */}
            <div className="flex-1 min-w-0">
              <p className={`text-sm font-medium truncate ${active ? 'text-text-primary' : 'text-text-secondary'}`}>
                {track.title}
              </p>
              <p className="text-xs text-text-muted truncate">{track.artist}</p>
            </div>
          </button>
        )
      })}
    </div>
  )
}
