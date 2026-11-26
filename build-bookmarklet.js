// Injects bookmarklet.js as drag-to-bookmarks link into public/index.html (the <a id="bm"> href).
const fs = require('fs');
const src = fs.readFileSync(__dirname + '/bookmarklet.js', 'utf8')
  .split('\n').filter(l => !/^\s*\/\//.test(l)).join('\n'); // drop full-line comments
new Function(src); // syntax check, throws on error
const href = ('javascript:' + encodeURIComponent(src)).replace(/"/g, '%22');
const page = __dirname + '/public/index.html';
const html = fs.readFileSync(page, 'utf8');
const out = html.replace(/(<a id="bm"[^>]*?href=")[^"]*"/, (_, pre) => pre + href + '"');
if (out === html && !html.includes(href)) throw new Error('<a id="bm" href="..."> not found in public/index.html');
fs.writeFileSync(page, out);
console.log('public/index.html: bookmarklet updated,', href.length, 'chars');
