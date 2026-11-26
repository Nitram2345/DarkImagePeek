# DarkImagePeek

<img src="icons/icon128.png" width="64" align="right" alt="DarkImagePeek Logo">

Browser-Erweiterung für **Chrome** und **Firefox**, die dunkle Bilder auf Webseiten live aufhellt – damit man Details erkennt, die im Schatten verschwinden (z. B. schwarze Kleidung auf Produktfotos).

Zusätzlich als **Bookmarklet** verfügbar – ohne Installation, ohne Store.

## Funktionen

- **Gamma (Schatten)** – hebt dunkle Bereiche an, ohne helle Stellen ausbrennen zu lassen. Der wichtigste Regler.
- **Helligkeit** – hellt das ganze Bild gleichmäßig auf.
- **Kontrast** – gibt nach dem Aufhellen wieder Tiefe.
- **Magic** – ein Klick: Gamma 2.5, Helligkeit 100 %, Kontrast 120 %.
- **Zurücksetzen** – Originalzustand.

Wirkt auf alle `img`, `picture` und `video`, auch in iframes und auf nachgeladene Bilder. Keine Datensammlung, keine Netzwerkzugriffe, keine dauerhafte Speicherung.

## Installation (Entwicklung)

**Chrome:** `chrome://extensions` → Entwicklermodus an → „Entpackte Erweiterung laden“ → Projektordner wählen.

**Firefox (ab 109):** `about:debugging` → „Dieser Firefox“ → „Temporäres Add-on laden“ → `manifest.json` wählen.

### Inkognito / Private Fenster

Muss pro Browser einmal erlaubt werden:
- Chrome: `chrome://extensions` → DarkImagePeek → Details → „Im Inkognito-Modus zulassen“
- Firefox: `about:addons` → DarkImagePeek → „In privaten Fenstern ausführen“ → Erlauben

## Bookmarklet

```sh
node build-bookmarklet.js
```

Dann `dist/bookmarklet.html` öffnen und den Button in die Lesezeichenleiste ziehen. Klick öffnet ein Panel auf der Seite, zweiter Klick schließt es (Filter bleiben aktiv).

Unterschiede zur Erweiterung: wirkt nur auf die Hauptseite (keine iframes), funktioniert sofort auch im Inkognito-Modus, braucht keine Installation.

## Wie es funktioniert

- Ein CSS-Filter `filter: url(#gamma) brightness() contrast()` auf alle Bilder; die Werte stecken in CSS-Variablen auf `<html>`.
- Gamma gibt es nicht als CSS-Filter → SVG-Filter (`feComponentTransfer` mit `type="gamma"`), wird nur bei Gamma ≠ 1 eingefügt.
- Erweiterung: CSS per `chrome.scripting.insertCSS`, Bookmarklet: Constructable Stylesheet (`adoptedStyleSheets`). Beides funktioniert auch auf Seiten, deren CSP Inline-Styles sperrt.
- Berechtigungen: nur `activeTab` und `scripting` – Zugriff ausschließlich auf den Tab, in dem das Popup geöffnet wird.

## Release bauen

1. `version` in `manifest.json` erhöhen.
2. ZIP bauen (nicht `Compress-Archive` aus PowerShell 5.1 verwenden – erzeugt Backslash-Pfade, die AMO ablehnt):
   ```sh
   tar -a -c -f dist/darkimagepeek-1.0.zip manifest.json popup.html popup.js icons/icon16.png icons/icon32.png icons/icon48.png icons/icon128.png
   ```
3. Hochladen:
   - Chrome Web Store: https://chrome.google.com/webstore/devconsole (einmalig 5 $)
   - Firefox AMO: https://addons.mozilla.org/developers/ (kostenlos)

> Die Firefox-ID (`browser_specific_settings.gecko.id` in `manifest.json`) vor dem ersten Upload final festlegen – sie lässt sich danach nicht mehr ändern.

## Dateien

| Datei | Zweck |
|---|---|
| `manifest.json` | Manifest V3, Chrome + Firefox |
| `popup.html`, `popup.js` | Popup mit Reglern, Filterlogik |
| `bookmarklet.js` | Bookmarklet-Quellcode (Filterlogik dupliziert aus `popup.js`) |
| `build-bookmarklet.js` | Baut `dist/bookmarklet.html` |
| `icons/icon.svg` | Logo-Vorlage; PNGs daraus gerendert |

## Bekannte Grenzen

- Funktioniert nicht auf Browser-internen Seiten (`chrome://`, `about:`, Web Store, AMO).
- Werte gelten nur für den aktuellen Tab und gehen beim Neuladen verloren.
- CSS-Hintergrundbilder werden nicht verändert.
- Bookmarklet: auf Seiten mit Trusted Types (manche Google-Seiten) kann das Panel blockiert werden.
