var canvas = document.getElementById("finalGame");
var ctx = canvas.getContext("2d");
document.body.appendChild(canvas);

// images
// start screen
var strtScrnImg = new Image();
strtScrnImg.src = "_images/startScreen.png";

// instruction screen
var instructionOver = false;
var instScrn = new Image();
instScrn.src = "_images/instructions.png";

// background image
var bgImageReady = false;
var bgImage = new Image();
bgImage.onload = function(){
    bgImageReady = true;
}
bgImage.src = "_images/background4_small.png";



// player image, source changes depending on class
var playerImage = new Image();

// pause symbol
var pauseSymbolImage = new Image();
pauseSymbolImage.src = "_images/pauseSymbol.png";

// freeze icon
var freezeIconImage = new Image();
freezeIconImage.src = "_images/freezeIcon_small.png";

// booleans that lead up to the actual gameplay
var classOver = false;
var start = false;
var playing = false;

// buttons
var playButton = {
    x: 500,
    y: 200,
    w: 200,
    h: 50,
    color: "white",
}

var normalButton = {
    x: 300,
    y: 130,
    w: 200, 
    h: 50,
    color: "white",
}
var assasinButton = {
    x: 300,
    y: 200,
    w: 200, 
    h: 50,
    color: "white",
}

var wizardButton = {
    x: 300,
    y: 270,
    w: 200,
    h: 50,
    color: "white",
}

var soldierButton = {
    x: 300,
    y: 340,
    w: 200,
    h: 50,
    color: "white",
}

var pause = false;
var pauseButton = {
    radius: 15,
    x: canvas.width - 25,
    y: 25,
    color: "white",
}


// set variables
var GRAVITY = 1;
var framerate = 50;
var level = 1;
var levelCount = 1;
var freezeCount = 0;
var teleportCount = 2;
var camoCount = 1;
// sounds
var jumpSound = new Audio("jump.mp3");

// player object
var player = {
    x: 0,
    y: 100,
    w: 30,
    h: 27,
    velX: 0,
    velY: 0,
    direction: ["right", "left"],
    class: ["normal", "assasin", "wizard", "soldier"],
    skillActivated: false,
    coFriction: 0.4,
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
    jumping: false,
    jump: function(){
        jumpSound.play();
        this.velY -= 8;
        this.jumping = true;
    },
    won: false,
    reset: function(){
        this.x = 0;
        this.y = 260 - player.h;
        this.dead = false;
        for(i in allFallingPlatforms){
            allFallingPlatforms[i].y = allFallingPlatforms[i].oldY;
        }
        if(player.class == "normal"){
            playerImage.src = "_images/platformAvatars/normal_small.png";
        }
        if(player.class == "assasin"){
            playerImage.src = "_images/platformAvatars/assasin_small.png";
        }
        if(player.class == "wizard"){
            playerImage.src = "_images/platformAvatars/wizard_small.png";
        }
        if(player.class == "soldier"){
            playerImage.src = "_images/platformAvatars/Soldier_small.png";
        }
    },
    teleported: false,
    camo: false,
    platSpeed: 1,
    stick: function(){
        this.x += this.platSpeed;
    },
    dead: false,
}
// all arrays
var allPlatforms = [];
var allEndPlats = [];
var allMovingPlatforms = [];
var allEnemies = [];
var allLasers = [];
var allFallingPlatforms = [];

// functions
function collision(x1, x2, y1, y2, w1, w2, h1, h2){
    return x1 <= (x2 + w2) &&
    x2 <= (x1 + w1) &&
    y1 <= (y2 + h2) &&
    y2 <= (y1 + h1)
}
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

        ddRst = function(){
            player.dead = false;
            player.reset();
        }
ddDtct = function(){    
    player.dead = true;
    setTimeout(ddRst, 200);
}

empty = function(){
    allMovingPlatforms = [];
    allPlatforms = [];
    allEndPlats = [];
    allEnemies = [];
    allLasers = [];
    allFallingPlatforms = [];
    if(freezeCount == 0){
        freezeCount++;
    }
    if(teleportCount == 0){
        teleportCount += 2;
    }
    else if(teleportCount == 1){
        teleportCount++;
    }
    if(camoCount == 0){
        camoCount++;
    }
}

function togglePause(){
    if(pause == false){
        pause = true;
        pauseSymbolImage.src = "_images/playSymbol.png";
    }
    else{
        if(player.jumping == false){
            player.velX = 0;
            player.velY = 0;
        }
        pause = false;
        pauseSymbolImage.src = "_images/pauseSymbol.png";
    }
}
// button code inspired from A1RPun and modified
//Function to get the mouse position
function getMousePos(canvas, event) {
    var button = canvas.getBoundingClientRect();
    return {
        x: event.clientX - button.left,
        y: event.clientY - button.top,
    };
}
//Function to check whether a point is inside a rectangle
function isInsideRect(pos, rect){
    return pos.x > rect.x && pos.x < rect.x+rect.w && pos.y < rect.y+rect.h && pos.y > rect.y;
}

function isInsideCirc(pos, circ){
    return pos.x < circ.x+circ.radius && pos.y < circ.y+circ.radius;
}

// function from Trke Rap and modified by me
function flipHorizontally(img,x,y){
    ctx.translate(x+30,y);
    ctx.scale(-1, 1);
    ctx.drawImage(img, img.x, img.y);
    ctx.setTransform(1,0,0,1,0,0);
}
// constructors
function platform(x, y, w, h, color){
        this.x = x;
        this.y = y;
        this.w = w;
        this.h = h;
        this.color = color;
    allPlatforms.push(this);
}

function endPlat(x, y, w, h){
    this.x = x;
    this.y = y;
    this.w = w;
    this.h = h;
    this.levelUp = function(){
        level += 0.9;
        levelCount ++;
        player.reset();
    }
    allEndPlats.push(this);

}
function movingPlatform(oldX, x, y, w, h, color){
        this.oldX = oldX;
        this.x = x;
        this.y = y;
        this.w = w;
        this.h = h;
        this.color = color;
        this.speed = 1;
        this.move = function(){
              this.x += this.speed  
              if(this.x == this.oldX){
                this.speed = 1;
                player.platSpeed = 1;
                for(i in allEnemies){
                    allEnemies[i].platSpeed = 0.5;
                }
            }
            if(this.x == this.oldX + 300){
                this.speed = -1;
                player.platSpeed = -1;
                for(i in allEnemies){
                    allEnemies[i].platSpeed = -0.5;
                }
            }
            }
    allMovingPlatforms.push(this);
}

function enemy(plat, w, h, color){
    this.w = w;
    this.h = h;
    this.x = (plat.x + plat.x + plat.w)/2 - this.w/2;
    this.y = plat.y - 20;
    this.color = color;
    this.follow = function(){
        if(this.frozen == false && !player.camo){
            if(this.x < player.x){
                this.x += 1;
            }
            if(this.x >= player.x){
                this.x -= 1;
            }
        }
    }
    this.platx = plat.x;
    this.platw = plat.w;
    this.platSpeed = 0.5;
    this.stick = function(){
        this.x += this.platSpeed;
        this.platx += this.platSpeed;
    }
    this.frozen = false;
    allEnemies.push(this);
}

function laser(oldX, x, y, oldW, w, h, gap){
    this.oldX = oldX;
    this.x = x;
    this.y = y;
    this.oldW = oldW;
    this.w = w;
    this.h = h;
    this.gap = gap;
    this.speed = 3;
    this.fired = false;
    this.grow = function(){
        this.w += this.speed;
    }
    this.reload = function(){
        this.x = this.oldX;
    }
    this.frozen = false;
    allLasers.push(this);
}

function fallingPlat(x, oldY, y, w, h, color){
    this.x = x;
    this.oldY = oldY;
    this.y = y;
    this.w = w;
    this.h = h;
    this.color = color;
    this.speed = 5;
    this.falling = false;
    allFallingPlatforms.push(this);
}
// update function
var update = function(){
    if(start){
        if(instructionOver){
    // keeping hero inside canvas
    if (player.y >= canvas.height-player.h) {
        player.reset();
        if(freezeCount == 0){
            freezeCount++;
        }
        if(teleportCount == 0){
            teleportCount += 2;
        }
        else if(teleportCount == 1){
            teleportCount++;
        }
        if(camoCount == 0){
            camoCount++;
        }
        player.velX = 0;
        player.velY = 0;
        player.y >= canvas.height-player.h;
        player.jumping = false;
        while(player.velY > 0){
            player.velY -= 1;
        }
    }

	if (player.x >= canvas.width - player.w) {
		player.x = canvas.width - player.w;
	}

	if (player.x <= 0) {
		player.x = 0;
	}
	if (player.y <= 0) {
		player.y = 0;
    }

// level structures
    if(level == 1){
        var plat1 = new platform(0, 390, 100, 20, "blue");
        var plat2 = new platform(200, 380, 90, 20, "green");
        var plat3 = new platform(400, 370, 80, 20, "red");
        var plat6 = new platform(canvas.width - 180, 290, 80, 20, "purple");
        var plat9 = new platform(495, 180, 80, 20, "blue");
        var plat10 = new platform(270, 150, 80, 20, "orange");
        var plat11 = new platform(150, 90, 80, 20, "yellow");
        var endPlat1 = new endPlat(0, 50, 50, 20);
        level = 1.1;
    }
    
    else if(level == 2){
        empty();
        plat1 = new platform(0, 390, 40, 20, "blue");
        plat2 = new movingPlatform(50, 50, 310, 90, 20, "orange");
        plat3 = new platform(380, 280, 190, 20, "teal");
        enemy1 = new enemy(plat3, 20, 20, "orange");
        plat4 = new platform(540, 180, 90, 20, "purple");
        plat5 = new platform(510, 80, 90, 20, "indigo");
        palt6 = new movingPlatform(100, 100, 80, 90, 20, "green");
        var endPlat2 = new endPlat(0, 50, 50, 20);
        level = 2.1;
    }
    else if(level == 3){
        empty();
        plat1 = new platform(0, 390, 40, 20, "blue");
        plat2 = new movingPlatform(130, 130, 360, 150, 20, "blue");
        enemy1 = new enemy(plat2, 10, 20, "red");
        plat3 = new platform(canvas.width - 80, 300, 80, 20, "orange");
        plat4 = new platform(canvas.width - 150, 200, 10, 20, "gray");
        plat5 = new platform(canvas.width - 80, 180, 80, 20, "aqua");
        plat6 =new movingPlatform(160, 160, 100, 150, 20, "blue");
        enemy2 = new enemy(plat6, 10, 20, "red");
        plat7 = new endPlat(0, 50, 50, 20);
        level = 3.1;
    }
    if(level == 4){
        empty();
        plat1 = new platform(0, 390, 40, 20, "blue");
        laser1 = new laser(70, 70, 300, 30, 30, 10, 200);
        plat2 = new platform(100, 370, 140, 20, "brown");
        enemy1 = new enemy(plat2, 20, 20, "gold");
        laser2 = new laser(400, 400, 350, 30, 30, 10, 350);
        laser3 = new laser(400, 400, 270, 30, 30, 10, 350);
        laser4 = new laser(400, 400, 200, 30, 30, 10, 350);
        laser5 = new laser(400, 400, 90, 30, 30, 10, 350);
        plat3 = new platform(270, 260, 40, 20, "aquamarine");
        plat4 = new platform(390, 360, 20, 20, "gray");
        plat5 = new platform(490, 380, 20, 20, "cyan");
        plat6 = new platform(570, 300, 20, 20, "gold");
        plat7 = new platform(640, 250, 20, 20, "purple");
        plat8 = new platform(540, 160, 20, 20, "magenta");
        plat9 = new platform(510, 100, 20, 20, "pink");
        plat10 = new platform(590, 70, 20, 20, "blue");
        endplat = new endPlat(canvas.width - 80, 50, 80, 20);
        level = 4.1;
    }
    if(level == 5){
        empty();
        plat1 = new platform(0, 390, 50, 20, "blue");
        fallPlat1 = new fallingPlat(50, 280, 280, 80, 20, "blue");
        laser1 = new laser(30, 30, 215, 30, 30, 10, 260);
        fallPlat2 = new fallingPlat(200, 180, 180, 80, 20, "red");
        laser2 = new laser(250, 250, 30, 30, 30, 10, 300);
        fallPlat3 = new fallingPlat(290, 100, 100, 30, 20, "aquamarine");
        fallPlat5 = new fallingPlat(450, 60, 60, 20,20, "cyan");
        fallPlat6 = new fallingPlat(550, 140, 140, 10, 20, "pink");
        fallPlat7 = new fallingPlat(650, 230, 230, 10, 20, "gold");
        endplat = new endPlat(canvas.width - 80, 400, 80, 20);
        level = 5.1;
    }
    if(level == 6){
        empty();
        plat1 = new platform(0, 390, canvas.width, 20, "white");
        ctx.fillStyle = "white";
    }
    // platform collision stop moving
    for(i in allPlatforms){
        if(collision(player.x, allPlatforms[i].x, player.y, allPlatforms[i].y, player.w, allPlatforms[i].w, player.h, allPlatforms[i].h)){
            if(player.y >= allPlatforms[i].y + allPlatforms[i].h - 10){
                player.y = allPlatforms[i].y + player.h;
            }
            else if(player.x + player.w - 8 < allPlatforms[i].x){
                player.x = allPlatforms[i].x - player.w;
            }
            else if(player.x + 8 > allPlatforms[i].x + allPlatforms[i].w){
                player.x = allPlatforms[i].x + allPlatforms[i].w;
            }
            else{
            player.y = allPlatforms[i].y - player.h;
            player.jumping = false;
            while(player.velY > 0){
                player.velY -= 1;
            }
        }
    }
    }
    // end platforms finish level
    for(i in allEndPlats){
        if(collision(player.x, allEndPlats[i].x, player.y, allEndPlats[i].y, player.w, allEndPlats[i].w, player.h, allEndPlats[i].h)){
            if(player.y >= allEndPlats[i].y + allEndPlats[i].h - 10){
                player.y = allEndPlats[i].y + player.h;
            }
            else if(player.x + player.w - 8 < allEndPlats[i].x){
                player.x = allEndPlats[i].x - player.w;
            }
            else if(player.x + 8 > allEndPlats[i].x + allEndPlats[i].w){
                player.x = allEndPlats[i].x + allEndPlats[i].w;
            }
            else{
            player.y = allEndPlats[i].y - player.h;
            player.jumping = false;
            while(player.velY > 0){
                player.velY -= 1;
            }
            allEndPlats[i].levelUp();
        }
    }
    }
    // falling platforms
    for(i in allFallingPlatforms){
        if(collision(player.x, allFallingPlatforms[i].x, player.y, allFallingPlatforms[i].y, player.w, allFallingPlatforms[i].w, player.h, allFallingPlatforms[i].h)){
            if(player.y >= allFallingPlatforms[i].y + allFallingPlatforms[i].h - 10){
                player.y = allFallingPlatforms[i].y + player.h;
            }
            else if(player.x + player.w - 8 < allFallingPlatforms[i].x){
                player.x = allFallingPlatforms[i].x - player.w;
            }
            else if(player.x + 8 > allFallingPlatforms[i].x + allFallingPlatforms[i].w){
                player.x = allFallingPlatforms[i].x + allFallingPlatforms[i].w;
            }
            else{
            allFallingPlatforms[i].y += 1;
            player.y = allFallingPlatforms[i].y - player.h;
            player.jumping = false;
            while(player.velY > 0){
                player.velY -= 1;
            }
        }
        }
    }
    // moving platforms
    for(i in allMovingPlatforms){ 
        allMovingPlatforms[i].move();
        if(collision(player.x, allMovingPlatforms[i].x, player.y, allMovingPlatforms[i].y, player.w, allMovingPlatforms[i].w, player.h, allMovingPlatforms[i].h)){
            if(player.y >= allMovingPlatforms[i].y + allMovingPlatforms[i].h - 10){
                while(player.velY < 0){
                    player.velY += 1;
                }
            }
            else if(player.x + player.w - 8 < allMovingPlatforms[i].x){
                player.x = allMovingPlatforms[i].x - player.w;
            }
            else if(player.x + 8 > allMovingPlatforms[i].x + allMovingPlatforms[i].w){
                player.x = allMovingPlatforms[i].x + allMovingPlatforms[i].w;
            }
            else{
            player.stick();
            player.y = allMovingPlatforms[i].y - player.h;
            player.jumping = false;
            while(player.velY > 0){
                player.velY -= 1;
            }
            }
        }
        for(i in allEnemies){
            if(collision(allEnemies[i].x, allMovingPlatforms[i].x, allEnemies[i].y, allMovingPlatforms[i].y, allEnemies[i].w, allMovingPlatforms[i].w, allEnemies[i].h, allMovingPlatforms[i].h)){
                allEnemies[i].stick();
            }
        }
    }

    // enemies
    for(i in allEnemies){
        if(collision(player.x, allEnemies[i].x, player.y, allEnemies[i].y, player.w, allEnemies[i].w, player.h, allEnemies[i].h)){
            if(allEnemies[i].frozen == false){
                playerImage.src = "_images/platformAvatars/dead.png";
                ddDtct();
                if(freezeCount == 0){
                    freezeCount++;
                }
                if(teleportCount == 0){
                    teleportCount += 2;
                }
                else if(teleportCount == 1){
                    teleportCount++;
                }
                if(camoCount == 0){
                    camoCount++;
                }
            }
            else{
                if(player.y < allEnemies[i].y + 1){
                    if(player.x < allEnemies[i].x){
                    player.velY = 0;
                    player.velX = -2;
                    }
                    else{
                    player.velY = 0; 
                    player.velX = 2;
                    }
                }
                else if(player.x < allEnemies[i].x){
                    player.x = allEnemies[i].x - player.w;
                }
                else{
                    player.x = allEnemies[i].x + allEnemies[i].w;  
                }
            }
        }
        if(collision(player.x, allEnemies[i].x - 80, player.y, allEnemies[i].y, player.w, allEnemies[i].w + 200, player.h, allEnemies[i].h + 50)){
            allEnemies[i].follow();
        }
        if(allEnemies[i].x < allEnemies[i].platx + allEnemies[i].w){
            allEnemies[i].x = allEnemies[i].platx + allEnemies[i].w;
        }
        if(allEnemies[i].x >= allEnemies[i].platx + allEnemies[i].platw - allEnemies[i].w){
            allEnemies[i].x = allEnemies[i].platx + allEnemies[i].platw - allEnemies[i].w;
        }
    }

    // lasers
    for(i in allLasers){
        allLasers[i].x += allLasers[i].speed;

        while(allLasers[i].x >= allLasers[i].oldX + allLasers[i].gap - allLasers[i].w && allLasers[i].w != 0){
            allLasers[i].w -= allLasers[i].speed;    
        }

        if(allLasers[i].w == 0){
            allLasers[i].w = allLasers[i].oldW;
            allLasers[i].x = allLasers[i].oldX - 20;

        }
        
        if(collision(player.x, allLasers[i].x, player.y, allLasers[i].y, player.w, allLasers[i].w, player.h, allLasers[i].h)){
            if(allLasers[i].frozen == false && !player.camo){
                playerImage.src = "_images/platformAvatars/dead.png";
                ddDtct();
                if(freezeCount == 0){
                    freezeCount++;
                }
                if(teleportCount == 0){
                    teleportCount += 2;
                }
                else if(teleportCount == 1){
                    teleportCount++;
                }
                if(camoCount == 0){
                    camoCount++;
                }
                allLasers[i].speed = 3;
            }
            else if(player.camo){
                ;
            }
            else{
                if(player.y < allLasers[i].y + 1){
                    if(player.x < allLasers[i].x){
                    player.velY = 0;
                    player.velX = -2;
                    }
                    else{
                    player.velY = 0; 
                    player.velX = 2;
                    }
                }
                else if(player.x < allLasers[i].x){
                    player.x = allLasers[i].x - player.w;
                }
                else{
                    player.x = allLasers[i].x + allLasers[i].w;  
                }
            }
        }
        if(allLasers[i].frozen){
            allLasers[i].speed = 0;
        }
    
}
    //player jumping and moving and facing directions
    player.x += player.velX;
    player.y += player.velY;
    player.friction();
    if(collision(player.x, allPlatforms.x, player.y, allPlatforms.y, player.w, allPlatforms.w, player.h, allPlatforms.h) == false && player.y <= canvas.height-player.h){
        player.velY += GRAVITY; 
    }
    if(player.velX >= 7){
        player.velX = 7;
    }
    if(player.velX <= -7){
        player.velX = -7;
    }
    }
}
}
// user input
var keysDown = [];
var keyPress = [];
addEventListener("keydown", function (e) {
	keysDown[e.key] = true;
}, false);

addEventListener("keyup", function (e) {
	delete keysDown[e.key];
}, false);

addEventListener("keypress", function(e){
    if(e.key == " "){
        tpDtct = function(){
            playerImage.src = "_images/platformAvatars/teleport.png";
            player.teleported = true;
            setTimeout(tpRst, 100);
        }
                tpRst = function(){
                    playerImage.src = "_images/platformAvatars/assasin_small.png"; 
                    if(player.direction == "right"){
                        player.x += 100;
                    }
                    else{
                        player.x -= 100;
                    }
                    player.teleported = false;
                }
        if(player.class == "assasin" && teleportCount > 0){
                teleportCount--;
                tpDtct();
            }
        tmStp = function(){
            for(i in allLasers){
                allLasers[i].frozen = true;
            }
            for(i in allEnemies){
                allEnemies[i].frozen = true;
            }
        }
        tmRsm = function(){
            for(i in allLasers){
                allLasers[i].frozen = false;
                allLasers[i].speed = 3;
            }
            for(i in allEnemies){
                allEnemies[i].frozen = false;
            }
        }
        if(player.class == "wizard" && freezeCount > 0){
            freezeCount--;
            tmStp();
            setTimeout(tmRsm, 1000);
        }

        rapr = function(){
            playerImage.src = "_images/platformAvatars/Soldier_small.png";
            player.camo = false;
        }
        if(player.class == "soldier" && camoCount > 0){
            player.camo = true;
            camoCount--;
            playerImage.src = "_images/platformAvatars/camoflauged_small.png";
            setTimeout(rapr, 1500);
        }

    }

})

// all clicking buttons
addEventListener('click', function(e) {
    var mousePos = getMousePos(canvas, e);
    if (isInsideRect(mousePos, playButton)) {
        start = true;
    }
    if(isInsideCirc(mousePos, pauseButton)){
        togglePause();
    }
    if(start && instructionOver && !playing){
        if(isInsideRect(mousePos, normalButton)){
            playerImage.src = "_images/platformAvatars/normal_small.png";
            classOver = true;
            player.class = "normal";
            playing = true;
        }
        if(isInsideRect(mousePos, assasinButton)){
            playerImage.src = "_images/platformAvatars/assasin_small.png";
            classOver = true;
            player.class = "assasin";
            playing = true;
        }
        if(isInsideRect(mousePos, wizardButton)){
            playerImage.src = "_images/platformAvatars/wizard_small.png";
            classOver = true;
            player.class = "wizard";
            playing = true;
        }
        if(isInsideRect(mousePos, soldierButton)){
            playerImage.src = "_images/platformAvatars/Soldier_small.png";
            classOver = true;
            player.class = "soldier";
            playing = true;
        }
    }   

}, false);
// key input

var input = function (modifier) {
	// checks for user input
	if ("w" in keysDown && player.jumping == false) {// Player holding up
        player.jump(); 
    }
    if ("a" in keysDown) { // Player holding left
        player.velX -= 0.9;
        player.direction = "left";
	}
    if ("d" in keysDown) { // Player holding right
        player.velX += 0.9;
        player.direction = "right";
        if(start){
            instructionOver = true;
        }
    }
    if("'" in keysDown){
        player.x = allEndPlats[0].x;
        player.y = 0;
    }
};

// render function

var render = function(){
    if(start == false){
        ctx.drawImage(strtScrnImg, 0, 0);
        drawRect(playButton.x, playButton.y, playButton.w, playButton.h, playButton.color);
        ctx.fillStyle = "black";
        drawText("Play", playButton.x + playButton.w/2 - 30, playButton.y + playButton.h - 15, "30px Impact", "black");
    }
    else if(instructionOver == false){
        ctx.drawImage(instScrn, 0, 0);

    }
    else if(classOver == false){
        drawRect(0, 0, canvas.width, canvas.height, "black");
        drawRect(normalButton.x, normalButton.y, normalButton.w, normalButton.h, normalButton.color);
        drawRect(assasinButton.x, assasinButton.y, assasinButton.w, assasinButton.h, assasinButton.color);
        drawRect(wizardButton.x, wizardButton.y, wizardButton.w, wizardButton.h, wizardButton.color);
        drawRect(soldierButton.x, soldierButton.y, soldierButton.w, soldierButton.h, soldierButton.color);
        drawText("Choose your class", canvas.width/2 - 180, 60, "50px Impact", "white");
        ctx.fillStyle = "black";
        drawText("Normal", normalButton.x + 70, normalButton.y + 30, "24px Impact", "black");
        drawText("(For people like Anthony Reynolds)", normalButton.x + 30, normalButton.y + 45, "10px Impact", "black");
        drawText("Assassin", assasinButton.x + 60, assasinButton.y + 30, "24px Impact", "black");
        drawText("Wizard", wizardButton.x + 65, wizardButton.y + 30, "24px Impact", "black");
        drawText("Soldier", soldierButton.x +70, soldierButton.y + 30, "24px Impact", "black");
    }
    else{
        if(bgImageReady){
            ctx.drawImage(bgImage, 0, 0);
        }
        if(level < 6){
            drawText("Level " + levelCount, canvas.width/2 - 50, canvas.height, "30px Impact", "blue");
        }
        if(player.direction == "right"){
            ctx.drawImage(playerImage, player.x, player.y);
        }
        else{
            flipHorizontally(playerImage, player.x, player.y);
        }
        for(i in allPlatforms){
            drawRect(allPlatforms[i].x, allPlatforms[i].y, allPlatforms[i].w, allPlatforms[i].h, allPlatforms[i].color);
        }
        for(i in allEndPlats){
            drawRect(allEndPlats[i].x, allEndPlats[i].y, allEndPlats[i].w, allEndPlats[i].h, "white");
        }
        for(i in allMovingPlatforms){
            drawRect(allMovingPlatforms[i].x, allMovingPlatforms[i].y, allMovingPlatforms[i].w, allMovingPlatforms[i].h, allMovingPlatforms[i].color);
        }
        for(i in allEnemies){
            if(allEnemies[i].frozen == false){
                drawRect(allEnemies[i].x, allEnemies[i].y, allEnemies[i].w, allEnemies[i].h, allEnemies[i].color);
            }
            else{
                drawRect(allEnemies[i].x, allEnemies[i].y, allEnemies[i].w, allEnemies[i].h, "DodgerBlue");
                ctx.drawImage(freezeIconImage, player.x + 20, player.y - 10);
            }
        }
        for(i in allLasers){
            if(allLasers[i].frozen == false){
                drawRect(allLasers[i].x, allLasers[i].y, allLasers[i].w, allLasers[i].h, "red");
            }
            else{
                drawRect(allLasers[i].x, allLasers[i].y, allLasers[i].w, allLasers[i].h, "DodgerBlue");
                ctx.drawImage(freezeIconImage, player.x + 20, player.y - 10);
            }
            drawRect(allLasers[i].oldX - 20, allLasers[i].y - (allLasers[i].h/2), 30, 20, "gray");
            drawRect(allLasers[i].oldX + allLasers[i].gap, allLasers[i].y - (allLasers[i].h/2), 30, 20, "gray");
        }
        for(i in allFallingPlatforms){
            drawRect(allFallingPlatforms[i].x, allFallingPlatforms[i].y, allFallingPlatforms[i].w, allFallingPlatforms[i].h, allFallingPlatforms[i].color);
        }
        drawCirc(pauseButton.x, pauseButton.y, pauseButton.radius, pauseButton.color);
        ctx.drawImage(pauseSymbolImage, pauseButton.x - 15, pauseButton.y - 15);
        if(level == 6){
            ctx.fillStyle = "white";
            drawText("THANKS FOR PLAYING", canvas.width/2 - 200, 100, "50px Impact", "white");
        }
}
}

//######### main function and run once functions
var main = function main() {
    now = Date.now();
    delta = now - then;
    if(pause == false && player.dead == false && player.teleported == false){
        update(delta / 1000);
        input(delta/1000);
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


    