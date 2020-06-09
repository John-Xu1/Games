var canvas = document.createElement("canvas");
canvas.width = 500;
canvas.height = 500;
var ctx = canvas.getContext("2d");
document.body.appendChild(canvas);

var GRAVITY = 1;
var framerate = 50;
var sheetW = 256;
var sheetH = 512;
var frameW = 4;
var frameH = 4;

var playerImage = new Image();
playerImage.src = "_images/avatarSpriteSheet.png";
var player = {
    x: 0,
    y: 100,
    w: sheetW/frameW,
    h: sheetH/frameH,
    color: "white",
    velX: 0,
    velY: 0,
    direction: "right",
    coFriction: 0.2,
    friction: function () {
		if(this.velX > 0.2){
            this.velX -= this.coFriction;
        }
        else if(this.velX < -0.2){
            this.velX += this.coFriction;
        }
		else {
			this.velX = 0;
		}
    },
    jumpCount: 2,
    toggleJump: function(){
        this.jumpCount--;
    },
    jump: function(){
        this.toggleJump();
        this.velY = 0;
        this.velY -= 16;
    },
    currentFrame: 0,
    drawFrame: 0,
    srcX: 0,
    srcY: 0,
    animate: function(){
        if(this.velX != 0){
            this.currentFrame = (this.currentFrame + Math.abs(this.velX)/20) % frameW;
            this.drawFrame = Math.floor(this.currentFrame);
            this.srcX = this.drawFrame*sheetW/frameW;
        }
        if(this.direction == "left"){
            this.srcY = sheetH/frameH;
        }
        if(this.direction == "right"){
            this.srcY = 2*sheetH/frameH;
        }
        if(this.velX == 0){
            this.srcY = 0;
            this.srcX = 0;
        }
    },
}

var update = function(modifier){
    player.y += player.velY;
    player.x += player.velX;
    player.friction();
    if(player.y < canvas.height - player.h){
        player.velY += GRAVITY;
    }
    else{
        while(player.velY > 0){
            player.velY--;
        }
        player.jumpCount = 2;
        player.y = canvas.height - player.h;
    }
    if(player.velX >= 5){
        player.velX = 5;
    }
    if(player.velX <= -5){
        player.velX = -5;
    }
    player.animate();
}


var keysDown = [];
addEventListener("keydown", function (e) {
	keysDown[e.key] = true;
}, false);

addEventListener("keyup", function (e) {
	delete keysDown[e.key];
}, false);

addEventListener("keypress", function(e){
    if(e.key == 'w' && player.jumpCount>0){
        player.jump()
    }
});

var input = function (modifier) {
	// checks for user input
    if ("a" in keysDown) { // Player holding left
        player.velX -= 0.9;
        player.direction = "left";
	}
    if ("d" in keysDown) { // Player holding right
        player.velX += 0.9;
        player.direction = "right";
    }
    // if("'" in keysDown){
    //     player.x = allEndPlats[0].x;
    //     player.y = 0;
    // }
};


var render = function(){
    ctx.fillStyle = "black";
    ctx.fillRect(0, 0, canvas.width, canvas.height);
    ctx.drawImage(playerImage, player.srcX, player.srcY, sheetW/frameW, sheetH/frameH, player.x, player.y, 32, 64);
}

var main = function main() {
    now = Date.now();
    delta = now - then;
    update(delta / 1000);
    input(delta/1000);
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