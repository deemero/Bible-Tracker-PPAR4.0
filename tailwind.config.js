/** @type {import('tailwindcss').Config} */
module.exports = {
  darkMode: 'class',
  content: [
    './app/**/*.{js,ts,jsx,tsx}',
    './pages/**/*.{js,ts,jsx,tsx}',
    './components/**/*.{js,ts,jsx,tsx}',
    './src/**/*.{js,ts,jsx,tsx}',
  ],
  theme: {
    extend: {
      fontFamily: {
        sans: ['"Segoe UI"', 'Inter', 'sans-serif'], // ✨ Cozy UI font
      },
      animation: {
        'heartbeat-glow': 'heartbeat 1.5s infinite ease-in-out',
      },
      keyframes: {
        heartbeat: {
          '0%, 100%': {
            transform: 'scale(1)',
            boxShadow: '0 0 0px rgba(34, 197, 94, 0.5)', // 💚 Tukar ke green glow
          },
          '50%': {
            transform: 'scale(1.05)',
            boxShadow: '0 0 15px rgba(34, 197, 94, 0.8)', // 💚 Tukar ke green glow
          },
        },
      },
    },
  },
  plugins: [],
}
