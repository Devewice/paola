@echo off
setlocal
cd /d "%~dp0"

if not exist "node_modules\" (
  echo Instalando dependencias...
  call npm install
  if errorlevel 1 (
    echo Fallo npm install.
    pause
    exit /b 1
  )
)

if not exist ".env" (
  echo Falta .env — copia .env.example y completa MYSQL_USER / MYSQL_PASSWORD.
  pause
  exit /b 1
)

echo Levantando back (API + MySQL) y front (Vite)...
start "Paola back" cmd /k npm run dev:back
timeout /t 2 /nobreak >nul
start "Paola front" cmd /k npm run dev:front

echo.
echo Back:  http://127.0.0.1:8787
echo Front: http://localhost:5173
echo.
echo Deja abiertas las ventanas "Paola back" y "Paola front".
echo Cierralas para apagar.
pause
