8:    <script src="https://cdnjs.cloudflare.com/ajax/libs/jspdf/2.5.1/jspdf.umd.min.js"></script>
9:    <script src="https://cdnjs.cloudflare.com/ajax/libs/jszip/3.10.1/jszip.min.js"></script>
10:    <script src="https://cdnjs.cloudflare.com/ajax/libs/mammoth/1.6.0/mammoth.browser.min.js"></script>
11:    <script src="https://cdnjs.cloudflare.com/ajax/libs/pdf.js/3.11.174/pdf.min.js"></script>
12:    <script>pdfjsLib.GlobalWorkerOptions.workerSrc = 'https://cdnjs.cloudflare.com/ajax/libs/pdf.js/3.11.174/pdf.worker.min.js';</script>
13:    <script src="https://cdn.tailwindcss.com?plugins=forms,container-queries"></script>
14-    <link href="https://fonts.googleapis.com/css2?family=Manrope:wght@700;800&family=Hanken+Grotesk:wght@400;600&family=Literata:wght@400;500;700&family=Material+Symbols+Outlined:wght,FILL@100..700,0..1&display=swap" rel="stylesheet"/>
15-
16:    <script>
17-        tailwind.config = {
18-            darkMode: "class",
19-            theme: {
20-                extend: {
21-                    colors: {
22-                        "primary": "#b8c3ff",
23-                        "secondary-container": "#01f5a0",
24-                        "background": "#0b1326",
25-                        "surface": "#171f33",
26-                        "on-surface-variant": "#c4c5d9",
27-                        "page-cream": "#fffcf5"
28-                    }
29-                }
30-            }
31-        }
32-    </script>
33-
34-    <style>
35-        .glass-card { background: rgba(23, 31, 51, 0.7); backdrop-filter: blur(12px); border: 1px solid rgba(51, 65, 85, 0.5); }
36-        
37-        /* Ajuste para não cobrir inputs no mobile */
38-        input, textarea, [contenteditable] {
39-            scroll-margin-top: 100px;
40-            scroll-margin-bottom: 100px;
41-        }
42-
43-        /* Estilo da Página de Livro Físico */
44-        .book-page-pro {
45-            width: 100%;
46-            max-width: 450px;
47-            background: #fffcf5;
48-            color: #1a1a1a;
49-            aspect-ratio: 6 / 9; /* Padrão Internacional 6x9 polegadas */
50-            padding: 11cqw 10cqw;
51-            box-shadow: 0 20px 50px rgba(0,0,0,0.6);
52-            font-family: 'Literata', serif;
53-            display: flex;
54-            flex-direction: column;
55-            position: relative;
56-            overflow: hidden;
57-            container-type: inline-size;
58-        }
59-
60-        .text-content {
61-            font-size: 3.55cqw;
62-            line-height: 1.8;
63-            text-align: justify;
64-            hyphens: auto; /* Evita quebras feias */
65-            word-break: break-word;
66-        }
67-
68-        /* Recuo de parágrafo clássico de livro */
69-        .text-content p {
70-            text-indent: 1.5em;
71-            margin-bottom: 0;
72-        }
73-
74-        .text-content p:first-of-type {
75-            text-indent: 0; /* Primeiro parágrafo do capítulo sem recuo */
76-        }
77-
78-        .hidden-screen { display: none; }
79-        .nav-active { color: #01f5a0 !important; border-top: 2px solid #01f5a0; padding-top: 4px; }
80-        
81-        .ai-pulse { animation: pulse 2s infinite; }
82-        @keyframes pulse {
83-            0% { box-shadow: 0 0 0 0 rgba(1, 245, 160, 0.4); }
84-            70% { box-shadow: 0 0 0 10px rgba(1, 245, 160, 0); }
85-            100% { box-shadow: 0 0 0 0 rgba(1, 245, 160, 0); }
86-        }
87-
88-        .page-html-content h1 { font-size: 2em; font-weight: bold; margin-bottom: 0.5em; text-align: center; }
89-        .page-html-content h2 { font-size: 1.5em; font-weight: bold; margin-bottom: 0.5em; }
90-        .page-html-content p { margin-bottom: 1em; }
91-        #main-textarea hr.page-break::after { content: "--- Fim da Página / Quebra ---"; display: block; text-align: center; color: #01f5a0; font-size: 0.8rem; margin-top: -0.5rem; background: #1a1a1a; width: 200px; margin-left: auto; margin-right: auto; }
92-        
93-        @media print {
94-            body * { visibility: hidden; }
95-            #screen-design, #screen-design * { visibility: visible; }
96-            #screen-design { position: absolute; left: 0; top: 0; width: 100%; background: white !important; }
97-            .book-page-pro { width: 15.24cm !important; height: 22.86cm !important; margin: 0 auto !important; padding: 1.5cm !important; box-shadow: none !important; page-break-after: always; border: none !important; }
98-            #screen-design header, #screen-design button { display: none !important; }
99-        }
100-    </style>
101-
102-</head>
103-<body class="bg-background text-white font-['Hanken_Grotesk'] min-h-screen">
104-
105-    <header class="fixed top-0 w-full z-50 bg-background/80 backdrop-blur-xl border-b border-white/10 h-16 flex items-center">
106-        <div class="flex items-center justify-between px-6 w-full max-w-4xl mx-auto">
107-            <div class="flex items-center gap-2">
108-                <span class="font-['Literata'] text-2xl font-bold tracking-tighter text-primary/80" style="letter-spacing: -2px;">RF</span>
109-                <h1 class="text-xl font-bold text-white">Editor</h1>
110-            </div>
111-            
112-            <div class="flex items-center gap-4">
113-                <button onclick="switchTab('screen-library')" class="flex items-center hover:opacity-80 transition-opacity text-on-surface-variant hover:text-white" title="Biblioteca">
114-                    <span class="material-symbols-outlined text-[28px]">library_books</span>
115-                </button>
116-                <button onclick="switchTab('screen-profile')" class="flex items-center hover:opacity-80 transition-opacity" title="Meu Perfil">
117-                    <div id="header-profile-icon" class="w-10 h-10 rounded-full bg-surface border border-white/20 flex items-center justify-center overflow-hidden bg-cover bg-center">
118-                        <span id="header-profile-placeholder" class="material-symbols-outlined text-primary text-[36px]">account_circle</span>
119-                    </div>
120-                </button>
121-            </div>
122-        </div>
123-    </header>
124-
125-    <main class="pt-24 pb-32 px-6 max-w-4xl mx-auto">
126-        
127-        <!-- TELA CREATE -->
128-        <section id="screen-create" class="screen">
129-            <div class="text-center mb-10">
130-                <div class="w-16 h-16 mx-auto mb-6 bg-secondary-container rounded-xl flex items-center justify-center text-black shadow-lg">
131-                    <span class="material-symbols-outlined text-4xl" style="font-variation-settings: 'FILL' 1;">auto_stories</span>
132-                </div>
133-                <h2 class="text-2xl font-bold mb-2">Inicie sua obra</h2>
134-                <p class="text-on-surface-variant">Descreva sua ideia para começar.</p>
135-            </div>
136-            <div class="glass-card rounded-2xl p-6">
137-                <textarea id="book-idea" class="w-full h-40 bg-black/20 border border-white/10 rounded-xl p-4 text-white resize-none" placeholder="Qual a ideia central do livro?"></textarea>
138-                <button onclick="createPlan()" class="w-full mt-6 h-14 bg-secondary-container text-black font-bold rounded-xl ai-pulse">Gerar Planejamento</button>
139-            </div>
140-        </section>
141-
142-        <!-- TELA EDITOR (MAGIC IA) -->
143-        <section id="screen-editor" class="screen hidden-screen">
144-            <div class="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
145-                <input id="in-title" type="text" placeholder="Título" class="bg-surface border-white/10 rounded-lg p-3 text-white outline-none focus:border-primary">
146-                <input id="in-author" type="text" placeholder="Autor" class="bg-surface border-white/10 rounded-lg p-3 text-white outline-none focus:border-primary">
147-            </div>
148-            <div class="flex gap-2 mb-4 flex-wrap">
149-                <button onclick="document.getElementById('file-input').click()" class="px-4 py-2 bg-primary/20 text-primary font-bold rounded-full flex items-center gap-2 border border-primary/40 hover:bg-primary/30 shadow-lg transition-all"><span class="material-symbols-outlined text-sm">upload_file</span> Import Doc</button>
150-                <button onclick="toggleToolbar()" class="px-4 py-2 bg-blue-500/20 text-blue-400 font-bold rounded-full flex items-center gap-2 border border-blue-500/40 hover:bg-blue-500/30 shadow-lg transition-all"><span class="material-symbols-outlined text-sm">edit</span> Organizar</button>
151-                <button onclick="addPageBreak()" class="px-4 py-2 bg-purple-500/20 text-purple-400 font-bold rounded-full flex items-center gap-2 border border-purple-500/40 hover:bg-purple-500/30 shadow-lg transition-all"><span class="material-symbols-outlined text-sm">note_add</span> Páginas</button>
152-                <button onclick="applyMagicIA()" class="px-4 py-2 bg-secondary-container text-black font-bold rounded-full flex items-center gap-2 ai-pulse border border-secondary-container shadow-lg hover:brightness-110 transition-all"><span class="material-symbols-outlined text-sm">auto_fix</span> Magic IA</button>
153-                <button onclick="checkGrammar()" id="btn-grammar" class="px-4 py-2 bg-blue-500/20 text-blue-400 font-bold rounded-full flex items-center gap-2 border border-blue-500/40 hover:bg-blue-500/30 shadow-lg transition-all"><span class="material-symbols-outlined text-sm">spellcheck</span> Revisar Texto</button>
154-                <button onclick="clearEditor()" class="px-4 py-2 bg-red-500/20 text-red-400 font-bold rounded-full flex items-center gap-2 border border-red-500/40 hover:bg-red-500/30 shadow-lg transition-all"><span class="material-symbols-outlined text-sm">delete</span> Limpar</button>
155-            </div>
156-            <input type="file" id="file-input" hidden accept=".docx,.pdf,.txt" onchange="handleImport(event)">
157-
158-            <div id="editor-toolbar" class="hidden flex gap-2 mb-4 p-2 bg-slate-800 rounded-lg flex-wrap items-center">
159-                <button onclick="formatDoc('bold')" class="p-2 hover:bg-slate-700 rounded font-bold text-white" title="Negrito">B</button>
160-                <button onclick="formatDoc('italic')" class="p-2 hover:bg-slate-700 rounded italic text-white" title="Itálico">I</button>
161-                <button onclick="formatDoc('underline')" class="p-2 hover:bg-slate-700 rounded underline text-white" title="Sublinhado">U</button>
162-                <div class="w-px h-6 bg-slate-600 mx-2"></div>
163-                <button onclick="formatDoc('formatBlock', 'H1')" class="p-2 hover:bg-slate-700 rounded font-bold text-white" title="Título Principal">Título</button>
164-                <button onclick="formatDoc('formatBlock', 'H2')" class="p-2 hover:bg-slate-700 rounded font-bold text-white text-sm" title="Subtítulo">Subtítulo</button>
165-                <button onclick="formatDoc('formatBlock', 'P')" class="p-2 hover:bg-slate-700 rounded text-white text-sm" title="Texto Normal">Normal</button>
166-                <div class="w-px h-6 bg-slate-600 mx-2"></div>
167-                <button onclick="increaseFontSize()" class="p-2 hover:bg-slate-700 rounded flex items-center text-white" title="Aumentar Fonte"><span class="material-symbols-outlined text-sm">text_increase</span></button>
168-                <button onclick="decreaseFontSize()" class="p-2 hover:bg-slate-700 rounded flex items-center text-white" title="Diminuir Fonte"><span class="material-symbols-outlined text-sm">text_decrease</span></button>
169-            </div>
170-
171-            
172-            <div class="bg-white rounded-2xl p-8 md:p-12 shadow-2xl min-h-[600px] mb-20 text-slate-900 overflow-y-auto">
173-                <div id="main-textarea" contenteditable="true" class="w-full min-h-[500px] outline-none leading-relaxed" placeholder="Escreva aqui..."></div>
174-            </div>
175-        </section>
176-
177-        <!-- TELA CAPA -->
178-        <section id="screen-cover" class="screen hidden-screen">
179-            <h2 class="text-2xl font-bold mb-6 text-primary">Identidade Visual</h2>
180-            <div class="grid grid-cols-1 md:grid-cols-2 gap-8">
181-                <div class="group mx-auto max-w-[300px] md:max-w-none md:mx-0">
182-                    <span class="text-xs font-bold text-on-surface-variant block mb-3 uppercase text-center md:text-left">Capa Principal</span>
183-                    <label id="cover-preview-box" class="aspect-[2/3] bg-surface rounded-xl border-2 border-dashed border-white/20 flex items-center justify-center relative overflow-hidden bg-cover bg-center block w-full cursor-pointer hover:border-primary transition-colors">
184-                        <div class="text-center p-6 bg-black/50 backdrop-blur-md rounded-lg pointer-events-none">
185-                            <span class="material-symbols-outlined text-primary text-4xl mb-2">add_photo_alternate</span>
186-                            <p class="text-sm text-white">Subir Foto da Capa</p>
187-                        </div>
188-                        <input type="file" id="cover-file" class="absolute inset-0 opacity-0 cursor-pointer w-full h-full z-10" accept="image/*" onchange="uploadCapa(event)">
189-                    </label>
190-                </div>
191-                <div class="glass-card rounded-2xl p-6 h-fit">
192-                    <h3 class="font-bold flex items-center gap-2 mb-4 text-secondary-container">
193-                        <span class="material-symbols-outlined">brush</span> Personalizar
194-                    </h3>
195-                    <p class="text-sm text-on-surface-variant mb-6">A imagem que você subir aqui será a primeira página do seu livro na visualização Pro.</p>
196-                    <input type="text" id="cover-prompt-input" placeholder="Descreva a capa (ex: fantasia épica...)" class="w-full bg-surface border-white/10 rounded-lg p-3 text-white outline-none focus:border-primary mb-4 text-sm transition-colors">
197-                    <button id="btn-generate-cover" onclick="generateCoverWithIA()" class="w-full py-4 bg-white/5 border border-white/10 rounded-xl font-bold hover:bg-white/10 transition flex items-center justify-center gap-2">
198-                        <span class="material-symbols-outlined text-secondary-container">auto_fix</span> Gerar Capa com IA
199-                    </button>
200-                </div>
201-            </div>
202-        </section>
203-
204-        <!-- TELA DESIGN PRO (PRÉVIA FINAL) -->
205-        <section id="screen-design" class="screen hidden-screen">
206-            <div class="text-center mb-12">
207-                <h2 id="prev-title" class="text-3xl font-bold mb-2">Título</h2>
208-                <div class="flex justify-center gap-2">
209-                    <span class="bg-secondary-container/20 text-secondary-container px-3 py-1 rounded-full text-[10px] font-bold uppercase tracking-wider">Edição Finalizada</span>
210-                </div>
211-            </div>
212-
213-            <div id="pages-container" class="flex flex-col items-center gap-12">
214-                <!-- Capa e Páginas geradas via JS -->
215-            </div>
216-
217-            <div class="mt-20 p-8 glass-card rounded-3xl text-center border-primary/20">
218-                <h3 class="text-xl font-bold mb-6">Sua obra está pronta para o mundo</h3>
219-                <div class="flex flex-col md:flex-row gap-4">
220-                    <button onclick="downloadPDF()" class="w-full h-16 bg-gradient-to-r from-blue-600 to-blue-500 text-white font-bold rounded-2xl shadow-2xl flex items-center justify-center gap-3 hover:scale-105 transition-transform">
221-                        <span class="material-symbols-outlined">picture_as_pdf</span> Baixar PDF (Impressão)
222-                    </button>
223-                    <button onclick="downloadEPUB()" class="w-full h-16 bg-gradient-to-r from-emerald-600 to-emerald-500 text-white font-bold rounded-2xl shadow-2xl flex items-center justify-center gap-3 hover:scale-105 transition-transform">
224-                        <span class="material-symbols-outlined">book</span> Baixar EPUB (Kindle/Leitores)
225-                    </button>
226-                </div>
227-            </div>
228-        </section>
229-
230-        <!-- TELA PERFIL -->
231-        <section id="screen-profile" class="screen hidden-screen">
232-            <h2 class="text-2xl font-bold mb-6 text-primary text-center">Meu Perfil</h2>
233-            
234-            <div class="max-w-md mx-auto glass-card p-8 rounded-2xl">
235-                <!-- Foto de Perfil -->
236-                <div class="flex flex-col items-center mb-8">
237-                    <label id="profile-preview-box" class="w-32 h-32 rounded-full bg-surface border-2 border-dashed border-white/20 flex items-center justify-center relative overflow-hidden bg-cover bg-center cursor-pointer hover:border-primary transition-colors">
238-                        <div class="text-center bg-black/50 w-full h-full flex flex-col items-center justify-center backdrop-blur-sm pointer-events-none transition-opacity hover:opacity-0" id="profile-placeholder">
239-                            <span class="material-symbols-outlined text-primary text-3xl mb-1">add_a_photo</span>
240-                        </div>
241-                        <input type="file" id="profile-file" class="absolute inset-0 opacity-0 cursor-pointer w-full h-full z-10" accept="image/*" onchange="uploadProfilePhoto(event)">
242-                    </label>
243-                    <span class="text-xs text-on-surface-variant mt-2 text-center uppercase tracking-wider">Alterar Foto</span>
244-                </div>
245-
246-                <div class="space-y-4">
247-                    <input type="text" placeholder="Nome Completo" class="w-full bg-surface border-white/10 rounded-lg p-4 text-white outline-none focus:border-primary transition-colors">
248-                    <input type="email" placeholder="E-mail" class="w-full bg-surface border-white/10 rounded-lg p-4 text-white outline-none focus:border-primary transition-colors">
249-                    <input type="tel" placeholder="Telefone" class="w-full bg-surface border-white/10 rounded-lg p-4 text-white outline-none focus:border-primary transition-colors">
250-                    <input type="password" placeholder="Senha" class="w-full bg-surface border-white/10 rounded-lg p-4 text-white outline-none focus:border-primary transition-colors">
251-                    <input type="password" placeholder="Confirmar Senha" class="w-full bg-surface border-white/10 rounded-lg p-4 text-white outline-none focus:border-primary transition-colors">
252-                    
253-                    <div class="pt-6 space-y-3">
254-                        <button onclick="saveProfile()" class="w-full bg-primary text-on-primary py-3 rounded-lg font-bold hover:brightness-110 transition-all shadow-lg flex justify-center items-center gap-2">
255-                            <span class="material-symbols-outlined">save</span> Salvar Alterações
256-                        </button>
257-                        <button onclick="logout()" class="w-full bg-red-500/20 text-red-400 py-3 rounded-lg font-bold hover:bg-red-500/30 transition-all border border-red-500/40 flex justify-center items-center gap-2">
258-                            <span class="material-symbols-outlined">logout</span> Sair
259-                        </button>
260-                    </div>
261-                </div>
262-            </div>
263-        </section>
264-
265-        <!-- TELA BIBLIOTECA -->
266-        <section id="screen-library" class="screen hidden-screen">
267-            <h2 class="text-2xl font-bold mb-6 text-primary text-center">Minha Biblioteca</h2>
268-            
269-            <div class="grid grid-cols-2 md:grid-cols-3 gap-6">
270-                <!-- Livro Placeholder -->
271-                <div class="glass-card rounded-xl p-4 flex flex-col items-center hover:border-primary/50 transition-colors cursor-pointer" onclick="switchTab('screen-editor')">
272-                    <div class="w-full aspect-[2/3] bg-surface rounded-lg mb-4 flex items-center justify-center">
273-                        <span class="material-symbols-outlined text-4xl text-on-surface-variant">menu_book</span>
274-                    </div>
275-                    <h4 class="font-bold text-sm text-center line-clamp-1">Meu Primeiro Livro</h4>
276-                    <p class="text-[10px] text-on-surface-variant mt-1">Editado há 2 dias</p>
277-                </div>
278-                
279-                <!-- Livro Placeholder -->
280-                <div class="glass-card rounded-xl p-4 flex flex-col items-center hover:border-primary/50 transition-colors cursor-pointer" onclick="switchTab('screen-editor')">
281-                    <div class="w-full aspect-[2/3] bg-surface rounded-lg mb-4 flex items-center justify-center">
282-                        <span class="material-symbols-outlined text-4xl text-on-surface-variant">menu_book</span>
283-                    </div>
284-                    <h4 class="font-bold text-sm text-center line-clamp-1">O Fim da Jornada</h4>
285-                    <p class="text-[10px] text-on-surface-variant mt-1">Editado há 5 dias</p>
286-                </div>
287-
288-                <!-- Novo Livro -->
289-                <div class="border-2 border-dashed border-white/20 rounded-xl p-4 flex flex-col items-center justify-center text-on-surface-variant hover:text-white hover:border-white/50 transition-colors cursor-pointer aspect-[2/3]" onclick="switchTab('screen-create')">
290-                    <span class="material-symbols-outlined text-4xl mb-2">add</span>
291-                    <span class="font-bold text-sm text-center">Novo Livro</span>
292-                </div>
293-            </div>
294-        </section>
295-
296-    </main>
297-
298-    <!-- Grammar Checker Panel -->
299-    <div id="grammar-panel" class="fixed right-0 top-16 bottom-16 w-80 max-w-full bg-surface/95 backdrop-blur-xl border-l border-white/10 p-6 transform translate-x-full transition-transform duration-300 z-40 overflow-y-auto">
300-        <div class="flex items-center justify-between mb-6">
301-            <h3 class="font-bold text-lg text-primary flex items-center gap-2"><span class="material-symbols-outlined">spellcheck</span> Revisão</h3>
302-            <button onclick="closeGrammarPanel()" class="text-on-surface-variant hover:text-white"><span class="material-symbols-outlined">close</span></button>
303-        </div>
304-        <div id="grammar-suggestions" class="space-y-4">
305-            <!-- Suggestions will be injected here -->
306-        </div>
307-    </div>
308-
309-    <!-- Menu Inferior -->
310-    <nav class="fixed bottom-0 left-0 w-full z-50 flex justify-around items-center px-4 pb-4 pt-2 bg-background/95 backdrop-blur-xl border-t border-white/10">
311-        <button onclick="switchTab('screen-editor')" class="nav-btn flex flex-col items-center text-on-surface-variant p-2">
312-            <span class="material-symbols-outlined">auto_fix</span>
313-            <span class="text-[10px] font-bold uppercase mt-1">Magic IA</span>
314-        </button>
315-        <button onclick="switchTab('screen-create')" class="nav-btn flex flex-col items-center text-on-surface-variant p-2">
316-            <span class="material-symbols-outlined">add_circle</span>
317-            <span class="text-[10px] font-bold uppercase mt-1">Create</span>
318-        </button>
319-        <button onclick="switchTab('screen-cover')" class="nav-btn flex flex-col items-center text-on-surface-variant p-2">
320-            <span class="material-symbols-outlined">menu_book</span>
321-            <span class="text-[10px] font-bold uppercase mt-1">Capa</span>
322-        </button>
323-        <button onclick="goToPreview()" class="nav-btn flex flex-col items-center text-on-surface-variant p-2">
324-            <span class="font-['Literata'] text-lg font-bold tracking-tighter text-current leading-none" style="margin-bottom: 5px;">RF</span>
325-            <span class="text-[10px] font-bold uppercase mt-1">Design</span>
326-        </button>
327-    </nav>
328-
329:    <script>
330-        let capaUrl = "";
331-
332-        function toggleToolbar() {
333-            const tb = document.getElementById('editor-toolbar');
334-            tb.classList.toggle('hidden');
335-        }
336-
337-        function formatDoc(cmd, value=null) {
338-            document.execCommand(cmd, false, value);
339-            document.getElementById('main-textarea').focus();
340-        }
341-
342-        let currentFontSize = 3;
343-        function increaseFontSize() {
344-            if(currentFontSize < 7) currentFontSize++;
345-            document.execCommand('fontSize', false, currentFontSize);
346-            document.getElementById('main-textarea').focus();
347-        }
348-
349-        function decreaseFontSize() {
350-            if(currentFontSize > 1) currentFontSize--;
351-            document.execCommand('fontSize', false, currentFontSize);
352-            document.getElementById('main-textarea').focus();
353-        }
354-
355-        function addPageBreak() {
356-            document.getElementById('main-textarea').focus();
357-            const hr = '<hr class="page-break" style="border: 0; border-top: 2px dashed #01f5a0; margin: 2rem 0; width: 100%; page-break-after: always; display: block; text-align: center; position: relative;" title="Nova Página">';
358-            document.execCommand('insertHTML', false, hr + '<p><br></p>');
359-        }
360-
361-
362-        function switchTab(screenId) {
363-            document.querySelectorAll('.screen').forEach(s => s.classList.add('hidden-screen'));
364-            document.getElementById(screenId).classList.remove('hidden-screen');
365-            document.querySelectorAll('.nav-btn').forEach(btn => btn.classList.remove('nav-active'));
366-            window.scrollTo(0,0);
367-        }
368-
369-        function clearEditor() { if(confirm("Apagar livro?")) document.getElementById('main-textarea').innerText = ""; }
370-
371-        async function handleImport(event) {
372-            const file = event.target.files[0];
373-            if (!file) return;
374-            
375-            const btn = document.querySelector(`button[onclick="document.getElementById('file-input').click()"]`);
376-            const originalContent = btn.innerHTML;
377-            btn.innerHTML = `<span class="material-symbols-outlined animate-spin" style="animation: spin 1s linear infinite;">sync</span> Importando...`;
378-            btn.disabled = true;
379-
380-            try {
381-                if (file.name.endsWith('.docx')) {
382-                    const arrayBuffer = await file.arrayBuffer();
383-                    const result = await mammoth.extractRawText({arrayBuffer: arrayBuffer});
384-                    document.getElementById('main-textarea').innerText = result.value;
385-                    switchTab('screen-editor');
386-                } else if (file.name.endsWith('.pdf')) {
387-                    const arrayBuffer = await file.arrayBuffer();
388-                    const pdf = await pdfjsLib.getDocument({data: arrayBuffer}).promise;
389-                    let text = "";
390-                    for (let i = 1; i <= pdf.numPages; i++) {
391-                        const page = await pdf.getPage(i);
392-                        const content = await page.getTextContent();
393-                        const strings = content.items.map(item => item.str);
394-                        text += strings.join(" ") + "\\n\\n";
395-                    }
396-                    document.getElementById('main-textarea').innerText = text;
397-                    switchTab('screen-editor');
398-                } else if (file.name.endsWith('.txt')) {
399-                    const text = await file.text();
400-                    document.getElementById('main-textarea').innerText = text;
401-                    switchTab('screen-editor');
402-                } else {
403-                    alert("Formato de arquivo não suportado. Por favor, use .docx, .pdf ou .txt");
404-                }
405-            } catch (error) {
406-                console.error("Erro ao importar o arquivo:", error);
407-                alert("Ocorreu um erro ao tentar importar o arquivo.");
408-            } finally {
409-                btn.innerHTML = originalContent;
410-                btn.disabled = false;
411-                event.target.value = ''; // Limpar o input para permitir nova seleção do mesmo arquivo
412-            }
413-        }
414-
415-        function uploadCapa(event) {
416-            const file = event.target.files[0];
417-            if(file) {
418-                const reader = new FileReader();
419-                reader.onload = function(e) {
420-                    capaUrl = e.target.result; // Data URL em base64
421-                    document.getElementById('cover-preview-box').style.backgroundImage = `url(${capaUrl})`;
422-                    document.getElementById('cover-preview-box').querySelector('div').style.display = 'none';
423-                }
424-                reader.readAsDataURL(file);
425-            }
426-        }
427-
428-        function uploadProfilePhoto(event) {
429-            const file = event.target.files[0];
430-            if(file) {
431-                const reader = new FileReader();
432-                reader.onload = function(e) {
433-                    const profileUrl = e.target.result;
434-                    const previewBox = document.getElementById('profile-preview-box');
435-                    previewBox.style.backgroundImage = `url(${profileUrl})`;
436-                    document.getElementById('profile-placeholder').style.display = 'none';
437-                    
438-                    const headerIcon = document.getElementById('header-profile-icon');
439-                    headerIcon.style.backgroundImage = `url(${profileUrl})`;
440-                    document.getElementById('header-profile-placeholder').style.display = 'none';
441-                }
442-                reader.readAsDataURL(file);
443-            }
444-        }
445-
446-        function saveProfile() {
447-            const btn = document.querySelector('button[onclick="saveProfile()"]');
448-            const originalContent = btn.innerHTML;
449-            btn.innerHTML = `<span class="material-symbols-outlined">check</span> Entendido!`;
450-            setTimeout(() => {
451-                btn.innerHTML = originalContent;
452-            }, 2000);
453-        }
454-
455-        function logout() {
456-            const btn = document.querySelector('button[onclick="logout()"]');
457-            const originalContent = btn.innerHTML;
458-            btn.innerHTML = `<span class="material-symbols-outlined">logout</span> Deslogado`;
459-            setTimeout(() => {
460-                btn.innerHTML = originalContent;
461-                switchTab('screen-create');
462-            }, 1000);
463-        }
464-
465-        async function createPlan() {
466-            const prompt = document.getElementById('book-idea').value;
467-            if(!prompt) {
468-                alert('Descreva a ideia central do livro.');
469-                return;
470-            }
471-            
472-            const btn = document.querySelector('button[onclick="createPlan()"]');
473-            let interval;
474-            if(btn) {
475-                btn.disabled = true;
476-                btn.classList.add('animate-pulse', 'opacity-80');
477-                let dotCount = 0;
478-                interval = setInterval(() => {
479-                    dotCount = (dotCount + 1) % 4;
480-                    btn.innerText = 'Gerando planejamento' + '.'.repeat(dotCount);
481-                }, 500);
482-            }
483-            
484-            try {
485-                const response = await fetch('/api/generate', {
486-                    method: 'POST',
487-                    headers: { 'Content-Type': 'application/json' },
488-                    body: JSON.stringify({ prompt })
489-                });
490-                
491-                if(!response.ok) throw new Error('API Error');
492-                
493-                const data = await response.json();
494-                document.getElementById('main-textarea').innerText = data.text;
495-                
496-                if(btn) {
497-                    clearInterval(interval);
498-                    btn.innerText = 'Livro gerado com sucesso!';
499-                    btn.classList.remove('bg-secondary-container', 'text-black', 'animate-pulse', 'opacity-80');
500-                    btn.classList.add('bg-green-500', 'text-white');
501-                }
502-                
503-                setTimeout(() => {
504-                    switchTab('screen-editor');
505-                    if(btn) {
506-                        btn.innerText = 'Gerar Planejamento';
507-                        btn.classList.remove('bg-green-500', 'text-white');
508-                        btn.classList.add('bg-secondary-container', 'text-black');
509-                        btn.disabled = false;
510-                    }
511-                }, 1500);
512-            } catch(error) {
513-                console.error(error);
514-                alert('Erro ao gerar o planejamento.');
515-                if(btn) {
516-                    clearInterval(interval);
517-                    btn.innerText = 'Gerar Planejamento';
518-                    btn.classList.remove('animate-pulse', 'opacity-80');
519-                    btn.disabled = false;
520-                }
521-            }
522-        }
523-        
524-        async function applyMagicIA() {
525-            let txt = document.getElementById('main-textarea').innerText;
526-            const btn = document.querySelector('button[onclick="applyMagicIA()"]');
527-            
528-            if (!txt.trim()) {
529-                const originalContent = btn.innerHTML;
530-                btn.innerHTML = `<span class="material-symbols-outlined text-sm">warning</span> Editor vazio`;
531-                setTimeout(() => btn.innerHTML = originalContent, 2000);
532-                return;
533-            }
534-
535-            const originalContent = btn.innerHTML;
536-            btn.innerHTML = `<span class="material-symbols-outlined text-sm animate-spin" style="animation: spin 1s linear infinite;">sync</span> Refinando...`;
537-            btn.disabled = true;
538-
539-            try {
540-                const response = await fetch('/api/magic-ia', {
541-                    method: 'POST',
542-                    headers: { 'Content-Type': 'application/json' },
543-                    body: JSON.stringify({ text: txt })
544-                });
545-
546-                if(!response.ok) throw new Error("Erro na API.");
547-
548-                let data = await response.json();
549-                document.getElementById('main-textarea').innerText = data.text;
550-                
551-                btn.innerHTML = `<span class="material-symbols-outlined text-sm text-green-400">check</span> Concluído`;
552-                setTimeout(() => btn.innerHTML = originalContent, 2000);
553-            } catch (error) {
554-                console.error(error);
555-                btn.innerHTML = `<span class="material-symbols-outlined text-sm text-red-400">error</span> Erro`;
556-                setTimeout(() => btn.innerHTML = originalContent, 2000);
557-            } finally {
558-                btn.disabled = false;
559-            }
560-        }
561-
562-        let clearConfirmSteps = 0;
563-        function clearEditor() {
564-            const btn = document.querySelector('button[onclick="clearEditor()"]');
565-            if (clearConfirmSteps === 0) {
566-                clearConfirmSteps = 1;
567-                const originalContent = btn.innerHTML;
568-                btn.innerHTML = `<span class="material-symbols-outlined text-sm">warning</span> Confirmar`;
569-                setTimeout(() => {
570-                    if (clearConfirmSteps === 1) {
571-                        clearConfirmSteps = 0;
572-                        btn.innerHTML = originalContent;
573-                    }
574-                }, 3000);
575-            } else {
576-                document.getElementById('main-textarea').innerText = '';
577-                document.getElementById('in-title').value = '';
578-                document.getElementById('in-author').value = '';
579-                clearConfirmSteps = 0;
580-                btn.innerHTML = `<span class="material-symbols-outlined text-sm text-green-400">check</span> Limpo`;
581-                setTimeout(() => {
582-                    btn.innerHTML = `<span class="material-symbols-outlined text-sm">delete</span> Limpar`;
583-                }, 2000);
584-            }
585-        }
586-
587-        async function generateCoverWithIA() {
588-            const coverPrompt = document.getElementById('cover-prompt-input').value;
589-            const btn = document.getElementById('btn-generate-cover');
590-            
591-            if (!coverPrompt.trim()) {
592-                const originalContent = btn.innerHTML;
593-                btn.innerHTML = `<span class="material-symbols-outlined text-sm text-red-400">warning</span> Digite uma descrição`;
594-                setTimeout(() => btn.innerHTML = originalContent, 2000);
595-                return;
596-            }
597-
598-            const originalContent = btn.innerHTML;
599-            btn.innerHTML = `<span class="material-symbols-outlined text-sm animate-spin" style="animation: spin 1s linear infinite;">sync</span> Gerando...`;
600-            btn.disabled = true;
601-
602-            try {
603-                // Using Pollinations AI for free image generation
604-                const encodedPrompt = encodeURIComponent(`A highly detailed book cover artwork painting, fantasy or thematic style, without any text. ${coverPrompt}`);
605-                const imageUrl = `https://image.pollinations.ai/prompt/${encodedPrompt}?width=600&height=800&nologo=true`;
606-                
607-                // Preload the image to ensure it's loaded before showing
608-                await new Promise((resolve, reject) => {
609-                    const img = new Image();
610-                    img.onload = resolve;
611-                    img.onerror = reject;
612-                    img.src = imageUrl;
613-                });
614-                
615-                // set capa
616-                capaUrl = imageUrl;
617-                document.getElementById('cover-preview-box').style.backgroundImage = `url(${capaUrl})`;
618-                document.getElementById('cover-preview-box').querySelector('div').style.display = 'none';
619-
620-                btn.innerHTML = `<span class="material-symbols-outlined text-sm text-green-400">check</span> Capa Gerada`;
621-                setTimeout(() => btn.innerHTML = originalContent, 2000);
622-            } catch (error) {
623-                console.error(error);
624-                btn.innerHTML = `<span class="material-symbols-outlined text-sm text-red-400">error</span> Falha ao Gerar`;
625-                setTimeout(() => btn.innerHTML = originalContent, 2000);
626-            } finally {
627-                btn.disabled = false;
628-            }
629-        }
630-
631-        async function checkGrammar() {
632-            const txt = document.getElementById('main-textarea').innerText;
633-            if(!txt.trim()) {
634-                alert("O editor está vazio.");
635-                return;
636-            }
637-
638-            const btn = document.getElementById('btn-grammar');
639-            const originalTextContent = btn.innerHTML;
640-            btn.innerHTML = `<span class="material-symbols-outlined text-sm animate-spin" style="animation: spin 1s linear infinite;">sync</span> Analisando...`;
641-            btn.disabled = true;
642-
643-            try {
644-                const response = await fetch('/api/check-grammar', {
645-                    method: 'POST',
646-                    headers: { 'Content-Type': 'application/json' },
647-                    body: JSON.stringify({ text: txt })
648-                });
649-
650-                if(!response.ok) throw new Error("Erro na API.");
651-
652-                let suggestions = await response.json();
653-                
654-                // Show panel
655-                document.getElementById('grammar-panel').classList.remove('translate-x-full');
656-                
657-                const grammarContainer = document.getElementById('grammar-suggestions');
658-                grammarContainer.innerHTML = '';
659-
660-                if (!Array.isArray(suggestions) || suggestions.length === 0) {
661-                    grammarContainer.innerHTML = '<p class="text-green-400 text-sm">Nenhum erro encontrado! Ótimo trabalho.</p>';
662-                } else {
663-                    suggestions.forEach((item, index) => {
664-                        grammarContainer.innerHTML += `
665-                            <div class="bg-black/20 p-4 rounded-xl border border-white/10" id="sugg-${index}">
666-                                <p class="text-xs text-red-400 line-through mb-1">${escapeHtml(item.original)}</p>
667-                                <p class="text-sm text-green-400 font-bold mb-2">${escapeHtml(item.suggestion)}</p>
668-                                <p class="text-xs text-on-surface-variant mb-4">${escapeHtml(item.explanation)}</p>
669-                                <button onclick="applySuggestion('${escapeHtml(item.original).replace(/'/g, "\\'")}', '${escapeHtml(item.suggestion).replace(/'/g, "\\'")}', ${index})" class="w-full bg-primary/20 text-primary py-2 rounded-lg text-xs font-bold hover:bg-primary/30 transition">Aplicar Correção</button>
670-                            </div>
671-                        `;
672-                    });
673-                }
674-
675-            } catch (err) {
676-                console.error(err);
677-                alert("Erro ao revisar texto. Tente novamente.");
678-            } finally {
679-                btn.innerHTML = originalTextContent;
680-                btn.disabled = false;
681-            }
682-        }
683-
684-        function escapeHtml(unsafe) {
685-            return (unsafe || "")
686-                 .toString()
687-                 .replace(/&/g, "&amp;")
688-                 .replace(/</g, "&lt;")
689-                 .replace(/>/g, "&gt;")
690-                 .replace(/"/g, "&quot;")
691-                 .replace(/'/g, "&#039;");
692-        }
693-
694-        function closeGrammarPanel() {
695-            document.getElementById('grammar-panel').classList.add('translate-x-full');
696-        }
697-
698-        function applySuggestion(original, suggestion, index) {
699-            const editor = document.getElementById('main-textarea');
700-            
701-            // Highlight replaced text
702-            let txt = editor.innerHTML;
703-            editor.innerHTML = txt.replace(original, suggestion);
704-            
705-            // Remove the suggestion card
706-            const card = document.getElementById(`sugg-${index}`);
707-            if (card) card.remove();
708-
709-            // Auto close pattern if empty?
710-            if (document.getElementById('grammar-suggestions').children.length === 0) {
711-                document.getElementById('grammar-suggestions').innerHTML = '<p class="text-green-400 text-sm">Todas as correções aplicadas!</p>';
712-            }
713-        }
714-
715-        // PAGINAÇÃO INTELIGENTE (SEM CORTAR PALAVRAS)
716-        function goToPreview() {
717-            const container = document.getElementById('pages-container');
718-            const fullText = document.getElementById('main-textarea').innerText;
719-            const titulo = document.getElementById('in-title').value || "Título da Obra";
720-            const autor = document.getElementById('in-author').value || "Seu Nome";
721-
722-            document.getElementById('prev-title').innerText = titulo;
723-            container.innerHTML = "";
724-
725-            // 1. ADICIONAR CAPA
726-            if(capaUrl) {
727-                container.innerHTML += `
728-                    <div class="book-page-pro" style="padding:0; justify-content:center;">
729-                        <img src="${capaUrl}" class="w-full h-full object-cover">
730-                    </div>
731-                `;
732-            }
733-
734-            // 2. ADICIONAR FOLHA DE ROSTO
735-            container.innerHTML += `
736-                <div class="book-page-pro text-center justify-center">
737-                    <h1 class="font-bold mb-[4cqw]" style="font-size: 8cqw; line-height: 1.2;">${titulo}</h1>
738-                    <p class="italic" style="font-size: 4.5cqw;">${autor}</p>
739-                    <div class="mt-[15cqw] border-t border-slate-200 pt-[4cqw] uppercase tracking-widest" style="font-size: 2.5cqw;">RF Publishing</div>
740-                </div>
741-            `;
742-
743-            // 3. PAGINAÇÃO INTELIGENTE (PRESERVANDO PARÁGRAFOS)
744-            const paragraphs = fullText.split(/\n+/);
745-            let pages = [];
746-            let currentText = "";
747-            const maxCharsPerPage = 700; // Ajustado para caber perfeitamente na página
748-
749-            paragraphs.forEach((p) => {
750-                if (!p.trim()) return;
751-                
752-                let words = p.split(/\s+/);
753-                words.forEach((word) => {
754-                    if ((currentText + " " + word).length > maxCharsPerPage) {
755-                        pages.push(currentText.trim());
756-                        currentText = word;
757-                    } else {
758-                        currentText += (currentText.endsWith("\n") || currentText === "" ? "" : " ") + word;
759-                    }
760-                });
761-                currentText += "\n";
762-            });
763-            if (currentText.trim()) pages.push(currentText.trim());
764-
765-            // GERA AS PÁGINAS NO CONTAINER
766-            pages.forEach((content, i) => {
767-                const num = (i + 1).toString().padStart(2, '0');
768-                container.innerHTML += `
769-                    <div class="book-page-pro">
770-                        <div class="flex justify-between uppercase tracking-widest text-slate-400 border-b pb-[2cqw] mb-[5cqw]" style="font-size: 2.2cqw;">
771-                            <span>${titulo}</span><span>${autor}</span>
772-                        </div>
773-                        <div class="text-center text-slate-500 mb-[5cqw]" style="font-size: 2.6cqw;">${num}</div>
774-                        <div class="text-content">
775-                            ${i === 0 ? `<h3 class="font-bold mb-[6cqw]" style="font-size: 5cqw;">Capítulo Primeiro</h3>` : ''}
776-                            ${content.split('\n').map(p => p.trim() ? `<p>${p.trim()}</p>` : '').join('')}
777-                        </div>
778-                    </div>
779-                `;
780-            });
781-
782-            switchTab('screen-design');
783-        }
784-
785-        function downloadPDF() {
786-            // Usa o diálogo de impressão nativo com a regra @media print para um PDF perfeito 6x9 (15.24x22.86cm)
787-            setTimeout(() => { window.print(); }, 500);
788-        }.pdf`);
789-        }
790-
791-        async function downloadEPUB() {
792-            if (typeof JSZip === 'undefined') {
793-                alert("Erro: JSZip não foi carregado.");
794-                return;
795-            }
796-            
797-            const btn = document.querySelector('button[onclick="downloadEPUB()"]');
798-            const originalContent = btn.innerHTML;
799-            btn.innerHTML = `<span class="material-symbols-outlined animate-spin" style="animation: spin 1s linear infinite;">sync</span> Gerando EPUB...`;
800-            btn.disabled = true;
801-
802-            try {
803-                const zip = new JSZip();
804-                
805-                const titulo = document.getElementById('in-title').value || "Meu Livro";
806-                const autor = document.getElementById('in-author').value || "Autor";
807-                const fullText = document.getElementById('main-textarea').innerText;
808-                const fullHtml = document.getElementById('main-textarea').innerHTML;
809-
810-                // mimetype MUST be first and NOT compressed
811-                zip.file("mimetype", "application/epub+zip", {compression: "STORE"});
812-
813-                // META-INF
814-                zip.file("META-INF/container.xml", `<?xml version="1.0" encoding="UTF-8"?>
815-<container version="1.0" xmlns="urn:oasis:names:tc:opendocument:xmlns:container">
816-    <rootfiles>
817-        <rootfile full-path="OEBPS/content.opf" media-type="application/oebps-package+xml"/>
818-    </rootfiles>
819-</container>`);
820-
821-                // Obter capa (se houver)
822-                let hasCover = false;
823-                if (capaUrl) {
824-                    try {
825-                        const resp = await fetch(capaUrl);
826-                        if (resp.ok) {
827-                            const blob = await resp.blob();
828-                            zip.file("OEBPS/cover.jpg", blob);
829-                            hasCover = true;
830-                        }
831-                    } catch (e) {
832-                        console.error("Erro ao carregar a capa para o EPUB", e);
833-                    }
834-                }
835-
836-                // OEBPS/content.opf
837-                let opf = `<?xml version="1.0" encoding="UTF-8"?>
838-<package xmlns="http://www.idpf.org/2007/opf" version="3.0" unique-identifier="pub-id">
839-    <metadata xmlns:dc="http://purl.org/dc/elements/1.1/">
840-        <dc:title>${escapeHtml(titulo)}</dc:title>
841-        <dc:creator>${escapeHtml(autor)}</dc:creator>
842-        <dc:language>pt-BR</dc:language>
843-        <dc:identifier id="pub-id">urn:uuid:epub-rf-${Date.now()}</dc:identifier>
844-        ${hasCover ? '<meta name="cover" content="cover-image"/>' : ''}
845-    </metadata>
846-    <manifest>
847-        <item id="toc" href="toc.xhtml" media-type="application/xhtml+xml" properties="nav"/>
848-        <item id="style" href="style.css" media-type="text/css"/>
849-        <item id="content" href="content.xhtml" media-type="application/xhtml+xml"/>
850-        ${hasCover ? '<item id="cover-image" href="cover.jpg" media-type="image/jpeg"/>' : ''}
851-        ${hasCover ? '<item id="cover-page" href="cover.xhtml" media-type="application/xhtml+xml"/>' : ''}
852-    </manifest>
853-    <spine>
854-        ${hasCover ? '<itemref idref="cover-page"/>' : ''}
855-        <itemref idref="toc"/>
856-        <itemref idref="content"/>
857-    </spine>
858-</package>`;
859-                zip.file("OEBPS/content.opf", opf);
860-
861-                // OEBPS/style.css
862-                zip.file("OEBPS/style.css", `
863-                    body { font-family: serif; line-height: 1.6; margin: 5%; text-align: justify; }
864-                    h1, h2, h3 { text-align: center; }
865-                    .cover { text-align: center; page-break-after: always; height: 100vh; display: flex; align-items: center; justify-content: center; }
866-                    .cover img { max-width: 100%; max-height: 100%; }
867-                    p { margin-bottom: 1em; text-indent: 1.5em; }
868-                `);
869-
870-                // OEBPS/cover.xhtml
871-                if (hasCover) {
872-                    zip.file("OEBPS/cover.xhtml", `<?xml version="1.0" encoding="UTF-8"?>
873-<html xmlns="http://www.w3.org/1999/xhtml" xmlns:epub="http://www.idpf.org/2007/ops">
874-<head>
875-    <title>Capa</title>
876-    <link rel="stylesheet" type="text/css" href="style.css"/>
877-</head>
878-<body>
879-    <div class="cover">
880-        <img src="cover.jpg" alt="Cover"/>
881-    </div>
882-</body>
883-</html>`);
884-                }
885-
886-                // OEBPS/toc.xhtml
887-                zip.file("OEBPS/toc.xhtml", `<?xml version="1.0" encoding="UTF-8"?>
888-<html xmlns="http://www.w3.org/1999/xhtml" xmlns:epub="http://www.idpf.org/2007/ops">
889-<head>
890-    <title>Índice</title>
891-    <link rel="stylesheet" type="text/css" href="style.css"/>
892-</head>
893-<body>
894-    <nav epub:type="toc" id="toc">
895-        <h1>Índice</h1>
896-        <ol>
897-            ${hasCover ? '<li><a href="cover.xhtml">Capa</a></li>' : ''}
898-            <li><a href="content.xhtml">Início</a></li>
899-        </ol>
900-    </nav>
901-</body>
902-</html>`);
903-
904-                // Conteúdo formatado
905-                let htmlContent = `<?xml version="1.0" encoding="UTF-8"?>
906-<html xmlns="http://www.w3.org/1999/xhtml" xmlns:epub="http://www.idpf.org/2007/ops">
907-<head>
908-    <title>${escapeHtml(titulo)}</title>
909-    <link rel="stylesheet" type="text/css" href="style.css"/>
910-</head>
911-<body>
912-    <div style="text-align: center; margin-bottom: 3em;">
913-        <h1>${escapeHtml(titulo)}</h1>
914-        <h3>${escapeHtml(autor)}</h3>
915-        <br/><br/>
916-        <p><i>RF Publishing</i></p>
917-    </div>
918-`;
919-                const rawPages = fullHtml.split(/<hr[^>]*class="[^"]*page-break[^"]*"[^>]*>/i);
920-                rawPages.forEach((pageContent, index) => {
921-                    if(!pageContent.trim() && index === 0 && rawPages.length > 1) return;
922-                    htmlContent += `
923-                        <div class="chapter" style="page-break-before: always; margin-top: 2em;">
924-                            ${pageContent}
925-                        </div>
926-                    `;
927-                });
928-                
929-                htmlContent += `</body>\n</html>`;
930-                
931-                zip.file("OEBPS/content.xhtml", htmlContent);
932-
933-                // Gerar e Baixar
934-                const content = await zip.generateAsync({type: "blob", mimeType: "application/epub+zip"});
935-                const url = URL.createObjectURL(content);
936-                const a = document.createElement("a");
937-                a.href = url;
938-                a.download = `${titulo.replace(/\s+/g, '_')}.epub`;
939-                a.click();
940-                URL.revokeObjectURL(url);
941-                
942-                btn.innerHTML = `<span class="material-symbols-outlined text-green-400">check</span> Concluído`;
943-                setTimeout(() => { btn.innerHTML = originalContent; }, 2000);
944-            } catch(error) {
945-                console.error("Erro ao gerar EPUB:", error);
946-                btn.innerHTML = `<span class="material-symbols-outlined text-red-400">error</span> Erro`;
947-                setTimeout(() => { btn.innerHTML = originalContent; }, 2000);
948-            } finally {
949-                btn.disabled = false;
950-            }
951-        }
952-        
953-        switchTab('screen-create');
954-    </script>
955-</body>
956-</html>
957-
