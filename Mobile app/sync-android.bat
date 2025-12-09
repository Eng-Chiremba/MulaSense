@echo off
echo Building web app...
call npm run build

echo Syncing with Android...
call npx cap sync android

echo Done! Now open Android Studio and rebuild the project.
pause
