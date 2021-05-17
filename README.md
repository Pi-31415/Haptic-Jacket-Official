# Haptic Jacket Middleware Official Repository

This is the official repository for the haptic jacket middleware for my research project.

Documentation [on Gitbook](https://pi31415.gitbook.io/haptic-jacket/)

### Related Repositories

- [UDP-Client-Server-Test](https://github.com/Pi-31415/UDP-Client-Server-Test)
- [Haptic-Jacket-API-GUI](https://github.com/Pi-31415/Haptic-Jacket-API-GUI)
- [Flutter-UDP-Client-Android](https://github.com/Pi-31415/Flutter-UDP-Client-Android)

## Requirements

- **NodeJS**
- **Electron**

## Electron - related documentation

**Clone and run for a quick way to see Electron in action.**

This is a minimal Electron application based on the [Quick Start Guide](https://electronjs.org/docs/tutorial/quick-start) within the Electron documentation.

**Use this app along with the [Electron API Demos](https://electronjs.org/#get-started) app for API code examples to help you get started.**

A basic Electron application needs just these files:

- `package.json` - Points to the app's main file and lists its details and dependencies.
- `main.js` - Starts the app and creates a browser window to render HTML. This is the app's **main process**.
- `index.html` - A web page to render. This is the app's **renderer process**.

You can learn more about each of these components within the [Quick Start Guide](https://electronjs.org/docs/tutorial/quick-start).

## Development Commands

```bash
# Install dependencies
npm install
# Run the app
npm start
```

## Building Commands

```bash
# Mac Build
electron-packager . --overwrite --platform=darwin --arch=x64 --icon=assets/icons/icon.icns --prune=true --out=release-builds
```

After Building on mac, change permission for the build folder using
```bash
chmod -R 777 release-builds
```

**Note: Copy extraResources into the release-builds folder after building**

```
# Ubuntu Build
# First install
npm install --save-dev electron-installer-snap
```
Then place following command in package.json
```
 "build:package": "electron-packager . --out=out",
 "build:snap": "electron-installer-snap --src=out/myappname-linux-x64"
```

```
# Finally Build
sudo npm run build:package && npm run build:snap
```
**Don't forget to manually copy the config.csv after building using following commands**

```
sudo cp -r extraResources/* out/Haptic-Jacket-Controller-linux-x64
```


After Building on linux, change permission for the build folder using
```bash
sudo chmod -R 777 out
```

Ubuntu build uses [electron-installer-snap](https://github.com/electron-userland/electron-installer-snap)

## Editing Style

 To compile scss, run

 ```
sass --watch www/styles/flat-ui-pro.scss:www/css/flat-ui-pro.css
 ```

 Install sass if not available by running 

 ```
 sudo npm install -g sass
 ```

 ## Running Middleware

 For Programmers, the Haptic Jacket GUI app can be invoked through a python API. Run the file in middleware folder.
