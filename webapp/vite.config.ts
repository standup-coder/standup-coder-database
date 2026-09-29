import { fileURLToPath } from 'node:url'
import react from '@vitejs/plugin-react'
import { defineConfig } from 'vite'

// 语料与 skills 位于仓库根目录（webapp 之外），允许 dev server 访问上级目录
export default defineConfig({
  plugins: [react()],
  server: {
    fs: {
      allow: [fileURLToPath(new URL('..', import.meta.url))],
    },
  },
})
