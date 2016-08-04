# http-client

A very simple electron app that can send raw http requests

## how to run

```
git clone https://github.com/S2-/http-client.git
cd http-client
npm install
node_modules\.bin\electron .
```

## screenshot
![version 0](screenshots/version0.png)

## package
### linux
`./node_modules/.bin/electron-packager . http-client --platform=linux --arch=x64`

###windows
`node_modules\.bin\electron-packager . http-client --platform win32 --arch=x64`
