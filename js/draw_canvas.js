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
var arrowSize;

var mousePos;
var isDown;
var draggedObj;
/*---------------------------------------------*/

function setup(){
  canvasResize();
  canvasImages = [];
  margin = 20; 
  arrowSize = 10;
  isDown = false;
  isDragging = false;
  for(var i = 0; i < allImages.length; i++){
    var img = new Object();  //creating object
    initImage(img, i, allResults[i], allImages[i]);      //initializing
    canvasImages.push(img);
  }
  mousePos = {x: 0, y: 0};

  canvas.addEventListener('mousemove',
                          function(evt){
                            getMousePos(evt);
                          },
                          false);

    canvas.addEventListener('mousedown',
                          function(){
                            isDown = true;
                          },
                          false);
    canvas.addEventListener('mouseup',
                          function(){
                            isDown = false;
                            isDragging = false;
                            for(var i = 0; i < canvasImages.length; i++){
                              var obj = canvasImages[i];
                              obj.isDragged = false;
                            }
                          },
                          false);    
  update();
}

function update(){
  for(var i = 0; i < canvasImages.length; i++){
    if(!isDragging){
      canvasImages[i].checkHover();
    }

      canvasImages[i].drag();

  }

  console.log('down: ' + isDown);
  console.log('drag: ' + isDragging);
  // if(draggedObj != null){
  //   console.log();
  // }
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
      drawConnection(obj, next);
    }

    ctx.drawImage(obj.img, obj.pos.x, obj.pos.y);
  }

  // request = requestAnimFrame(update);   
}

function drawConnection(obj, next){
  var start = { x: obj.pos.x + obj.img.width/2,
                y: obj.pos.y + obj.img.height/2 };
  var end = { x: next.pos.x + next.img.width/2,
              y: next.pos.y + next.img.height/2 };
  var dist = calculateDistance(start.x, start.y, end.x, end.y);
  dist -= 80;
  var angle = Math.atan2(end.y - start.y, end.x - start.x) - Math.PI/2;

    ctx.save();
      ctx.translate(start.x, start.y);
      ctx.rotate(angle);

        ctx.strokeStyle = 'black';
        ctx.beginPath();
        ctx.moveTo(0, 0);
        ctx.lineTo(0, dist);
        ctx.stroke();
        
        ctx.translate(0, dist);
        ctx.fillStyle = 'black';
        ctx.lineWidth = 3;
        ctx.beginPath();
        ctx.moveTo(0, 0);
        ctx.lineTo(- arrowSize/2, - arrowSize/2);
        ctx.lineTo(arrowSize/2, - arrowSize/2);
        ctx.fill();
      ctx.restore();
}

function checkHover(){
  if(mousePos.x > this.pos.x && mousePos.x < this.pos.x + this.img.width &&
     mousePos.y > this.pos.y && mousePos.y < this.pos.y + this.img.height ){
    // console.log(this.img.src);
    if(isDown){
      this.isDragged = true;
      isDragging = true;
    }
  }
}

function drag(){
  if(this.isDragged){
    var x, y;
    x = mousePos.x;
    y = mousePos.y;
    this.pos.x = x;
    this.pos.y = y;
  }
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
  obj.index = index;
  obj.result = result;
  obj.img = img;
  obj.pos = pos;
  obj.checkHover = checkHover;
  obj.drag = drag;
  obj.isDragged = false;
}

var calculateDistance = function(x1, y1, x2, y2){
  var angle = Math.atan2(y1 - y2, x1 - x2);
  var dist;
  if( (y1 - y2) == 0 ){
    dist = (x1 - x2) / Math.cos( angle );
  }else{
    dist = (y1 - y2) / Math.sin( angle );
  }
  return dist;
} 

function canvasResize(){
  screenWidth = window.innerWidth;
  screenHeight = window.innerHeight;

  marginTop = $('#title').height();
  // console.log('margin top: ' + marginTop);

  canvasPosition = canvas.getBoundingClientRect(); // Gets the canvas position
  canvas.width = screenWidth - 10;
  canvas.height = screenHeight - marginTop - 10;
  canvasPosition = canvas.getBoundingClientRect(); // Gets the canvas position again!
  console.log(canvasPosition);
} 

function getMousePos(evt){
  mousePos.x = evt.clientX - canvasPosition.left;
  mousePos.y = evt.clientY - canvasPosition.top;
  //You have to use clientX! .x doesn't work with Firefox!
  // console.log(mousePos);
  update();
}