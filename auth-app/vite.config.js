import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import federation from '@originjs/vite-plugin-federation'

export default defineConfig({
  plugins: [
    react(),
    federation({
      name: 'auth_app',
      filename: 'remoteEntry.js',
      exposes: {
        './Auth': './src/App.jsx'
      },
      shared: ['react', 'react-dom', 'antd']
    })
  ],
  server: { port: 3001, strictPort: true },
  preview: { port: 3001, strictPort: true },
  build: { target: 'esnext' }
})