import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import federation from '@originjs/vite-plugin-federation'

export default defineConfig({
  plugins: [
    react(),
    federation({
      name: 'board_app',
      filename: 'remoteEntry.js',
      exposes: {
        './Board': './src/App.jsx'
      },
      shared: ['react', 'react-dom', 'antd']
    })
  ],
  server: { port: 3002, strictPort: true },
  preview: { port: 3002, strictPort: true },
  build: { target: 'esnext' }
})