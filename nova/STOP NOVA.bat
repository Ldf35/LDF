@echo off
echo Stopping every copy of Nova (windows and background)...
powershell -NoProfile -Command "Get-CimInstance Win32_Process | Where-Object { $_.CommandLine -like '*my_agent.py*' } | ForEach-Object { Stop-Process -Id $_.ProcessId -Force }"
taskkill /IM pythonw.exe /F >nul 2>&1
echo Stopped. Now start Nova again.
pause
