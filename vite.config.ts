import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import tailwindcss from '@tailwindcss/vite';
export default defineConfig({plugins:[react(),tailwindcss()],build:{rollupOptions:{output:{manualChunks:{motion:['framer-motion'],react:['react','react-dom']}}}},server:{proxy:{'/api':'http://127.0.0.1:3001','/sitemap.xml':'http://127.0.0.1:3001','/robots.txt':'http://127.0.0.1:3001'}}});
