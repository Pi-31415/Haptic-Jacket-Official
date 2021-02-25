// Declare GUI objects
let selection_box;
let row_slider;
let column_slider;
let sensitivity_slider;
let delay_slider;
let slider_width = '180px';
let motorGUI = [];
let motorDelayTimes = [];
let help_message = 'Haptic Jacket Simulation Demo\nHover the mouse over the vibration motors to simulate tactile motion.\nEdit the sliders to see different results.';
let API_message = 'No output from API / Master Node';

//Default Variables for motors
var motors = {
  "0": {
    "name": "Front",
    "row": 3,
    "column": 3
  },
  "1": {
    "name": "Back",
    "row": 3,
    "column": 3
  },
  "2": {
    "name": "Right Hand",
    "row": 4,
    "column": 1
  },
  "3": {
    "name": "Left Hand",
    "row": 4,
    "column": 1
  }
};

//Initial Variables
let max_row_column = 10;
let regionID = 0;
let arm_width = 80;
let arm_height = 270;
let body_width = 230;
let body_height = 350;
let padding = 10;
let margin = 100;
let margin_top = 150;
let display_region = motors[regionID].name;
let display_rows = motors[regionID].row;
let display_columns = motors[regionID].column;
let currentvibratingID = 0;

let sensitivity = 1;
let max_sensitivity = 4;

let max_delay_time = 2000;
let delay_time = 300;


//Main Functions
function setup() {
  pixelDensity(3.0);
  createCanvas(displayWidth, 0.8 * displayHeight);
  bug = new VibrationMotor();
  //UI for sliders
  createSelectionBox();
  createSliders();
  RenderMotors();

}


function draw() {
  background(255, 255, 255);

  fill(color(0, 0, 0));
  updateText();
  renderRectangleText();

  //Render frame first
  fill(color(250, 250, 250));

  //renderRectangleFrames();
  renderJacket();

  fill(color(150, 150, 150));
  RenderMotors();

  //Activate Vibration Detection
  for (var l = 1; l < motorGUI.length; l++) {
    motorGUI[l].vibrate();
  }

  fill(color(0, 0, 0));
  //API Output
  text(help_message, margin + padding, margin_top + body_height + (padding * 3), 500, 100);
  text(API_message, margin + padding, margin_top + body_height + (padding * 3) + 70, 500, 100);
  //console.log(millis());
}

//GUI and data related functions
function createSelectionBox() {
  selection_box = createSelect();
  selection_box.position(20, 60);
  for (var i = 0; i < Object.keys(motors).length; i++) {
    selection_box.option(motors[i].name);
  }
  selection_box.selected(display_region);
  selection_box.changed(SelectRegion);
}
function createSliders() {
  row_slider = createSlider(0, max_row_column, display_rows);
  row_slider.position(250, 40);
  row_slider.style('width', slider_width);
  row_slider.changed(updateRows);

  column_slider = createSlider(0, max_row_column, display_columns);
  column_slider.position(450, 40);
  column_slider.style('width', slider_width);
  column_slider.changed(updateColumns);

  delay_slider = createSlider(0, max_delay_time, delay_time);
  delay_slider.position(650, 40);
  delay_slider.style('width', slider_width);
  delay_slider.changed(updateDelay);

  sensitivity_slider = createSlider(0, max_sensitivity, sensitivity, 0.1);
  sensitivity_slider.position(850, 40);
  sensitivity_slider.style('width', slider_width);
  sensitivity_slider.changed(updateSensitivity);
}
function updateRows() {
  motors[regionID].row = row_slider.value();
  display_rows = motors[regionID].row;
  updateText();
  RenderMotors();
}
function updateColumns() {
  motors[regionID].column = column_slider.value();
  display_columns = motors[regionID].column;
  updateText();
  RenderMotors();
}
function updateDelay() {
  delay_time = delay_slider.value();
  updateText();
}
function updateSensitivity() {
  sensitivity = sensitivity_slider.value();
  updateText();
}
function updateText() {

  if (delay_time >= 1000) {
    formatted_delay_time = delay_time / 1000 + ' s'
  } else {
    formatted_delay_time = delay_time + ' ms';
  }

  textSize(16);
  text('Select Jacket Region\nto modify number of motors', 20, 20);
  text(display_region + ' Rows : ' + display_rows, 250, 30);
  text(display_region + ' Columns : ' + display_columns, 450, 30);
  text('Delay Duration : ' + formatted_delay_time, 650, 30);
  text('Resolution : ' + sensitivity, 850, 30);
}
//Function to update data based on selected region of jacket
function SelectRegion() {
  //This selects the region of the haptic jacket currently being manipulated
  display_region = selection_box.value();
  //Update the data according to the selected region
  for (var i = 0; i < Object.keys(motors).length; i++) {
    if (display_region == motors[i].name) {
      regionID = i;
    }
  }
  //Then update the values
  display_region = motors[regionID].name;
  display_rows = motors[regionID].row;
  display_columns = motors[regionID].column;
  //Update the sliders too, by deleting and constructing them again
  removeElements();
  createSelectionBox();
  createSliders();
}

function renderRectangleFrames() {
  //This function renders the guiding wireframes for different regions of the jacket
  //Right Arm Frontal View
  rect(margin + padding, margin_top, arm_width, arm_height);
  //Body Frontal View
  rect(margin + (2 * padding) + arm_width, margin_top, body_width, body_height);
  //Left Arm Frontal View
  rect(margin + (3 * padding) + arm_width + body_width, margin_top, arm_width, arm_height);
  //Back Body View
  rect(margin + (3 * padding) + arm_width + 2 * body_width, margin_top, body_width, body_height);
}

function renderJacket() {
  //This draws lineart of Jacket
  noFill();
  /*
  beginShape();
  vertex( margin + padding, margin_top);
  vertex(margin + padding, margin_top+arm_height);
  endShape(CLOSE);
  */
  //Right Arm Frontal View
  rect(margin + padding, margin_top, arm_width + padding, arm_height, 30, 0, 0, 10);
  //Body Frontal View
  rect(margin + (2 * padding) + arm_width, margin_top, body_width, body_height, 0, 0, 30, 30);
  //Left Arm Frontal View
  rect(margin + (2 * padding) + arm_width + body_width, margin_top, arm_width + padding, arm_height, 0, 30, 10, 0);
  //Back Body View
  rect(margin + (3 * padding) + arm_width + 2 * body_width, margin_top, body_width, body_height, 0, 0, 30, 30);
}

function renderRectangleText() {
  //Text Legends
  text(motors[2].name, (arm_width / 2) - 30 + margin + padding, margin_top - 30);
  text(motors[0].name, (margin + (2 * padding) + arm_width) * 1.5, margin_top - 30);
  text(motors[3].name, (arm_width / 2) - 30 + margin + (3 * padding) + arm_width + body_width, margin_top - 30);
  text(motors[1].name, margin + (3 * padding) + arm_width + 2.4 * body_width, margin_top - 30);
}

//Render Vibration Motors dynamically on the jacket
function RenderMotors() {
  var autoID = 1;
  var j, k;

  //First render the right hands
  var current_separator_X = arm_width / (motors[2].column + 1);
  var current_separator_Y = arm_height / (motors[2].row + 1);
  var currentY = margin_top + current_separator_Y;
  var currentX = margin + padding + current_separator_X;
  for (j = 1; j <= motors[2].row; j++) {
    for (k = 1; k <= motors[2].column; k++) {
      motorGUI[autoID] = new VibrationMotor(currentX, currentY, autoID);
      motorGUI[autoID].display();
      currentX += current_separator_X;
      autoID++;
    }
    currentX = margin + padding + current_separator_X;
    currentY += current_separator_Y;
  }

  //Then Render Body Front
  current_separator_X = body_width / (motors[0].column + 1);
  current_separator_Y = body_height / (motors[0].row + 1);
  currentY = margin_top + current_separator_Y;
  currentX = margin + (2 * padding) + arm_width + current_separator_X;
  for (j = 1; j <= motors[0].row; j++) {
    for (k = 1; k <= motors[0].column; k++) {
      motorGUI[autoID] = new VibrationMotor(currentX, currentY, autoID);
      motorGUI[autoID].display();
      currentX += current_separator_X;
      autoID++;
    }
    currentX = margin + (2 * padding) + arm_width + current_separator_X;
    currentY += current_separator_Y;
  }

  //Then Render Hand Left
  current_separator_X = arm_width / (motors[3].column + 1);
  current_separator_Y = arm_height / (motors[3].row + 1);
  currentY = margin_top + current_separator_Y;
  currentX = margin + (3 * padding) + arm_width + body_width + current_separator_X;
  for (j = 1; j <= motors[3].row; j++) {
    for (k = 1; k <= motors[3].column; k++) {
      motorGUI[autoID] = new VibrationMotor(currentX, currentY, autoID);
      motorGUI[autoID].display();
      currentX += current_separator_X;
      autoID++;
    }
    currentX = margin + (3 * padding) + arm_width + body_width + current_separator_X;
    currentY += current_separator_Y;
  }

  //Then Render Body Back
  current_separator_X = body_width / (motors[1].column + 1);
  current_separator_Y = body_height / (motors[1].row + 1);
  currentY = margin_top + current_separator_Y;
  currentX = margin + (3 * padding) + arm_width + 2 * body_width + current_separator_X;
  for (j = 1; j <= motors[1].row; j++) {
    for (k = 1; k <= motors[1].column; k++) {
      motorGUI[autoID] = new VibrationMotor(currentX, currentY, autoID);
      motorGUI[autoID].display();
      currentX += current_separator_X;
      autoID++;
    }
    currentX = margin + (3 * padding) + arm_width + 2 * body_width + current_separator_X;
    currentY += current_separator_Y;
  }


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
      API_message = 'Sample API Output from Master Node \nModule ID : ' + this.ID + ', Duration : ' + delay_time + ' ms, Intensity : 100';

    } else {
      ellipse(this.x, this.y, this.diameter, this.diameter);
      text(this.ID, this.x - 2, this.y - 20);
     
    }

  }
  display() {
    if (this.ID != currentvibratingID) {
      //ellipse(this.x, this.y, this.diameter, this.diameter);
    }

  }
}
