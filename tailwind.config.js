/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        petronas: {
          emerald: '#00B1A9',
          'dark-blue': '#0B3C49',
          yellow: '#FDB924',
          red: '#E31837',
        },
      },
      boxShadow: {
        'soft': '0 2px 8px rgba(0, 0, 0, 0.04), 0 1px 3px rgba(0, 0, 0, 0.06)',
        'elevated': '0 4px 16px rgba(0, 0, 0, 0.08), 0 2px 6px rgba(0, 0, 0, 0.04)',
        'hover': '0 8px 24px rgba(0, 0, 0, 0.12), 0 4px 8px rgba(0, 0, 0, 0.06)',
        'glow-emerald': '0 0 0 3px rgba(0, 177, 169, 0.15)',
        'glow-yellow': '0 0 0 3px rgba(253, 185, 36, 0.15)',
        'glow-red': '0 0 0 3px rgba(227, 24, 55, 0.15)',
      },
      borderRadius: {
        'xl': '16px',
        '2xl': '20px',
      },
      animation: {
        'fade-in': 'fadeIn 0.3s ease-in-out',
        'slide-up': 'slideUp 0.4s ease-out',
        'gauge-fill': 'gaugeFill 0.8s ease-out',
      },
      keyframes: {
        fadeIn: {
          '0%': { opacity: '0' },
          '100%': { opacity: '1' },
        },
        slideUp: {
          '0%': { transform: 'translateY(10px)', opacity: '0' },
          '100%': { transform: 'translateY(0)', opacity: '1' },
        },
        gaugeFill: {
          '0%': { strokeDasharray: '0 219.9' },
          '100%': { strokeDasharray: 'var(--gauge-value) 219.9' },
        },
      },
    },
  },
  plugins: [],
}
