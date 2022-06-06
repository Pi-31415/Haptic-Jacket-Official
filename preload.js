// All of the Node.js APIs are available in the preload process.
const { count } = require("console");
var fs = require("fs");
var os = require("os");
var path = require("path");
const csv = require("csv-parser");
var counter = 1;

if (os.platform() == "darwin") {
  //For MacOS
  var input_file_path = path.join(__dirname, "../../../../", "config.csv");
} else if (os.platform() == "linux") {
  //For Ubuntu
  var input_file_path = path.join(__dirname, "../../", "config.csv");
} else {
  var input_file_path = path.join(__dirname, "../../../../", "config.csv");
}

localStorage.setItem("config_file_path", input_file_path);

function read_config_file() {
  //Read contents of config file
  fs.createReadStream(input_file_path)
    .pipe(csv())
    .on("data", function (data) {
      try {
        if (data.IP != undefined) {
          //perform the operation of reading into memory
          localStorage.setItem(counter + "-IP", data.IP);
          localStorage.setItem(counter + "-port", data.PORT);
          counter++;
          localStorage.setItem("MaxID", counter - 1);
        }
      } catch (err) {
        //error handler
      }
    })
    .on("end", function () {
      //some final operation
    });
}

// It has the same sandbox as a Chrome extension.
window.addEventListener("DOMContentLoaded", () => {
  const replaceText = (selector, text) => {
    const element = document.getElementById(selector);
    if (element) element.innerText = text;
  };

  if (fs.existsSync(input_file_path)) {
    //Check if configuration file exists
    read_config_file();
  } else {
    //Create config.csv if not found
    var stream = fs.createWriteStream(input_file_path);
    stream.once("open", function (fd) {
      stream.write("ID,IP,PORT\n");
      stream.write("1,221.0.3.201,7777\n");
      stream.write("2,221.0.3.202,7777\n");
      stream.write("3,221.0.3.203,7777\n");
      stream.write("4,221.0.3.204,7777\n");
      stream.write("5,221.0.3.205,7777\n");
      stream.write("6,221.0.3.206,7777\n");
      stream.write("7,221.0.3.207,7777\n");
      stream.write("8,221.0.3.208,7777\n");
      stream.write("9,221.0.3.209,7777\n");
      stream.write("10,221.0.3.210,7777\n");
      stream.write("11,221.0.3.211,7777\n");
      stream.write("12,221.0.3.212,7777\n");
      stream.write("13,221.0.3.213,7777\n");
      stream.write("14,221.0.3.214,7777\n");
      stream.write("15,221.0.3.215,7777\n");
      stream.write("16,221.0.3.216,7777\n");
      stream.write("17,221.0.3.217,7777\n");
      stream.write("18,221.0.3.218,7777\n");
      stream.write("19,221.0.3.219,7777\n");
      stream.write("20,221.0.3.220,7777\n");
      stream.write("21,221.0.3.221,7777\n");
      stream.write("22,221.0.3.222,7777\n");
      stream.write("23,221.0.3.223,7777\n");
      stream.write("24,221.0.3.224,7777\n");
      stream.write("25,221.0.3.225,7777\n");
      stream.write("26,221.0.3.226,7777\n");
      stream.write("27,221.0.3.227,7777\n");
      stream.write("28,221.0.3.228,7777\n");
      stream.write("29,221.0.3.229,7777\n");
      stream.write("30,221.0.3.230,7777\n");
      stream.write("31,221.0.3.231,7777\n");
      stream.write("32,221.0.3.232,7777\n");
      stream.write("33,221.0.3.233,7777\n");
      stream.write("34,221.0.3.234,7777\n");
      stream.write("35,221.0.3.235,7777\n");
      stream.end();
    });
    read_config_file();
  }

  for (const type of ["chrome", "node", "electron"]) {
    replaceText(`${type}-version`, process.versions[type]);
  }
});
