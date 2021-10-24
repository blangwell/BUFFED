import { buildLevel } from './levels.js';
export const SCALE = 3;
let currentLevel = 0;

scene('game', () => {
	// ====== SETUP ======
	layers([
		"bg",
		"game",
		"ui",
	], 'game');

	cursor('none');
	buildLevel(currentLevel);

	let levelMessage = add([
		text(`Layer ${currentLevel + 1}`, {
			font: 'sink',
			size: 40
		}),
		console.log(camPos()),
		pos(camPos().x, camPos().y),
		origin('center'),
		layer('ui'),
		fixed(),
		lifespan(2, { fade: 1 })
	])
	
	// ====== PLAYER CHARACTER ======
	let player = get('player')[0];
	action('player', player => camPos(player.pos));
	player.collides('cat', () => {
		if (player.invulnerable) {
			return;
		}
		play('hit');
		player.hurt(1);
		player.invulnerable = true;
		updateHealthUI(player.hp());
		// flicker when damaged TODO: Add wave()
		let flicker = setInterval(() => {
			player.opacity = player.opacity == 1 ? .4 : 1; 
		}, 150);
		wait(1, () => {
			clearInterval(flicker)
			player.opacity = 1;
			player.invulnerable = false;
		});
	});
	updateHealthUI(player.hp());
	
	player.collides('potion', potion => {
		player.heal(1);
		play('heal', { volume: .5 });
		updateHealthUI(player.hp());
		potion.destroy();
	})

	on("hurt", "player", player => {
		player.color = rgb(255, 0, 0);
		wait(.5, () => player.color = null);
	});

	on("death", "player", () => {
		// bgm.pause();
		play('lose');
		currentLevel = 0;
		let cats = get('cat');
		cats.forEach(c => clearInterval(c.meowLoop));
		go('gameOver');
	});

	function updateHealthUI(playerHP) {
		every('heart', destroy);
		for (let i = 0; i < playerHP; i++) {
			add([
				sprite('gold'),
				scale(SCALE),
				pos(40 + (50 * i), 30	),
				layer('ui'),
				fixed(),
				'heart'
			])
		}
	}

	// ====== CAT LOGIC ======
	function catFollow(cat) {
		if (cat.buffed) {
			cat.moveTo(player.pos, cat.moveSpeed + 10);
			if (player.pos.x > cat.pos.x) {
				cat.flipX(true);
			} else {
				cat.flipX(false);
			}
		}
	}

	action('cat', cat => catFollow(cat));

	on("death", "cat", cat => {
		clearInterval(cat.meowLoop);
		burp({ volume: .4 });
		play('explode');
		cat.destroy();
		add([
			sprite("puff", { anim: "puff"}),
			pos(cat.pos.x, cat.pos.y),
			origin('center'),
			lifespan(.5),
			scale(SCALE + 5)
		]);
		if (get('cat').length === 0) {
			let staircase = add([
				sprite('staircase'),
				scale(SCALE + 2),
				pos(cat.pos.x, cat.pos.y),
				area({ width: 1, height: 1 }),
				origin('center'),
				layer('bg'),
				'staircase'
			])
			player.collides('staircase', () => {
				play('footsteps');
				currentLevel++;
				go('game');
			})
		}
	});


	// ===== INPUT =====
	// walk / idle 
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

	// movement
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

	// flipX
	keyPress('a', () => {
		player.flipX(false);
	});
	keyPress('d', () => {
		player.flipX(true);
	});

	// fullscreen
	keyPress('f', () => {
		fullscreen(!isFullscreen());
	});

	// ====== PROJECTILE LOGIC ======
	// spawn projectiles
	keyPress('left', () => {
		spawnProjectile(LEFT);
		player.flipX(false);
	});
	keyPress('right', () => {
		spawnProjectile(RIGHT);
		player.flipX(true);
	});
	keyPress('up', () => {
		spawnProjectile(UP);
	});
	keyPress('down', () => {
		spawnProjectile(DOWN);
	});

	function spawnProjectile(dir) {
		if (!player.inCooldown) {
			player.inCooldown = true;
			player.play('throw');
			wait(player.cooldownTime, () => {
				player.inCooldown = false;
				player.play('idle');
			});

			let projectile = add([
				sprite('fish'),
				pos(player.pos.x, player.pos.y),
				area(),
				move(dir, 300),
				scale(SCALE),
				rotate(0),
				cleanup(),
				origin('center'),
				"projectile"
			]);
			projectile.action(() => {
				projectile.angle += 300 * dt();
			});
		}
	}

	

	// ====== PROJECILE COLLISIONS ======
	collides('cat', 'projectile', (cat, projectile) => {
		projectile.destroy();
		if (cat.hp() > 1) {
			play('grow');
		}
		cat.hurt(1);
		cat.timesFed++;
		cat.scaleTo(SCALE + cat.timesFed);
	});

	collides("projectile", "wall", (projectile) => {
		projectile.destroy();
	});

}); 
// =========== END SCENE ===========

scene('mainMenu', () => {
	add([
		text('BUFFED', {
			size: 170,
			font: "sink"
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
	keyPress('space', () => {
		go('game');
	});
	keyPress('f', () => {
		fullscreen(!isFullscreen());
	})
});

scene('gameOver', () => {
	add([
		text('GAME OVER', {
			size: 90,
			font: "sinko"
		}),
		pos(width() / 2, height() / 2),
		origin('center')
	]);
	add([
		text('Press space to play again', {
			size: 25,
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