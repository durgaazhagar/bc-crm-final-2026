@echo off
REM MongoDB Setup Script for Windows
REM This script helps diagnose and fix MongoDB connection issues

echo ========================================
echo   MongoDB Connection Troubleshooter
echo ========================================
echo.

REM Check if MongoDB service exists
echo [1/5] Checking MongoDB service...
powershell -Command "Get-Service MongoDB -ErrorAction SilentlyContinue | Select-Object Status, Name" >nul 2>&1
if %ERRORLEVEL% EQU 0 (
    echo     ✓ MongoDB service found
    powershell -Command "Get-Service MongoDB | Select-Object Status"
) else (
    echo     ✗ MongoDB service NOT found (need to install)
)

REM Check if mongod process is running
echo.
echo [2/5] Checking if mongod process is running...
tasklist /FI "IMAGENAME eq mongod.exe" 2>NUL | find /I /N "mongod.exe">NUL
if "%ERRORLEVEL%"=="0" (
    echo     ✓ mongod process is running
) else (
    echo     ✗ mongod process is NOT running
)

REM Check if port 27017 is listening
echo.
echo [3/5] Checking port 27017...
netstat -ano | findstr "27017" >nul 2>&1
if %ERRORLEVEL% EQU 0 (
    echo     ✓ Port 27017 is listening
    netstat -ano | findstr "27017"
) else (
    echo     ✗ Port 27017 is NOT listening
)

REM Check if mongod executable exists
echo.
echo [4/5] Checking for mongod executable...
where mongod >nul 2>&1
if %ERRORLEVEL% EQU 0 (
    echo     ✓ mongod found in PATH
    where mongod
) else (
    echo     ✗ mongod NOT found in PATH
    echo     Try: "C:\Program Files\MongoDB\Server\6.0\bin\mongod.exe"
)

REM Check .env configuration
echo.
echo [5/5] Checking .env configuration...
if exist ".env" (
    echo     ✓ .env file exists
    findstr "MONGO_URI" .env
) else (
    echo     ✗ .env file not found
)

echo.
echo ========================================
echo   Recommendations:
echo ========================================
echo.
echo Option A: Install MongoDB Community Edition
echo   1. Download: https://www.mongodb.com/try/download/community
echo   2. Run installer (select "Install MongoDB as a Service")
echo   3. MongoDB starts automatically
echo.
echo Option B: Use MongoDB Atlas (Cloud)
echo   1. Create account: https://www.mongodb.com/cloud/atlas
echo   2. Create free cluster
echo   3. Copy connection string
echo   4. Update MONGO_URI in .env
echo.
echo Option C: Start MongoDB manually
echo   Run: mongod --dbpath "C:\data\db"
echo.
echo ========================================
echo.
pause
