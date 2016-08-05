#!/bin/bash

./node_modules/.bin/electron-packager . http-client --platform=linux --arch=x64 --overwrite
./node_modules/.bin/electron-packager . http-client --platform=win32 --arch=x64 --overwrite

zip -r http-client-linux-x64.zip http-client-linux-x64
zip -r http-client-win32-x64.zip http-client-win32-x64

rm -rf http-client-linux-x64
rm -rf http-client-win32-x64
