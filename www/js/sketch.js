let jacket_img;
let currentvibratingID = 0;
let sensitivity = 0.5;
let motorDelayTimes = [];
let delay_time = 300;


function setup() {
    createCanvas(1300, 700);
    jacket_img = loadImage('img/jacket.png');

    k = new VibrationMotor(500, 200, 1);
    k.display();
    
}

function draw() {
    //Set up scene
    background(255, 255, 255);
    fill(color(150, 150, 150));

    image(jacket_img, 50,50,1200,500);

    //activate motors
    k.vibrate();

}

//Functions related to GUI
function show_help(){
    alert("Hello1");
}

function configure(){
    alert("Hello2");
}

function scan_modules(){
    alert("Hello3");

}


// Vibration Motor Class
class VibrationMotor {
    constructor(X, Y, autoID) {
      this.diameter = 20;
      this.x = X;
      this.y = Y;
      this.speed = 2;
      this.intensity = 3;
      this.ID = autoID;
      this.is_vibrating = false;
    }
    move() {
      this.x += random(-this.speed, this.speed);
      this.y += random(-this.speed, this.speed);
    }
    vibrate() {
      if (
        mouseX >= this.x - (this.diameter * sensitivity) &&
        mouseX <= this.x + (this.diameter * sensitivity) &&
        mouseY >= this.y - (this.diameter * sensitivity) &&
        mouseY <= this.y + (this.diameter * sensitivity)
      ) {
        //Activate Vibration for a duration
        motorDelayTimes[this.ID] = Math.floor(millis());
        this.is_vibrating = true;
      }
  
      var delayed_time = Math.floor(millis() - motorDelayTimes[this.ID]);
      //Added Delay
      if (motorDelayTimes[this.ID] > 0) {
        if (delayed_time > delay_time) {
          this.is_vibrating = false;
          delayed_time = delay_time;
          
        } 
        else {
          this.is_vibrating = true;
        }
      }
  
      //animate vibration
      if (this.is_vibrating) {
        currentvibratingID = this.ID;
        this.x += random(-this.intensity, this.intensity);
        this.y += random(-this.intensity, this.intensity);
        //vibrate
        fill(color(255, 40, 0));
        ellipse(this.x, this.y, this.diameter, this.diameter);
        fill(color(150, 150, 150));
        text(this.ID, this.x - 2, this.y - 20);

      } else {
        ellipse(this.x, this.y, this.diameter, this.diameter);
        text(this.ID, this.x - 2, this.y - 20);
       
      }
  
    }
    display() {
      if (this.ID != currentvibratingID) {
        ellipse(this.x, this.y, this.diameter, this.diameter);
      }
  
    }
  }

