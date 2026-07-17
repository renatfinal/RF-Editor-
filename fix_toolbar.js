const fs = require('fs');
let html = fs.readFileSync('index.html', 'utf8');

// The original Paginas button
const paginasBtn = `<button onclick="addPageBreak()" class="px-4 py-2 bg-purple-500/20 text-purple-400 font-bold rounded-full flex items-center gap-2 border border-purple-500/40 hover:bg-purple-500/30 shadow-lg transition-all"><span class="material-symbols-outlined text-sm">note_add</span> Páginas</button>`;

// Remove it from the main buttons group
if(html.includes(paginasBtn)) {
    html = html.replace(paginasBtn, '');
} else {
    // try to match with varying whitespace
    const btnRegex = /<button[^>]*onclick="addPageBreak\(\)"[^>]*>.*?<\/button>/s;
    const match = html.match(btnRegex);
    if(match) {
        html = html.replace(match[0], '');
    }
}

// Now replace the editor toolbar div start and add the Paginas button to it
const oldToolbarStart = `<div id="editor-toolbar" class="hidden flex gap-2 mb-4 p-2 bg-slate-800 rounded-lg flex-wrap items-center">`;
const newToolbarStart = `<div id="editor-toolbar" class="hidden flex gap-2 mb-4 p-2 bg-slate-800/95 backdrop-blur-md rounded-lg flex-wrap items-center sticky top-16 z-40 shadow-xl border border-white/10">
                <button onclick="addPageBreak()" class="p-2 hover:bg-slate-700 rounded flex items-center text-purple-400 font-bold" title="Nova Página"><span class="material-symbols-outlined text-sm mr-1">note_add</span> Páginas</button>
                <div class="w-px h-6 bg-slate-600 mx-1"></div>`;

html = html.replace(oldToolbarStart, newToolbarStart);

fs.writeFileSync('index.html', html);
console.log("Updated toolbar to be sticky and moved Paginas button into it.");
