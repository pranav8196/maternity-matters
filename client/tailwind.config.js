// client/tailwind.config.js
/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html", // If your main index.html is in the root
    "./src/**/*.{js,ts,jsx,tsx}", // Scan all JS, TS, JSX, TSX files in src
  ],
  theme: {
    extend: {
      fontFamily: { // Example: Adding a custom font family
        sans: ['Inter', 'sans-serif'],
      },
    },
  },
  plugins: [],
}