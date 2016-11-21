@echo off

REM Specify folders and files to operate on
set BaseDir=C:\Users\csull\AppData\Local\Screeps\scripts\otherkev_duckdns_org___21025\screeps-try1
set DestDir=D:\ScreepsBackup
set ExtFilter=js
set ZipFilter=gz
set Zip=c:\program files\7-zip\7z.exe

REM Current date time in YYYY_MM_DD_hh_mm_ss format for timestamp on moved files
set datetime=%date:~-4%_%date:~-7,2%_%date:~-10,2%_%time:~0,2%_%time:~3,2%_%time:~6,2%
echo %datetime%

REM Move all matching files to destination folder renaming with date/time stamp
echo Running ""%Zip%" a -tgzip "%DestDir%\SCREEPS_DB_%datetime%.%ZipFilter%" "%BaseDir%\*.%ExtFilter%""

REM Only keep 30 newest files in destination folder
for /F "tokens=* skip=30" %%A in ('dir /b /a-d /tc /o-d "%DestDir%\*.%ZipFilter%"') do del "%DestDir%\%%~A"