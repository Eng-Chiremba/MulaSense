@echo off
echo ========================================
echo MulaSense - Production Setup
echo ========================================
echo.

set /p BACKEND_URL="Enter your Render backend URL (e.g., https://mulasense-backend.onrender.com): "

if "%BACKEND_URL%"=="" (
    echo Error: Backend URL is required!
    pause
    exit /b 1
)

echo.
echo Creating .env file with production settings...
echo VITE_API_BASE_URL=%BACKEND_URL%/api > .env

echo.
echo ========================================
echo Setup Complete!
echo ========================================
echo.
echo Backend URL: %BACKEND_URL%
echo API Endpoint: %BACKEND_URL%/api
echo.
echo Next steps:
echo 1. Test connection: npm run dev
echo 2. Build for production: npm run build
echo 3. Build for Android: npm run android
echo 4. Build for iOS: npm run ios
echo.
pause
