# Anforderungen – DarkImagePeek

## Ziel

Bilder auf Webseiten, die zu dunkel sind und Details verschlucken (Ausgangsfall: schwarze Fell-Jacke auf einem eBay-Produktfoto), sollen während des Betrachtens live aufgehellt werden können.

## Funktionale Anforderungen

| ID | Anforderung | Status |
|---|---|---|
| F1 | Helligkeit von Bildern auf der aktuellen Seite einstellbar (0–300 %) | ✅ |
| F2 | Kontrast einstellbar (0–300 %) | ✅ |
| F3 | Gamma einstellbar (0.3–4, höher = Schatten heller) | ✅ |
| F4 | Änderungen wirken sofort beim Verschieben der Regler | ✅ |
| F5 | „Zurücksetzen“ stellt Originalzustand her (Gamma 1, Helligkeit 100 %, Kontrast 100 %) | ✅ |
| F6 | „Magic“-Button setzt Gamma 2.5, Helligkeit 100 %, Kontrast 120 % | ✅ |
| F7 | Popup zeigt beim erneuten Öffnen die aktuell auf der Seite aktiven Werte | ✅ |
| F8 | Wirkt auf `img`, `picture`, `video`, inkl. nachgeladener Bilder | ✅ |
| F9 | Wirkt auch in iframes (Erweiterung) | ✅ |
| F10 | Alternative Bereitstellung als Bookmarklet mit gleichem Funktionsumfang (ohne iframes) | ✅ |
| F11 | Eigenes Logo (Apfel, diagonal geteilt: oben links dunkel, unten rechts hell) | ✅ |

## Nicht-funktionale Anforderungen

| ID | Anforderung | Status |
|---|---|---|
| N1 | Läuft in Chrome und Firefox (ab 109) aus einer Codebasis (Manifest V3) | ✅ |
| N2 | Minimale Berechtigungen: nur `activeTab` und `scripting` | ✅ |
| N3 | Keine Datensammlung, keine Netzwerkzugriffe | ✅ |
| N4 | Funktioniert auch auf Seiten mit strenger CSP (Inline-Styles gesperrt) | ✅ |
| N5 | Bei Gamma = 1 kein SVG-Filter aktiv (fehlender Filter darf Bilder nicht ausblenden) | ✅ |
| N6 | Nutzbar im Inkognito-/Privatmodus (nach Freigabe durch Nutzer) | ✅ |
| N7 | Keine Abhängigkeiten, kein Build-Schritt für die Erweiterung | ✅ |
| N8 | Veröffentlichung im Chrome Web Store und auf addons.mozilla.org | offen |

## Bewusst nicht umgesetzt

| Thema | Grund |
|---|---|
| Schärfe-Filter | Getestet: macht bei typischen (komprimierten) Shop-Bildern vor allem JPEG-Artefakte sichtbar |
| Sättigung / Invertieren | Kein Bedarf beim Ausgangsfall |
| Werte pro Website speichern | Bisher nicht gefordert; bräuchte `storage`-Berechtigung |
| CSS-Hintergrundbilder | Filter würde den gesamten Inhalt des Elements mitverändern |
| Tastenkürzel | Bisher nicht gefordert |

## Offene Punkte

- Firefox-ID (`darkimagepeek@local`) vor dem ersten AMO-Upload final festlegen.
- Store-Texte und Screenshots erstellen.
- Manueller Test der installierten Erweiterung in Chrome und Firefox sowie des Bookmarklets per echtem Lesezeichen-Klick.
