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
          emeraldLight: '#33C4BD',
          emeraldDark: '#008F89',
          teal: '#0B3C49',
          tealLight: '#1A5566',
          tealDark: '#062530',
          yellow: '#FDB924',
          yellowLight: '#FECA50',
          red: '#E31837',
          redLight: '#E94560',
        },
        status: {
          healthy: '#00B1A9',
          caution: '#FDB924',
          overrun: '#E31837',
        }
      },
      fontFamily: {
        sans: ['Inter', 'system-ui', '-apple-system', 'BlinkMacSystemFont', 'Segoe UI', 'Roboto', 'sans-serif'],
      },
      boxShadow: {
        'card': '0 4px 20px -4px rgba(11, 60, 73, 0.08)',
        'card-hover': '0 8px 30px -4px rgba(11, 60, 73, 0.12)',
        'kpi': '0 6px 24px -6px rgba(0, 177, 169, 0.15)',
      },
      borderRadius: {
        'xl': '16px',
        '2xl': '20px',
        '3xl': '24px',
      },
      backgroundImage: {
        'petronas-gradient': 'linear-gradient(135deg, #0B3C49 0%, #00B1A9 100%)',
        'header-gradient': 'linear-gradient(180deg, #0B3C49 0%, #1A5566 100%)',
        'card-gradient': 'linear-gradient(135deg, rgba(0, 177, 169, 0.05) 0%, rgba(11, 60, 73, 0.02) 100%)',
      }
    },
  },
  plugins: [],
}
