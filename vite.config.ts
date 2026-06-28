import tailwindcss from '@tailwindcss/vite';
import react from '@vitejs/plugin-react';
import path from 'path';
import {defineConfig} from 'vite';
import { GoogleGenAI } from '@google/genai';

function getAiClient() {
  const apiKey = process.env.GEMINI_API_KEY;
  if (!apiKey) {
    throw new Error('Chave de API do Gemini não configurada.');
  }
  return new GoogleGenAI({ apiKey });
}

async function generateContentWithRetry(ai, options) {
  try {
    return await ai.models.generateContent(options);
  } catch (error) {
    console.warn("First attempt failed, retrying with fallback model...", error.message);
    const fallbackModel = options.model.includes('image') ? 'gemini-2.5-flash-image' : 'gemini-3.1-flash-lite';
    return await ai.models.generateContent({
      ...options,
      model: fallbackModel
    });
  }
}

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
            const ai = getAiClient();
            const { prompt } = JSON.parse(body);
            const response = await generateContentWithRetry(ai, {
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
      if (req.url === '/api/check-grammar' && req.method === 'POST') {
        let body = '';
        req.on('data', chunk => {
          body += chunk.toString();
        });
        req.on('end', async () => {
          try {
            const ai = getAiClient();
            const { text } = JSON.parse(body);
            const response = await generateContentWithRetry(ai, {
              model: "gemini-3.5-flash",
              contents: [{
                role: 'user',
                parts: [{ text: `Revise o texto abaixo e encontre erros gramaticais ou ortográficos. Retorne um JSON estrito no formato de um array de objetos, onde cada objeto tem:\n- "original": a palavra ou frase curta exata com erro presente no texto fornecido\n- "suggestion": a correção sugerida\n- "explanation": uma breve explicação do erro\n\nTexto:\n${text}` }]
              }],
              config: {
                systemInstruction: "Você deve retornar APENAS um JSON válido contendo um array de objetos, nada mais. Sem blocos de código com trechos como ```json ou texto adicional.",
                responseMimeType: "application/json"
              }
            });
            res.setHeader('Content-Type', 'application/json');
            res.end(response.text);
          } catch (error) {
            console.error(error);
            res.statusCode = 500;
            res.end(JSON.stringify({ error: 'Failed to check grammar' }));
          }
        });
        return;
      }
      if (req.url === '/api/magic-ia' && req.method === 'POST') {
        let body = '';
        req.on('data', chunk => {
          body += chunk.toString();
        });
        req.on('end', async () => {
          try {
            const ai = getAiClient();
            const { text } = JSON.parse(body);
            const response = await generateContentWithRetry(ai, {
              model: "gemini-3.5-flash",
              contents: [{
                role: 'user',
                parts: [{ text: `Melhore o texto abaixo, corrigindo pontuação, organizando diálogos com travessões, e ajustando a fluidez. Não modifique a essência da história. Retorne apenas o texto final.\n\nTexto original:\n${text}` }]
              }]
            });
            res.setHeader('Content-Type', 'application/json');
            res.end(JSON.stringify({ text: response.text }));
          } catch (error) {
            console.error(error);
            res.statusCode = 500;
            res.end(JSON.stringify({ error: 'Failed' }));
          }
        });
        return;
      }
      if (req.url === '/api/generate-cover' && req.method === 'POST') {
        let body = '';
        req.on('data', chunk => {
          body += chunk.toString();
        });
        req.on('end', async () => {
          try {
            const ai = getAiClient();
            const { prompt } = JSON.parse(body);
            const response = await generateContentWithRetry(ai, {
              model: 'gemini-2.5-flash-image',
              contents: {
                parts: [
                  {text: `A highly detailed book cover artwork painting, fantasy or thematic style, without any text. ${prompt}`},
                ],
              },
              config: {
                imageConfig: {
                  aspectRatio: "3:4",
                }
              }
            });
            let base64Image = '';
            for (const part of response.candidates[0].content.parts) {
              if (part.inlineData) {
                base64Image = part.inlineData.data;
                break;
              }
            }
            if (!base64Image) throw new Error("No image generated");
            res.setHeader('Content-Type', 'application/json');
            res.end(JSON.stringify({ image: `data:image/png;base64,${base64Image}` }));
          } catch (error) {
            console.error(error);
            res.statusCode = 500;
            res.end(JSON.stringify({ error: 'Failed' }));
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
