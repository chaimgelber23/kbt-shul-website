@echo off
REM Sets up a Windows Task Scheduler task to auto-enhance new shiurim daily at 3 AM.
REM Run this script once as Administrator to configure automatic enhancement.

set SCRIPT_DIR=%~dp0
set NODE_PATH=node
set SCRIPT_PATH=%SCRIPT_DIR%enhance-shiurim.mjs

echo Setting up daily shiurim enhancement task...
echo Script: %SCRIPT_PATH%

schtasks /create /tn "KBT-Shiurim-Enhance" /tr "cmd /c cd /d \"%SCRIPT_DIR%..\" && node scripts/enhance-shiurim.mjs --recent 50 >> scripts/enhance.log 2>&1" /sc daily /st 03:00 /f

if %ERRORLEVEL% == 0 (
    echo.
    echo SUCCESS! Task "KBT-Shiurim-Enhance" created.
    echo It will run daily at 3:00 AM and process up to 50 new shiurim.
    echo.
    echo To run it now:   schtasks /run /tn "KBT-Shiurim-Enhance"
    echo To check status: schtasks /query /tn "KBT-Shiurim-Enhance"
    echo To remove it:    schtasks /delete /tn "KBT-Shiurim-Enhance" /f
) else (
    echo.
    echo FAILED - Try running this script as Administrator.
)
pause
