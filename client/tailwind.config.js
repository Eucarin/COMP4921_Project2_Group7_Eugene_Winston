/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./src/**/*.{js,jsx,ts,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        'funny-yellow': '#FCB03B',
        'funny-blue': '#2AABE2',
        'funny-red': '#FF4D44',
        'funny-green': '#3FB58A',
        'funny-grey': '#E4E4E4',
        'funny-rose': '#FF8B6F',
        'funny-purple': '#6234AB'
      }
    },
  },
  plugins: [],
}

