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
var nColumns;
var nLines;
var spacing;

/*---------------- IMAGE OBJECTS --------------*/
var canvasImages;
var arrowSize;


/*------------------ INTERACTION --------------*/
var mousePos;
// var isDown;
// var draggedObj;
var openUrl;

/*------------ SETUP | UPDATE | DRAW ----------*/
function setup(){
  canvasResize();
  canvasImages = [];
  margin = {x: 120,
            y: 120 }; 
  arrowSize = 24;
  // isDown = false;
  // isDragging = false;

  nLines = 3;
  nColumns = Math.ceil(allImages.length/nLines);
  spacing = { x: (canvas.width - (2 * margin.x)) / (nColumns - 1),
              y: (canvas.height - (2 * margin.y)) / (nLines - 1)};
  // console.log(nColumns);
  // console.log(spacing);

  for(var i = 0; i < allImages.length; i++){
    var imgObj = new Object();  //creating object
    initImage(imgObj, i, allResults[i], allImages[i]);      //initializing
    canvasImages.push(imgObj);
  }
  mousePos = {x: 0, y: 0};

  canvas.addEventListener('mousemove',
                          function(evt){
                            getMousePos(evt);
                          },
                          false);

    // canvas.addEventListener('mousedown',
    //                       function(){
    //                         isDown = true;
    //                       },
    //                       false);
    canvas.addEventListener('mouseup',
                          function(){
                            // isDown = false;
                            if(openUrl != ''){
                              window.open(openUrl, '_blank');  
                            }
                            // isDragging = false;
                            // for(var i = 0; i < canvasImages.length; i++){
                            //   var obj = canvasImages[i];
                            //   obj.isDragged = false;
                            // }
                          },
                          false);    
  update();
}

function update(){
  for(var i = 0; i < canvasImages.length; i++){
    canvasImages[i].updateImage();
  }

  // console.log('down: ' + isDown);
  // console.log('drag: ' + isDragging);

  draw();
}

function draw(){
  // console.log('called draw');
  //Erasing the background
  ctx.clearRect(0, 0, canvas.width, canvas.height); 

  var isHovering = false;

  //Draw images
  for(var i = 0; i < canvasImages.length; i++){
    var obj = canvasImages[i];
    if(i < canvasImages.length - 1){
      var next = canvasImages[i + 1];
      drawConnection(obj, next);
    }

    // console.log(obj.isHovered);
    if(obj.isHovered){

      isHovering = true;

      ctx.fillStyle = parseHslaColor(0, 0, 0, 0.5);
      ctx.fillRect(obj.pos.x - obj.img.width/2, obj.pos.y - obj.img.height/2,
                   obj.img.width, obj.img.height);        
      ctx.drawImage(obj.img, obj.pos.x - obj.img.width/2 - 10, obj.pos.y - obj.img.height/2 - 10);
    }else{
      ctx.drawImage(obj.img, obj.pos.x - obj.img.width/2, obj.pos.y - obj.img.height/2);  
    }
  }

  //Draw description
  for(var i = 0; i < canvasImages.length; i++){
    var obj = canvasImages[i];
    if(obj.isHovered){
      drawDescription(obj);
    }
  }

  //Change cursor
  if(isHovering){
    canvas.style.cursor = 'pointer';  
  }else{
    canvas.style.cursor = 'default';  
  }

  // request = requestAnimFrame(update);   
}

function drawConnection(obj, next){
  var start = { x: obj.pos.x,
                y: obj.pos.y };
  var end = { x: next.pos.x,
              y: next.pos.y };
  var dist = calculateDistance(start.x, start.y, end.x, end.y);
  dist -= 80;
  var angle = Math.atan2(end.y - start.y, end.x - start.x) - Math.PI/2;

    ctx.save();
      ctx.translate(start.x, start.y);
      ctx.rotate(angle);

        ctx.strokeStyle = parseHslaColor(0, 0, 0, 0.4);
        ctx.lineWidth = 2;        
        ctx.beginPath();
        ctx.moveTo(0, 0);
        ctx.lineTo(0, dist);
        ctx.stroke();
        
        ctx.translate(0, dist);
        // ctx.fillStyle = 'black';
        ctx.beginPath();
        ctx.moveTo(- arrowSize/2, - arrowSize/2);
        ctx.lineTo(0, 0);
        ctx.lineTo(arrowSize/2, - arrowSize/2);
        // ctx.fill();
        ctx.stroke();
      ctx.restore();
}

function drawDescription(obj){
  ctx.font="bold 12px Arial";
  var txt = obj.result.titleNoFormatting;
  var textWidth = ctx.measureText(txt).width;
  var descPos = {x: obj.pos.x - obj.img.width/2,
                 y: obj.pos.y + obj.img.height/2 + 4 }
  wrapText(ctx, txt, descPos.x, descPos.y, obj.img.width/2 + margin.x - 16, 14);
}

/*---------------- IMAGE OBJECTS --------------*/
function initImage(obj, _index, _result, _img){
  var index = _index;
  var result = _result;
  var img = _img;
  var pos = new Object();

  pos = {x: margin.x + Math.floor(index / nLines) * spacing.x,
         y: 0}
         if(Math.floor(index / nLines) % 2 == 0){
          pos.y = margin.y + ((index % 3) * spacing.y);
         }else{
          pos.y = margin.y + (( (nLines - 1) * spacing.y) - ( (index % nLines) * spacing.y));
         }

  //Vars
  obj.index = index;
  obj.result = result;
  obj.img = img;
  obj.pos = pos;
  obj.isHovered = false;
  // obj.isDragged = false;  
  
  //Functions
  obj.updateImage = updateImage;
}

function updateImage(){
  //Check Hover
  //If the mouse is not dragging any object...
  // if(!isDragging){
    if(mousePos.x > this.pos.x - this.img.width/2 && mousePos.x < this.pos.x + this.img.width/2 &&
       mousePos.y > this.pos.y - this.img.height/2 && mousePos.y < this.pos.y + this.img.height/2 ){
      // console.log(this.img.src);
      this.isHovered = true;
      // console.log(isHovered);

      //Check click
      // if(isDown){
        // this.isDragged = true;
        // isDragging = true;
      // }
      openUrl = this.result.originalContextUrl;

    }else{
      this.isHovered = false;
      openUrl = '';
    }
  // }

  //Drag
  // if(this.isDragged){
  //   var x, y;
  //   x = mousePos.x;
  //   y = mousePos.y;
  //   this.pos.x = x;
  //   this.pos.y = y;
  // }  
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
  // console.log(canvasPosition);
} 

var parseHslaColor = function(h, s, l, a){
  var myHslColor = 'hsla(' + h + ', ' + s + '%, ' + l + '%, ' + a +')';
  //console.log('called calculateAngle function');
  return myHslColor;
}

function wrapText(context, text, x, y, maxWidth, textLeading) {

  var words = text.split(' ');
  var line = '';
  var metrics;
  var testWidth;
  for(var n = 0; n < words.length; n++) {
    var testLine = line + words[n] + ' ';
    var metrics = context.measureText(testLine);
    var testWidth = metrics.width;
    if (testWidth > maxWidth && n > 0) {
      context.fillStyle = 'black';
      context.textBaseline = 'top';
      context.fillText(line, x, y);
      line = words[n] + ' ';
      y += textLeading;
    } else {
      line = testLine;
    }
  }

  context.fillStyle = 'black';
  context.textBaseline = 'top';
  metrics = context.measureText(line);
  testWidth = metrics.width;  
  context.fillText(line, x, y);
}

function getMousePos(evt){
  mousePos.x = evt.clientX - canvasPosition.left;
  mousePos.y = evt.clientY - canvasPosition.top;
  //You have to use clientX! .x doesn't work with Firefox!
  // console.log(mousePos);
  update();
}