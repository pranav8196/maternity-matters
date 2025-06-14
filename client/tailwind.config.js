/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      // 1. Define the new color palette
      colors: {
        'brand-primary': '#B94A6F', // A deep, muted rose for primary actions
        'brand-primary-hover': '#a04161', // A slightly darker version for hover
        'brand-secondary': '#E9E7F4', // A soft lavender for accents and section backgrounds
        'brand-background': '#FFFBF5', // A warm, creamy off-white for the main background
        'brand-text': '#334155', // A dark charcoal/slate for body text
        'brand-headings': '#1e293b', // A slightly darker slate for main headings
      },
      // 2. Define the new font families
      fontFamily: {
        heading: ['Poppins', 'sans-serif'], // Font for main titles and headings
        sans: ['Inter', 'sans-serif'], // Default body font
      },
    },
  },
  plugins: [],
}