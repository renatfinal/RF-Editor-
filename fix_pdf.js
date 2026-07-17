const fs = require('fs');
let html = fs.readFileSync('index.html', 'utf8');

const regex = /function downloadPDF\(\) \{[\s\S]*?\}\.pdf`\);\s*\}/;
const correctPdfFunc = `function downloadPDF() {
            // Usa o diálogo de impressão nativo com a regra @media print para um PDF perfeito 6x9 (15.24x22.86cm)
            setTimeout(() => { window.print(); }, 500);
        }`;
if(regex.test(html)) {
    html = html.replace(regex, correctPdfFunc);
    fs.writeFileSync('index.html', html);
    console.log("Fixed PDF function");
} else {
    console.log("Could not find corrupted PDF function");
}
