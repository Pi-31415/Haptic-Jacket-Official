// All of the Node.js APIs are available in the preload process.
const { count } = require('console');
var fs = require('fs');
var path = require('path');
const csv = require('csv-parser');
var counter = 1;
var input_file_path = path.join(__dirname, '../../../../', 'config.csv');


function read_config_file(){
  //Read contents of config file
  fs.createReadStream(input_file_path)
    .pipe(csv())
    .on('data', function (data) {
      try {
        //perform the operation of reading into memory
        localStorage.setItem(counter + "-IP", data.IP);
        localStorage.setItem(counter + "-port", data.PORT);
        counter++;
        localStorage.setItem("MaxID", counter - 1);
      }
      catch (err) {
        //error handler
      }
    })
    .on('end', function () {
      //some final operation
    });
}

// It has the same sandbox as a Chrome extension.
window.addEventListener('DOMContentLoaded', () => {
  const replaceText = (selector, text) => {
    const element = document.getElementById(selector)
    if (element) element.innerText = text
  }

  if (fs.existsSync(input_file_path)) {
    //Check if configuration file exists
    read_config_file();
  } else {
    //Create config.csv if not found
    var stream = fs.createWriteStream(input_file_path);
    stream.once('open', function (fd) {
      stream.write("ID,IP,PORT\n");
      stream.write("1,102.87.192.93,7777\n");
      stream.write("2,154.204.118.69,7777\n");
      stream.write("3,174.249.227.92,7777\n");
      stream.write("4,69.238.204.57,7777\n");
      stream.write("5,120.151.177.61,7777\n");
      stream.write("6,81.197.31.110,7777\n");
      stream.end();
    });
    read_config_file();
  }

  for (const type of ['chrome', 'node', 'electron']) {
    replaceText(`${type}-version`, process.versions[type])
  }
})
