// Code inspired by Meth Meth Method
// canvas setup
var canvas = document.getElementById("pong");
var ctx = canvas.getContext("2d");
document.body.appendChild(canvas);

// ########## Global Variables ##########
var frameRate = 50;
var paused = false;
var gameWon = false;
var pauseWord = "Pause";
var collisionAudio = new Audio("pongBlip.mp3");
var loseSound = new Audio("losingSound.mp3");
// ########## functions ##########
drawRect = function(x, y, w, h, color) {
    ctx.fillStyle = color;
    ctx.fillRect(x, y, w, h);
}
drawCirc = function(x, y, r, color){
    ctx.fillStyle = color;
    ctx.beginPath();
    ctx.arc(x, y, r, 0, Math.PI * 2, false);
    ctx.closePath();
    ctx.fill();
}
drawText = function(text, x, y, font, color1) {
    ctx.fillstyle = color1;
    ctx.font = font;
	ctx.fillText(text, x, y);
}

reset = function(){
    ball.x = canvas.width/2;
    ball.y = canvas.height/2;
    var randomAngle = Math.random()*(Math.PI*2);
    if(randomAngle < (Math.PI + 0.3) && randomAngle > (Math.PI - 0.3)){
        randomAngle += 0.5;
    }
    ball.velX = 5*Math.cos(randomAngle);
    ball.velY = 5*Math.sin(randomAngle);  
}
togglePause = function(){
    if(!paused){
        paused = true;
        pauseWord = "resume";    
     
    }
    else if(paused){
        paused = false;
        pauseWord = "pause";
    }
}
// Paue button logic: inspired from A1RPun
//Function to get the mouse position
function getMousePos(canvas, event) {
    var pButton = canvas.getBoundingClientRect();
    return {
        x: event.clientX - pButton.left,
        y: event.clientY - pButton.top
    };
}
//Function to check whether a point is inside a rectangle
function isInside(pos, rect){
    return pos.x > rect.x && pos.x < rect.x+rect.width && pos.y < rect.y+rect.height && pos.y > rect.y
}

// ########## game objects ##########
var user = {
    x: 5,
    y: canvas.height/2 - 75,
    width: 20,
    height: 150,
    color: "white",
    score: 0,
    speed: 5,
}
var CPU = {
    x: canvas.width - 15,
    y: canvas.height/2,
    width: 20,
    height: 150,
    color: "white",
    score: 0,
    speed: 256,
}
var ball = {
    x: canvas.width/2,
    y: canvas.height/2,
    radius: 10,
    color: "red",
    speed: 9,
    velX: Math.sqrt(80-(10*(Math.random()*2 - 1))**2),
    velY: 10*(Math.random()*2 - 1),
}
var net = {
    x: canvas.width/2,
    y: 0,
    width: 2,
    height: 10,
    color: "blue",
}
var pButton = {
    x: 5,
    y: 5,
    width:35,
    height: 30,
    color: "white",
};

// ########## render function ##########
var render = function render(){
    drawRect(0, 0, canvas.width, canvas.height, "black"); // draw BACKGROUND
    drawRect(user.x, user.y, user.width, user.height, user.color); // draw User Paddle
    drawRect(CPU.x, CPU.y, CPU.width, CPU.height, CPU.color); // draw CPU paddle
    drawCirc(ball.x, ball.y, ball.radius, ball.color); // draw ball
    for(var i = 0; i <= canvas.height; i+=15){ // draw net
        drawRect(net.x, net.y + i, net.width, net.height, net.color);
    }
    ctx.fillStyle = "white";
    drawText(user.score, canvas.width/4, 35, "30px Impact", "white"); // draw User Score
    drawText(CPU.score, (3*canvas.width)/4, 35, "30px Impact", "white"); // draw CPU Score
    drawRect(pButton.x, pButton.y, pButton.width, pButton.height, pButton.color); // draw Pause Button
    ctx.fillStyle = "black";
    drawText(pauseWord, 8, 24, "10px Impact", "black");
    if(CPU.score == 10){
        ctx.fillStyle = "white";
        ctx.font = "50px Impact";
        ctx.fillText("You lost!", ((3*canvas.width)/4)-80, canvas.height/2)
    }
    if(user.score == 10){
        ctx.fillStyle = "white";
        ctx.font = "50px Impact";
        ctx.fillText("You won!", canvas.width/4 - 80, canvas.height/2)
    }
}

// ########## update function ##########
var update = function update(){
    // ball stuff
    // console.log(ball.velX + " " + ball.velY);
        ball.x += ball.velX;
        ball.y += ball.velY;
        if(ball.x > canvas.width - ball.radius){
            user.score ++;
            loseSound.play();
            reset();
        }
        if(ball.x < ball.radius){
            CPU.score ++;
            loseSound.play();
            reset();
        }
        if(ball.y > canvas.height - ball.radius){
            ball.velY *= -1;
        }
        if(ball.y <= -ball.radius){
            ball.velY *= -1;
        }
    // user paddle stuff
    
        if(user.x <= (ball.x + ball.radius) &&
        ball.x <= (user.x + 20) &&
        user.y <= (ball.y + ball.radius) &&
        ball.y <= (user.y + 150)){  
            // ball.velX = (ball.x - (user.x + user.width/2))*(ball.speed)/(user.width/2);
            // ball.velY = Math.sqrt((ball.speed*ball.speed) - (ball.velX*ball.velX));
            var differenceUser = (ball.y - (user.y + user.height/2))/37.5;
            var reflectAngleUser = Math.PI*0.25*(differenceUser);
            console.log(reflectAngleUser);
            ball.velX = ball.speed * Math.cos(reflectAngleUser);
            ball.velY = ball.speed * Math.sin(reflectAngleUser);
            // ball.velX *= -1;
            collisionAudio.play();
        }
        if(user.y >= canvas.height - user.height){
            user.y = canvas.height - user.height;
        }
        if(user.y <= 0){
            user.y = 0;    
        }
    // CPU paddle stuff
        // AI portion
            var desty = ball.y-CPU.height/2;
            CPU.y += (desty-CPU.y)*0.1;

        if(CPU.x <= (ball.x + ball.radius) &&
        ball.x <= (CPU.x + 10) &&
        CPU.y <= (ball.y + ball.radius) &&
        ball.y <= (CPU.y + 150)){
            var differenceCPU = (ball.y - (CPU.y + CPU.height/2))/37;
            var reflectAngleCPU = Math.PI*0.25*(differenceCPU);
            console.log(reflectAngleCPU);
            ball.velX = -1*ball.speed * Math.cos(reflectAngleCPU);
            ball.velY = ball.speed * Math.sin(reflectAngleCPU);
            // ball.velX *= -1;
            collisionAudio.play();
        }
        if(CPU.y >= canvas.height - CPU.height){
            CPU.y = canvas.height - CPU.height;
        }
        if(CPU.y <= 0){
            CPU.y = 0;    
        }

    // either side wins
    if(CPU.score === 10){
        gameWon = true;
        
    }
    if(user.score === 10){
        gameWon = true;
    }   
}
if(user.score == 0 && CPU.score == 0){  
    gameWon = false;
    console.log("reset");
}

// add event listeners
var keysDown = [];
var mouseClick = [];

addEventListener("keydown", function (e) {
	keysDown[e.keyCode] = true;
}, false);

addEventListener("keyup", function (e) {
	delete keysDown[e.keyCode];
}, false);

//Binding the click event on the canvas
canvas.addEventListener('click', function(evt) {
    var mousePos = getMousePos(canvas, evt);

    if (isInside(mousePos,pButton)) {
        togglePause();
    }
}, false);

// keyboard controls

var input = function input(modifier){
    if("87" in keysDown) {
        user.y -= user.speed;
        // console.log(user.y);
    }
    if("83" in keysDown) {
        user.y += user.speed;
        // console.log(user.y);
    }
    if("38" in keysDown) {
        CPU.y -= user.speed;
    }
    if("40" in keysDown) {
        CPU.y += user.speed;
    }
    if("82" in keysDown) {
        CPU.score = 0;
        user.score = 0;
    }
}

// ########## main function ##########
var main = function main() {
    now = Date.now();
    delta = now - then;
    input(delta/1000);
    if(paused == false && gameWon == false) {
    update(delta / 1000);
        }	
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
   
