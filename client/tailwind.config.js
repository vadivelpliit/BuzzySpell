/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        bee: {
          yellow: '#FFD93D',
          gold: '#FFC107',
          orange: '#FF9800',
          brown: '#795548',
        },
        hive: {
          light: '#FFF9E6',
          medium: '#FFE5B4',
          dark: '#FFD180',
        },
        sky: '#87CEEB',
        grass: '#90EE90',
      },
      fontFamily: {
        child: ['Comic Sans MS', 'Comic Neue', 'cursive'],
      },
    },
  },
  plugins: [],
}
