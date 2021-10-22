import kaboom from "https://unpkg.com/kaboom@next/dist/kaboom.mjs";

export const k = kaboom({
	background: [0, 0, 0],
});

loadSprite('crosshair', './sprites/crosshair.png');
loadSpriteAtlas('./sprites/tmDungeon.png', './tilemap.json');
loadSpriteAtlas('./sprites/ssFantasy.png', './fantasySpriteAtlas.json');
loadSpriteAtlas('./sprites/uiRedbox.png', './redBox.json');
loadSprite('fish', './sprites/fish.png');
loadSound('grow', './sounds/grow1.wav');
loadSound('explode', './sounds/explode1.wav');
loadSound('bgm', './sounds/abstractionDeepBlue.wav');
loadSound('lose', './sounds/lose.wav');
loadSound('hit', './sounds/hit1.wav');
loadSound('heal', './sounds/threeTone2.ogg');
