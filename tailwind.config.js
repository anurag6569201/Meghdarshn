/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./src/**/*.{js,jsx,ts,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        // Custom color palette for the light theme
        primary: {
          light: '#67e8f9', // cyan-300
          DEFAULT: '#06b6d4', // cyan-500
          dark: '#0e7490', // cyan-700
        },
        secondary: {
          light: '#f0f9ff', // sky-50
          DEFAULT: '#0ea5e9', // sky-500
          dark: '#0369a1', // sky-800
        },
        accent: {
          DEFAULT: '#a855f7', // purple-500
          dark: '#7e22ce', // purple-700
        },
        background: '#ffffff',
        surface: '#f8fafc', // slate-50
        'surface-active': '#f1f5f9', // slate-100
        'surface-border': '#e2e8f0', // slate-200
        'text-primary': '#1e293b', // slate-800
        'text-secondary': '#475569', // slate-600
        'text-tertiary': '#94a3b8', // slate-400
      },
    },
  },
  plugins: [],
}