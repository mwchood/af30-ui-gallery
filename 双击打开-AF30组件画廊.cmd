@echo off
chcp 65001 >nul
cd /d "%~dp0"
title AF30 UI System - keep this window open

if not exist "node_modules\vite\bin\vite.js" (
  echo Installing required packages...
  call npm install
  if errorlevel 1 (
    echo.
    echo Installation failed. Please send this window screenshot to Codex.
    pause
    exit /b 1
  )
)

echo Starting AF30 UI System...
echo Keep this window open while viewing the gallery.
start "" cmd /c "timeout /t 2 /nobreak >nul & start "" http://127.0.0.1:5173/?page=home^&state=HOME-V01-V2^&physical=v2"
call npm run dev

echo.
echo The AF30 preview server has stopped.
pause
