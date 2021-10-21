import kaboom from "https://unpkg.com/kaboom@next/dist/kaboom.mjs";
import { LEVELS } from "./levels.js";

const SCALE = 3;

kaboom({
	background: [0, 0, 0]
});

loadSpriteAtlas('./sprites/tmDungeon.png', './tilemap.json');
loadSpriteAtlas('./sprites/ssFantasy.png', './fantasySpriteAtlas.json');
loadSpriteAtlas('./sprites/uiRedbox.png', './redBox.json');

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
			origin('top')
		],
		"l": () => [
			sprite("wallL"),
			scale(SCALE),
			area({ offset: -32 }),
			solid(),
			origin('topleft')
		]
	});


	const ogre = add([
		sprite('ogre', { anim: 'idle' }),
		pos(width() / 2, height() / 2),
		origin('center'),
		scale(SCALE),
		area({ width: 14, height: 14 }),
		solid(),
		z(2),
		{
			speed: 100
		}
	]);
	ogre.direction = 'right';

	const slime = add([
		sprite('slime', { anim: 'idle' }),
		pos(200, 200),
		origin('center'),
		scale(SCALE),
		area({ width: 8, height: 7 }),
		solid()
	]);

	const slime2 = add([
		sprite('slime', { anim: 'idle' }),
		pos(400, 400),
		origin('center'),
		scale(SCALE),
		area({ width: 8, height: 7 }),
		// solid()
	]);


	// sprite animation 
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

	keyPress(['left', 'a'], () => {
		if (!keyIsDown('right') && !keyIsDown('d')) {
			ogre.flipX(true);
		}
	});
	keyPress(['right', 'd'], () => {
		if (!keyIsDown('left') && !keyIsDown('a')) {
			ogre.flipX(false);
		}
	});
	// pc movement logic
	keyDown(['left', 'a'], () => {
		ogre.move(-150, 0);
	});
	keyDown(['right', 'd'], () => {
		ogre.move(150, 0);
	});
	keyDown(['up', 'w'], () => {
		ogre.move(0, -150);
	});
	keyDown(['down', 's'], () => {
		ogre.move(0, 150);
	});
});

scene('mainMenu', () => {
	add([
		text('HUGE', {
			size: 200,
			font: "apl386"
		}),
		pos(width() / 2, height() / 2),
		origin('center')
	]);
	add([
		text('Press space to play', {
			size: 50
		}),
		pos(width() / 2, height() / 2 + 100),
		origin('top')
	]);

	keyPress(['space'], () => {
		go('game');
	});

});


go('mainMenu');