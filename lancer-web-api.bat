@echo off
REM Lance Bringo Mind dans le navigateur, branche sur l API de production.
REM Les variables ci-dessous priment sur le fichier .env (le fichier .env n est pas modifie).
cd /d "%~dp0"
set EXPO_PUBLIC_API_URL=https://app.bringomind.com
set EXPO_PUBLIC_DATA_MODE=api
echo Lancement de Bringo Mind (mode API : https://app.bringomind.com)...
call npx expo start -c --web
pause
