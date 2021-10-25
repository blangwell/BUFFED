import kaboom from "https://unpkg.com/kaboom@next/dist/kaboom.mjs";

export const k = kaboom({
	canvas: document.getElementById("game"),
	background: [69, 27, 74],
	width: 800,
	height: 600,
	crisp: true
});

export const gameConfig = {
	tileWidth: 16,
	tileHeight: 16,

}

loadSprite('splashScreen', './sprites/splashScreen.png');
loadSprite('gameOverScreen', './sprites/gameOverScreen.png');
loadSprite('fish', './sprites/fish.png');
loadSpriteAtlas('./sprites/tmDungeon.png', './tilemap.json');
loadSpriteAtlas('./sprites/ssFantasy.png', './fantasySpriteAtlas.json');
loadSpriteAtlas('./sprites/ssTilemapV2.png', './tilemapV2.json');

loadSpriteAtlas('./sprites/ssChars.png', './ssChars.json');

loadSound('grow', './sounds/grow1.wav');
loadSound('explode', './sounds/explode1.wav');
loadSound('bgm', './sounds/abstractionDeepBlue.wav');
loadSound('lose', './sounds/lose.wav');
loadSound('hit', './sounds/hit1.wav');
loadSound('heal', './sounds/threeTone2.ogg');
loadSound('meow', './sounds/meow.wav');
loadSound('footsteps', './sounds/footstepV2.wav');
loadSound('eliteMeow', './sounds/eliteMeow.wav');
