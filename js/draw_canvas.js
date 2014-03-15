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
var marginTop;
var margin;
/*---------------------------------------------*/

function setup(){
  marginTop = $('title').height();
  console.log('margin top: ' + marginTop);
  margin = 20;
  canvasResize();
  update();
}

function update(){
  draw();
}

function draw(result){
  console.log('called draw');
  //Erasing the background
  // ctx.clearRect(0, 0, canvas.width, canvas.height);

  ctx.fillStyle = 'black';
  ctx.fillRect(0, 0, canvas.width, canvas.height);
  // ctx.beginPath();
  // ctx.arc(Math.random()*canvas.width, Math.random()*canvas.height,
  //         40, 40, 0, Math.PI*2, false);
  // ctx.fill();  
  
  for(var i = 0; i < allImages.length; i++){
    var img = allImages[i];
    console.log('image ' + i + ": width = " + img.width);
    var pos = new Object();
    if(i == 0){
      pos = {x: margin,
             y: margin}
    }else if(i == allImages.length - 1){
      pos = {x: canvas.width - img.width - margin,
             y: canvas.height - img.height - margin}
    }else{
      pos = {x: Math.random()*canvas.width - img.width - margin,
             y: Math.random()*canvas.height - img.height - margin}
    }
    ctx.drawImage(img, pos.x, pos.y);
  }

  // request = requestAnimFrame(update);   
}

function canvasResize(){
  screenWidth = window.innerWidth;
  screenHeight = window.innerHeight;

  canvasPosition = canvas.getBoundingClientRect(); // Gets the canvas position
  canvas.width = screenWidth - 4;
  canvas.height = screenHeight - 4;
} 