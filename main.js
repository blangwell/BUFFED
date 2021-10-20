import kaboom from "https://unpkg.com/kaboom@next/dist/kaboom.mjs";
import { LEVELS } from "./levels.js";

const SCALE = 3;

kaboom({
	background: [0, 0, 0]
});

loadSpriteAtlas('./sprites/tmDungeon.png', './tilemap.json');
loadSpriteAtlas('./sprites/ssFantasy.png', './fantasySpriteAtlas.json');

scene('game', () => {
	let floor = addLevel(LEVELS.one.floor, {
		width: 16 * SCALE,
		height: 16 * SCALE,
		" ": () => [
			sprite("floorTiles", { frame: ~~rand(0, 7) }),
			scale(SCALE),
			origin('center')
		],
		"t": () => [
			sprite("wallFaceTiles", { frame: ~~rand(0, 6) }),
			scale(SCALE),
			origin('center')
		]
	});
	
	let map = addLevel(LEVELS.one.map, {
		width: 16 * SCALE,
		height: 16 * SCALE,
		"$": () => [
			sprite("skeleton"),
			scale(SCALE),
			area({ offset: vec2(0, -25) }),
			solid(),
			origin('center')
		],
		"w": () => [
			sprite("wallB"),
			scale(SCALE),
			area({ offset: 20 }),
			solid(),
			origin('center')
		],
		"r": () => [
			sprite("wallR"),
			scale(SCALE),
			area({ offset: 32 }),
			solid(),
			origin('center')
		],
		"l": () => [
			sprite("wallL"),
			scale(SCALE),
			area({ offset: -32 }),
			solid(),
			origin('left')
		]
	});
	
	
	const ogre = add([
		sprite('ogre', { anim: 'idle' }),
		pos(width() / 2, height() / 2),
		origin('center'),
		scale(SCALE),
		area(),
		solid(),
		z(3)
	]);
	ogre.direction = 'right';
	
	const slime = add([
		sprite('slime', { anim: 'idle' }),
		pos(ogre.pos.x + 100, ogre.pos.y + 100),
		origin('center'),
		scale(SCALE),
		area({ width: 8, height: 7 }),
		solid()
	]);
	
	function slimeAI(slime) {
		let interval = randi(3, 8);
	
	}

	// event animation 
	const movementKeys = ['left', 'a', 'right', 'd', 'down', 's', 'up', 'w']
	keyPress(movementKeys, () => {
		ogre.play('walk');
	});
	keyRelease(movementKeys, () => {
		for (let key of movementKeys) {
			if (keyIsDown(key)) {
				return;
			}
		}
		ogre.play('idle');
	});

	// pc move and flip logic
	keyDown(['left', 'a'], () => {
		ogre.move(-150, 0);
		ogre.flipX(true);
	});
	keyDown(['right', 'd'], () => {
		ogre.move(150, 0);
		ogre.flipX(false);
	});
	keyDown(['up', 'w'], () => {
		ogre.move(0, -150);
	});
	keyDown(['down', 's'], () => {
		ogre.move(0, 150);
	});
});


go('game');