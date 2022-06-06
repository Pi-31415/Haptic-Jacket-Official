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
  var input_file_path = path.join(__dirname, "./", "config.csv");
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
      stream.write("1,192.168.1.201,4210\n");
      stream.write("2,192.168.1.202,4210\n");
      stream.write("3,192.168.1.203,4210\n");
      stream.write("4,192.168.1.204,4210\n");
      stream.write("5,192.168.1.205,4210\n");
      stream.write("6,192.168.1.206,4210\n");
      stream.write("7,192.168.1.207,4210\n");
      stream.write("8,192.168.1.208,4210\n");
      stream.write("9,192.168.1.209,4210\n");
      stream.write("10,192.168.1.210,4210\n");
      stream.write("11,192.168.1.211,4210\n");
      stream.write("12,192.168.1.212,4210\n");
      stream.write("13,192.168.1.213,4210\n");
      stream.write("14,192.168.1.214,4210\n");
      stream.write("15,192.168.1.215,4210\n");
      stream.write("16,192.168.1.216,4210\n");
      stream.write("17,192.168.1.217,4210\n");
      stream.write("18,192.168.1.218,4210\n");
      stream.write("19,192.168.1.219,4210\n");
      stream.write("20,192.168.1.220,4210\n");
      stream.write("21,192.168.1.221,4210\n");
      stream.write("22,192.168.1.222,4210\n");
      stream.write("23,192.168.1.223,4210\n");
      stream.write("24,192.168.1.87,4210\n");
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
