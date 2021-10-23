import {addFloor, addMap} from './levels.js';
const SCALE = 3;

scene('game', () => {
	layers([
		"bg",
		"game",
		"ui",
	], 'game');

	cursor('none');
	addFloor(SCALE);
	addMap(SCALE);

	const player = add([
		sprite('pc', { anim: 'idle' }),
		pos(width() / 2, height() / 2),
		origin('center'),
		layer('game'),
		scale(SCALE),
		area({ width: 14, height: 14 }),
		health(3),
		solid(),
		z(2),
		"player"
	]);
	player.invulnerable = false;
	player.cooldownTime = .5;
	player.inCooldown = false;

	player.collides('slime', () => {
		if (!player.invulnerable) {
			play('hit');
			player.hurt(1);
			updateHealthUI(player.hp());
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

	player.collides('potion', potion => {
		player.heal(1);
		play('heal', { volume: .5 });
		updateHealthUI(player.hp());
		potion.destroy();
	})

	function updateHealthUI(playerHP) {
		every('heart', destroy);
		for (let i = 0; i < playerHP; i++) {
			add([
				sprite('gold'),
				scale(SCALE),
				pos(50 + (50 * i), 50),
				layer('ui'),
				'heart'
			])
		}
	}
	updateHealthUI(player.hp());

	on("hurt", "player", player => {
		player.color = rgb(255, 0, 0);
		wait(.5, () => player.color = null);
	});

	on("death", "player", () => {
		// bgm.pause();
		play('lose');
		go('gameOver');
	});

	

	// CUSTOM SPRITE CURSOR
	let crosshair = add([
		sprite('crosshair'),
		pos(mousePos()),
		scale(SCALE - 1),
		origin('center'),
		z(3),
		"crosshair"
	]);

	// ADD SLIMES
	add([
		sprite('cats', { anim: 'blackIdle' }),
		pos(200, 200),
		origin('center'),
		layer('game'),
		scale(SCALE),
		// area({ width: 12, height: 8, offset: {x: 0, y: 3} }),
		area(),
		solid(),
		health(3),
		{
			timesFed: 0
		},
		"slime"
	]);
	add([
		sprite('cats', { anim: 'orangeIdle' }),
		pos(400, 400),
		origin('center'),
		layer('game'),
		scale(SCALE),
		// area({ width: 12, height: 8, offset: {x: 0, y: 3} }),
		area(),
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

	// FLIP PLAYER BASED ON MOUSE POSITION
	mouseMove(() => {
		crosshair.pos = mousePos();
		if (mousePos().x < player.pos.x) {
			player.flipX(false);
		} else {
			player.flipX(true);
		}
	});

	// PROJECTILE LOGIC
	mouseClick(() => {
		if (!player.inCooldown) {
			player.inCooldown = true;
			player.play('throw');
			wait(player.cooldownTime, () => {
				player.inCooldown = false;
				player.play('idle');
			})
			let dest = mousePos();
			let projectile = add([
				sprite('fish'),
				pos(player.pos.x, player.pos.y),
				area(),
				move(dest.angle(player.pos), 300),
				scale(SCALE - 1),
				rotate(0),
				cleanup(),
				origin('center'),
				"projectile"
			]);
			projectile.action(() => {
				projectile.angle += 300 * dt();
			});

		}
	});

	keyPress('f', () => {
		fullscreen(!isFullscreen());
	})

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

	// PROJECTILE WALL COLLISION 
	collides("projectile", "wall", (projectile) => {
		projectile.destroy();
	});

}); 
// =========== END SCENE ===========

scene('mainMenu', () => {
	add([
		text('BUFFED', {
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

scene('gameOver', () => {
	add([
		text('GAME OVER!', {
			size: 100,
			font: "sinko"
		}),
		pos(width() / 2, height() / 2),
		origin('center')
	]);
	add([
		text('Press space to play again', {
			size: 50,
			font: "sink"
		}),
		pos(width() / 2, height() / 2 + 100),
		origin('top')
	]);
	keyPress(['space'], () => {
		go('game');
	});
})

go('mainMenu');