@echo off
title Avatar Creator - Server Manager
color 0B

:menu
cls
echo ===================================================
echo     AVATAR CREATOR - ADVANCED SERVER MANAGER
echo ===================================================
echo.
echo   [1] Start Server (Dev Server)
echo   [2] Clear Cache (Vite Cache ^& Dist)
echo   [3] Check Code (Lint)
echo   [4] Prepare for Production (Build)
echo   [5] Update Dependencies (npm install)
echo   [6] Exit
echo.
echo ===================================================
set /p choice="Select an operation [1-6]: "

if "%choice%"=="1" goto start
if "%choice%"=="2" goto cache
if "%choice%"=="3" goto lint
if "%choice%"=="4" goto build
if "%choice%"=="5" goto install
if "%choice%"=="6" exit

:start
cls
echo Starting development server... (Press CTRL+C to exit)
call npm run dev
pause
goto menu

:cache
cls
echo Clearing cache...
if exist "node_modules\.vite" (
    rmdir /s /q "node_modules\.vite"
    echo [INFO] Vite cache deleted.
)
if exist "dist" (
    rmdir /s /q "dist"
    echo [INFO] Build (dist) folder deleted.
)
echo [INFO] NPM cache is being cleared...
call npm cache clean --force
echo.
echo [SUCCESS] Cleanup completed.
pause
goto menu

:lint
cls
echo Checking code with ESLint...
call npm run lint
echo.
echo [SUCCESS] Linting operation finished.
pause
goto menu

:build
cls
echo Compiling project for production...
call npm run build
echo.
echo [SUCCESS] Build completed. Outputs are in the "dist" folder.
pause
goto menu

:install
cls
echo Checking and installing dependencies...
call npm install --legacy-peer-deps
echo.
echo [SUCCESS] Installation completed.
pause
goto menu
