/**
 * "Now playing" row — gradient disc (spins while playing) + track metadata.
 */
export default function NowPlaying({ track, isPlaying, trackNumber, total }) {
  return (
    <div className="flex items-center gap-4">
      {/* Album art disc */}
      <div className="relative w-16 h-16 sm:w-20 sm:h-20 flex-shrink-0">
        <div
          className={`absolute inset-0 rounded-full ${isPlaying ? 'animate-spin-slow' : ''}`}
          style={{ background: `linear-gradient(135deg, ${track.gradient[0]}, ${track.gradient[1]})` }}
        />
        <div className="absolute inset-[32%] rounded-full bg-surface-0 border-2 border-surface-2" />
        {/* Spindle dot */}
        <div className="absolute inset-[46%] rounded-full bg-surface-3" />
      </div>

      {/* Metadata */}
      <div className="min-w-0 flex-1">
        <p className="text-[10px] text-text-muted font-mono mb-0.5">
          Track {trackNumber} of {total}
        </p>
        <h2 className="text-base sm:text-lg font-semibold text-text-primary truncate leading-tight">
          {track.title}
        </h2>
        <p className="text-sm text-text-secondary truncate">{track.artist}</p>
      </div>
    </div>
  )
}
