#!/usr/bin/env powershell
<#
GET IT! - Quick Start Script for Windows
This script helps you start the entire system locally
#>

$ErrorActionPreference = "Stop"

Write-Host "========================================" -ForegroundColor Cyan
Write-Host "GET IT! - Quick Start Setup" -ForegroundColor Green -NoNewline
Write-Host " 🚀" -ForegroundColor Yellow
Write-Host "========================================" -ForegroundColor Cyan
Write-Host ""

# Check Python
Write-Host "1. Checking Python installation..." -ForegroundColor Yellow
try {
    $pythonVersion = python --version 2>&1
    Write-Host "   ✅ Python found: $pythonVersion" -ForegroundColor Green
}
catch {
    Write-Host "   ❌ Python not found. Please install Python 3.9+" -ForegroundColor Red
    exit 1
}

# Check Node
Write-Host "2. Checking Node.js installation..." -ForegroundColor Yellow
try {
    $nodeVersion = node --version 2>&1
    Write-Host "   ✅ Node.js found: $nodeVersion" -ForegroundColor Green
}
catch {
    Write-Host "   ❌ Node.js not found. Please install Node.js 18+" -ForegroundColor Red
    exit 1
}

# Start Backend
Write-Host "3. Starting Backend API Server..." -ForegroundColor Yellow
Write-Host "   (Opens in new window)" -ForegroundColor Gray

$backendProcess = Start-Process powershell -ArgumentList "-NoExit", "-Command", "cd '$PSScriptRoot\backend'; python main.py" -PassThru
Write-Host "   ✅ Backend started (PID: $($backendProcess.Id))" -ForegroundColor Green

# Wait for backend
Write-Host "4. Waiting for backend to initialize..." -ForegroundColor Yellow
Start-Sleep -Seconds 3

# Test backend
$maxRetries = 5
$retryCount = 0
while ($retryCount -lt $maxRetries) {
    try {
        $response = Invoke-WebRequest -Uri "http://localhost:8000/health" -TimeoutSec 2 -ErrorAction SilentlyContinue
        if ($response.StatusCode -eq 200) {
            Write-Host "   ✅ Backend is healthy!" -ForegroundColor Green
            break
        }
    }
    catch {
        $retryCount++
        if ($retryCount -lt $maxRetries) {
            Write-Host "   ⏳ Waiting... (attempt $retryCount/$maxRetries)" -ForegroundColor Yellow
            Start-Sleep -Seconds 2
        }
    }
}

if ($retryCount -eq $maxRetries) {
    Write-Host "   ⚠️  Backend not responding - check terminal for errors" -ForegroundColor Yellow
}

# Start Frontend
Write-Host "5. Starting Frontend Development Server..." -ForegroundColor Yellow
Write-Host "   (Opens in new window)" -ForegroundColor Gray

$frontendProcess = Start-Process powershell -ArgumentList "-NoExit", "-Command", "cd '$PSScriptRoot\frontend'; npm run dev" -PassThru
Write-Host "   ✅ Frontend started (PID: $($frontendProcess.Id))" -ForegroundColor Green

Write-Host ""
Write-Host "========================================" -ForegroundColor Cyan
Write-Host "System Ready! 🎉" -ForegroundColor Green
Write-Host "========================================" -ForegroundColor Cyan
Write-Host ""
Write-Host "📍 Frontend:  http://localhost:3000" -ForegroundColor Cyan
Write-Host "📍 Backend:   http://localhost:8000" -ForegroundColor Cyan
Write-Host "📍 Health:    http://localhost:8000/health" -ForegroundColor Cyan
Write-Host ""
Write-Host "🧪 To run system tests:" -ForegroundColor Yellow
Write-Host "   python test_all_features.py" -ForegroundColor White
Write-Host ""
Write-Host "🌐 To access from remote machine:" -ForegroundColor Yellow
Write-Host "   1. Get your IP: ipconfig | findstr IPv4" -ForegroundColor Gray
Write-Host "   2. Update .env: NEXT_PUBLIC_API_URL=http://YOUR_IP:8000" -ForegroundColor Gray
Write-Host "   3. Access from other device: http://YOUR_IP:3000" -ForegroundColor Gray
Write-Host ""
Write-Host "Press Ctrl+C to stop this script (servers continue running)" -ForegroundColor Gray
Write-Host ""

# Keep script running
while ($true) {
    Start-Sleep -Seconds 1
}
