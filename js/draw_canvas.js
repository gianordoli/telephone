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
var margin;


/*---------------- IMAGE OBJECTS --------------*/
var canvasImages;
var arrowSize;


/*------------------ INTERACTION --------------*/
var mousePos;
var isDown;
var draggedObj;


/*------------ SETUP | UPDATE | DRAW ----------*/
function setup(){
  canvasResize();
  canvasImages = [];
  margin = 100; 
  arrowSize = 30;
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
    // if(!isDragging){
    //   canvasImages[i].checkHover();
    // }

    //   canvasImages[i].drag();
    canvasImages[i].updateImage();
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
        ctx.lineWidth = 2;        
        ctx.beginPath();
        ctx.moveTo(0, 0);
        ctx.lineTo(0, dist);
        ctx.stroke();
        
        ctx.translate(0, dist);
        ctx.fillStyle = 'black';
        ctx.beginPath();
        ctx.moveTo(0, 0);
        ctx.lineTo(- arrowSize/2, - arrowSize/2);
        ctx.lineTo(arrowSize/2, - arrowSize/2);
        ctx.fill();
      ctx.restore();
}

/*---------------- IMAGE OBJECTS --------------*/
function initImage(obj, _index, _result, _img){
  var index = _index;
  var result = _result;
  var img = _img;
  var pos = new Object();

  pos = {x: margin + Math.floor(index / 3) * 200 - img.width/2,
         y: 0}
         if(Math.floor(index / 3) % 2 == 0){
          pos.y = margin + ((index % 3) * 200) - img.height/2;
         }else{
          pos.y = margin + ((2 * 200) - ((index % 3) * 200)) - img.height/2;
         }

  //Vars
  obj.index = index;
  obj.result = result;
  obj.img = img;
  obj.pos = pos;
  obj.isDragged = false;  
  
  //Functions
  obj.updateImage = updateImage;
}

function updateImage(){
  //Check Hover
  //If the mouse is not dragging any object...
  if(!isDragging){
    if(mousePos.x > this.pos.x && mousePos.x < this.pos.x + this.img.width &&
       mousePos.y > this.pos.y && mousePos.y < this.pos.y + this.img.height ){
      // console.log(this.img.src);
      if(isDown){
        this.isDragged = true;
        isDragging = true;
      }
    }
  }

  //Drag
  if(this.isDragged){
    var x, y;
    x = mousePos.x - this.img.width/2;
    y = mousePos.y - this.img.height/2;
    this.pos.x = x;
    this.pos.y = y;
  }  
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