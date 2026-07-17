const fs = require('fs');
let html = fs.readFileSync('index.html', 'utf8');

const oldPreviewFunc = `        // PAGINAÇÃO INTELIGENTE (SEM CORTAR PALAVRAS)
        function goToPreview() {
            const container = document.getElementById('pages-container');
            const fullText = document.getElementById('main-textarea').innerText;
            const titulo = document.getElementById('in-title').value || "Título da Obra";
            const autor = document.getElementById('in-author').value || "Seu Nome";

            document.getElementById('prev-title').innerText = titulo;
            container.innerHTML = "";

            // 1. ADICIONAR CAPA
            if(capaUrl) {
                container.innerHTML += \`
                    <div class="book-page-pro" style="padding:0; justify-content:center;">
                        <img src="\${capaUrl}" class="w-full h-full object-cover">
                    </div>
                \`;
            }

            // 2. ADICIONAR FOLHA DE ROSTO
            container.innerHTML += \`
                <div class="book-page-pro text-center justify-center">
                    <h1 class="font-bold mb-[4cqw]" style="font-size: 8cqw; line-height: 1.2;">\${titulo}</h1>
                    <p class="italic" style="font-size: 4.5cqw;">\${autor}</p>
                    <div class="mt-[15cqw] border-t border-slate-200 pt-[4cqw] uppercase tracking-widest" style="font-size: 2.5cqw;">RF Publishing</div>
                </div>
            \`;

            // 3. PAGINAÇÃO INTELIGENTE (PRESERVANDO PARÁGRAFOS)
            const paragraphs = fullText.split(/\\n+/);
            let pages = [];
            let currentText = "";
            const maxCharsPerPage = 700; // Ajustado para caber perfeitamente na página

            paragraphs.forEach((p) => {
                if (!p.trim()) return;
                
                let words = p.split(/\\s+/);
                words.forEach((word) => {
                    if ((currentText + " " + word).length > maxCharsPerPage) {
                        pages.push(currentText.trim());
                        currentText = word;
                    } else {
                        currentText += (currentText ? " " : "") + word;
                    }
                });
                
                currentText += "\\n"; // Quebra de parágrafo no HTML renderizado
            });
            if (currentText.trim()) pages.push(currentText.trim());

            // Renderizar as páginas de conteúdo
            pages.forEach((content, i) => {
                let num = i + 1;
                container.innerHTML += \`
                    <div class="book-page-pro relative">
                        <div class="flex justify-between uppercase tracking-widest text-slate-400 border-b pb-[2cqw] mb-[5cqw]" style="font-size: 2.2cqw;">
                            <span>\${titulo}</span><span>\${autor}</span>
                        </div>
                        <div class="text-center text-slate-500 mb-[5cqw]" style="font-size: 2.6cqw;">\${num}</div>
                        <div class="text-content">
                            \${i === 0 ? \`<h3 class="font-bold mb-[6cqw]" style="font-size: 5cqw;">Capítulo Primeiro</h3>\` : ''}
                            \${content.split('\\n').map(p => p.trim() ? \`<p>\${p.trim()}</p>\` : '').join('')}
                        </div>
                    </div>
                \`;
            });

            switchTab('screen-design');
        }`;

const newPreviewFunc = `        // PAGINAÇÃO COM BASE NO FORMATO E QUEBRAS DE PÁGINA MANUAIS
        function goToPreview() {
            const container = document.getElementById('pages-container');
            const fullHtml = document.getElementById('main-textarea').innerHTML;
            const titulo = document.getElementById('in-title').value || "Título da Obra";
            const autor = document.getElementById('in-author').value || "Seu Nome";

            document.getElementById('prev-title').innerText = titulo;
            container.innerHTML = "";

            // 1. ADICIONAR CAPA
            if(capaUrl) {
                container.innerHTML += \`
                    <div class="book-page-pro" style="padding:0; justify-content:center;">
                        <img src="\${capaUrl}" class="w-full h-full object-cover">
                    </div>
                \`;
            }

            // 2. ADICIONAR FOLHA DE ROSTO
            container.innerHTML += \`
                <div class="book-page-pro text-center justify-center">
                    <h1 class="font-bold mb-[4cqw]" style="font-size: 8cqw; line-height: 1.2;">\${titulo}</h1>
                    <p class="italic" style="font-size: 4.5cqw;">\${autor}</p>
                    <div class="mt-[15cqw] border-t border-slate-200 pt-[4cqw] uppercase tracking-widest" style="font-size: 2.5cqw;">RF Publishing</div>
                </div>
            \`;

            // 3. PAGINAÇÃO MANUAL / HTML LIVRE
            const rawPages = fullHtml.split(/<hr[^>]*class="[^"]*page-break[^"]*"[^>]*>/i);
            
            // Renderizar as páginas de conteúdo
            rawPages.forEach((content, i) => {
                if(!content.trim() && i === 0 && rawPages.length > 1) return; // ignore empty first page
                let num = i + 1;
                container.innerHTML += \`
                    <div class="book-page-pro relative">
                        <div class="flex justify-between uppercase tracking-widest text-slate-400 border-b pb-[2cqw] mb-[5cqw]" style="font-size: 2.2cqw;">
                            <span>\${titulo}</span><span>\${autor}</span>
                        </div>
                        <div class="text-center text-slate-500 mb-[5cqw]" style="font-size: 2.6cqw;">\${num}</div>
                        <div class="text-content page-html-content text-left" style="font-size: 3cqw; line-height: 1.6;">
                            \${content}
                        </div>
                    </div>
                \`;
            });

            switchTab('screen-design');
        }`;

html = html.replace(oldPreviewFunc, newPreviewFunc);
fs.writeFileSync('index.html', html);
