    <script>pdfjsLib.GlobalWorkerOptions.workerSrc = 'https://cdnjs.cloudflare.com/ajax/libs/pdf.js/3.11.174/pdf.worker.min.js';</script>
    <script src="https://cdn.tailwindcss.com?plugins=forms,container-queries"></script>
    <script>
        tailwind.config = {
            darkMode: "class",
            theme: {
                extend: {
                    colors: {
                        "primary": "#b8c3ff",
                        "secondary-container": "#01f5a0",
                        "background": "#0b1326",
                        "surface": "#171f33",
                        "on-surface-variant": "#c4c5d9",
                        "page-cream": "#fffcf5"
                    }
                }
            }
        }
    </script>
    <script>
        let capaUrl = "";

        function toggleToolbar() {
            const tb = document.getElementById('editor-toolbar');
            tb.classList.toggle('hidden');
        }

        function formatDoc(cmd, value=null) {
            document.execCommand(cmd, false, value);
            document.getElementById('main-textarea').focus();
        }

        let currentFontSize = 3;
        function increaseFontSize() {
            if(currentFontSize < 7) currentFontSize++;
            document.execCommand('fontSize', false, currentFontSize);
            document.getElementById('main-textarea').focus();
        }

        function decreaseFontSize() {
            if(currentFontSize > 1) currentFontSize--;
            document.execCommand('fontSize', false, currentFontSize);
            document.getElementById('main-textarea').focus();
        }

        function addPageBreak() {
            document.getElementById('main-textarea').focus();
            const hr = '<hr class="page-break" style="border: 0; border-top: 2px dashed #01f5a0; margin: 2rem 0; width: 100%; page-break-after: always; display: block; text-align: center; position: relative;" title="Nova Página">';
            document.execCommand('insertHTML', false, hr + '<p><br></p>');
        }


        function switchTab(screenId) {
            document.querySelectorAll('.screen').forEach(s => s.classList.add('hidden-screen'));
            document.getElementById(screenId).classList.remove('hidden-screen');
            document.querySelectorAll('.nav-btn').forEach(btn => btn.classList.remove('nav-active'));
            window.scrollTo(0,0);
        }

        function clearEditor() { if(confirm("Apagar livro?")) document.getElementById('main-textarea').innerText = ""; }

        async function handleImport(event) {
            const file = event.target.files[0];
            if (!file) return;
            
            const btn = document.querySelector(`button[onclick="document.getElementById('file-input').click()"]`);
            const originalContent = btn.innerHTML;
            btn.innerHTML = `<span class="material-symbols-outlined animate-spin" style="animation: spin 1s linear infinite;">sync</span> Importando...`;
            btn.disabled = true;

            try {
                if (file.name.endsWith('.docx')) {
                    const arrayBuffer = await file.arrayBuffer();
                    const result = await mammoth.extractRawText({arrayBuffer: arrayBuffer});
                    document.getElementById('main-textarea').innerText = result.value;
                    switchTab('screen-editor');
                } else if (file.name.endsWith('.pdf')) {
                    const arrayBuffer = await file.arrayBuffer();
                    const pdf = await pdfjsLib.getDocument({data: arrayBuffer}).promise;
                    let text = "";
                    for (let i = 1; i <= pdf.numPages; i++) {
                        const page = await pdf.getPage(i);
                        const content = await page.getTextContent();
                        const strings = content.items.map(item => item.str);
                        text += strings.join(" ") + "\\n\\n";
                    }
                    document.getElementById('main-textarea').innerText = text;
                    switchTab('screen-editor');
                } else if (file.name.endsWith('.txt')) {
                    const text = await file.text();
                    document.getElementById('main-textarea').innerText = text;
                    switchTab('screen-editor');
                } else {
                    alert("Formato de arquivo não suportado. Por favor, use .docx, .pdf ou .txt");
                }
            } catch (error) {
                console.error("Erro ao importar o arquivo:", error);
                alert("Ocorreu um erro ao tentar importar o arquivo.");
            } finally {
                btn.innerHTML = originalContent;
                btn.disabled = false;
                event.target.value = ''; // Limpar o input para permitir nova seleção do mesmo arquivo
            }
        }

        function uploadCapa(event) {
            const file = event.target.files[0];
            if(file) {
                const reader = new FileReader();
                reader.onload = function(e) {
                    capaUrl = e.target.result; // Data URL em base64
                    document.getElementById('cover-preview-box').style.backgroundImage = `url(${capaUrl})`;
                    document.getElementById('cover-preview-box').querySelector('div').style.display = 'none';
                }
                reader.readAsDataURL(file);
            }
        }

        function uploadProfilePhoto(event) {
            const file = event.target.files[0];
            if(file) {
                const reader = new FileReader();
                reader.onload = function(e) {
                    const profileUrl = e.target.result;
                    const previewBox = document.getElementById('profile-preview-box');
                    previewBox.style.backgroundImage = `url(${profileUrl})`;
                    document.getElementById('profile-placeholder').style.display = 'none';
                    
                    const headerIcon = document.getElementById('header-profile-icon');
                    headerIcon.style.backgroundImage = `url(${profileUrl})`;
                    document.getElementById('header-profile-placeholder').style.display = 'none';
                }
                reader.readAsDataURL(file);
            }
        }

        function saveProfile() {
            const btn = document.querySelector('button[onclick="saveProfile()"]');
            const originalContent = btn.innerHTML;
            btn.innerHTML = `<span class="material-symbols-outlined">check</span> Entendido!`;
            setTimeout(() => {
                btn.innerHTML = originalContent;
            }, 2000);
        }

        function logout() {
            const btn = document.querySelector('button[onclick="logout()"]');
            const originalContent = btn.innerHTML;
            btn.innerHTML = `<span class="material-symbols-outlined">logout</span> Deslogado`;
            setTimeout(() => {
                btn.innerHTML = originalContent;
                switchTab('screen-create');
            }, 1000);
        }

        async function createPlan() {
            const prompt = document.getElementById('book-idea').value;
            if(!prompt) {
                alert('Descreva a ideia central do livro.');
                return;
            }
            
            const btn = document.querySelector('button[onclick="createPlan()"]');
            let interval;
            if(btn) {
                btn.disabled = true;
                btn.classList.add('animate-pulse', 'opacity-80');
                let dotCount = 0;
                interval = setInterval(() => {
                    dotCount = (dotCount + 1) % 4;
                    btn.innerText = 'Gerando planejamento' + '.'.repeat(dotCount);
                }, 500);
            }
            
            try {
                const response = await fetch('/api/generate', {
                    method: 'POST',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify({ prompt })
                });
                
                if(!response.ok) throw new Error('API Error');
                
                const data = await response.json();
                document.getElementById('main-textarea').innerText = data.text;
                
                if(btn) {
                    clearInterval(interval);
                    btn.innerText = 'Livro gerado com sucesso!';
                    btn.classList.remove('bg-secondary-container', 'text-black', 'animate-pulse', 'opacity-80');
                    btn.classList.add('bg-green-500', 'text-white');
                }
                
                setTimeout(() => {
                    switchTab('screen-editor');
                    if(btn) {
                        btn.innerText = 'Gerar Planejamento';
                        btn.classList.remove('bg-green-500', 'text-white');
                        btn.classList.add('bg-secondary-container', 'text-black');
                        btn.disabled = false;
                    }
                }, 1500);
            } catch(error) {
                console.error(error);
                alert('Erro ao gerar o planejamento.');
                if(btn) {
                    clearInterval(interval);
                    btn.innerText = 'Gerar Planejamento';
                    btn.classList.remove('animate-pulse', 'opacity-80');
                    btn.disabled = false;
                }
            }
        }
        
        async function applyMagicIA() {
            let txt = document.getElementById('main-textarea').innerText;
            const btn = document.querySelector('button[onclick="applyMagicIA()"]');
            
            if (!txt.trim()) {
                const originalContent = btn.innerHTML;
                btn.innerHTML = `<span class="material-symbols-outlined text-sm">warning</span> Editor vazio`;
                setTimeout(() => btn.innerHTML = originalContent, 2000);
                return;
            }

            const originalContent = btn.innerHTML;
            btn.innerHTML = `<span class="material-symbols-outlined text-sm animate-spin" style="animation: spin 1s linear infinite;">sync</span> Refinando...`;
            btn.disabled = true;

            try {
                const response = await fetch('/api/magic-ia', {
                    method: 'POST',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify({ text: txt })
                });

                if(!response.ok) throw new Error("Erro na API.");

                let data = await response.json();
                document.getElementById('main-textarea').innerText = data.text;
                
                btn.innerHTML = `<span class="material-symbols-outlined text-sm text-green-400">check</span> Concluído`;
                setTimeout(() => btn.innerHTML = originalContent, 2000);
            } catch (error) {
                console.error(error);
                btn.innerHTML = `<span class="material-symbols-outlined text-sm text-red-400">error</span> Erro`;
                setTimeout(() => btn.innerHTML = originalContent, 2000);
            } finally {
                btn.disabled = false;
            }
        }

        let clearConfirmSteps = 0;
        function clearEditor() {
            const btn = document.querySelector('button[onclick="clearEditor()"]');
            if (clearConfirmSteps === 0) {
                clearConfirmSteps = 1;
                const originalContent = btn.innerHTML;
                btn.innerHTML = `<span class="material-symbols-outlined text-sm">warning</span> Confirmar`;
                setTimeout(() => {
                    if (clearConfirmSteps === 1) {
                        clearConfirmSteps = 0;
                        btn.innerHTML = originalContent;
                    }
                }, 3000);
            } else {
                document.getElementById('main-textarea').innerText = '';
                document.getElementById('in-title').value = '';
                document.getElementById('in-author').value = '';
                clearConfirmSteps = 0;
                btn.innerHTML = `<span class="material-symbols-outlined text-sm text-green-400">check</span> Limpo`;
                setTimeout(() => {
                    btn.innerHTML = `<span class="material-symbols-outlined text-sm">delete</span> Limpar`;
                }, 2000);
            }
        }

        async function generateCoverWithIA() {
            const coverPrompt = document.getElementById('cover-prompt-input').value;
            const btn = document.getElementById('btn-generate-cover');
            
            if (!coverPrompt.trim()) {
                const originalContent = btn.innerHTML;
                btn.innerHTML = `<span class="material-symbols-outlined text-sm text-red-400">warning</span> Digite uma descrição`;
                setTimeout(() => btn.innerHTML = originalContent, 2000);
                return;
            }

            const originalContent = btn.innerHTML;
            btn.innerHTML = `<span class="material-symbols-outlined text-sm animate-spin" style="animation: spin 1s linear infinite;">sync</span> Gerando...`;
            btn.disabled = true;

            try {
                // Using Pollinations AI for free image generation
                const encodedPrompt = encodeURIComponent(`A highly detailed book cover artwork painting, fantasy or thematic style, without any text. ${coverPrompt}`);
                const imageUrl = `https://image.pollinations.ai/prompt/${encodedPrompt}?width=600&height=800&nologo=true`;
                
                // Preload the image to ensure it's loaded before showing
                await new Promise((resolve, reject) => {
                    const img = new Image();
                    img.onload = resolve;
                    img.onerror = reject;
                    img.src = imageUrl;
                });
                
                // set capa
                capaUrl = imageUrl;
                document.getElementById('cover-preview-box').style.backgroundImage = `url(${capaUrl})`;
                document.getElementById('cover-preview-box').querySelector('div').style.display = 'none';

                btn.innerHTML = `<span class="material-symbols-outlined text-sm text-green-400">check</span> Capa Gerada`;
                setTimeout(() => btn.innerHTML = originalContent, 2000);
            } catch (error) {
                console.error(error);
                btn.innerHTML = `<span class="material-symbols-outlined text-sm text-red-400">error</span> Falha ao Gerar`;
                setTimeout(() => btn.innerHTML = originalContent, 2000);
            } finally {
                btn.disabled = false;
            }
        }

        async function checkGrammar() {
            const txt = document.getElementById('main-textarea').innerText;
            if(!txt.trim()) {
                alert("O editor está vazio.");
                return;
            }

            const btn = document.getElementById('btn-grammar');
            const originalTextContent = btn.innerHTML;
            btn.innerHTML = `<span class="material-symbols-outlined text-sm animate-spin" style="animation: spin 1s linear infinite;">sync</span> Analisando...`;
            btn.disabled = true;

            try {
                const response = await fetch('/api/check-grammar', {
                    method: 'POST',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify({ text: txt })
                });

                if(!response.ok) throw new Error("Erro na API.");

                let suggestions = await response.json();
                
                // Show panel
                document.getElementById('grammar-panel').classList.remove('translate-x-full');
                
                const grammarContainer = document.getElementById('grammar-suggestions');
                grammarContainer.innerHTML = '';

                if (!Array.isArray(suggestions) || suggestions.length === 0) {
                    grammarContainer.innerHTML = '<p class="text-green-400 text-sm">Nenhum erro encontrado! Ótimo trabalho.</p>';
                } else {
                    suggestions.forEach((item, index) => {
                        grammarContainer.innerHTML += `
                            <div class="bg-black/20 p-4 rounded-xl border border-white/10" id="sugg-${index}">
                                <p class="text-xs text-red-400 line-through mb-1">${escapeHtml(item.original)}</p>
                                <p class="text-sm text-green-400 font-bold mb-2">${escapeHtml(item.suggestion)}</p>
                                <p class="text-xs text-on-surface-variant mb-4">${escapeHtml(item.explanation)}</p>
                                <button onclick="applySuggestion('${escapeHtml(item.original).replace(/'/g, "\\'")}', '${escapeHtml(item.suggestion).replace(/'/g, "\\'")}', ${index})" class="w-full bg-primary/20 text-primary py-2 rounded-lg text-xs font-bold hover:bg-primary/30 transition">Aplicar Correção</button>
                            </div>
                        `;
                    });
                }

            } catch (err) {
                console.error(err);
                alert("Erro ao revisar texto. Tente novamente.");
            } finally {
                btn.innerHTML = originalTextContent;
                btn.disabled = false;
            }
        }

        function escapeHtml(unsafe) {
            return (unsafe || "")
                 .toString()
                 .replace(/&/g, "&amp;")
                 .replace(/</g, "&lt;")
                 .replace(/>/g, "&gt;")
                 .replace(/"/g, "&quot;")
                 .replace(/'/g, "&#039;");
        }

        function closeGrammarPanel() {
            document.getElementById('grammar-panel').classList.add('translate-x-full');
        }

        function applySuggestion(original, suggestion, index) {
            const editor = document.getElementById('main-textarea');
            
            // Highlight replaced text
            let txt = editor.innerHTML;
            editor.innerHTML = txt.replace(original, suggestion);
            
            // Remove the suggestion card
            const card = document.getElementById(`sugg-${index}`);
            if (card) card.remove();

            // Auto close pattern if empty?
            if (document.getElementById('grammar-suggestions').children.length === 0) {
                document.getElementById('grammar-suggestions').innerHTML = '<p class="text-green-400 text-sm">Todas as correções aplicadas!</p>';
            }
        }

        // PAGINAÇÃO INTELIGENTE (SEM CORTAR PALAVRAS)
        function goToPreview() {
            const container = document.getElementById('pages-container');
            const fullText = document.getElementById('main-textarea').innerText;
            const titulo = document.getElementById('in-title').value || "Título da Obra";
            const autor = document.getElementById('in-author').value || "Seu Nome";

            document.getElementById('prev-title').innerText = titulo;
            container.innerHTML = "";

            // 1. ADICIONAR CAPA
            if(capaUrl) {
                container.innerHTML += `
                    <div class="book-page-pro" style="padding:0; justify-content:center;">
                        <img src="${capaUrl}" class="w-full h-full object-cover">
                    </div>
                `;
            }

            // 2. ADICIONAR FOLHA DE ROSTO
            container.innerHTML += `
                <div class="book-page-pro text-center justify-center">
                    <h1 class="font-bold mb-[4cqw]" style="font-size: 8cqw; line-height: 1.2;">${titulo}</h1>
                    <p class="italic" style="font-size: 4.5cqw;">${autor}</p>
                    <div class="mt-[15cqw] border-t border-slate-200 pt-[4cqw] uppercase tracking-widest" style="font-size: 2.5cqw;">RF Publishing</div>
                </div>
            `;

            // 3. PAGINAÇÃO INTELIGENTE (PRESERVANDO PARÁGRAFOS)
            const paragraphs = fullText.split(/\n+/);
            let pages = [];
            let currentText = "";
            const maxCharsPerPage = 700; // Ajustado para caber perfeitamente na página

            paragraphs.forEach((p) => {
                if (!p.trim()) return;
                
                let words = p.split(/\s+/);
                words.forEach((word) => {
                    if ((currentText + " " + word).length > maxCharsPerPage) {
                        pages.push(currentText.trim());
                        currentText = word;
                    } else {
                        currentText += (currentText.endsWith("\n") || currentText === "" ? "" : " ") + word;
                    }
                });
                currentText += "\n";
            });
            if (currentText.trim()) pages.push(currentText.trim());

            // GERA AS PÁGINAS NO CONTAINER
            pages.forEach((content, i) => {
                const num = (i + 1).toString().padStart(2, '0');
                container.innerHTML += `
                    <div class="book-page-pro">
                        <div class="flex justify-between uppercase tracking-widest text-slate-400 border-b pb-[2cqw] mb-[5cqw]" style="font-size: 2.2cqw;">
                            <span>${titulo}</span><span>${autor}</span>
                        </div>
                        <div class="text-center text-slate-500 mb-[5cqw]" style="font-size: 2.6cqw;">${num}</div>
                        <div class="text-content">
                            ${i === 0 ? `<h3 class="font-bold mb-[6cqw]" style="font-size: 5cqw;">Capítulo Primeiro</h3>` : ''}
                            ${content.split('\n').map(p => p.trim() ? `<p>${p.trim()}</p>` : '').join('')}
                        </div>
                    </div>
                `;
            });

            switchTab('screen-design');
        }

        function downloadPDF() {
            // Usa o diálogo de impressão nativo com a regra @media print para um PDF perfeito 6x9 (15.24x22.86cm)
            setTimeout(() => { window.print(); }, 500);
        }.pdf`);
        }

        async function downloadEPUB() {
            if (typeof JSZip === 'undefined') {
                alert("Erro: JSZip não foi carregado.");
                return;
            }
            
            const btn = document.querySelector('button[onclick="downloadEPUB()"]');
            const originalContent = btn.innerHTML;
            btn.innerHTML = `<span class="material-symbols-outlined animate-spin" style="animation: spin 1s linear infinite;">sync</span> Gerando EPUB...`;
            btn.disabled = true;

            try {
                const zip = new JSZip();
                
                const titulo = document.getElementById('in-title').value || "Meu Livro";
                const autor = document.getElementById('in-author').value || "Autor";
                const fullText = document.getElementById('main-textarea').innerText;
                const fullHtml = document.getElementById('main-textarea').innerHTML;

                // mimetype MUST be first and NOT compressed
                zip.file("mimetype", "application/epub+zip", {compression: "STORE"});

                // META-INF
                zip.file("META-INF/container.xml", `<?xml version="1.0" encoding="UTF-8"?>
<container version="1.0" xmlns="urn:oasis:names:tc:opendocument:xmlns:container">
    <rootfiles>
        <rootfile full-path="OEBPS/content.opf" media-type="application/oebps-package+xml"/>
    </rootfiles>
</container>`);

                // Obter capa (se houver)
                let hasCover = false;
                if (capaUrl) {
                    try {
                        const resp = await fetch(capaUrl);
                        if (resp.ok) {
                            const blob = await resp.blob();
                            zip.file("OEBPS/cover.jpg", blob);
                            hasCover = true;
                        }
                    } catch (e) {
                        console.error("Erro ao carregar a capa para o EPUB", e);
                    }
                }

                // OEBPS/content.opf
                let opf = `<?xml version="1.0" encoding="UTF-8"?>
<package xmlns="http://www.idpf.org/2007/opf" version="3.0" unique-identifier="pub-id">
    <metadata xmlns:dc="http://purl.org/dc/elements/1.1/">
        <dc:title>${escapeHtml(titulo)}</dc:title>
        <dc:creator>${escapeHtml(autor)}</dc:creator>
        <dc:language>pt-BR</dc:language>
        <dc:identifier id="pub-id">urn:uuid:epub-rf-${Date.now()}</dc:identifier>
        ${hasCover ? '<meta name="cover" content="cover-image"/>' : ''}
    </metadata>
    <manifest>
        <item id="toc" href="toc.xhtml" media-type="application/xhtml+xml" properties="nav"/>
        <item id="style" href="style.css" media-type="text/css"/>
        <item id="content" href="content.xhtml" media-type="application/xhtml+xml"/>
        ${hasCover ? '<item id="cover-image" href="cover.jpg" media-type="image/jpeg"/>' : ''}
        ${hasCover ? '<item id="cover-page" href="cover.xhtml" media-type="application/xhtml+xml"/>' : ''}
    </manifest>
    <spine>
        ${hasCover ? '<itemref idref="cover-page"/>' : ''}
        <itemref idref="toc"/>
        <itemref idref="content"/>
    </spine>
</package>`;
                zip.file("OEBPS/content.opf", opf);

                // OEBPS/style.css
                zip.file("OEBPS/style.css", `
                    body { font-family: serif; line-height: 1.6; margin: 5%; text-align: justify; }
                    h1, h2, h3 { text-align: center; }
                    .cover { text-align: center; page-break-after: always; height: 100vh; display: flex; align-items: center; justify-content: center; }
                    .cover img { max-width: 100%; max-height: 100%; }
                    p { margin-bottom: 1em; text-indent: 1.5em; }
                `);

                // OEBPS/cover.xhtml
                if (hasCover) {
                    zip.file("OEBPS/cover.xhtml", `<?xml version="1.0" encoding="UTF-8"?>
<html xmlns="http://www.w3.org/1999/xhtml" xmlns:epub="http://www.idpf.org/2007/ops">
<head>
    <title>Capa</title>
    <link rel="stylesheet" type="text/css" href="style.css"/>
</head>
<body>
    <div class="cover">
        <img src="cover.jpg" alt="Cover"/>
    </div>
</body>
</html>`);
                }

                // OEBPS/toc.xhtml
                zip.file("OEBPS/toc.xhtml", `<?xml version="1.0" encoding="UTF-8"?>
<html xmlns="http://www.w3.org/1999/xhtml" xmlns:epub="http://www.idpf.org/2007/ops">
<head>
    <title>Índice</title>
    <link rel="stylesheet" type="text/css" href="style.css"/>
</head>
<body>
    <nav epub:type="toc" id="toc">
        <h1>Índice</h1>
        <ol>
            ${hasCover ? '<li><a href="cover.xhtml">Capa</a></li>' : ''}
            <li><a href="content.xhtml">Início</a></li>
        </ol>
    </nav>
</body>
</html>`);

                // Conteúdo formatado
                let htmlContent = `<?xml version="1.0" encoding="UTF-8"?>
<html xmlns="http://www.w3.org/1999/xhtml" xmlns:epub="http://www.idpf.org/2007/ops">
<head>
    <title>${escapeHtml(titulo)}</title>
    <link rel="stylesheet" type="text/css" href="style.css"/>
</head>
<body>
    <div style="text-align: center; margin-bottom: 3em;">
        <h1>${escapeHtml(titulo)}</h1>
        <h3>${escapeHtml(autor)}</h3>
        <br/><br/>
        <p><i>RF Publishing</i></p>
    </div>
`;
                const rawPages = fullHtml.split(/<hr[^>]*class="[^"]*page-break[^"]*"[^>]*>/i);
                rawPages.forEach((pageContent, index) => {
                    if(!pageContent.trim() && index === 0 && rawPages.length > 1) return;
                    htmlContent += `
                        <div class="chapter" style="page-break-before: always; margin-top: 2em;">
                            ${pageContent}
                        </div>
                    `;
                });
                
                htmlContent += `</body>\n</html>`;
                
                zip.file("OEBPS/content.xhtml", htmlContent);

                // Gerar e Baixar
                const content = await zip.generateAsync({type: "blob", mimeType: "application/epub+zip"});
                const url = URL.createObjectURL(content);
                const a = document.createElement("a");
                a.href = url;
                a.download = `${titulo.replace(/\s+/g, '_')}.epub`;
                a.click();
                URL.revokeObjectURL(url);
                
                btn.innerHTML = `<span class="material-symbols-outlined text-green-400">check</span> Concluído`;
                setTimeout(() => { btn.innerHTML = originalContent; }, 2000);
            } catch(error) {
                console.error("Erro ao gerar EPUB:", error);
                btn.innerHTML = `<span class="material-symbols-outlined text-red-400">error</span> Erro`;
                setTimeout(() => { btn.innerHTML = originalContent; }, 2000);
            } finally {
                btn.disabled = false;
            }
        }
        
        switchTab('screen-create');
    </script>
