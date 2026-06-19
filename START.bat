@echo off
echo Starting Backend...
start "OptiMind Backend" cmd /k "cd /d %~dp0backend && npm run dev"

timeout /t 2 /nobreak >nul

echo Starting Frontend...
start "OptiMind Frontend" cmd /k "cd /d %~dp0client && npm start"

timeout /t 2 /nobreak >nul

echo Starting Prisma Studio...
start "Prisma Studio" cmd /k "cd /d %~dp0backend && npm run prisma:studio"

timeout /t 5 /nobreak >nul

echo Opening browser...
start http://localhost:3000

echo.
echo Done! All services are starting...
echo - Backend: http://localhost:4000
echo - Frontend: http://localhost:3000
echo - Prisma Studio: http://localhost:5555
