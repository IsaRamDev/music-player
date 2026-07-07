import { useCallback } from 'react'

/**
 * Stub analyser — frequency data is not available for cross-origin audio
 * sources that lack CORS headers (e.g. SoundHelix demo tracks). Connecting
 * the audio element to a MediaElementSource routes all audio through the Web
 * Audio graph; without CORS the browser silences that path entirely.
 *
 * The visualizer already handles a null return from getFrequencyData by
 * falling back to its ambient sine-wave animation, so audio plays normally
 * and the canvas still animates while playing.
 *
 * To enable real spectrum data: host audio files locally under /public/audio/
 * and update src paths in src/lib/tracks.js.
 */
export function useAudioAnalyser(_audioEl) {
  const ensureContext  = useCallback(async () => null, [])
  const getFrequencyData = useCallback(() => null, [])
  return { ensureContext, getFrequencyData }
}
