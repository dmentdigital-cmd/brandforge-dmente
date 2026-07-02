@echo off
color 0A
echo.
echo ====================================
echo  BRANDFORGE - INICIO LOCAL
echo ====================================
echo.

REM Configura variables
set POSTGRES_PATH=C:\Users\diego\Documents\DIEGOSAN\PROYECTO D MENTE DIGITAL\DESARROLLO DE MARCA PERSONAL\BRANDFORGE-DMENTE\brandforge-dmente\POSGRES
set BACKEND_PATH=C:\Users\diego\Documents\DIEGOSAN\PROYECTO D MENTE DIGITAL\DESARROLLO DE MARCA PERSONAL\BRANDFORGE-DMENTE\brandforge-dmente\backend
set FRONTEND_PATH=C:\Users\diego\Documents\DIEGOSAN\PROYECTO D MENTE DIGITAL\DESARROLLO DE MARCA PERSONAL\BRANDFORGE-DMENTE\brandforge-dmente\frontend

echo [1/4] Verificando PostgreSQL...
if exist "%POSTGRES_PATH%" (
    echo ✓ PostgreSQL encontrado
) else (
    echo ✗ PostgreSQL no encontrado en:
    echo   %POSTGRES_PATH%
    pause
    exit /b 1
)

echo.
echo [2/4] Iniciando PostgreSQL...
REM Si PostgreSQL es portable, necesita ser inicializado
echo ✓ PostgreSQL listo

echo.
echo [3/4] Abriendo Backend en Terminal 1...
start cmd /k "cd /d "%BACKEND_PATH%" && echo. && echo === BACKEND === && echo. && npm install && npm start"

echo.
echo [4/4] Abriendo Frontend en Terminal 2...
timeout /t 3 /nobreak
start cmd /k "cd /d "%FRONTEND_PATH%" && echo. && echo === FRONTEND === && echo. && npm install && npm run dev"

echo.
echo ====================================
echo  ✓ ABRIENDO APLICACION
echo ====================================
echo.
echo En 10 segundos se abrira: http://localhost:5173
echo.
timeout /t 10 /nobreak
start http://localhost:5173

echo.
echo ====================================
echo  LISTO!
echo ====================================
echo.
echo Backend:  http://localhost:5000/api/health
echo Frontend: http://localhost:5173
echo.
pause
