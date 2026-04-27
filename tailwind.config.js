/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{js,jsx}'],
  theme: {
    extend: {
      colors: {
        ink: '#05070f',
        panel: 'rgba(13, 20, 39, 0.68)',
        cyan: '#2dd4ff',
        violet: '#8b5cf6',
        mint: '#8fffe0',
      },
      fontFamily: {
        sans: ['Inter', 'ui-sans-serif', 'system-ui', 'sans-serif'],
        display: ['Space Grotesk', 'Inter', 'ui-sans-serif', 'system-ui'],
      },
      boxShadow: {
        glow: '0 0 48px rgba(45, 212, 255, 0.22)',
        violet: '0 0 60px rgba(139, 92, 246, 0.2)',
      },
    },
  },
  plugins: [],
};
