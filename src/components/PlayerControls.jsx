import {
  PlayIcon, PauseIcon, NextIcon, PrevIcon,
  ShuffleIcon, RepeatIcon, RepeatOneIcon, Spinner,
} from './icons'

/**
 * Transport controls: shuffle, prev, play/pause, next, repeat.
 * Shuffle and repeat buttons show an active state when toggled on.
 */
export default function PlayerControls({
  isPlaying, isLoading, onTogglePlay, onNext, onPrev,
  shuffle, onToggleShuffle, repeat, onCycleRepeat, gradient,
}) {
  return (
    <div className="flex items-center gap-1.5 sm:gap-3">
      <IconButton active={shuffle} onClick={onToggleShuffle} title="Shuffle">
        <ShuffleIcon />
      </IconButton>

      <IconButton onClick={onPrev} title="Previous track">
        <PrevIcon />
      </IconButton>

      <button
        onClick={onTogglePlay}
        aria-label={isPlaying ? 'Pause' : 'Play'}
        className="w-11 h-11 sm:w-12 sm:h-12 rounded-full flex items-center justify-center text-white shadow-lg transition-transform active:scale-90 flex-shrink-0"
        style={{ background: `linear-gradient(135deg, ${gradient[0]}, ${gradient[1]})` }}
      >
        {isLoading ? <Spinner /> : isPlaying ? <PauseIcon /> : <PlayIcon />}
      </button>

      <IconButton onClick={onNext} title="Next track">
        <NextIcon />
      </IconButton>

      <IconButton
        active={repeat !== 'off'}
        onClick={onCycleRepeat}
        title={`Repeat: ${repeat}`}
      >
        {repeat === 'one' ? <RepeatOneIcon /> : <RepeatIcon />}
      </IconButton>
    </div>
  )
}

function IconButton({ children, active, ...props }) {
  return (
    <button
      {...props}
      className={`w-9 h-9 rounded-full flex items-center justify-center transition-colors flex-shrink-0 ${
        active
          ? 'text-accent-light bg-white/10'
          : 'text-text-secondary hover:text-text-primary hover:bg-white/5'
      }`}
      style={active ? { color: '#a5b4fc' } : undefined}
    >
      {children}
    </button>
  )
}
