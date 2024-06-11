import { defineConfig } from 'vite'
import vue from '@vitejs/plugin-vue'
import dts from "vite-plugin-dts";

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [
    vue(),
    dts({
      rollupTypes: true,
    }),
  ],
  build: {
    lib: {
      entry: 'src/index.ts',
      name: 'Vue3SocketIO',
      fileName: `vue3-socket.io`,
      formats: ['es']
    },
    rollupOptions: {
      external: ['vue', 'socket.io-client'],
    }
  },
  test: {
    environment: 'jsdom'
  }
})
