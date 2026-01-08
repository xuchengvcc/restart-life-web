import react from '@vitejs/plugin-react'
import path from 'path'
import { defineConfig } from 'vite'

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [react()],
  resolve: {
    alias: {
      '@': path.resolve(__dirname, './src')
    }
  },
  server: {
    host: '0.0.0.0', // 允许外部访问
    port: 8080, // 使用Vite默认端口
    allowedHosts: [
      'localhost',
      '127.0.0.1',
      '43.136.39.202',
      'asecondchance.cn',
      'www.asecondchance.cn'
    ], // 允许的主机名
    proxy: {
      '/api': {
        target: 'http://localhost:8081', // 指向后端端口
        changeOrigin: true,
        rewrite: (path) => path.replace(/^\/api/, '/api/v1')
      }
    }
  },
  css: {
    preprocessorOptions: {
      less: {
        javascriptEnabled: true,
      }
    }
  }
})
