import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import federation from '@originjs/vite-plugin-federation'

export default defineConfig({
  plugins: [
    react(),
    federation({
      name: 'host_app',
      remotes: {
        authApp: 'http://localhost:3001/assets/remoteEntry.js',
        boardApp: 'http://localhost:3002/assets/remoteEntry.js'
      },
      shared: ['react', 'react-dom']
    })
  ],
  server: { port: 3000, strictPort: true },
  preview: { port: 3000, strictPort: true }, // Dòng mới bổ sung
  build: { target: 'esnext' }
})