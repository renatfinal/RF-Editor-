import tailwindcss from '@tailwindcss/vite';
import react from '@vitejs/plugin-react';
import path from 'path';
import {defineConfig} from 'vite';
import { GoogleGenAI } from '@google/genai';

const ai = new GoogleGenAI({ apiKey: process.env.GEMINI_API_KEY });

const apiMiddleware = () => ({
  name: 'api-middleware',
  configureServer(server) {
    server.middlewares.use(async (req, res, next) => {
      if (req.url === '/api/generate' && req.method === 'POST') {
        let body = '';
        req.on('data', chunk => {
          body += chunk.toString();
        });
        req.on('end', async () => {
          try {
            const { prompt } = JSON.parse(body);
            const response = await ai.models.generateContent({
              model: "gemini-3.5-flash",
              contents: [{
                role: 'user',
                parts: [{ text: `Você é um assistente especializado em estruturar e escrever livros de ficção e não-ficção. Com base na ideia abaixo, gere um planejamento detalhado de capítulos e um trecho inicial do primeiro capítulo, sem formatação markdown pesada, pronto para ser lido no editor. Organize bem com parágrafos.\n\nIdeia: ${prompt}` }]
              }],
              config: {
                systemInstruction: "Retorne o texto bem formatado sem markdown como asteriscos, use texto limpo e quebras de linha para simular páginas de livro.",
              }
            });
            res.setHeader('Content-Type', 'application/json');
            res.end(JSON.stringify({ text: response.text }));
          } catch (error) {
            console.error(error);
            res.statusCode = 500;
            res.end(JSON.stringify({ error: 'Failed to generate content' }));
          }
        });
        return;
      }
      next();
    });
  }
});

export default defineConfig(() => {
  return {
    plugins: [react(), tailwindcss(), apiMiddleware()],
    resolve: {
      alias: {
        '@': path.resolve(__dirname, '.'),
      },
    },
    server: {
      // HMR is disabled in AI Studio via DISABLE_HMR env var.
      // Do not modifyâfile watching is disabled to prevent flickering during agent edits.
      hmr: process.env.DISABLE_HMR !== 'true',
      // Disable file watching when DISABLE_HMR is true to save CPU during agent edits.
      watch: process.env.DISABLE_HMR === 'true' ? null : {},
    },
  };
});
