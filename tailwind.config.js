// /** @type {import('tailwindcss').Config} */
// module.exports = {
//     darkMode: 'class',
//     content: [
//       './app/**/*.{js,ts,jsx,tsx}',
//       './pages/**/*.{js,ts,jsx,tsx}',
//       './components/**/*.{js,ts,jsx,tsx}',
//       './src/**/*.{js,ts,jsx,tsx}',
//     ],
//     theme: {
//       extend: {},
//     },
//     plugins: [],
//   }
  
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
    },
  },
  plugins: [],
}


