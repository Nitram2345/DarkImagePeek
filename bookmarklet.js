// DarkImagePeek as a bookmarklet. Click once: panel opens. Click again: panel closes (filters stay).
// Build the installable link with: node build-bookmarklet.js
(() => {
  const ID = 'icf-panel';
  const old = document.getElementById(ID);
  if (old) { old.remove(); return; }

  const root = document.documentElement;
  const rs = root.style;

  // Constructable stylesheet: not blocked by page CSP like an injected <style> could be.
  if (!window.__icfSheet) {
    const sheet = new CSSStyleSheet();
    sheet.replaceSync('img, picture, video { filter: var(--icf-g,) brightness(var(--icf-b, 100%)) contrast(var(--icf-c, 100%)) !important; }');
    document.adoptedStyleSheets = [...document.adoptedStyleSheets, sheet];
    window.__icfSheet = sheet;
  }

  // Same logic as setVars() in popup.js. Gamma -> SVG filter, only active when != 1.
  function setVars(gv, bv, cv) {
    rs.setProperty('--icf-b', bv + '%');
    rs.setProperty('--icf-c', cv + '%');
    rs.setProperty('--icf-gv', gv);
    if (gv == 1) { rs.removeProperty('--icf-g'); return; }
    let svg = document.getElementById('icf-svg');
    if (!svg) {
      const NS = 'http://www.w3.org/2000/svg';
      svg = document.createElementNS(NS, 'svg');
      svg.id = 'icf-svg';
      svg.setAttribute('width', '0');
      svg.setAttribute('height', '0');
      svg.setAttribute('aria-hidden', 'true');
      svg.style.position = 'absolute';
      const filter = document.createElementNS(NS, 'filter');
      filter.id = 'icf-gamma';
      filter.setAttribute('color-interpolation-filters', 'sRGB');
      const ct = document.createElementNS(NS, 'feComponentTransfer');
      for (const ch of ['R', 'G', 'B']) {
        const f = document.createElementNS(NS, 'feFunc' + ch);
        f.setAttribute('type', 'gamma');
        ct.append(f);
      }
      filter.append(ct);
      svg.append(filter);
      root.append(svg);
    }
    for (const f of svg.querySelectorAll('[type=gamma]')) f.setAttribute('exponent', 1 / gv);
    rs.setProperty('--icf-g', 'url(#icf-gamma)');
  }

  // Panel in shadow DOM so page CSS can't touch it.
  const host = document.createElement('div');
  host.id = ID;
  host.style.cssText = 'position:fixed;top:12px;right:12px;z-index:2147483647';
  const sh = host.attachShadow({ mode: 'open' });
  const css = new CSSStyleSheet();
  css.replaceSync(`
    .p { font: 13px system-ui, sans-serif; width: 220px; padding: 12px; background: #fff; color: #222;
         border: 1px solid #ccc; border-radius: 8px; box-shadow: 0 4px 16px rgba(0,0,0,.25); }
    label { display: block; margin-bottom: 10px; }
    input { width: 100%; }
    .row { display: flex; gap: 6px; }
    button { flex: 1; font: inherit; }
    .x { position: absolute; top: 4px; right: 8px; flex: none; border: 0; background: none; cursor: pointer; font-size: 16px; }`);
  sh.adoptedStyleSheets = [css];
  // ponytail: innerHTML fails on Trusted-Types sites (some Google pages); switch to createElement if needed.
  sh.innerHTML = `<div class="p">
    <button class="x" title="Schließen">×</button>
    <label>Gamma (Schatten): <output id="go"></output><input id="g" type="range" min="0.3" max="4" step="0.05"></label>
    <label>Helligkeit: <output id="bo"></output>%<input id="b" type="range" min="0" max="300"></label>
    <label>Kontrast: <output id="co"></output>%<input id="c" type="range" min="0" max="300"></label>
    <div class="row"><button id="reset">Zurücksetzen</button><button id="magic">Magic</button></div>
  </div>`;
  const $ = id => sh.getElementById(id);
  const g = $('g'), b = $('b'), c = $('c');

  g.value = parseFloat(rs.getPropertyValue('--icf-gv')) || 1;
  b.value = parseInt(rs.getPropertyValue('--icf-b')) || 100;
  c.value = parseInt(rs.getPropertyValue('--icf-c')) || 100;

  function apply() {
    $('go').value = (+g.value).toFixed(2);
    $('bo').value = b.value;
    $('co').value = c.value;
    setVars(+g.value, b.value, c.value);
  }
  g.oninput = b.oninput = c.oninput = apply;
  $('reset').onclick = () => { g.value = 1; b.value = c.value = 100; apply(); };
  $('magic').onclick = () => { g.value = 2.5; b.value = 100; c.value = 120; apply(); };
  sh.querySelector('.x').onclick = () => host.remove();
  apply();
  root.append(host);
})();
