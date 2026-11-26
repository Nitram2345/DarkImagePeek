@echo off
rem Updates bookmarklet link in public\index.html, builds dist\darkimagepeek-<version>.zip (Chrome + Firefox).
cd /d "%~dp0"
node build-bookmarklet.js || exit /b 1
for /f "delims=" %%v in ('node -p "require('./manifest.json').version"') do set VER=%%v
if not exist dist mkdir dist
del /q "dist\darkimagepeek-%VER%.zip" 2>nul
rem tar (bsdtar) writes forward-slash paths; Compress-Archive in PS 5.1 does not, AMO rejects that.
tar -a -cf "dist\darkimagepeek-%VER%.zip" LICENSE manifest.json popup.html popup.js icons/icon16.png icons/icon32.png icons/icon48.png icons/icon128.png || exit /b 1
echo dist\darkimagepeek-%VER%.zip written
