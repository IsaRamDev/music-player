import { useReducer } from 'react'
import { TRACKS } from '../lib/tracks'

/** Fisher-Yates shuffle — returns a new array, doesn't mutate the input. */
function shuffleArray(arr) {
  const a = [...arr]
  for (let i = a.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1))
    ;[a[i], a[j]] = [a[j], a[i]]
  }
  return a
}

/**
 * State shape:
 *   playOrder — array of track indices defining play order (identity when
 *               shuffle is off, shuffled when on)
 *   position  — index INTO playOrder (not into TRACKS directly)
 *   shuffle   — boolean
 *   repeat    — 'off' | 'all' | 'one'
 *
 * Keeping a separate `playOrder` (rather than shuffling TRACKS itself) means
 * the playlist sidebar always shows tracks in their original order, while
 * next/prev navigate through the shuffled sequence.
 */
const initialState = {
  playOrder: TRACKS.map((_, i) => i),
  position: 0,
  shuffle: false,
  repeat: 'off',
}

function reducer(state, action) {
  switch (action.type) {
    case 'SELECT': {
      const pos = state.playOrder.indexOf(action.index)
      return { ...state, position: pos === -1 ? 0 : pos }
    }

    case 'NEXT': {
      const atEnd = state.position >= state.playOrder.length - 1
      if (atEnd) {
        if (state.repeat !== 'all') return state // stop at end of playlist
        // Wrap to the start; reshuffle for a fresh order if shuffle is on
        const playOrder = state.shuffle ? shuffleArray(state.playOrder) : state.playOrder
        return { ...state, playOrder, position: 0 }
      }
      return { ...state, position: state.position + 1 }
    }

    case 'PREV': {
      if (state.position === 0) {
        return state.repeat === 'all'
          ? { ...state, position: state.playOrder.length - 1 }
          : state
      }
      return { ...state, position: state.position - 1 }
    }

    case 'TOGGLE_SHUFFLE': {
      const currentTrackIndex = state.playOrder[state.position]

      if (state.shuffle) {
        // Turning shuffle OFF — restore natural order, keep the same track playing
        const playOrder = TRACKS.map((_, i) => i)
        return { ...state, shuffle: false, playOrder, position: playOrder.indexOf(currentTrackIndex) }
      }

      // Turning shuffle ON — current track stays first, rest is shuffled
      const rest = shuffleArray(TRACKS.map((_, i) => i).filter((i) => i !== currentTrackIndex))
      return { ...state, shuffle: true, playOrder: [currentTrackIndex, ...rest], position: 0 }
    }

    case 'CYCLE_REPEAT': {
      const order = ['off', 'all', 'one']
      return { ...state, repeat: order[(order.indexOf(state.repeat) + 1) % order.length] }
    }

    default:
      return state
  }
}

export function usePlaylist() {
  const [state, dispatch] = useReducer(reducer, initialState)

  const trackIndex   = state.playOrder[state.position]
  const currentTrack = TRACKS[trackIndex]

  return {
    tracks:       TRACKS,
    currentTrack,
    trackIndex,
    shuffle:      state.shuffle,
    repeat:       state.repeat,
    select:        (index) => dispatch({ type: 'SELECT', index }),
    next:          () => dispatch({ type: 'NEXT' }),
    prev:          () => dispatch({ type: 'PREV' }),
    toggleShuffle: () => dispatch({ type: 'TOGGLE_SHUFFLE' }),
    cycleRepeat:   () => dispatch({ type: 'CYCLE_REPEAT' }),
  }
}
