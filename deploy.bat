@echo off
setlocal
echo.
echo ===================================================
echo   MUSTAFA PORTFOLIO — DEPLOYMENT ASSISTANT
echo ===================================================
echo.

cd /d "d:\Mustafa Personal Portfolio Website"

:: Check if git is installed
where git >nul 2>nul
if %errorlevel% neq 0 (
    echo [ERROR] Git is not installed or not in PATH.
    pause
    exit /b
)

echo [1/5] Checking Git Status...
git status
echo.

echo [2/5] Staging All Changes...
git add -A
echo       DONE.
echo.

echo [3/5] Committing Changes...
:: Only commit if there are changes
git diff-index --quiet HEAD -- || git commit -m "🚀 Update portfolio code - %date% %time%"
echo       DONE.
echo.

echo [4/5] Configuring Remote Repository...
git branch -M main
git remote remove origin 2>nul
git remote add origin https://github.com/mhassaniuk-coder/Mustafa-Baloch-Personal-Portfolio-Website.git
echo       Remote set to: https://github.com/mhassaniuk-coder/Mustafa-Baloch-Personal-Portfolio-Website.git
echo       DONE.
echo.

echo [5/5] Pushing to GitHub...
echo.
echo       ---------------------------------------------------
echo       PLEASE NOTE: You may be asked to sign in to GitHub
echo       in a browser window or enter your credentials.
echo       ---------------------------------------------------
echo.
git push -u origin main

if %errorlevel% neq 0 (
    echo.
    echo [ERROR] Push failed!
    echo         Possible reasons:
    echo         1. You are not logged in to GitHub
    echo         2. The repository does not exist on GitHub yet
    echo            (Go to https://github.com/new and create it!)
    echo         3. You don't have permission
    echo.
) else (
    echo.
    echo ===================================================
    echo   SUCCESS! CODE IS LIVE ON GITHUB!
    echo ===================================================
    echo.
    echo   NEXT STEPS - DEPLOY TO VERCEL:
    echo.
    echo   1. Go to https://vercel.com/new
    echo   2. Import "Mustafa-Baloch-Personal-Portfolio-Website"
    echo   3. Click "Deploy" (no config needed)
    echo   4. Copy the resulting URL (e.g. https://portfolio.vercel.app)
    echo   5. Go to your GitHub repo settings and paste it in "Website"
    echo.
)

pause
