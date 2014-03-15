/*---------- REQUEST ANIMATION FRAME ----------*/
var request;
window.requestAnimFrame = (function(callback) {
  return  window.requestAnimationFrame ||
        window.webkitRequestAnimationFrame ||
        window.mozRequestAnimationFrame ||
        window.oRequestAnimationFrame ||
        window.msRequestAnimationFrame ||
          function(callback) {
              return window.setTimeout(callback, 1000 / 60);
          };
})();
/*---------------------------------------------*/

/*-------------- CANVAS VARIABLES -------------*/
var canvas = document.getElementById('myCanvas');
var ctx = canvas.getContext('2d');
var canvasPosition;
/*---------------------------------------------*/

setup();

function setup(){
  canvasResize();
  update();
}

function update(){
  draw();
}

function draw(){
  //Erasing the background
  ctx.clearRect(0, 0, canvas.width, canvas.height);

  ctx.fillStyle = 'black';
  ctx.beginPath();
  ctx.arc(Math.random()*canvas.width, Math.random()*canvas.height,
          40, 40, 0, Math.PI*2, false);
  ctx.fill();  

  request = requestAnimFrame(update);   
}

function canvasResize(){
  screenWidth = window.innerWidth;
  screenHeight = window.innerHeight;

  canvasPosition = canvas.getBoundingClientRect(); // Gets the canvas position
  canvas.width = screenWidth - 4;
  canvas.height = screenHeight - 4;
} 