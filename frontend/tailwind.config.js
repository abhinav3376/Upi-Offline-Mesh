/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{js,jsx}'],
  theme: {
    extend: {
      colors: {
        bg: '#05070a',
        panel: '#0b0f14',
        panelborder: '#1b2230',
        mint: '#34e0a1',
        mintdim: '#1f7a5c',
        ink: '#e6ecf1',
        sub: '#7c8a9a',
      },
      fontFamily: {
        mono: ['"JetBrains Mono"', '"Fira Code"', 'ui-monospace', 'monospace'],
      },
      boxShadow: {
        glow: '0 0 24px rgba(52, 224, 161, 0.35)',
      },
    },
  },
  plugins: [],
};
