/*-------------------------------------------------*/
/* Author : Pi */
/* Date: Feb 26, 2021. */
/* Description:  This is the GUI visualization for the Haptic Jacket controller middleware */
/* Dependencies : node, materialize and p5.js*/
/*-------------------------------------------------*/

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


function setup() {

  //Scan a random number of modules
  //Maximum support is 60, but IP can only handle 28 on screen.

  total_number_of_modules = floor(random(10, 28));


  //Render initial components
  pixelDensity(2.0);
  document.getElementById("config_confirm_btn").style.display = "none";
  document.getElementById("progressbar").style.visibility = "hidden";
  createCanvas(screen_width, 720);
  jacket_img = loadImage('img/jacket.png');

  //Generate IP initially
  for (var l = 1; l <= total_number_of_modules; l++) {
    IP[l] = generate_IP();
  }

}

function draw() {
  //Set up scene
  background(255, 255, 255);
  fill(color(150, 150, 150));
  image(jacket_img, 30, 20, 1000, 500);

  //Check if localstorage exists
  if (localStorage.getItem("1-x") != null) {
    configuration_storage_exists = true;
  }

  //Render Other Motors
  if (scan_complete) {
    RenderMotors(total_number_of_modules);
    //Activate Vibration Detection
    for (var l = 1; l < motorGUI.length; l++) {
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
      fill(color(186, 104, 200));
    } else {
      //selection color on dummy - dark purple
      fill(87, 6, 140);
    }
  } else {
    fill(color(150, 150, 150));
    overBox = false;
  }

  if (current_dragged_module != 0 && configuration_mode_on) {
    // Draw the dummy
    ellipse(bx, by, boxSize, boxSize);
    fill(color(0, 0, 0))
    text(current_dragged_module, bx - 2, by - 20);
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
      document.getElementById("result").innerHTML = "Sorry, your browser does not support Web Storage...";
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
  stroke(127, 63, 120);
  rect(20, 560, 1020, 160);

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
  M.Toast.dismissAll();
  M.toast({
    html: '<span>First, scan for modules.</span>', classes: 'rounded', completeCallback: function () {
      M.toast({
        html: 'Then, configure the position<br>of the modules on the jacket <br> and save.', classes: 'rounded', completeCallback: function () {
          M.toast({ html: '<span>Finally, mouse-hover the modules <br> to activate them.</span>', classes: 'rounded' });
        }
      });
    }
  });
}

function configure() {
  current_dragged_module = 0;
  M.Toast.dismissAll();
  if (!scan_complete) {
    M.toast({ html: 'Please scan for modules first.', classes: 'rounded' });
  } else {
    configuration_mode_on = true;
    document.getElementById("config_confirm_btn").style.display = "initial";
    document.getElementById("configure_btn").style.display = "none";
    M.toast({ html: 'Drag and drop the modules onto the jacket. <br> Save when done.', classes: 'rounded' });
  }
}

function save_configuration() {
  M.Toast.dismissAll();
  current_dragged_module = 0;
  configuration_mode_on = false;
  document.getElementById("config_confirm_btn").style.display = "none";
  document.getElementById("configure_btn").style.display = "initial";
  M.toast({ html: 'Your configurations are saved.', classes: 'rounded' });
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
  M.toast({ html: 'All configuration data cleared.', classes: 'rounded' });
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
    this.color_vibrating = color(186, 104, 200);
    this.color_non_vibration = color(150, 150, 150);
  }
  move(x, y) {
    this.init_x = x;
    this.init_y = y;
  }
  activate() {
    if (
      mouseX >= this.init_x - (this.diameter * this.sensitivity) &&
      mouseX <= this.init_x + (this.diameter * this.sensitivity) &&
      mouseY >= this.init_y - (this.diameter * this.sensitivity) &&
      mouseY <= this.init_y + (this.diameter * this.sensitivity)
    ) {
      //Activate Vibration for a duration
      motorDelayTimes[this.ID] = Math.floor(millis());
      this.is_vibrating = true;

      console.log('current drag ID: ' + current_dragged_module);

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
      if (this.is_vibrating) {
        //only vibrate if configuration mode mode is off
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
  //Mock progress bar for now
  M.Toast.dismissAll();
  var htmlmessage = 'Scanning';
  M.toast({ html: htmlmessage, classes: 'rounded' });
  document.getElementById("progressbar").style.visibility = "visible";
  window.setTimeout(function () {
    scan_complete = true;
    M.Toast.dismissAll();
    document.getElementById("progressbar").style.visibility = "hidden";
    htmlmessage = total_number_of_modules + ' modules found.';
    M.toast({ html: htmlmessage, classes: 'rounded' });
  }, 500);
}

//Mock IP Generator
function generate_IP() {
  return floor(random(0, 255)) + '.' + floor(random(0, 255)) + '.' + floor(random(0, 255)) + '.' + floor(random(0, 255));
}

function show_IP() {
  text('Modules and Associated IP', 1060, 15);
  for (var l = 1; l < motorGUI.length; l++) {
    text(l + ' - ' + IP[l], 1060, 10 + (25 * l));
  }
}