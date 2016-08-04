cd /d %~dp0

cmd.exe /c node_modules\.bin\electron-packager . http-client --platform=linux --arch=x64 --overwrite
cmd.exe /c node_modules\.bin\electron-packager . http-client --platform=win32 --arch=x64 --overwrite
