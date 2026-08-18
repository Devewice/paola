@echo off
setlocal
cd /d "%~dp0"

if not exist "node_modules\" (
  echo Instalando dependencias...
  call npm install
  if errorlevel 1 exit /b 1
)

if not exist ".env" (
  echo Falta .env — copia .env.example y completa MYSQL_USER / MYSQL_PASSWORD.
  exit /b 1
)

echo Levantando front y back juntos (mismo Hostinger, no servicios aparte)...
call npm run dev
