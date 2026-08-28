import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import tailwindcss from '@tailwindcss/vite'

// https://vite.dev/config/
export default defineConfig({
  plugins: [
    react(),
    tailwindcss(),
  ],
  test: {
    globals: true,
    environment: 'jsdom',
    setupFiles: ['./tests/setup.js'],
    pool: 'forks',
    fileParallelism: false,
    server: {
      deps: {
        inline: [
          'react-router',
          'react-router-dom',
          '@lineiconshq/react-lineicons',
          '@lineiconshq/free-icons',
        ],
      },
    },
  },
})

