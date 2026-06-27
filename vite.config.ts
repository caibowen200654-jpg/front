import { defineConfig, loadEnv } from 'vite'
import react from '@vitejs/plugin-react'
import tailwindcss from '@tailwindcss/vite'

export default defineConfig(({ mode }) => {
  const env = loadEnv(mode, process.cwd(), '')

  return {
    base: '/front/',
    plugins: [react(), tailwindcss()],
    server: {
      proxy: {
        '/api/deepseek': {
          target: 'https://api.deepseek.com',
          changeOrigin: true,
          rewrite: (path) => path.replace(/^\/api\/deepseek/, ''),
          headers: {
            Authorization: `Bearer ${env.VITE_DEEPSEEK_API_KEY}`,
          },
        },
        '/unsplash': {
          target: 'https://images.unsplash.com',
          changeOrigin: true,
          rewrite: (path) => path.replace(/^\/unsplash/, ''),
          headers: {
            'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36',
          },
        },
      },
    },
  }
})
