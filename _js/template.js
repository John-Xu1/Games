//######### setup the canvas
var canvas = document.createElement("canvas");
var ctx = canvas.getContext("2d");
canvas.width = 512;
canvas.height = 480;
document.body.appendChild(canvas);

//######### global variables
const gravity = 9.8;
var allSprites = [];

//######### game objects

// Background image
var bgReady = false;
var bgImage = new Image();
bgImage.onload = function () {
	bgReady = true;
	console.log("background loaded successfully");
};
bgImage.src = "_images/background2.jpg";

// Hero image
var heroReady = false;
var heroImage = new Image();
heroImage.onload = function () {
	heroReady = true;
};
heroImage.src = "_images/hero_small.png";

// Monster image
var monsterReady = false;
var monsterImage = new Image();
monsterImage.onload = function () {
	monsterReady = true;
};
monsterImage.src = "_images/monster_small.png";

// function entity(img) {
// 	this.img = img;
// 	this.w = 32;
// 	this.h = 32;
// 	this.x = canvas.width/2;
// 	this.y = canvas.height/2;
// 	this.velX = 0;
// 	this.velY = 0;
// 	this
//     this.speed = 1;
// 	this.reset = function () {
// 		this.x = canvas.width/2;
// 	    this.y = canvas.height/2;
//     };
// 	allSprites.push(this);
// }

// coFriction: 0.8,
// 	friction: function() {
// 		if (this.velX > 0.5) {
// 			this.velX -= this.coFriction;
// 		}
// 		else if (this.velX < -0.5) {
// 			this.velX += this.coFriction;
// 		}
// 		else {
// 			this.velX = 0;
// 		}
// 	},

var hero = {
	speed: 256,
	velX: 0,
	velY: 0,
}

var monster = {
	name: "big baddy",
}

//######### functions
 //// we don't have any yet
//######### input ***

//adding event listeners

var keysDown = {};

addEventListener("keydown", function (e) {
	keysDown[e.key] = true;
}, false);

addEventListener("keyup", function (e) {
	delete keysDown[e.key];
}, false);

//get key input

var input = function (modifier) {
	// checks for user input
	if ("w" in keysDown) { // Player holding up
        hero.velY -= hero.speed;
    }
    if ("a" in keysDown) { // Player holding left
		hero.velX -= hero.speed;
	}
	if ("s" in keysDown) { // Player holding down
		hero.velY += hero.speed;
	}
	if ("d" in keysDown) { // Player holding right
		hero.velX += hero.speed;
	}
};

//######### updates ***
function update() {
	// for(var sprite in allSprites) {
	// 	allSprites[sprite].x += allSprites[sprite].velX;
    //     allSprites[sprite].y += allSprites[sprite].velY;
    //     if(allSprites[sprite].y>canvas.height-32) {
    //         allSprites[sprite].y = canvas.height-32;
            
    //     }
    //     if(allSprites[sprite].y<= -5) {
    //         allSprites[sprite].y = -5;
    //     }
	// }
	hero.x = canvas.width/2;
	hero.y = canvas.height/2;
	monster.x = canvas.width/2;
	monster.y = canvas.height/2;
}

//######### render
function render() {
    //render background first
    if (bgReady) {
        ctx.drawImage(bgImage, 0, 0);
        // console.log("background drawn successfully")
    }
    // then hero on top of background
		if (heroReady) {
			ctx.drawImage(heroImage, hero.x, hero.y);
			// console.log("hero ready");
		}
		if(monsterReady) {
			ctx.drawImage(monsterImage, monster.x, monster.y)
		}
	}


//######### main function and run once functions
var main = function () {
	now = Date.now();
    delta = now - then;
	input(delta / 1000);
	update(delta / 1000);
	render(delta / 1000);
	then = now;
	// Request to do this again ASAP
	requestAnimationFrame(main);
};

// Cross-browser support for requestAnimationFrame
var w = window;
requestAnimationFrame = w.requestAnimationFrame || w.webkitRequestAnimationFrame || w.msRequestAnimationFrame || w.mozRequestAnimationFrame;

// Let's play this game!
var then = Date.now();
// hero.reset();
main();





// //######### setup the canvas
//     var canvas = document.createElement("canvas");
//     var ctx = canvas.getContext("2d");
//     canvas.width = 512;
//     canvas.height = 480;
//     document.body.appendChild(canvas);
// // -----------------global variables
//     const gravity = 9.8;
//     var allSprites = [];
// // ------------------ game objects

// 	// Background image
// 	var bgReady = false;
// 	var bgImage = new Image();
// 	bgImage.onload = function () {
// 		bgReady = true;
// 	};
// 	bgImage.src = "_images/background2.jpg";

//     // Hero Image
//     var heroReady = false;
//     var heroImage = new Image();
//     heroImage.onload = function () {
//         heroReady = true;
//     };
//     heroImage.src = "_images/hero_small.png";

//     // Monster image
//     var monsterReady = false;
//     var monsterImage = new Image();
//     monsterImage.onload = function () {
//         monsterReady = true;
//     };
//     monsterImage.src = "_images/monster_small.png";
//     // entity function
//     function entity(img) {
//         this.img = img,
//         this.width = 32,
//         this.height = 32,
//         this.x = canvas.width/2,
//         this.y = canvas.height/2,
//         this.velX = 0,
//         this.velY = 0,
//         this.speed = 5,
//         this.reset = function(){
//             this.x = canvas.x/2;
//             this.y = canvas.y/2;
//         };
//         allSprites.push(this);
//     }

// 	var hero = {
// 		name: "John",
// 		speed: 256,
// 	}
//     // var hero = new entity(heroImage);
//     // var monster = new entity(monsterImage);
// // --------------------- functions

// // ---------------------- input ***


//     // add event listeners
//     var keysDown = {};

//     addEventListener("keydown", function (e) {
//         keysDown[e.key] = true;
//     }, false);

//     addEventListener("keyup", function (e) {
//         delete keysDown[e.key];
//     }, false);

//     //get key input
//     var input = function (modifier) {
//         if ("w" in keysDown && hero.grounded == true) { // Player holding up
//             hero.jump();
//             hero.grounded = false;
//         }
//         if ("s" in keysDown) { // Player holding down
//             hero.y += hero.speed * modifier;
//         }
//         if ("a" in keysDown) { // Player holding left
//             hero.x -= hero.speed * modifier;
//         }
//         if ("d" in keysDown) { // Player holding right
//             hero.x += hero.speed * modifier;
//         }
//     }
// // ------------------------- updates ***
//         function update(){
// 		hero.y = canvas.height/2;
// 		hero.x = canvas.width/2;
// 		if(bgReady == true){
// 			console.log("stuff");
// 		}
//     }
// //  ------------------- render ***
//         function render(){
//             if(bgReady) {
// 				ctx.drawImage(bgImage, 0, 0);
// 				console.log("bakcground loaded");
// 			}
//         	if(heroReady) {
//                 ctx.drawImage(heroImage, hero.x, hero.y);
// 			}
// 		}
        
// // ------------------------ main function and run once functions
//         function main(){
//             now = Date.now;
//             delta = now - then;
//             input(delta/1000);
//             update(delta/1000);
//             render(delta/1000);
//             then = now;
//         }
// // Cross-browser support for requestAnimationFrame
// var w = window;
// requestAnimationFrame = w.requestAnimationFrame || w.webkitRequestAnimationFrame || w.msRequestAnimationFrame || w.mozRequestAnimationFrame;

// // Let's play this game!
// var then = Date.now();
// main();
