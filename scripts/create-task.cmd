@echo off
schtasks /create /tn "KBT-Shiurim-Enhance" /tr "cmd /c cd /d \"C:\Users\chaim\kbt shul\kbt-website\" && node scripts\enhance-shiurim.mjs --recent 50 >> scripts\enhance.log 2>&1" /sc daily /st 03:00 /f
if %ERRORLEVEL% == 0 (
    echo Task created successfully! Will run daily at 3:00 AM.
) else (
    echo Failed - try running as Administrator.
)
