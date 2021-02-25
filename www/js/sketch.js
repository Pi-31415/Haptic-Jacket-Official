let jacket_img;
var configuration_mode_on = false;
//Motor related variables, for the motor being dragged
let motorDelayTimes = [];


function setup() {
  pixelDensity(2.0);
  document.getElementById("config_confirm_btn").style.display = "none";
  createCanvas(1300, 700);
  jacket_img = loadImage('img/jacket.png');

  k = new VibrationMotor(500, 200, 1);
  j = new VibrationMotor(700, 200, 2);
}

function draw() {
  //Set up scene
  background(255, 255, 255);
  fill(color(150, 150, 150));
  image(jacket_img, 250, 50, 1000, 500);

  k.activate();
  j.activate();
}


//GUI Related Functions
function show_help() {
  alert("Hello1");
}

function configure() {
  configuration_mode_on = true;
  document.getElementById("config_confirm_btn").style.display = "initial";
  document.getElementById("configure_btn").style.display = "none";
}

function scan_modules() {
  alert("Hello3");

}

function save_configuration() {
  configuration_mode_on = false;
  document.getElementById("config_confirm_btn").style.display = "none";
  document.getElementById("configure_btn").style.display = "initial";
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
    this.intensity = 2;
    this.sensitivity = 1;
    this.delay_time = 300;
    this.ID = autoID;
    this.is_vibrating = false;
    //Color scheme
    this.color_vibrating = color(186, 104, 200);
    this.color_non_vibration = color(150, 150, 150);
  }

  activate() {
    if (
      mouseX >= this.x - (this.diameter * this.sensitivity) &&
      mouseX <= this.x + (this.diameter * this.sensitivity) &&
      mouseY >= this.y - (this.diameter * this.sensitivity) &&
      mouseY <= this.y + (this.diameter * this.sensitivity)
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
        ellipse(this.x, this.y, this.diameter, this.diameter);
        fill(color(0, 0, 0))
        text(this.ID, this.x - 2, this.y - 20);
      }
    }
  }
}
