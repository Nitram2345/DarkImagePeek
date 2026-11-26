// Works in Chrome and Firefox (Firefox MV3 also exposes `chrome.*`).
const g = document.getElementById('g');
const b = document.getElementById('b');
const c = document.getElementById('c');
const go = document.getElementById('go');
const bo = document.getElementById('bo');
const co = document.getElementById('co');

// Stylesheet via insertCSS bypasses page CSP; values live in CSS variables on <html>,
// set via CSSOM (also CSP-safe). Lazy-loaded images get the filter automatically.
// Order matters: gamma first, then brightness, then contrast.
// --icf-g is empty unless gamma != 1, so a missing SVG filter can never hide images.
const CSS = 'img, picture, video { filter: var(--icf-g,) brightness(var(--icf-b, 100%)) contrast(var(--icf-c, 100%)) !important; }';

// Runs inside the page. Gamma has no CSS filter function -> SVG feComponentTransfer.
function setVars(gv, bv, cv) {
  const s = document.documentElement.style;
  s.setProperty('--icf-b', bv + '%');
  s.setProperty('--icf-c', cv + '%');
  s.setProperty('--icf-gv', gv);
  if (gv == 1) { s.removeProperty('--icf-g'); return; }

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
    // <html> instead of <body>: SPAs that re-render <body> won't wipe it.
    document.documentElement.append(svg);
  }
  // Slider shows classic gamma (higher = brighter shadows); SVG wants the exponent.
  for (const f of svg.querySelectorAll('[type=gamma]')) f.setAttribute('exponent', 1 / gv);
  s.setProperty('--icf-g', 'url(#icf-gamma)');
}

function getVars() {
  const s = document.documentElement.style;
  return [
    parseFloat(s.getPropertyValue('--icf-gv')) || 1,
    parseInt(s.getPropertyValue('--icf-b')) || 100,
    parseInt(s.getPropertyValue('--icf-c')) || 100,
  ];
}

let target;

function show() {
  go.value = (+g.value).toFixed(2);
  bo.value = b.value;
  co.value = c.value;
}

function apply() {
  show();
  chrome.scripting.executeScript({ target, func: setVars, args: [+g.value, b.value, c.value] });
}

(async () => {
  const [tab] = await chrome.tabs.query({ active: true, currentWindow: true });
  target = { tabId: tab.id, allFrames: true };
  try {
    // ponytail: CSS inserted on every popup open; duplicates are harmless (same rule).
    await chrome.scripting.insertCSS({ target, css: CSS });
    const [res] = await chrome.scripting.executeScript({ target: { tabId: tab.id }, func: getVars });
    [g.value, b.value, c.value] = res.result;
    show();
  } catch (e) {
    // chrome://, about:, Web Store / AMO pages can't be scripted.
    document.body.textContent = 'Auf dieser Seite nicht möglich.';
    return;
  }
  g.oninput = b.oninput = c.oninput = apply;
  document.getElementById('reset').onclick = () => { g.value = 1; b.value = c.value = 100; apply(); };
  // Tuned on dark product photos (black fur on white): lift shadows, restore some depth.
  document.getElementById('magic').onclick = () => { g.value = 2.5; b.value = 100; c.value = 120; apply(); };
})();
