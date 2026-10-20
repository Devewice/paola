import { defineConfig, mergeConfig } from 'vite'
import base from './vite.config'

export default mergeConfig(base, defineConfig({
  server: {
    port: 5199,
    proxy: {
      '/api': { target: 'https://paolabiker.com', changeOrigin: true, secure: true },
    },
  },
}))
