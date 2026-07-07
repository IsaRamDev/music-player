import { useRef, useEffect } from 'react'

const BAR_COUNT = 64

/**
 * Canvas-based frequency spectrum visualizer.
 *
 * Draws BAR_COUNT vertical bars whose heights come from the analyser's
 * frequency data. Bins are sampled with a power curve (`Math.pow(i/N, 1.5)`)
 * so lower bins (bass — usually the most energetic) get more visual weight
 * across more bars, instead of all the action being crammed into the first
 * few pixels.
 *
 * Idle / no-signal fallback:
 * If `getFrequencyData()` returns null (analyser not built yet) OR an
 * all-zero array (cross-origin audio without CORS headers — see
 * useAudioAnalyser.js), the bars fall back to a gentle sine-wave ambient
 * animation. This means the visualizer always looks alive, regardless of
 * whether live spectrum data is available for a given audio source.
 */
export default function Visualizer({ getFrequencyData, isPlaying, gradient }) {
  const canvasRef = useRef(null)

  useEffect(() => {
    const canvas = canvasRef.current
    const ctx = canvas.getContext('2d')
    let frameId
    let t = 0

    const resize = () => {
      const dpr = window.devicePixelRatio || 1
      const rect = canvas.getBoundingClientRect()
      canvas.width  = Math.max(1, rect.width * dpr)
      canvas.height = Math.max(1, rect.height * dpr)
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0)
    }
    resize()

    const ro = new ResizeObserver(resize)
    ro.observe(canvas)

    const [c1, c2] = gradient

    function draw() {
      const rect = canvas.getBoundingClientRect()
      const { width, height } = rect
      ctx.clearRect(0, 0, width, height)

      const rawData = isPlaying ? getFrequencyData() : null
      const hasSignal = rawData && rawData.some((v) => v > 2)

      const barWidth = width / BAR_COUNT
      const gap = barWidth * 0.3

      const grad = ctx.createLinearGradient(0, height, 0, 0)
      grad.addColorStop(0, c1)
      grad.addColorStop(1, c2)
      ctx.fillStyle = grad

      for (let i = 0; i < BAR_COUNT; i++) {
        let ratio
        if (hasSignal) {
          const binIndex = Math.floor(Math.pow(i / BAR_COUNT, 1.5) * (rawData.length * 0.85))
          ratio = rawData[binIndex] / 255
        } else {
          // Ambient idle animation — gentle traveling wave
          ratio = 0.04 + Math.abs(Math.sin(t * 0.03 + i * 0.25)) * 0.05
        }

        const barHeight = Math.max(3, ratio * height)
        const x = i * barWidth
        const y = height - barHeight

        ctx.globalAlpha = hasSignal ? 1 : 0.35
        ctx.fillRect(x + gap / 2, y, barWidth - gap, barHeight)
      }

      t++
      frameId = requestAnimationFrame(draw)
    }
    draw()

    return () => {
      cancelAnimationFrame(frameId)
      ro.disconnect()
    }
  }, [isPlaying, getFrequencyData, gradient])

  return <canvas ref={canvasRef} className="w-full h-full block" aria-hidden="true" />
}
