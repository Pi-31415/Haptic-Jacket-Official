# Haptic Jacket Middleware Official Repository

This is the official repository for the haptic jacket middleware for my research project.

### Related Repositories

- [UDP-Client-Server-Test](https://github.com/Pi-31415/UDP-Client-Server-Test)
- [Haptic-Jacket-API-GUI](https://github.com/Pi-31415/Haptic-Jacket-API-GUI)

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

## Editing Style

 To compile scss, run

 ```
sass --watch www/styles/flat-ui-pro.scss:www/css/flat-ui-pro.css
 ```

 Install sass if not available by running 

 ```
 sudo npm install -g sass
 ```
