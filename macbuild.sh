sudo electron-packager . --overwrite --platform=darwin --arch=x64 --icon=assets/icons/icon.icns --prune=true --out=release-builds
sudo cp -R ./extraResources/ ./release-builds/Haptic-Jacket-Controller-darwin-x64
sudo chmod -R 777 release-builds