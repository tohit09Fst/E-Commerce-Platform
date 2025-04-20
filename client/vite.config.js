import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import tailwindcss from '@tailwindcss/vite'

// https://vite.dev/config/
export default defineConfig({
  plugins: [react(), tailwindcss(),],

  theme: {
  extend: {
    animation: {
      'fade-slide': 'fadeSlide 0.3s ease-out forwards',
    },
    keyframes: {
      fadeSlide: {
        '0%': { opacity: 0, transform: 'translateY(-10px)' },
        '100%': { opacity: 1, transform: 'translateY(0)' },
      },
    },
  },
}

})
