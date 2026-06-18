#!/usr/bin/env pwsh
# MongoDB Quick Setup Script for Windows PowerShell
# Run: .\mongodb-setup.ps1

Write-Host "========================================" -ForegroundColor Cyan
Write-Host "  MongoDB Setup & Verification Script" -ForegroundColor Cyan
Write-Host "========================================" -ForegroundColor Cyan
Write-Host ""

function Check-Service {
    param([string]$ServiceName)
    $service = Get-Service -Name $ServiceName -ErrorAction SilentlyContinue
    if ($service) {
        Write-Host "✓ Service found: $($service.Status)" -ForegroundColor Green
        return $service.Status
    } else {
        Write-Host "✗ Service not found" -ForegroundColor Red
        return $null
    }
}

function Check-Process {
    param([string]$ProcessName)
    $process = Get-Process -Name $ProcessName -ErrorAction SilentlyContinue
    if ($process) {
        Write-Host "✓ Process running: $($process.Name) (PID: $($process.Id))" -ForegroundColor Green
        return $true
    } else {
        Write-Host "✗ Process not running" -ForegroundColor Red
        return $false
    }
}

function Check-Port {
    param([int]$Port)
    $connection = Test-NetConnection -ComputerName 127.0.0.1 -Port $Port -ErrorAction SilentlyContinue
    if ($connection.TcpTestSucceeded) {
        Write-Host "✓ Port $Port is listening" -ForegroundColor Green
        return $true
    } else {
        Write-Host "✗ Port $Port is not listening" -ForegroundColor Red
        return $false
    }
}

function Check-Executable {
    param([string]$Command)
    $exe = Get-Command $Command -ErrorAction SilentlyContinue
    if ($exe) {
        Write-Host "✓ Executable found: $($exe.Source)" -ForegroundColor Green
        return $exe.Source
    } else {
        Write-Host "✗ Executable not found" -ForegroundColor Red
        return $null
    }
}

# Run checks
Write-Host "[1/5] Checking MongoDB Service..." -ForegroundColor Yellow
$serviceStatus = Check-Service "MongoDB"

Write-Host ""
Write-Host "[2/5] Checking mongod Process..." -ForegroundColor Yellow
$processRunning = Check-Process "mongod"

Write-Host ""
Write-Host "[3/5] Checking Port 27017..." -ForegroundColor Yellow
$portListening = Check-Port 27017

Write-Host ""
Write-Host "[4/5] Checking mongod Executable..." -ForegroundColor Yellow
$mongodPath = Check-Executable "mongod"

Write-Host ""
Write-Host "[5/5] Checking .env Configuration..." -ForegroundColor Yellow
if (Test-Path ".env") {
    Write-Host "✓ .env file found" -ForegroundColor Green
    $mongoUri = Select-String -Path ".env" -Pattern "MONGO_URI" | Select-Object -First 1
    Write-Host "  $($mongoUri.Line)" -ForegroundColor Gray
} else {
    Write-Host "✗ .env file not found" -ForegroundColor Red
}

# Summary
Write-Host ""
Write-Host "========================================" -ForegroundColor Cyan
Write-Host "  Diagnosis Summary" -ForegroundColor Cyan
Write-Host "========================================" -ForegroundColor Cyan
Write-Host ""

if ($serviceStatus -eq "Running" -and $portListening) {
    Write-Host "✓ MongoDB is running and ready!" -ForegroundColor Green
    Write-Host ""
    Write-Host "Next: Start the backend" -ForegroundColor Green
    Write-Host "  cd backend"
    Write-Host "  npm run dev"
} else {
    Write-Host "MongoDB is not running. Choose an option:" -ForegroundColor Yellow
    Write-Host ""
    Write-Host "[Option A] Install MongoDB Community Edition" -ForegroundColor Cyan
    Write-Host "  1. Download: https://www.mongodb.com/try/download/community"
    Write-Host "  2. Run the MSI installer"
    Write-Host "  3. Select 'Run the MongoDB service as Admin'"
    Write-Host "  4. MongoDB starts automatically"
    Write-Host ""
    Write-Host "[Option B] Start MongoDB Manually" -ForegroundColor Cyan
    if ($mongodPath) {
        Write-Host "  Run: & '$mongodPath' --dbpath 'C:\data\db'"
    } else {
        Write-Host "  mongod.exe not found in PATH"
        Write-Host "  Default path: C:\Program Files\MongoDB\Server\6.0\bin\mongod.exe"
    }
    Write-Host ""
    Write-Host "[Option C] Use MongoDB Atlas (Cloud)" -ForegroundColor Cyan
    Write-Host "  1. Create account: https://www.mongodb.com/cloud/atlas"
    Write-Host "  2. Create a free M0 cluster"
    Write-Host "  3. Copy connection string"
    Write-Host "  4. Update MONGO_URI in .env"
}

Write-Host ""
Write-Host "========================================" -ForegroundColor Cyan
Write-Host ""
