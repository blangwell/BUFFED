import kaboom from "https://unpkg.com/kaboom@next/dist/kaboom.mjs";
import { LEVELS } from "./levels.js";

const SCALE = 3;

kaboom({
	background: [0, 0, 0]
});

loadSpriteAtlas('./sprites/tmDungeon.png', './tilemap.json');
loadSpriteAtlas('./sprites/ssFantasy.png', './fantasySpriteAtlas.json');
loadSpriteAtlas('./sprites/uiRedbox.png', './redBox.json');
loadSprite('fish', './sprites/fish.png');
loadSound('grow', './sounds/grow1.wav');
loadSound('explode', './sounds/explode1.wav');
loadSound('bgm', './sounds/abstractionDeepBlue.wav');
loadSound('lose', './sounds/lose.wav');
loadSound('hit', './sounds/hit1.wav');

scene('game', () => {
	cursor('crosshair');

	const bgm = play('bgm', {
		volume: .1
	});	
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
			origin('center'),
			"wall"
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
			origin('center'),
			"wall"
		],
		"r": () => [
			sprite("wallR"),
			scale(SCALE),
			area({ offset: 32 }),
			solid(),
			origin('top'),
			"wall"
		],
		"l": () => [
			sprite("wallL"),
			scale(SCALE),
			area({ offset: -32 }),
			solid(),
			origin('topleft'),
			"wall"
		]
	});


	const player = add([
		sprite('ogre', { anim: 'idle' }),
		pos(width() / 2, height() / 2),
		origin('center'),
		scale(SCALE),
		area({ width: 14, height: 14 }),
		health(3),
		solid(),
		z(2),
		"player"
	]);
	player.invulnerable = false;
	player.collides('slime', () => {
		console.log(player.hp())
		if (!player.invulnerable) {
			play('hit');
			player.hurt(1);
			player.opacity = .4;
			// flicker when damaged
			let flicker = setInterval(() => {
				player.opacity = player.opacity == 1 ? .4 : 1; 
			}, 150)
			wait(1, () => clearInterval(flicker));
		}
		player.invulnerable = true;
		wait(1, () => {
			player.invulnerable = false;
			player.opacity = 1;
		});
	});

	on("hurt", "player", player => {
		player.color = rgb(255, 0, 0);
		wait(.5, () => player.color = null);
	});

	on("death", "player", player => {
		bgm.pause();
		play('lose');
		go('mainMenu');
	});

	const slime = add([
		sprite('slime', { anim: 'idle' }),
		pos(200, 200),
		origin('center'),
		scale(SCALE),
		area({ width: 12, height: 8, offset: {x: 0, y: 3} }),
		solid(),
		health(3),
		{
			timesFed: 0
		},
		"slime"
	]);

	const slime2 = add([
		sprite('slime', { anim: 'idle' }),
		pos(400, 400),
		origin('center'),
		scale(SCALE),
		area({ width: 12, height: 8, offset: {x: 0, y: 3} }),
		solid(),
		health(3),
		{
			timesFed: 0
		},
		"slime"
	]);

	// SLIME COLLISION / DEATH
	on("death", "slime", slime => {
		burp({ volume: .4 });
		play('explode');
		slime.destroy();
		add([
			sprite("puff", { anim: "puff"}),
			pos(slime.pos.x, slime.pos.y),
			origin('center'),
			lifespan(.5),
			scale(SCALE + 3)
		]);
	});

	// sprite animation 
	const movementKeys = ['w', 'a', 's', 'd'];
	keyPress(movementKeys, () => {
		player.play('walk');
	});
	keyRelease(movementKeys, () => {
		for (let key of movementKeys) {
			if (keyIsDown(key)) {
				return;
			}
		}
		player.play('idle');
	});

	// INPUTS
	// pc movement logic
	keyDown('a', () => {
		player.move(-150, 0);
	});
	keyDown('d', () => {
		player.move(150, 0);
	});
	keyDown('w', () => {
		player.move(0, -150);
	});
	keyDown('s', () => {
		player.move(0, 150);
	});

	// PROJECTILE LOGIC
	mouseClick(() => {
		let dest = mousePos();
		let projectile = add([
			sprite('fish'),
			pos(player.pos.x, player.pos.y),
			area(),
			move(dest.angle(player.pos), 250),
			scale(SCALE - 1),
			rotate(0),
			cleanup(),
			origin('center'),
			"projectile"
		]);
		projectile.action(() => {
			projectile.angle += 300 * dt();
		});
	});

	// FLIP PLAYER BASED ON MOUSE POSITION
	mouseMove(() => {
		if (mousePos().x < player.pos.x) {
			player.flipX(true);
		} else {
			player.flipX(false);
		}
	});

	// COLLISIONS
	// GROW ON SHOOT LOGIC
	collides('slime', 'projectile', (slime, projectile) => {
		projectile.destroy();
		if (slime.hp() > 1) {
			play('grow');
		}
		slime.hurt(1);
		slime.timesFed++;
		slime.scaleTo(SCALE + slime.timesFed);
	});

	// collides('player', 'slime', (player, slime) => {
	// 	player.hurt(1);
	// 	console.log(player.hp());
	// });


	// PROJECTILE WALL COLLISION 
	collides("projectile", "wall", (projectile) => {
		projectile.destroy();
	});

}); 
// =========== END SCENE ===========


scene('mainMenu', () => {
	add([
		text('HUGE', {
			size: 200,
			font: "sinko"
		}),
		pos(width() / 2, height() / 2),
		origin('center')
	]);
	add([
		text('Press space to play', {
			size: 50,
			font: "sink"
		}),
		pos(width() / 2, height() / 2 + 100),
		origin('top')
	]);
	keyPress(['space'], () => {
		go('game');
	});
});

go('mainMenu');