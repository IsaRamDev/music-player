/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{js,jsx}'],
  theme: {
    extend: {
      fontFamily: {
        sans: ['"Inter"', 'system-ui', 'sans-serif'],
        mono: ['"JetBrains Mono"', 'monospace'],
      },
      colors: {
        surface: {
          0: '#0a0a0f',
          1: '#13131c',
          2: '#1b1b28',
          3: '#252536',
          4: '#32324a',
        },
        border: {
          DEFAULT: '#22222f',
          light:   '#32324a',
        },
        text: {
          primary:   '#f4f4f8',
          secondary: '#9999b0',
          muted:     '#5e5e76',
        },
      },
      animation: {
        'fade-in':   'fadeIn 0.3s ease-out',
        'spin-slow': 'spin 8s linear infinite',
        'eq1': 'eq1 0.9s ease-in-out infinite',
        'eq2': 'eq2 1.1s ease-in-out infinite',
        'eq3': 'eq3 0.75s ease-in-out infinite',
      },
      keyframes: {
        fadeIn: { from: { opacity: 0 }, to: { opacity: 1 } },
        eq1: { '0%,100%': { height: '30%' }, '50%': { height: '100%' } },
        eq2: { '0%,100%': { height: '100%' }, '50%': { height: '40%' } },
        eq3: { '0%,100%': { height: '55%' }, '50%': { height: '90%' } },
      },
    },
  },
  plugins: [],
}
