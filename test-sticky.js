const fs = require('fs');
let html = fs.readFileSync('index.html', 'utf8');
if (html.includes('sticky top-16 z-40')) {
    console.log("Toolbar already has sticky top-16 z-40");
}
