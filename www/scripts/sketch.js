/*-------------------------------------------------*/
/* Author : Pi */
/* Date: Feb 26, 2021. */
/* Description:  This is the GUI visualization for the Haptic Jacket controller middleware */
/* Dependencies : node, materialize and p5.js*/
/*-------------------------------------------------*/

// UDP related libraries
var PORT = 33333;
var UDP_motorid = [];
var HOST = '127.0.0.1';
const fs = require('fs');
var dgram = require('dgram');
var path = require('path');
var os = require('os');
var server = dgram.createSocket('udp4');

var delay_times = [];
var intensities = [];

function UDP_bind() {
  server.on('listening', function () {
    var address = server.address();
    console.log('UDP Server listening on ' + address.address + ':' + address.port);
  });

  server.on('message', function (message, remote) {
    //alert(message);
    if (message == 0) {
      //Stop if the incoming UDP message is 0
      UDP_motorid = [0]
    } else {
      var splitted_message = message.toString().split(",");
      UDP_motorid.push(Number(splitted_message[0]));
      intensities[Number(splitted_message[0])] = Number(splitted_message[1]);
      delay_times[Number(splitted_message[0])] = Number(splitted_message[2]);
      console.log("Message Received:" + message);
    }
  });

  server.bind(PORT, HOST);
}

function UDP_send(MESSAGE, PORT, HOST) {
  var message = new Buffer.from(MESSAGE);
  var client = dgram.createSocket('udp4');
  client.send(message, 0, message.length, PORT, HOST, function (err, bytes) {
    if (err) throw err;
    console.log('UDP message ' + MESSAGE + ' sent to ' + HOST + ':' + PORT);
    client.close();
  });
}

// GUI related variables
let jacket_img;
var configuration_mode_on = false;
var showing_configuration_data = false;

var scan_complete = false;
let screen_width = 1050;
let box_boundary_y_coordinate = 420;

//Check if storage_file exists
var configuration_storage_exists = false;

//Motor related variables
var current_dragged_module = 0;
let motorDelayTimes = [];
let motorGUI = [];
let IP = [];
//Configuration Motor Dummy
let bx;
let by;
let boxSize = 35;
let overBox = false;
let locked = false;
let xOffset = 0.0;
let yOffset = 0.0;

var myFont;

function preload() {
  myFont = loadFont("./fonts/lato/lato-light.ttf");
}


function removeItemAll(arr, value) {
  var i = 0;
  while (i < arr.length) {
    if (arr[i] === value) {
      arr.splice(i, 1);
    } else {
      ++i;
    }
  }
  return arr;
}

function setup() {
  textFont(myFont);
  UDP_bind();
  //Disable GUI Buttons
  document.getElementById("btn_save").style.display = "none";

  document.getElementById("configpath").innerHTML = localStorage.getItem("config_file_path");
  document.getElementById("configmessage").innerHTML = "Configuration file location : ";
  document.getElementById("btn_reset").style.display = "none";
  document.getElementById("btn_hide_config").style.display = "none";
  document.getElementById("configtable").style.display = "none";
  document.getElementById("btn_configure").style.display = "none";
  //Maximum support is 40, but IP can only handle 28 on screen.
  total_number_of_modules = localStorage.getItem("MaxID");

  //Render initial components
  pixelDensity(3.0);
  createCanvas(screen_width, 550);
  jacket_img = loadImage('img/jacket.svg');
  scan_modules();
}

function draw() {
  //Set up scene
  background(255, 255, 255);
  fill(color(150, 150, 150));
  image(jacket_img, 100, 0, 800, 460);

  //Check if localstorage exists
  if (localStorage.getItem("1-x") != null) {
    configuration_storage_exists = true;
  }

  //Render Other Motors
  if (scan_complete) {
    RenderMotors(localStorage.getItem("MaxID"));
    //Activate Vibration Detection
    for (var l = 1; l < motorGUI.length; l++) {
      //listen to UDP and activate accordingly;
      for (var y = 0; y < UDP_motorid.length; y++) {
        if (UDP_motorid[y] != 0 && UDP_motorid[y] < motorGUI.length) {
          motorGUI[UDP_motorid[y]].API_activate(delay_times[UDP_motorid[y]], intensities[UDP_motorid[y]]);
          //Activation occurs here
        }
      }
      motorGUI[l].activate();
    }

  }

  //Configuration Motor Dummy
  // Test if the cursor is over the box
  if (
    mouseX > bx - boxSize &&
    mouseX < bx + boxSize &&
    mouseY > by - boxSize &&
    mouseY < by + boxSize
  ) {
    overBox = true;
    if (!locked) {
      //if not locked, display purple on dummy
      fill(color(33, 218, 189));
    } else {
      //selection color on dummy - dark torquise
      fill(20, 72, 84);
    }
  } else {
    fill(color(20, 72, 84));
    overBox = false;
  }

  if (current_dragged_module != 0 && configuration_mode_on) {
    // Draw the dummy
    ellipse(bx, by, boxSize, boxSize);
    fill(color(0, 0, 0))
    text(current_dragged_module, bx - 2, by - 20);
  }
}

function show_message(msg) {
  document.getElementById("messagebox").innerHTML = "<i style='font-weight:normal'>" + msg + "</i>";
}

function render_config_data() {
  //Renders data from configuration file onto GUI
  //render configuration file data onto GUI
  document.getElementById("configdata").innerHTML = "";
  var j;
  for (j = 1; j <= localStorage.getItem("MaxID"); j++) {
    document.getElementById("configdata").innerHTML += "<tr><td class='text-center'>" + j + "</td><td class='text-center'>"
      + "<div class='form-group'><input type='text' value='"
      + localStorage.getItem(j + "-IP")
      + "' id='"
      + (j + "-IP")
      + "' onfocusout= \"updatedata('"
      + (j + "-IP")
      + "')\" "
      + "placeholder='-' class='form-control input-sm'></div>"
      + "</td><td class='text-center'>"
      + "<div class='form-group'><input type='text' value='"
      + localStorage.getItem(j + "-port")
      + "' id='"
      + (j + "-port")
      + "' onfocusout= \"updatedata('"
      + (j + "-port")
      + "')\" "
      + "' placeholder='-' class='form-control input-sm'></div>"
      + "</td></tr>";
  }

}

function toggle_configure() {
  if (configuration_mode_on) {
    document.getElementById("btn_configure").style.display = "none";
    document.getElementById("btn_save").style.display = "block";
    document.getElementById("btn_reset").style.display = "block";
  } else {
    document.getElementById("btn_configure").style.display = "block";
    document.getElementById("btn_save").style.display = "none";
    document.getElementById("btn_reset").style.display = "none";
  }
}

function toggle_show_table() {
  render_config_data();
  show_message('Click and edit the values you want, then save.');
  document.getElementById("btn_hide_config").style.display = "block";
  document.getElementById("btn_show_config").style.display = "none";
  document.getElementById("configtable").style.display = "block";
  document.getElementById("p5canvas").style.display = "none";
  showing_configuration_data = true;
  document.getElementById("configmessage").innerHTML = "Configuration file location : ";
}

function toggle_hide_table() {
  show_message('IP data saved.');
  document.getElementById("p5canvas").style.display = "block";
  document.getElementById("btn_show_config").style.display = "block";
  document.getElementById("btn_hide_config").style.display = "none";
  document.getElementById("configtable").style.display = "none";
  showing_configuration_data = false;
}

//Configuration Dummy Motor related functions
function mousePressed() {
  if (overBox) {
    locked = true;
    fill(255, 255, 255);
  } else {
    locked = false;
  }
  xOffset = mouseX - bx;
  yOffset = mouseY - by;
}

function mouseDragged() {
  if (locked) {
    bx = mouseX - xOffset;
    by = mouseY - yOffset;
  }
}

function mouseReleased() {
  //Drag and drop code occurs here, first record the dummy module's location and duplicate
  //Then save into local storage
  if (configuration_mode_on && locked) {
    // Check browser support
    if (typeof (Storage) !== "undefined") {
      // Store location in localstorage if possible
      localStorage.setItem(current_dragged_module + "-x", parseFloat(bx));
      localStorage.setItem(current_dragged_module + "-y", parseFloat(by));
      console.log("Saved Location : Motor " + current_dragged_module + " : (" + localStorage.getItem(current_dragged_module + "-x") + "," + localStorage.getItem(current_dragged_module + "-y") + ")");
      current_dragged_module = 0;
    } else {
      //document.getElementById("result").innerHTML = "Sorry, your browser does not support Web Storage...";
    }
  }
  locked = false;
}

//GUI Related Functions
function RenderMotors(number_of_motors) {
  var autoID = 1;
  var j, k;
  var current_separator_X = 50;
  var current_separator_Y = 50;
  var currentY = box_boundary_y_coordinate + (boxSize * 1.1);
  var currentX = 50;

  noFill();
  stroke(20, 72, 84);
  //Table to place unconfigured modules
  rect(20, box_boundary_y_coordinate, 1020, 120);

  //Render the motors in a rectangular array if configuration does not exist
  for (j = 1; j <= 4; j++) {
    for (k = 1; k <= 20; k++) {
      if (autoID <= number_of_motors) {
        if (localStorage.getItem(autoID + "-x")) {
          motorGUI[autoID] = new VibrationMotor(parseFloat(localStorage.getItem(autoID + "-x")), parseFloat(localStorage.getItem(autoID + "-y")), autoID);
        } else {
          motorGUI[autoID] = new VibrationMotor(currentX, currentY, autoID);
        }
        currentX += current_separator_X;
        autoID++;
      }
    }
    currentX = 50;
    currentY += current_separator_Y;
  }

}

function show_help() {
  show_message("First scan modules. Then configure the positions. Hover with mouse to activate.");
}

function configure() {
  current_dragged_module = 0;
  if (!scan_complete) {
    show_message('Please scan for modules first.');
  } else {
    configuration_mode_on = true;
    show_message('Drag and drop the modules onto the jacket. Save when done.');
    toggle_configure();
  }
}

//List all configurations
function list_configuration() {
  for (var l = 1; l <= localStorage.getItem("MaxID"); l++) {
    if (localStorage.getItem(l + "-x") != null || localStorage.getItem(l + "-y") != null) {
      console.log("Motor " + l + " : (" + localStorage.getItem(l + "-x") + "," + localStorage.getItem(l + "-y") + ")");
    }
  }
}

//This updates the config.csv data when edited
function updatedata(NAME) {

  localStorage.setItem(NAME, document.getElementById(NAME).value);
  //Then write to config.csv file
  if (os.platform() == 'darwin') {
    //For MacOS
    var input_file_path = path.join(__dirname, '../../../../../', 'config.csv');
  } else if (os.platform() == 'linux') {
    //For Ubuntu
    var input_file_path = path.join(__dirname, '../../../', 'config.csv');
  }

  var stream = fs.createWriteStream(input_file_path);
  stream.once('open', function (fd) {
    stream.write("ID,IP,PORT\n");
    //Writes the locations of jackets to external file, only the assigned ones
    for (var l = 1; l <= localStorage.getItem("MaxID"); l++) {
      if (localStorage.getItem(l + "-IP") != null || localStorage.getItem(l + "-port") != null) {
        stream.write(l + "," + localStorage.getItem(l + "-IP") + "," + localStorage.getItem(l + "-port") + "\n");
      }
    }

    stream.end();
  });

  //Display Message
  document.getElementById("configmessage").innerHTML = "Successfully updated the value " + document.getElementById(NAME).value + " in ";
  write_locations();
}

function write_locations() {

  if (os.platform() == 'darwin') {
    //For MacOS
    var input_file_path = path.join(__dirname, '../../../../../', 'location.csv');
  } else if (os.platform() == 'linux') {
    //For Ubuntu
    var input_file_path = path.join(__dirname, '../../../', 'location.csv');
  }

  var stream = fs.createWriteStream(input_file_path);
  stream.once('open', function (fd) {
    stream.write("ID,X,Y,IP,PORT\n");
    //Writes the locations of jackets to external file, only the assigned ones
    for (var l = 1; l <= localStorage.getItem("MaxID"); l++) {
      if (localStorage.getItem(l + "-x") != null || localStorage.getItem(l + "-y") != null) {

        if (localStorage.getItem(l + "-y") <= box_boundary_y_coordinate) {
          stream.write(l + "," + localStorage.getItem(l + "-x") + "," + localStorage.getItem(l + "-y") + "," + localStorage.getItem(l + "-IP") + "," + localStorage.getItem(l + "-port") + "\n");
        }

      }
    }

    stream.end();
  });
}

function save_configuration() {
  current_dragged_module = 0;
  configuration_mode_on = false;
  write_locations();
  show_message('Your configurations are saved.');
  toggle_configure();
}



//Clear all configurations, and reset motor locations for reset button
function clear_configuration() {
  current_dragged_module = 0;
  var autoID = 1;
  var j, k;
  var current_separator_X = 50;
  var current_separator_Y = 50;
  var currentY = box_boundary_y_coordinate + (boxSize * 1.1);
  var currentX = 50;
  for (j = 1; j <= 4; j++) {
    for (k = 1; k <= 20; k++) {
      if (autoID <= localStorage.getItem("MaxID")) {
        localStorage.setItem(autoID + "-x", currentX);
        localStorage.setItem(autoID + "-y", currentY);
        currentX += current_separator_X;
        autoID++;
      }
    }
    currentX = 50;
    currentY += current_separator_Y;
  }

  show_message('Locations have been reset.');
  toggle_configure();
}

// Vibration Motor Class
class VibrationMotor {
  constructor(X, Y, autoID) {
    this.x = X;
    this.y = Y;
    this.init_x = X;
    this.init_y = Y;
    this.diameter = boxSize;
    this.speed = 2;
    this.max_pixel_vibration_animation = 3;
    this.sensitivity = 1;
    this.delay_time = 300; //Default delay time
    this.ID = autoID;
    this.is_vibrating = false;
    //Color scheme
    this.color_vibrating = color(255, 255, 255); //Torquise
    this.color_non_vibration = color(19, 68, 92); //Grey
    //API calls
    this.API_activated = false;
    this.current_activation_time = 0.0;
  }
  move(x, y) {
    this.init_x = x;
    this.init_y = y;
  }
  API_activate(duration, intensity) {
    this.API_activated = true;
    this.delay_time = duration;

    //Calculate the intensity color (100 = reddest, 0 = white)
    var normalized_color = Math.floor(-(2.55 * intensity) + 255);
    this.max_pixel_vibration_animation = 4 * (intensity / 100);

    this.color_vibrating = color(255, normalized_color, normalized_color);
    //console.log(this.delay_time);
  }
  activate() {

    //Activate via API call only
    if (
      (mouseX >= this.init_x - (this.diameter * this.sensitivity) &&
        mouseX <= this.init_x + (this.diameter * this.sensitivity) &&
        mouseY >= this.init_y - (this.diameter * this.sensitivity) &&
        mouseY <= this.init_y + (this.diameter * this.sensitivity))
      || (this.API_activated)
    ) {

      //Activate Vibration for a duration only if API is called, not mouse
      if ((mouseX >= this.init_x - (this.diameter * this.sensitivity) &&
        mouseX <= this.init_x + (this.diameter * this.sensitivity) &&
        mouseY >= this.init_y - (this.diameter * this.sensitivity) &&
        mouseY <= this.init_y + (this.diameter * this.sensitivity))
        || this.API_activated) {
        if (motorDelayTimes[this.ID] == undefined) {
          motorDelayTimes[this.ID] = Math.floor(millis());
          //Keep time to generate one command only to physical module;
          this.current_activation_time = millis();
          this.is_vibrating = true;
        }
      }

      //console.log(motorDelayTimes[this.ID]);

      //Allow Dragging if locked
      //console.log('current drag ID: ' + current_dragged_module);
      if (!locked && configuration_mode_on) {
        current_dragged_module = this.ID;
        bx = motorGUI[current_dragged_module].init_x;
        by = motorGUI[current_dragged_module].init_y;
      }

    }

    var delayed_time = 10000000;
    if (motorDelayTimes[this.ID] != undefined) {
      delayed_time = Math.floor(millis() - motorDelayTimes[this.ID]);
      //Stop vibrating the motor after the specified delay time
      if (motorDelayTimes[this.ID] > 0) {
        if (delayed_time >= this.delay_time) {
          this.API_activated = false;
          this.is_vibrating = false;
          motorDelayTimes[this.ID] = undefined;
          removeItemAll(UDP_motorid, this.ID);
        }
        else {
          this.is_vibrating = true;
        }
      }
    }

    //if configuration mode is off, play vibration animations with delay time
    if (!configuration_mode_on) {
      //Update Animations
      stroke(0, 0, 0);
      if (this.is_vibrating && this.init_y <= box_boundary_y_coordinate) {

        //UDP command to physical module
        //Submit UDP message to physical Module based on mouse activity

        //console.log(this.current_activation_time);
        //console.log(millis());

        if ((mouseX >= this.init_x - (this.diameter * this.sensitivity) &&
          mouseX <= this.init_x + (this.diameter * this.sensitivity) &&
          mouseY >= this.init_y - (this.diameter * this.sensitivity) &&
          mouseY <= this.init_y + (this.diameter * this.sensitivity))) {
          UDP_send('1', localStorage.getItem(this.ID + "-port"), localStorage.getItem(this.ID + "-IP"));
          //console.log("Vibrating");
        } else {
          UDP_send('0', localStorage.getItem(this.ID + "-port"), localStorage.getItem(this.ID + "-IP"));
          //console.log("Not Vibrating");
        }


        //only play vibrate animation if configuration mode mode is off
        this.x = this.init_x;
        this.y = this.init_y;
        this.x += random(-this.max_pixel_vibration_animation, this.max_pixel_vibration_animation);
        this.y += random(-this.max_pixel_vibration_animation, this.max_pixel_vibration_animation);
        fill(this.color_vibrating);
        ellipse(this.x, this.y, this.diameter, this.diameter);
        fill(color(0, 0, 0))
        text(this.ID, this.x - 2, this.y - 20);
      } else {
        fill(this.color_non_vibration);
        ellipse(this.init_x, this.init_y, this.diameter, this.diameter);
        fill(color(0, 0, 0))
        text(this.ID, this.init_x - 2, this.init_y - 20);
      }

    } else {
      if (this.ID != current_dragged_module) {
        fill(this.color_non_vibration);
        ellipse(this.init_x, this.init_y, this.diameter, this.diameter);
        fill(color(0, 0, 0))
        text(this.ID, this.init_x - 2, this.init_y - 20);
      }
    }

  }
}

function launch_hand_control() {


  const { spawn } = require('child_process');
  const ls = spawn('python3', ["\"./API/handdetect.py\""]);
  ls.stdout.on('data', (data) => {
    console.log(`stdout: ${data}`);
  });

  ls.stderr.on('data', (data) => {
    console.error(`stderr: ${data}`);
  });

  ls.on('close', (code) => {
    console.log(`child process exited with code ${code}`);
  });
}

function scan_modules() {
  //This loads the modules
  var htmlmessage = 'Scanning';
  show_message(htmlmessage)
  window.setTimeout(function () {
    document.getElementById("btn_configure").style.display = "block";
    scan_complete = true;
    if (localStorage.getItem("MaxID") == null) {
      alert("Configuration CSV file not found.");
      htmlmessage = 'Error: Configuration CSV file not found.';
    } else {
      htmlmessage = localStorage.getItem("MaxID") + ' Modules loaded.';
    }
    show_message(htmlmessage);
  }, 500);
}