const fs = require('fs');
let html = fs.readFileSync('index.html', 'utf8');

const oldFuncStart = html.indexOf('function downloadPDF() {');
const oldFuncEnd = html.indexOf('}', html.indexOf('doc.save(', oldFuncStart)) + 1;

if (oldFuncStart !== -1 && oldFuncEnd !== -1) {
    const replacement = `function downloadPDF() {
            // Usa o diálogo de impressão nativo com a regra @media print para um PDF perfeito 6x9 (15.24x22.86cm)
            setTimeout(() => { window.print(); }, 500);
        }`;
    html = html.substring(0, oldFuncStart) + replacement + html.substring(oldFuncEnd);
    fs.writeFileSync('index.html', html);
    console.log("Updated downloadPDF");
} else {
    console.log("Could not find downloadPDF");
}
