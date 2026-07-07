/**
 * Demo playlist.
 *
 * Audio files are SoundHelix's public royalty-free demo tracks — commonly
 * used for testing audio players. To use your own music, drop files into
 * /public/audio and point `src` at e.g. '/audio/my-track.mp3'.
 *
 * `gradient` drives the visualizer colors, the album-art disc, and the
 * progress bar — the now-playing track's identity flows through the whole UI.
 */
export const TRACKS = [
  {
    id: 1,
    title:  'Morning Static',
    artist: 'Holloway Drive',
    src:    'https://www.soundhelix.com/examples/mp3/SoundHelix-Song-1.mp3',
    gradient: ['#f97316', '#ec4899'],
  },
  {
    id: 2,
    title:  'Glass Horizon',
    artist: 'Nova Tide',
    src:    'https://www.soundhelix.com/examples/mp3/SoundHelix-Song-2.mp3',
    gradient: ['#06b6d4', '#3b82f6'],
  },
  {
    id: 3,
    title:  'Concrete Bloom',
    artist: 'Echo Park Collective',
    src:    'https://www.soundhelix.com/examples/mp3/SoundHelix-Song-3.mp3',
    gradient: ['#10b981', '#14b8a6'],
  },
  {
    id: 4,
    title:  'Velvet Static',
    artist: 'Marigold Sound',
    src:    'https://www.soundhelix.com/examples/mp3/SoundHelix-Song-4.mp3',
    gradient: ['#8b5cf6', '#d946ef'],
  },
  {
    id: 5,
    title:  'Low Tide',
    artist: 'The Quiet Hours',
    src:    'https://www.soundhelix.com/examples/mp3/SoundHelix-Song-5.mp3',
    gradient: ['#f59e0b', '#ef4444'],
  },
  {
    id: 6,
    title:  'Afterglow',
    artist: 'Paper Moons',
    src:    'https://www.soundhelix.com/examples/mp3/SoundHelix-Song-6.mp3',
    gradient: ['#6366f1', '#0ea5e9'],
  },
]
