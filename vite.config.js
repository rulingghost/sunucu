import { resolve } from 'path';
import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import tailwindcss from '@tailwindcss/vite';

// https://vite.dev/config/
export default defineConfig({
  plugins: [react(), tailwindcss()],
  build: {
    rollupOptions: {
      input: {
        main: resolve(import.meta.dirname, 'index.html'),
        vds: resolve(import.meta.dirname, 'sanal-sunucu.html'),
        extreme: resolve(import.meta.dirname, 'extreme-sunucu.html'),
        dedicated: resolve(import.meta.dirname, 'fiziksel-sunucu.html'),
        gpu: resolve(import.meta.dirname, 'ekran-kartli-sunucu.html'),
        datacenters: resolve(import.meta.dirname, 'veri-merkezleri.html'),
        about: resolve(import.meta.dirname, 'hakkimizda.html'),
        contact: resolve(import.meta.dirname, 'iletisim.html'),
        terms: resolve(import.meta.dirname, 'hizmet-sozlesmesi.html'),
        privacy: resolve(import.meta.dirname, 'gizlilik-politikasi.html'),
        kvkk: resolve(import.meta.dirname, 'kvkk-aydinlatma-metni.html'),
        cookies: resolve(import.meta.dirname, 'cerez-politikasi.html'),
        panel: resolve(import.meta.dirname, 'panel.html'),
        login: resolve(import.meta.dirname, 'login.html'),
        yonetici: resolve(import.meta.dirname, 'yonetici.html')
      }
    }
  }
});
