const fs = require('fs');
let html = fs.readFileSync('index.html', 'utf8');

const epubOld1 = `                const fullText = document.getElementById('main-textarea').innerText;`;
const epubNew1 = `                const fullText = document.getElementById('main-textarea').innerText;
                const fullHtml = document.getElementById('main-textarea').innerHTML;`;
html = html.replace(epubOld1, epubNew1);

const epubOld2 = `                // Conteúdo formatado
                let htmlContent = \`<?xml version="1.0" encoding="UTF-8"?>
<html xmlns="http://www.w3.org/1999/xhtml" xmlns:epub="http://www.idpf.org/2007/ops">
<head>
    <title>\${escapeHtml(titulo)}</title>
    <link rel="stylesheet" type="text/css" href="style.css"/>
</head>
<body>
    <div style="text-align: center; margin-bottom: 3em;">
        <h1>\${escapeHtml(titulo)}</h1>
        <h3>\${escapeHtml(autor)}</h3>
        <br/><br/>
        <p><i>RF Publishing</i></p>
    </div>
    <div style="page-break-before: always;"></div>
    <h2>Capítulo Primeiro</h2>
\`;
                
                const paragraphs = fullText.split(/\\n+/);
                paragraphs.forEach(p => {
                    if(p.trim()) {
                        htmlContent += \`    <p>\${escapeHtml(p.trim())}</p>\\n\`;
                    }
                });
                
                htmlContent += \`</body>\\n</html>\`;`;

const epubNew2 = `                // Conteúdo formatado
                let htmlContent = \`<?xml version="1.0" encoding="UTF-8"?>
<html xmlns="http://www.w3.org/1999/xhtml" xmlns:epub="http://www.idpf.org/2007/ops">
<head>
    <title>\${escapeHtml(titulo)}</title>
    <link rel="stylesheet" type="text/css" href="style.css"/>
</head>
<body>
    <div style="text-align: center; margin-bottom: 3em;">
        <h1>\${escapeHtml(titulo)}</h1>
        <h3>\${escapeHtml(autor)}</h3>
        <br/><br/>
        <p><i>RF Publishing</i></p>
    </div>
\`;
                const rawPages = fullHtml.split(/<hr[^>]*class="[^"]*page-break[^"]*"[^>]*>/i);
                rawPages.forEach((pageContent, index) => {
                    if(!pageContent.trim() && index === 0 && rawPages.length > 1) return;
                    htmlContent += \`
                        <div class="chapter" style="page-break-before: always; margin-top: 2em;">
                            \${pageContent}
                        </div>
                    \`;
                });
                
                htmlContent += \`</body>\\n</html>\`;`;

html = html.replace(epubOld2, epubNew2);
fs.writeFileSync('index.html', html);
