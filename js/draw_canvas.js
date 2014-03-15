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
var canvasImages;
var margin;
/*---------------------------------------------*/

function setup(){
  canvasResize();
  canvasImages = [];
  margin = 20;  
  for(var i = 0; i < allImages.length; i++){
    var img = new Object();  //creating object
    initImage(img, i, allResults[i], allImages[i]);      //initializing
    canvasImages.push(img);
  }
  update();
}

function update(){
  draw();
}

function draw(){
  // console.log('called draw');
  //Erasing the background
  ctx.clearRect(0, 0, canvas.width, canvas.height);

  // ctx.fillStyle = 'black';
  // ctx.fillRect(0, 0, canvas.width, canvas.height);
  // ctx.beginPath();
  // ctx.arc(Math.random()*canvas.width, Math.random()*canvas.height,
  //         40, 40, 0, Math.PI*2, false);
  // ctx.fill();  
  
  for(var i = 0; i < canvasImages.length; i++){
    var obj = canvasImages[i];
    if(i < canvasImages.length - 1){
      var next = canvasImages[i + 1];
      ctx.strokeStyle = 'black';
      ctx.beginPath();
      ctx.moveTo(obj.pos.x, obj.pos.y);
      ctx.lineTo(next.pos.x, next.pos.y);
      ctx.stroke();
    }

    // console.log(obj);
    ctx.fillStyle = 'white';
    ctx.drawImage(obj.img, obj.pos.x, obj.pos.y);
  }

  request = requestAnimFrame(update);   
}

function initImage(obj, _index, _result, _img){
  var index = _index;
  var result = _result;
  var img = _img;
  var pos = new Object();
  if(_index == 0){
    pos = {x: margin,
           y: margin}
  }else if(_index == allImages.length - 1){
    pos = {x: canvas.width - img.width - margin,
           y: canvas.height - img.height - margin}
  }else{
    pos = {x: margin + Math.random() * (canvas.width - img.width - margin),
           y: margin + Math.random() * (canvas.height - img.height - margin) }
  }  

  obj.result = result;
  obj.img = img;
  obj.pos = pos;
}

function canvasResize(){
  screenWidth = window.innerWidth;
  screenHeight = window.innerHeight;

  marginTop = $('#title').height();
  // console.log('margin top: ' + marginTop);

  canvasPosition = canvas.getBoundingClientRect(); // Gets the canvas position
  canvas.width = screenWidth - 10;
  canvas.height = screenHeight - marginTop - 10;
} 