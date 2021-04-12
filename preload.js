// All of the Node.js APIs are available in the preload process.
// It has the same sandbox as a Chrome extension.
window.addEventListener('DOMContentLoaded', () => {
  const replaceText = (selector, text) => {
    const element = document.getElementById(selector)
    if (element) element.innerText = text
  }

  var fs = require('fs');
  var path = require('path');
  const csv = require('csv-parser');


  var input_file_path = path.join(__dirname, '../../../../', 'config.csv');

  fs.createReadStream(input_file_path)
    .pipe(csv())
    .on('data', function (data) {
      try {
        console.log("ID is: " + data.ID);
        console.log("IP is: " + data.IP);

        //perform the operation
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
