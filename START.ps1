# OptiMind ERP System - Quick Start Script
Write-Host "========================================" -ForegroundColor Cyan
Write-Host "  OptiMind ERP System - Quick Start" -ForegroundColor Cyan
Write-Host "========================================" -ForegroundColor Cyan
Write-Host ""

# 检查Node.js
Write-Host "[1/4] Checking Node.js..." -ForegroundColor Yellow
$nodeVersion = node --version 2>$null
if (!$nodeVersion) {
    Write-Host "[ERROR] Node.js not found! Please install Node.js first." -ForegroundColor Red
    pause
    exit 1
}
Write-Host "[OK] Node.js $nodeVersion found" -ForegroundColor Green

# 检查PostgreSQL
Write-Host ""
Write-Host "[2/4] Checking PostgreSQL..." -ForegroundColor Yellow
$pgService = Get-Service -Name "postgresql-x64-18" -ErrorAction SilentlyContinue
if ($pgService.Status -ne "Running") {
    Write-Host "[WARNING] PostgreSQL is not running. Starting..." -ForegroundColor Yellow
    Start-Service -Name "postgresql-x64-18"
    Start-Sleep -Seconds 2
}
Write-Host "[OK] PostgreSQL is running" -ForegroundColor Green

# 获取项目根目录
$rootDir = Split-Path -Parent $MyInvocation.MyCommand.Path

# 启动后端
Write-Host ""
Write-Host "[3/4] Starting Backend Server..." -ForegroundColor Yellow
$backendPath = Join-Path $rootDir "backend"
Start-Process powershell -ArgumentList "-NoExit", "-Command", "cd '$backendPath'; Write-Host 'Backend Server' -ForegroundColor Cyan; npm run dev"
Start-Sleep -Seconds 3
Write-Host "[OK] Backend started on http://localhost:4000" -ForegroundColor Green

# 启动前端
Write-Host ""
Write-Host "[4/4] Starting Frontend Server..." -ForegroundColor Yellow
$clientPath = Join-Path $rootDir "client"
Start-Process powershell -ArgumentList "-NoExit", "-Command", "cd '$clientPath'; Write-Host 'Frontend Server' -ForegroundColor Cyan; npm start"
Write-Host "[OK] Frontend will start on http://localhost:3000" -ForegroundColor Green

# 等待前端启动后打开浏览器
Write-Host ""
Write-Host "Waiting for servers to start..." -ForegroundColor Yellow
Start-Sleep -Seconds 8
Start-Process "http://localhost:3000"

Write-Host ""
Write-Host "========================================" -ForegroundColor Green
Write-Host "  System Started Successfully!" -ForegroundColor Green
Write-Host "========================================" -ForegroundColor Green
Write-Host ""
Write-Host "Backend:  http://localhost:4000" -ForegroundColor Cyan
Write-Host "Frontend: http://localhost:3000" -ForegroundColor Cyan
Write-Host ""
Write-Host "Press any key to exit this window." -ForegroundColor Yellow
Write-Host "(Backend and Frontend will continue running)" -ForegroundColor Yellow
$null = $Host.UI.RawUI.ReadKey("NoEcho,IncludeKeyDown")
