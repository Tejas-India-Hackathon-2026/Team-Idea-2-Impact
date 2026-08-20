@echo off
title LocalKart Platform Launcher
echo ===================================================
echo     Starting LocalKart Platform (FastAPI + Uvicorn)
echo ===================================================
echo.
echo Launching server at http://127.0.0.1:5000 ...
echo.

:: Open default web browser after 2 seconds
timeout /t 2 /nobreak >nul
start http://127.0.0.1:5000

:: Start FastAPI backend server
.venv\Scripts\python -m uvicorn backend.main:app --host 127.0.0.1 --port 5000 --reload

pause
