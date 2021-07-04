
mkdir out
sudo npm run build:package && npm run build:snap
sudo cp -r extraResources/* out/Haptic-Jacket-Controller-linux-x64
sudo chmod -R 777 out
cd out
tar -czvf Haptic-Jacket-Controller-linux-x64.tar.gz Haptic-Jacket-Controller-linux-x64