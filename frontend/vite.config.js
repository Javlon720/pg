import { defineConfig } from 'vite'
import { config } from 'dotenv'

config()

export default defineConfig({
    server: {
        port: process.env.VITE_PORT,
        proxy: {
            '/api': {
                target: 'http://localhost:3005/data.uz',
                changeOrigin: true,
                rewrite: (path) => path.replace(/^\/api/, '')
            }
        }
    }
})