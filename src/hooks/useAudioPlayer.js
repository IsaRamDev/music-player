import { useRef, useState, useEffect, useCallback } from 'react'

export function useAudioPlayer({ src, volume, muted, loop, onEnded }) {
  const audioRef = useRef(null)
  if (audioRef.current === null) {
    const audio = new Audio()
    audio.preload = 'metadata'
    audioRef.current = audio
  }

  const [isPlaying, setIsPlaying]     = useState(false)
  const [currentTime, setCurrentTime] = useState(0)
  const [duration, setDuration]       = useState(0)
  const [isLoading, setIsLoading]     = useState(true)

  const onEndedRef = useRef(onEnded)
  useEffect(() => { onEndedRef.current = onEnded }, [onEnded])

  useEffect(() => {
    const audio = audioRef.current
    setIsLoading(true)
    setCurrentTime(0)
    setDuration(0)
    audio.src = src
    audio.load()
  }, [src])

  useEffect(() => {
    audioRef.current.loop = !!loop
  }, [loop])

  useEffect(() => {
    const audio = audioRef.current
    const handleTimeUpdate     = () => setCurrentTime(audio.currentTime)
    const handleLoadedMetadata = () => { setDuration(audio.duration || 0); setIsLoading(false) }
    const handleEnded          = () => onEndedRef.current?.()
    const handleWaiting        = () => setIsLoading(true)
    const handleCanPlay        = () => setIsLoading(false)
    const handlePlay           = () => setIsPlaying(true)
    const handlePause          = () => setIsPlaying(false)

    audio.addEventListener('timeupdate',     handleTimeUpdate)
    audio.addEventListener('loadedmetadata', handleLoadedMetadata)
    audio.addEventListener('ended',          handleEnded)
    audio.addEventListener('waiting',        handleWaiting)
    audio.addEventListener('canplay',        handleCanPlay)
    audio.addEventListener('play',           handlePlay)
    audio.addEventListener('pause',          handlePause)

    return () => {
      audio.removeEventListener('timeupdate',     handleTimeUpdate)
      audio.removeEventListener('loadedmetadata', handleLoadedMetadata)
      audio.removeEventListener('ended',          handleEnded)
      audio.removeEventListener('waiting',        handleWaiting)
      audio.removeEventListener('canplay',        handleCanPlay)
      audio.removeEventListener('play',           handlePlay)
      audio.removeEventListener('pause',          handlePause)
    }
  }, [])

  useEffect(() => {
    audioRef.current.volume = muted ? 0 : volume
  }, [volume, muted])

  const play = useCallback(async () => {
    try { await audioRef.current.play() } catch { /* autoplay blocked */ }
  }, [])

  const pause = useCallback(() => {
    audioRef.current.pause()
  }, [])

  const seek = useCallback((time) => {
    const clamped = Math.min(Math.max(time, 0), audioRef.current.duration || 0)
    audioRef.current.currentTime = clamped
    setCurrentTime(clamped)
  }, [])

  return { audioEl: audioRef.current, isPlaying, currentTime, duration, isLoading, play, pause, seek }
}