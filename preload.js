// All of the Node.js APIs are available in the preload process.
// It has the same sandbox as a Chrome extension.
window.addEventListener('DOMContentLoaded', () => {
  const replaceText = (selector, text) => {
    const element = document.getElementById(selector)
    if (element) element.innerText = text
  }

  var fs = require('fs');
  var path = require('path');
  const csv = require('csv')

  var p = path.join(__dirname, '..', 'config.json');
  fs.readFile(p, 'utf8', function (err, data) {
    if (err) return console.log(err);

    console.log(data);
    // data is the contents of the text file we just read
    //localStorage.setItem(current_dragged_module + "-x", parseFloat(bx));
    //localStorage.setItem(current_dragged_module + "-y", parseFloat(by));
  });



  for (const type of ['chrome', 'node', 'electron']) {
    replaceText(`${type}-version`, process.versions[type])
  }
})
