const fs = require('fs');
let html = fs.readFileSync('index.html', 'utf8');

// 1. Rename "Importar Documento" and add "Organizar" and "Páginas" buttons
const oldButtons = `<button onclick="document.getElementById('file-input').click()" class="px-4 py-2 bg-primary/20 text-primary font-bold rounded-full flex items-center gap-2 border border-primary/40 hover:bg-primary/30 shadow-lg transition-all"><span class="material-symbols-outlined text-sm">upload_file</span> Importar Documento</button>`;
const newButtons = `<button onclick="document.getElementById('file-input').click()" class="px-4 py-2 bg-primary/20 text-primary font-bold rounded-full flex items-center gap-2 border border-primary/40 hover:bg-primary/30 shadow-lg transition-all"><span class="material-symbols-outlined text-sm">upload_file</span> Import Doc</button>
                <button onclick="toggleToolbar()" class="px-4 py-2 bg-blue-500/20 text-blue-400 font-bold rounded-full flex items-center gap-2 border border-blue-500/40 hover:bg-blue-500/30 shadow-lg transition-all"><span class="material-symbols-outlined text-sm">edit</span> Organizar</button>
                <button onclick="addPageBreak()" class="px-4 py-2 bg-purple-500/20 text-purple-400 font-bold rounded-full flex items-center gap-2 border border-purple-500/40 hover:bg-purple-500/30 shadow-lg transition-all"><span class="material-symbols-outlined text-sm">note_add</span> Páginas</button>`;
html = html.replace(oldButtons, newButtons);

// 2. Add Editor Toolbar
const fileInputStr = `<input type="file" id="file-input" hidden accept=".docx,.pdf,.txt" onchange="handleImport(event)">`;
const toolbarHtml = `
            <div id="editor-toolbar" class="hidden flex gap-2 mb-4 p-2 bg-slate-800 rounded-lg flex-wrap items-center">
                <button onclick="formatDoc('bold')" class="p-2 hover:bg-slate-700 rounded font-bold text-white" title="Negrito">B</button>
                <button onclick="formatDoc('italic')" class="p-2 hover:bg-slate-700 rounded italic text-white" title="Itálico">I</button>
                <button onclick="formatDoc('underline')" class="p-2 hover:bg-slate-700 rounded underline text-white" title="Sublinhado">U</button>
                <div class="w-px h-6 bg-slate-600 mx-2"></div>
                <button onclick="formatDoc('formatBlock', 'H1')" class="p-2 hover:bg-slate-700 rounded font-bold text-white" title="Título Principal">Título</button>
                <button onclick="formatDoc('formatBlock', 'H2')" class="p-2 hover:bg-slate-700 rounded font-bold text-white text-sm" title="Subtítulo">Subtítulo</button>
                <button onclick="formatDoc('formatBlock', 'P')" class="p-2 hover:bg-slate-700 rounded text-white text-sm" title="Texto Normal">Normal</button>
                <div class="w-px h-6 bg-slate-600 mx-2"></div>
                <button onclick="increaseFontSize()" class="p-2 hover:bg-slate-700 rounded flex items-center text-white" title="Aumentar Fonte"><span class="material-symbols-outlined text-sm">text_increase</span></button>
                <button onclick="decreaseFontSize()" class="p-2 hover:bg-slate-700 rounded flex items-center text-white" title="Diminuir Fonte"><span class="material-symbols-outlined text-sm">text_decrease</span></button>
            </div>
`;
html = html.replace(fileInputStr, fileInputStr + '\n' + toolbarHtml);

// 3. Add Javascript functions for Toolbar
const scriptsToInsert = `
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
`;
html = html.replace('let capaUrl = "";', 'let capaUrl = "";\n' + scriptsToInsert);

fs.writeFileSync('index.html', html);
