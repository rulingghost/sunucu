import { resolve } from 'path';
import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import tailwindcss from '@tailwindcss/vite';

function vercelApiDevPlugin() {
  return {
    name: 'vercel-api-dev-middleware',
    configureServer(server) {
      server.middlewares.use(async (req, res, next) => {
        if (!req.url.startsWith('/api/')) {
          return next();
        }

        try {
          const urlObj = new URL(req.url, 'http://localhost');
          const pathname = urlObj.pathname;
          const route = pathname.replace(/^\/api\//, '').split('?')[0];
          const filePath = resolve(import.meta.dirname, `api/${route}.js`);

          req.query = Object.fromEntries(urlObj.searchParams.entries());

          res.status = (code) => {
            res.statusCode = code;
            return res;
          };
          res.json = (data) => {
            res.setHeader('Content-Type', 'application/json; charset=utf-8');
            res.end(JSON.stringify(data));
            return res;
          };

          if (['POST', 'PUT', 'PATCH', 'DELETE'].includes(req.method)) {
            const buffers = [];
            for await (const chunk of req) {
              buffers.push(chunk);
            }
            const rawBody = Buffer.concat(buffers).toString();
            try {
              req.body = rawBody ? JSON.parse(rawBody) : {};
            } catch {
              req.body = rawBody;
            }
          }

          const module = await import(`${filePath}?t=${Date.now()}`);
          if (module.default && typeof module.default === 'function') {
            await module.default(req, res);
          } else {
            res.status(404).json({ error: `API route handler not found for ${route}` });
          }
        } catch (err) {
          console.error('[Vite Dev API Error]', err);
          res.status(500).json({ error: err.message });
        }
      });
    }
  };
}

// https://vite.dev/config/
export default defineConfig({
  plugins: [react(), tailwindcss(), vercelApiDevPlugin()],
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
