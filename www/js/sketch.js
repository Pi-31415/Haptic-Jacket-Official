let jacket_img;
function setup() {
    createCanvas(1300, 700);
    jacket_img = loadImage('img/jacket.png');

}

function draw() {
    // Displays the image at point (0, height/2) at half size
    image(jacket_img, 50,50,1200,500);
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

//Vibration motor class
class VibrationMotor {


}

