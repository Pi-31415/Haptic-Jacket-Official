let jacket_img;
var configuration_mode_on = false;
var total_number_of_modules = 40;

var scan_complete = false;

//Motor related variables
let motorDelayTimes = [];
let motorGUI = [];


function setup() {
  //Render initial components
  pixelDensity(2.0);
  document.getElementById("config_confirm_btn").style.display = "none";
  document.getElementById("progressbar").style.visibility = "hidden";
  createCanvas(1300, 700);
  jacket_img = loadImage('img/jacket.png');

}

function draw() {
  //Set up scene
  background(255, 255, 255);
  fill(color(150, 150, 150));
  image(jacket_img, 30, 30, 1000, 500);
  if (scan_complete) {
    RenderMotors(total_number_of_modules);
    //Activate Vibration Detection
    for (var l = 1; l < motorGUI.length; l++) {
      motorGUI[l].activate();
    }
  }
}


//GUI Related Functions
function RenderMotors(number_of_motors) {
  var autoID = 1;
  var j, k;
  var current_separator_X = 50;
  var current_separator_Y = 50;
  var currentY = 600;
  var currentX = 50;
  for (j = 1; j <= 4; j++) {
    for (k = 1; k <= 20; k++) {
      if (autoID <= number_of_motors) {
        motorGUI[autoID] = new VibrationMotor(currentX, currentY, autoID);
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
function scan_modules() {
  //Mock progress bar for now
  M.Toast.dismissAll();
  var htmlmessage = 'Scanning';
    M.toast({ html: htmlmessage, classes: 'rounded' });
  document.getElementById("progressbar").style.visibility = "visible";
  window.setTimeout(function(){
    scan_complete = true;
    M.Toast.dismissAll();
    document.getElementById("progressbar").style.visibility = "hidden";
    htmlmessage = total_number_of_modules + ' modules found.';
    M.toast({ html: htmlmessage, classes: 'rounded' });
  }, 2500);
}
function save_configuration() {
  M.Toast.dismissAll();
  configuration_mode_on = false;
  document.getElementById("config_confirm_btn").style.display = "none";
  document.getElementById("configure_btn").style.display = "initial";
  M.toast({ html: 'Your configurations are saved.', classes: 'rounded' });
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
    } else {
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
        //only vibrate if vibration mode is off
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
    }
  }
}
