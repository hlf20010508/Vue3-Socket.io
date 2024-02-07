import { defineConfig } from 'vite'
import vue from '@vitejs/plugin-vue'

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [
    vue(),
  ],
  build: {
    lib: {
      entry: 'src/index.js',
      name: 'Vue3SocketIO',
      fileName: `vue3-socket.io`,
      formats: ['es']
    },
    rollupOptions: {
      external: ['vue', 'socket.io-client']
    }
  }
})
