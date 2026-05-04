import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import tailwindcss from '@tailwindcss/vite'

export default defineConfig({
  plugins: [react(), tailwindcss()],
  // base: './' 讓所有資源使用相對路徑
  // → Electron 以 file:// 載入時圖片/影片/JS 都能正確找到
  base: './',
})
