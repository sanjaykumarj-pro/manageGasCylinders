/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        kerala: {
          light: '#e6f4ea',
          green: '#2d6a4f',
          dark: '#1b4332',
          gold: '#d4af37',
          red: '#c53030'
        }
      }
    },
  },
  plugins: [],
}
