// All of the Node.js APIs are available in the preload process.

const { count } = require('console');

// It has the same sandbox as a Chrome extension.
window.addEventListener('DOMContentLoaded', () => {
  const replaceText = (selector, text) => {
    const element = document.getElementById(selector)
    if (element) element.innerText = text
  }

  var fs = require('fs');
  var path = require('path');
  const csv = require('csv-parser');

  var counter = 1;
  var input_file_path = path.join(__dirname, '../../../../', 'config.csv');

  fs.createReadStream(input_file_path)
    .pipe(csv())
    .on('data', function (data) {
      try {
        //perform the operation of reading into memory
        localStorage.setItem(counter + "-IP", data.IP);
        localStorage.setItem(counter + "-port", data.PORT);
        counter++;
        localStorage.setItem("MaxID", counter-1);
      }
      catch (err) {
        //error handler
      }
    })
    .on('end', function () {
      //some final operation
    });
    
  for (const type of ['chrome', 'node', 'electron']) {
    replaceText(`${type}-version`, process.versions[type])
  }
})
