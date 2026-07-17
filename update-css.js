const fs = require('fs');
let html = fs.readFileSync('index.html', 'utf8');

const additionalStyles = `
        .page-html-content h1 { font-size: 2em; font-weight: bold; margin-bottom: 0.5em; text-align: center; }
        .page-html-content h2 { font-size: 1.5em; font-weight: bold; margin-bottom: 0.5em; }
        .page-html-content p { margin-bottom: 1em; }
        #main-textarea hr.page-break::after { content: "--- Fim da Página / Quebra ---"; display: block; text-align: center; color: #01f5a0; font-size: 0.8rem; margin-top: -0.5rem; background: #1a1a1a; width: 200px; margin-left: auto; margin-right: auto; }
        
        @media print {
            body * { visibility: hidden; }
            #screen-design, #screen-design * { visibility: visible; }
            #screen-design { position: absolute; left: 0; top: 0; width: 100%; background: white !important; }
            .book-page-pro { width: 15.24cm !important; height: 22.86cm !important; margin: 0 auto !important; padding: 1.5cm !important; box-shadow: none !important; page-break-after: always; border: none !important; }
            #screen-design header, #screen-design button { display: none !important; }
        }
    </style>
`;
html = html.replace('    </style>', additionalStyles);

fs.writeFileSync('index.html', html);
