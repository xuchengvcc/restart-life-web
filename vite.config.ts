import react from '@vitejs/plugin-react'
import { dirname, resolve } from 'path'
import { fileURLToPath } from 'url'
import { defineConfig } from 'vite'

const __filename = fileURLToPath(import.meta.url)
const __dirname = dirname(__filename)

// 自定义安全头插件
const securityHeadersPlugin = () => {
  return {
    name: 'security-headers',
    configureServer(server: any) {
      server.middlewares.use((req: any, res: any, next: any) => {
        // 添加安全头
        res.setHeader('X-Content-Type-Options', 'nosniff')
        res.setHeader('X-Frame-Options', 'DENY')
        res.setHeader('X-XSS-Protection', '1; mode=block')
        res.setHeader('Cache-Control', 'no-cache, no-store, must-revalidate')
        res.setHeader('Pragma', 'no-cache')
        res.setHeader('Expires', '0')
        res.setHeader('Referrer-Policy', 'strict-origin-when-cross-origin')

        // 针对静态资源的缓存策略
        if (req.url && (req.url.includes('.js') || req.url.includes('.css') || req.url.includes('.png') || req.url.includes('.jpg') || req.url.includes('.svg'))) {
          res.setHeader('Cache-Control', 'public, max-age=31536000, immutable')
        }

        next()
      })
    }
  }
}

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [
    react(),
    securityHeadersPlugin()
  ],
  resolve: {
    alias: {
      '@': resolve(__dirname, './src')
    }
  },
  server: {
    host: '0.0.0.0', // 允许外部访问
    port: 8080, // 使用标准Web端口
    allowedHosts: [
      'localhost',
      '127.0.0.1',
      '43.136.39.202',
      'asecondchance.cn',
      'www.asecondchance.cn'
    ], // 允许的主机名
    proxy: {
      '/api': {
        target: 'http://localhost:8081', // 指向Docker中的后端服务（本地端口映射）
        changeOrigin: true,
        secure: false,
        // 不需要重写路径，因为前端已经使用 /api/v1 作为baseURL
      }
    }
  },
  preview: {
    host: '0.0.0.0', // 允许外部访问
    port: 4174, // 自定义预览端口（避免与开发端口8080冲突）
    allowedHosts: [
      'localhost',
      '127.0.0.1',
      '43.136.39.202',
      'asecondchance.cn',
      'www.asecondchance.cn'
    ]
  },
  css: {
    preprocessorOptions: {
      less: {
        javascriptEnabled: true,
      }
    }
  }
})
