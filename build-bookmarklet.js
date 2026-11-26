// Turns bookmarklet.js into dist/bookmarklet.html with a drag-to-bookmarks link.
const fs = require('fs');
const src = fs.readFileSync(__dirname + '/bookmarklet.js', 'utf8')
  .split('\n').filter(l => !/^\s*\/\//.test(l)).join('\n'); // drop full-line comments
new Function(src); // syntax check, throws on error
const href = 'javascript:' + encodeURIComponent(src);
fs.mkdirSync(__dirname + '/dist', { recursive: true });
fs.writeFileSync(__dirname + '/dist/bookmarklet.html', `<!doctype html><meta charset="utf-8"><title>DarkImagePeek Bookmarklet</title>
<body style="font:16px system-ui,sans-serif;max-width:600px;margin:40px auto;padding:0 16px">
<h1>DarkImagePeek</h1>
<p>Link in die Lesezeichenleiste ziehen:</p>
<p><a href="${href.replace(/"/g, '%22')}" style="display:inline-block;padding:8px 16px;background:#1d1d24;color:#ffd84a;border-radius:6px;text-decoration:none">🍏 DarkImagePeek</a></p>
<p>Dann auf einer Seite mit Bildern auf das Lesezeichen klicken. Nochmal klicken schließt das Panel.</p>
</body>`);
console.log('dist/bookmarklet.html written,', href.length, 'chars');
