/*code from http://www.lostdecadegames.com/how-to-make-a-simple-html5-canvas-game/
but modified heavily*/
/*projectile code also taken from Cozort*/
// Goals rules feedback freedom
// Create the canvas


//--------------------- SETUP CANVAS ----------------------------
//create the canvas element
var canvas = document.getElementById("canvas");
//ctx variable used whenever we want to render something onscreen
var ctx = canvas.getContext("2d");
//appends the canvas to the document object
document.body.appendChild(canvas);

//----------------------------- Global Variables -------------------------
var monstersCaught = 0;
var now;
var delta;
var allMonsters = [];
var heroProjectiles = [];
// Nathan Gong helped me with the increasing gravity with the monsters in allmonster array
var GRAVITY = 200;
// -----arrays-----
var monsterProjectiles = [];
var allPotions = [];
var allFireShields= [];
// ---numbers---
var waveNumber = 1;
var potionNumber = 500;
var freezeNumber = 1000;
var fireShieldNumber = 1000;
// Pause logic stole and modified from cozort
var paused = false;
//---------------------------Images------------------------------------
// Background image
var bgReady = false;
var bgImage = new Image();
bgImage.onload = function () {
	bgReady = true;
};
bgImage.src = "_images/background3.png";

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

// hero projectile image
var heroProjectileReady = false;
var heroProjectileImage = new Image();
heroProjectileImage.onload = function () {
	heroProjectileReady = true;
};
heroProjectileImage.src = "_images/sword_small.png";

// monster projectile image
var monsterProjectilReady = false;
var monsterProjectileImage = new Image();
monsterProjectileImage.onload = function() {
	monsterProjectileReady = true;
}
monsterProjectileImage.src = "_images/monsterProjectile_small.png";

// health potion image
var healthPotionReady = false;
var healthPotionImage = new Image();
healthPotionImage.onload = function() {
	healthPotionReady = true;
}
healthPotionImage.src = "_images/healthPotion_small.png";

// freeze power up image
var freezeIconReady = false;
var freezeIconImage = new Image();
freezeIconImage.onload = function() {
	freezeIconReady = true;
}
freezeIconImage.src = "_images/freezeIcon_small.png";

// fire shield image
var fireShieldReady = false;
var fireShieldImage = new Image();
fireShieldImage.onload = function(){
	fireShieldReady = true;
}
fireShieldImage.src = "_images/fireShield_small.png";

// fire shield icon i,age
var shieldIconReady = false;
var shieldIconImage = new Image();
shieldIconImage.onload = function() {
	shieldIconReady = true;
}
shieldIconImage.src = "_images/fireIcon_small.png";

//------------------------------ Game Objects ----------------------------
var hero = {
	gravity: 9.8,
	speed: 256, // movement in pixels per second
	grounded: true,
	health: 400,
	healthSmall: 35,
	jump: function () {
		this.y -= 65;
	}
};

function Monster() {
	this.gravity = 300;
	this.x = Math.random()*canvas.width;
	this.y = 0;
	this.jump = function() {
		this.y = 0;
	};
	this.killed = false;
	allMonsters.push(this);
}
function heroProjectile() {
	this.speed = 25;
	this.x = canvas.width/2;
	this.y = canvas.height/2;
	this.fired = false;
	heroProjectiles.push(this);
}
var heroProjectile = new heroProjectile(); 

function healthPotion() {
	this.speed = 5;
	this.x = Math.random()*canvas.width;
	this.y = 0;
	this.used = false;
	allPotions.push(this);
}

function freeze() {
	this.speed = 5;
	this.x = Math.random()*canvas.width;
	this.y = 0;
}

function fireShield() {
	this.x = hero.x - 45;
	this.y = hero.y - 30;
	this.used = false;
}

function monsterProjectile() {
	this.speed = 10,
	this.x = Monster.x,
	this.y = Monster.y;	
	this.fired = false;
	monsterProjectiles.push(this);
}
var monsterProjectile = new monsterProjectile();



//------------------------------------- Setup Keyboard controls ----------------------------------------

var keysDown = {};

addEventListener("keydown", function (e) {
	keysDown[e.key] = true;
}, false);

addEventListener("keyup", function (e) {
	delete keysDown[e.key];
}, false);

//----------------------------------- Functions -----------------------------------
var reset = function () {
	hero.x = canvas.width - 64;
	hero.y = canvas.height - 64;
	for(monsters in allMonsters){
	 allMonsters[monsters].gravity += 20;
	}
	monsterWave(50);
	spawnPotion();
	healthPotion.y = 0;
	heroProjectile.x = hero.x;
	heroProjectile.y = hero.y;
};

// generate random number
var randNum = function (x) {
	return Math.floor(Math.random() * x);
};
//creates a range from a start number to the end
function range(start, end) {
	var arr = [];
	for (let i = start; i <= end; i++) {
		arr.push(i);
	}
	return arr;
}

// //this function creates new monsters based on a range using the range function
// // testing this block
function monsterWave(max) {
	for (monster in range(1, max)) {
		monster = new Monster();
	}
}
// spawns a potion
function spawnPotion() {
	new healthPotion();
}

// unfreeze monsters
function unfreeze() {
	for(monsters in allMonsters){
		allMonsters[monsters].gravity = 300 + (waveNumber-1)*10;
		monsterImage.src = "_images/monster_small.png"
	}
}
function fireShieldGone() {
	heroProjectileImage.src = "_images/heroProjectile_small.png";
	fireShield.used = false;
}
// // monster fire function
// function monsterFire () {
// 	monsterProjectile.y += monsterProjectile.speed;
// 	monsterProjectileFired = true;
// 	console.log("rock launched");
// }
// ------------------------- User input -----------------------
var input = function (modifier) {
if ("w" in keysDown && hero.grounded == true) { // Player holding up
	if(hero.grounded) {
	hero.jump();
}
}

if ("s" in keysDown) { // Player holding down
	hero.y += hero.speed * modifier;
}
if ("a" in keysDown) { // Player holding left
	hero.x -= hero.speed * modifier;
}
if ("d" in keysDown) { // Player holding right
	hero.x += hero.speed * modifier;
}
if (" " in keysDown) { // Player holding right
	heroProjectile.fired = true;
}
if ("p" in keysDown) { 
		paused = true;	
}
if ("r" in keysDown && hero.health >0) {
	paused = false;
}
if("z" in keysDown) {
	hero.health += 1000;
}
if("1" in keysDown && hero.health<1000 && potionNumber >0) {
	hero.health += 100;
	hero.healthSmall += 35/4;
	potionNumber--;
}
if("2" in keysDown && freezeNumber>0 && paused == false) {
	for(monsters in allMonsters){
		allMonsters[monsters].gravity = 0;
		monsterImage.src = "_images/freezeIcon_small.png";
	}
	freezeNumber--;
	// setTimeout logic from w3schools
	setTimeout(unfreeze, 2000);
}
if("3" in keysDown && fireShieldNumber>0 && paused == false) {
	heroProjectileImage.src = "_images/fireShield_small.png";
	fireShield.used = true;
	fireShieldNumber--;
	setTimeout(fireShieldGone, 10000);
}
}
// ------------------------------- Update Function ----------------------------------
var update = function (modifier) {
// console.log(allPotions)
// potion dropping and stopping on floor
	for(potions in allPotions){
	allPotions[potions].y += allPotions[potions].speed;
	if(allPotions[potions].y >canvas.height - 32) {
		allPotions[potions].y = canvas.height - 32;
	}
	}
	
// Hero firing arrow if projectileFired is true
	if (heroProjectile.fired == true) {
		heroProjectile.y -= heroProjectile.speed;
	}
	if (heroProjectile.y < 0) {
		heroProjectile.fired = false;
	}
	if (heroProjectile.fired == false) {
		heroProjectile.x = hero.x;
		heroProjectile.y = hero.y;	
	}
	// jumping code
	if (hero.y > canvas.height-32) {
		hero.y = canvas.height-32;
		hero.gravity = 0;
	}
	if (hero.y < canvas.height - 32) {
		hero.gravity = 9.8;
	}

	if (hero.x >= canvas.width - 32) {
		hero.x = canvas.width - 32;
	}

	if (hero.x <= 0) {
		hero.x = 0;
	}
	if (hero.y <= 0) {
		hero.y = 0;
	}
	// ---- making monsters faster and waves loop----
	if(allMonsters.length == 0) {
		reset();
		waveNumber++;
	}
	// this is where the monsters get updated
		for (monster in allMonsters) {
			if (allMonsters[monster].y <= canvas.height) {
				allMonsters[monster].y += allMonsters[monster].gravity * modifier;	
			}
			if (allMonsters[monster].y > canvas.height - 59) {
				allMonsters[monster].jump();
				allMonsters[monster].x = randNum(canvas.width);
			}
		}
	
	// this is where the gravity is applied to the hero
	hero.y += hero.gravity;

	// this detects collision, where there's a hitboc that is initialized

	for (monster in allMonsters) {
		if (
			hero.x <= (allMonsters[monster].x + 32) &&
			allMonsters[monster].x <= (hero.x + 32) &&
			hero.y <= (allMonsters[monster].y + 32) &&
			allMonsters[monster].y <= (hero.y + 32)
		) {
			hero.health -= 50;
			hero.healthSmall -= 35/8;
			monstersCaught--;
		}
	}
	// detects collision with potion
	for(potions in allPotions){
		if(	
		hero.x <= (allPotions[potions].x + 32) &&
		allPotions[potions].x <= (hero.x + 32) &&
		hero.y <= (allPotions[potions].y + 32) &&
		allPotions[potions].y <= (hero.y + 32) &&
		hero.health<=400 
		)
		{
		potionNumber++;
		allPotions.splice(potions, 1);
		}
		}

	// projectile collision
	for (monster in allMonsters) {
	if (allMonsters[monster].y < canvas.height - 50) {
		if (
			heroProjectile.x <= (allMonsters[monster].x + 20) &&
			allMonsters[monster].x <= (heroProjectile.x + 20) &&
			heroProjectile.y <= (allMonsters[monster].y + 32) &&
			allMonsters[monster].y <= (heroProjectile.y + 32)
		) {
			++monstersCaught;
			allMonsters.splice(monster, 1);
		}
	}
}
	// fire shield exploding logic
	for(monsters in allMonsters){
		if(allMonsters[monsters].killed){
			allMonsters.splice(monsters, 1);
		}
	}
	if(fireShield.used)
		for(monsters in allMonsters) {
			if(fireShield.x <= (allMonsters[monsters].x + 25) &&
			allMonsters[monsters].x <= (fireShield.x + 90) &&
			fireShield.y <= (allMonsters[monsters].y + 32) &&
			allMonsters[monsters].y <= (fireShield.y + 20)){
				monstersCaught++;
				allMonsters[monsters].killed = true;
			}
		}
		

		
	// ------- pause if hero dies ---------
	if(hero.health <= 0) {
		paused = true;
	}
}

	
// ### Render ###
var render = function () {
	if (bgReady) {
		ctx.drawImage(bgImage, 0, 0);
	}

	if (heroReady) {
		ctx.drawImage(heroImage, hero.x, hero.y);
	}
	if (heroProjectileReady) {
			ctx.drawImage(heroProjectileImage, heroProjectile.x, heroProjectile.y);
			// console.log("it works");
		}
		//render monsters
	if (monsterReady) {
		for (monster in allMonsters) {
			ctx.drawImage(monsterImage, allMonsters[monster].x, allMonsters[monster].y);
		}
	}

	// render health potion and potion icon
	if (healthPotionReady) {
		ctx.drawImage(healthPotionImage, 5, 150);
		for(potions in allPotions) {
			ctx.drawImage(healthPotionImage, allPotions[potions].x, allPotions[potions].y);
			}
	}
		ctx.fillstyle = "rgb(0, 250, 0)";
		ctx.font = "24px Helvetica";
		ctx.fillText(potionNumber, 20, 170);
	
	// render freeze icon and count
	if(freezeIconReady) {
		ctx.drawImage(freezeIconImage, 10, 200);
		ctx.fillstyle = "rgb(0, 250, 0)";
		ctx.font = "24px Helvetica";
		ctx.fillText(freezeNumber, 25, 210);
	}
	// render fire shield, Icon and count
	// if(fireShieldReady){
	// for(shields in allFireShields){
	// 	ctx.drawImage(fireShieldImage, hero.x - 45, hero.y - 30);
	// }
	// }
	if(shieldIconReady){
	ctx.drawImage(shieldIconImage, 15, 240);
	ctx.fillStyle = "rgb(0, 250 , 0)";
	ctx.font = "24px Helvetica";
	ctx.fillText(fireShieldNumber, 20, 250);
	}


	// render wave number
	ctx.fillStyle = "rgb(0, 250, 250)";
		ctx.font = "50px Impact";
		ctx.textAlign = "center";
		ctx.textBaseline = "middle";
		ctx.fillText("Wave " + waveNumber, 610, 30);

	// pause text
	if(paused == true) {
		ctx.fillStyle = "rgb(250, 0, 0)";
		ctx.font = "36px Helvetica";
		ctx.textAlign = "center";
		ctx.textBaseline = "middle";
		ctx.fillText("Paused", 600, 250);
	}

	// Score
	ctx.fillStyle = "rgb(250, 250, 250)";
	ctx.font = "24px Helvetica";
	ctx.textAlign = "left";
	ctx.textBaseline = "top";
	ctx.fillText("Goblins caught: " + monstersCaught, 32, 32);

	// health bar: code from https://developer.mozilla.org/en-US/docs/Web/API/CanvasRenderingContext2D/createLinearGradient
	// and modified
	var gradient = ctx.createLinearGradient(20,0, 220,0);

	// Add two color stops
	gradient.addColorStop(0, 'green');
	gradient.addColorStop(1, 'green');

	// Set the fill style and draw a rectangle
	ctx.fillStyle = gradient;
	ctx.fillRect(10, 450, hero.health, 20);
	

	// health bar small, above hero
	var gradient = ctx.createLinearGradient(20,0, 220,0);

	// Add two color stops
	gradient.addColorStop(0, 'rgb(250, 0, 0)');
	gradient.addColorStop(1, 'rgb(0, 240, 0)');

	// Set the fill style and draw a rectangle
	ctx.fillStyle = gradient;
	ctx.fillRect(hero.x, hero.y, hero.healthSmall, 5);
}

// ---- Main loop function ----
var main = function () {
	now = Date.now();
	delta = now - then;
	input(delta/1000);
	if(paused == false) {
	update(delta / 1000);
	hero.speed = 256;
	}	
	else {
		hero.speed = 0;
		hero.grounded = false;
	}
	render(delta/1000);
	then = now;

	// Request to do this again ASAP
	requestAnimationFrame(main);
}
// Cross-browser support for requestAnimationFrame
var w = window;
requestAnimationFrame = w.requestAnimationFrame || w.webkitRequestAnimationFrame || w.msRequestAnimationFrame || w.mozRequestAnimationFrame;

// Let's play this game!
var then = Date.now();
reset();
main();
