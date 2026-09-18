/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{js,ts,jsx,tsx}'],
  theme: {
    extend: {
      colors: {
        ink: '#08080F',
        muted: '#5F5F78',
        border: '#E1E1EB',
        surface: '#FFFFFF',
        canvas: '#F3F4F9',
        violet: { DEFAULT: '#5346D3', soft: '#EFEDFF' },
        blue: { DEFAULT: '#2563EB', soft: '#E8F0FF' },
        teal: { DEFAULT: '#0B8F82', soft: '#DFF5F1' },
        amber: { DEFAULT: '#B86E08', soft: '#FBF0DC' },
        coral: { DEFAULT: '#D44545', soft: '#FCEAEA' },
        rail: '#0A0A12',
      },
      fontFamily: {
        sans: ['"Plus Jakarta Sans"', 'ui-sans-serif', 'sans-serif'],
        display: ['Outfit', 'ui-sans-serif', 'sans-serif'],
        mono: ['"JetBrains Mono"', 'ui-monospace', 'monospace'],
      },
      boxShadow: {
        soft: '0 1px 2px rgba(8,8,15,.04), 0 10px 28px -14px rgba(8,8,15,.14)',
        lift: '0 4px 12px rgba(8,8,15,.06), 0 20px 48px -20px rgba(83,70,211,.28)',
        glow: '0 0 0 1px rgba(83,70,211,.2), 0 14px 36px -12px rgba(83,70,211,.4)',
        inset: 'inset 0 1px 0 rgba(255,255,255,.65)',
      },
      keyframes: {
        'fade-up': {
          '0%': { opacity: '0', transform: 'translateY(10px)' },
          '100%': { opacity: '1', transform: 'translateY(0)' },
        },
        'fade-in': {
          '0%': { opacity: '0' },
          '100%': { opacity: '1' },
        },
        'soft-pulse': {
          '0%, 100%': { boxShadow: '0 0 0 0 rgba(83,70,211,.4)' },
          '70%': { boxShadow: '0 0 0 12px rgba(83,70,211,0)' },
        },
      },
      animation: {
        'fade-up': 'fade-up .5s cubic-bezier(.22,1,.36,1) both',
        'fade-in': 'fade-in .35s ease both',
        'soft-pulse': 'soft-pulse 2.6s ease-out infinite',
      },
    },
  },
  plugins: [],
};
