// canvas setup
const canvas = document.getElementById("snake");
const ctx = canvas.getContext("2d");

// variables and constructor functions
var scale = 20;
var score = 0;
var rows = canvas.height/scale;
var columns = canvas.width / scale;
var frameRate = 30000;
var allFoods = [];
var snake = {
    x: scale,
    y: scale,
    headVel: [scale,0],
    total: [],
    move: function() {
        for(var i = snake.total.length - 1; i >= 0; i--) {
            if (i == 0) {
                snake.total[i].x = snake.x;
                snake.total[i].y = snake.y;
            }
            else {
                snake.total[i].x = snake.total[i-1].x;
                snake.total[i].y = snake.total[i-1].y;
            }
        }
        snake.x += snake.headVel[0];
        snake.y += snake.headVel[1];
    }
}

var food = {
    x: Math.floor(Math.random()*columns)*scale,
    y: Math.floor(Math.random()*rows)*scale,
    w: scale,
    h: scale,
    refreshLocation: function() {
        this.x = Math.floor(Math.random()*columns)*scale;
        this.y = Math.floor(Math.random()*rows)*scale;
    },
}

function tail() {
    if (tail.length > 0){
        this.x = snake.total[snake.total.length -1].oldX;
        this.y = snake.total[snake.total.length -1].oldY;
    }
    else {
        this.x = snake.oldX;
        this.y = snake.oldY;
    }
    this.oldX;
    this.oldY;
    snake.total.push(this);
}

// functions
function collision(x1, x2, y1, y2, w1, w2, h1, h2){
    return x1 <= (x2 + w2) &&
    x2 <= (x1 + w1) &&
    y1 <= (y2 + h2) &&
    y2 <= (y1 + h1)
}
setInterval(snake.move, 100);
// update function
var update = function() {
//    canvas borders
    if(snake.y > canvas.height) snake.y = 0;
    if(snake.y < 0) snake.y = canvas.height - scale;
    if(snake.x < 0) snake.x = canvas.width - scale;
    if(snake.x > canvas.width) snake.x = 0;
//   food collision
    if(collision(food.x, snake.x, food.y, snake.y, 0, 0, 0, 0)){
            console.log("food eaten!");
            score+=10;
            food.refreshLocation();
            new tail;
    }
    for (i in snake.total) {
        snake.total[i].oldX = snake.total[i].x;
        snake.total[i].oldY = snake.total[i].y;
    }
     snake.oldX = snake.x;
     snake.oldY = snake.y;
    //  tail collision
    for(tails in snake.total){
        if(collision(snake.x, snake.total[tails].x, snake.y, snake.total[tails].y, 0, 0, 0, 0)){
            snake.total.length = 0;
            console.log(snake.total);
            snake.x = scale;
            snake.y = scale;
            food.refreshLocation();
            snake.headVel = [scale, 0];
            score = 0;
        }
        // write score
        document.getElementById("score").innerHTML = score;
}
}
    

// input
var keysDown = {};

addEventListener("keydown", function (e) {
	keysDown[e.key] = true;
}, false);

addEventListener("keyup", function (e) {
	delete keysDown[e.key];
}, false);

var input = function(){
    if("w" in keysDown){
        if(snake.headVel[1] != scale){
            snake.headVel = [0, -scale];
        }
    }
    if("s" in keysDown) {
        if(snake.headVel[1] != -scale){
            snake.headVel = [0, scale];
        }
    }
    if("a" in keysDown) {
        if(snake.headVel[0] != scale){
            snake.headVel = [-scale, 0];
        }
    
    }
    if("d" in keysDown) {
        if(snake.headVel[0] != -scale){
            snake.headVel = [scale, 0]; 
        }
    }
    snake.move;
}

// render function
var render = function(){
    ctx.fillStyle = "black";
    ctx.fillRect(0, 0, canvas.width, canvas.height);
    ctx.fillStyle = "white";
    ctx.fillRect(snake.x, snake.y, scale, scale);
    ctx.strokeStyle = 'red';
        ctx.strokeRect(snake.x, snake.y, scale, scale);
    for (i in snake.total) {
        ctx.fillRect(snake.total[i].x, snake.total[i].y, scale, scale);
        ctx.strokeStyle = 'red';
        ctx.strokeRect(snake.total[i].x, snake.total[i].y, scale, scale);
    }
    ctx.fillStyle = "red";
    ctx.fillRect(food.x, food.y, food.w, food.h);
}

// ########## main function ##########
var main = function main() {
    now = Date.now();
    delta = now - then;
    input(delta/1000);
    update(delta / 1000);
    render(delta/1000);
    then = now;
        // Request to do this again ASAP
        requestAnimationFrame(main);
    }
    // setInterval(main, 1000/frameRate);
    // Cross-browser support for requestAnimationFrame
    var w = window;
    requestAnimationFrame = w.requestAnimationFrame || w.webkitRequestAnimationFrame || w.msRequestAnimationFrame || w.mozRequestAnimationFrame;
    
    // Let's play this game!
    var then = Date.now();
    main(); 