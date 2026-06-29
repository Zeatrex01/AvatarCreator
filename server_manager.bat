@echo off
title Avatar Creator - Server Manager
color 0B

:menu
cls
echo ===================================================
echo   🚀 Avatar Creator - Gelismis Sunucu Yoneticisi
echo ===================================================
echo.
echo   [1] 🟢 Sunucuyu Baslat (Dev Server)
echo   [2] 🧹 Onbellegi Temizle (Vite Cache ^& Dist)
echo   [3] 🔍 Kodlari Kontrol Et (Lint)
echo   [4] 📦 Uretime Hazirla (Build)
echo   [5] 🔄 Bagimliliklari Guncelle (npm install)
echo   [6] ❌ Cikis
echo.
echo ===================================================
set /p choice="Lutfen bir islem secin (1-6): "

if "%choice%"=="1" goto start
if "%choice%"=="2" goto cache
if "%choice%"=="3" goto lint
if "%choice%"=="4" goto build
if "%choice%"=="5" goto install
if "%choice%"=="6" exit

:start
cls
echo 🟢 Gelistirme sunucusu baslatiliyor... (Cikmak icin CTRL+C)
call npm run dev
pause
goto menu

:cache
cls
echo 🧹 Onbellek temizleniyor...
if exist "node_modules\.vite" (
    rmdir /s /q "node_modules\.vite"
    echo - Vite onbellegi silindi.
)
if exist "dist" (
    rmdir /s /q "dist"
    echo - Build (dist) klasoru silindi.
)
echo - NPM onbellegi temizleniyor...
call npm cache clean --force
echo.
echo ✅ Temizlik tamamlandi!
pause
goto menu

:lint
cls
echo 🔍 ESLint ile kodlar kontrol ediliyor...
call npm run lint
echo.
echo ✅ Linting islemi bitti.
pause
goto menu

:build
cls
echo 📦 Uretim ortami icin proje derleniyor...
call npm run build
echo.
echo ✅ Derleme tamamlandi! Ciktilar "dist" klasorunde.
pause
goto menu

:install
cls
echo 🔄 Bagimliliklar kontrol ediliyor ve yukleniyor...
call npm install --legacy-peer-deps
echo.
echo ✅ Yukleme tamamlandi!
pause
goto menu
