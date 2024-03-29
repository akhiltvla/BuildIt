import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import pluginRewriteAll from 'vite-plugin-rewrite-all';


// https://vitejs.dev/config/
export default defineConfig({
  plugins: [react(), pluginRewriteAll()],
  server: {
    port: 3000,
    proxy:{
      '/api': {
        // target:'http://localhost:5000',
        target:'https://buildit-q6ya.onrender.com',
        changeOrigin: true
      }
    }
  }

})
