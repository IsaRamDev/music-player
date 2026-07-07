import { VolumeHighIcon, VolumeLowIcon, MuteIcon } from './icons'

/**
 * Volume slider with a mute toggle. The icon changes based on the current
 * level (muted / low / high) — a small but expected affordance.
 */
export default function VolumeControl({ volume, muted, onVolumeChange, onToggleMute }) {
  const effective = muted ? 0 : volume
  const Icon = effective === 0 ? MuteIcon : effective < 0.5 ? VolumeLowIcon : VolumeHighIcon

  return (
    <div className="flex items-center gap-2">
      <button
        onClick={onToggleMute}
        aria-label={muted ? 'Unmute' : 'Mute'}
        className="text-text-secondary hover:text-text-primary transition-colors flex-shrink-0"
      >
        <Icon />
      </button>
      <input
        type="range"
        min="0"
        max="1"
        step="0.01"
        value={effective}
        onChange={(e) => onVolumeChange(parseFloat(e.target.value))}
        className="w-20 sm:w-24"
        aria-label="Volume"
      />
    </div>
  )
}
