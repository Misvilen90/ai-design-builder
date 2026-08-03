/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  darkMode: 'class',
  theme: {
    extend: {
      colors: {
        primary: {
          DEFAULT: '#6366f1',
          hover: '#4f46e5',
        },
        accent: '#a855f7',
        danger: '#ef4444',
        body: {
          dark: '#090d16',
          light: '#f8fafc',
        },
        card: {
          dark: '#101726',
          light: '#ffffff',
        },
        border: {
          dark: '#1e293b',
          light: '#e2e8f0',
        },
        textMain: {
          dark: '#f1f5f9',
          light: '#0f172a',
        },
        textMuted: {
          dark: '#94a3b8',
          light: '#64748b',
        }
      },
      boxShadow: {
        glow: '0 0 20px rgba(99, 102, 241, 0.35)',
        glowLight: '0 0 20px rgba(99, 102, 241, 0.15)',
      }
    },
  },
  plugins: [],
}
