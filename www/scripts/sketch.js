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
var dgram = require('dgram');
var server = dgram.createSocket('udp4');


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
      UDP_motorid.push(Number(message));
      console.log(UDP_motorid);
    }
  });

  server.bind(PORT, HOST);
}

// GUI related variables
let jacket_img;
var configuration_mode_on = false;

var total_number_of_modules = 60;

var scan_complete = false;
let screen_width = 1300;
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
let boxSize = 20;
let overBox = false;
let locked = false;
let xOffset = 0.0;
let yOffset = 0.0;

var myFont;

function preload() {
  myFont = loadFont("./fonts/lato/lato-light.ttf");
}

function setup() {
  textFont(myFont);
  UDP_bind();
  //Disable GUI Buttons
  document.getElementById("btn_save").style.display = "none";
  document.getElementById("btn_reset").style.display = "none";

  //Maximum support is 60, but IP can only handle 28 on screen.
  total_number_of_modules = floor(random(10, 28));

  //Render initial components
  pixelDensity(3.0);

  createCanvas(screen_width, 690);
  jacket_img = loadImage('img/jacket.svg');

  //Generate IP initially
  for (var l = 1; l <= total_number_of_modules; l++) {
    IP[l] = generate_IP();
  }
}

function draw() {
  //Set up scene
  background(255, 255, 255);
  fill(color(150, 150, 150));
  image(jacket_img, 20, 20, 1000, 580);

  //Check if localstorage exists
  if (localStorage.getItem("1-x") != null) {
    configuration_storage_exists = true;
  }

  //Render Other Motors
  if (scan_complete) {
    RenderMotors(total_number_of_modules);
    //Activate Vibration Detection
    for (var l = 1; l < motorGUI.length; l++) {

      //listen to UDP and activate accordingly;
      for (var y = 0; y < UDP_motorid.length; y++) {
        if (UDP_motorid[y] != 0) {
          motorGUI[UDP_motorid[y]].API_activated = true;
        }
      }


      motorGUI[l].activate();
    }
    show_IP();
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
  var currentY = 600;
  var currentX = 50;

  noFill();
  stroke(20, 72, 84);
  //Table to place unconfigured modules
  rect(20, 560, 1020, 120);

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

function save_configuration() {
  current_dragged_module = 0;
  configuration_mode_on = false;
  show_message('Your configurations are saved.');
  toggle_configure();
}

//List all configurations
function list_configuration() {
  for (var l = 1; l <= total_number_of_modules; l++) {
    if (localStorage.getItem(l + "-x") != null || localStorage.getItem(l + "-y") != null) {
      console.log("Motor " + l + " : (" + localStorage.getItem(l + "-x") + "," + localStorage.getItem(l + "-y") + ")");
    }
  }
}

//Clear all configurations
function clear_configuration() {
  current_dragged_module = 0;
  localStorage.clear();
  show_message('All configuration data cleared.');
  toggle_configure();
}

// Vibration Motor Class
class VibrationMotor {
  constructor(X, Y, autoID) {
    this.x = X;
    this.y = Y;
    this.init_x = X;
    this.init_y = Y;
    this.diameter = 20;
    this.speed = 2;
    this.intensity = 3;
    this.sensitivity = 1;
    this.delay_time = 300;
    this.ID = autoID;
    this.is_vibrating = false;
    //Color scheme
    this.color_vibrating = color(33, 218, 189); //Torquise
    this.color_non_vibration = color(19, 68, 92); //Grey
    //API calls
    this.API_activated = false;
  }
  move(x, y) {
    this.init_x = x;
    this.init_y = y;
  }
  API_activate(duration) {
    this.API_activated = true;
  }
  activate() {
    //Activate via mouse hover or API call
    if (
      (mouseX >= this.init_x - (this.diameter * this.sensitivity) &&
        mouseX <= this.init_x + (this.diameter * this.sensitivity) &&
        mouseY >= this.init_y - (this.diameter * this.sensitivity) &&
        mouseY <= this.init_y + (this.diameter * this.sensitivity))
      || (this.API_activated)
    ) {
      //Activate Vibration for a duration
      motorDelayTimes[this.ID] = Math.floor(millis());
      this.is_vibrating = true;

      //console.log('current drag ID: ' + current_dragged_module);

      if (!locked && configuration_mode_on) {
        current_dragged_module = this.ID;
        bx = motorGUI[current_dragged_module].init_x;
        by = motorGUI[current_dragged_module].init_y;
      }

    }
    var delayed_time = Math.floor(millis() - motorDelayTimes[this.ID]);
    //Stop vibrating the motor after a delay time
    if (motorDelayTimes[this.ID] > 0) {
      if (delayed_time > this.delay_time) {
        this.is_vibrating = false;
        delayed_time = this.delay_time;
      }
      else {
        this.is_vibrating = true;
      }
    }
    //if configuration mode is off, play vibration animations with delay time
    if (!configuration_mode_on) {
      stroke(0, 0, 0);
      if (this.is_vibrating && this.init_y <= 530) {
        //only play vibrate animation if configuration mode mode is off
        this.x = this.init_x;
        this.y = this.init_y;
        this.x += random(-this.intensity, this.intensity);
        this.y += random(-this.intensity, this.intensity);
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

function scan_modules() {
  var htmlmessage = 'Scanning';
  show_message(htmlmessage)
  window.setTimeout(function () {
    scan_complete = true;
    htmlmessage = total_number_of_modules + ' modules found.';
    show_message(htmlmessage);
  }, 500);
}

//Mock IP Generator
function generate_IP() {
  return floor(random(0, 255)) + '.' + floor(random(0, 255)) + '.' + floor(random(0, 255)) + '.' + floor(random(0, 255));
}

function show_IP() {
  text('Modules and Associated IP', 1060, 9);
  for (var l = 1; l < motorGUI.length; l++) {
    text(l + '\t:\t' + IP[l], 1060, 10 + (25 * l));
  }
}