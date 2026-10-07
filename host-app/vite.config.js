import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import federation from '@originjs/vite-plugin-federation'

export default defineConfig({
  plugins: [
    react(),
    federation({
      name: 'host_app',
      remotes: {
        authApp: 'https://microboard-auth.vercel.app/assets/remoteEntry.js',
        boardApp: 'https://microboard-board.vercel.app/assets/remoteEntry.js',
      },
      shared: ['react', 'react-dom', 'antd']
    })
  ],
  server: { port: 3000, strictPort: true },
  preview: { port: 3000, strictPort: true }, // Dòng mới bổ sung
  build: { target: 'esnext' }
})