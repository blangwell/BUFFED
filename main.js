import { k } from './load.js';
import { buildLevel } from './levels.js';
export const SCALE = 3;
let currentLevel = 0;
let bgmPlaying = false;
let bgm;

export let playerHealth = 3;

scene('game', () => {
	// debug.inspect = true;
	// ====== SETUP ======
	layers([
		"bg",
		"game",
		"ui",
	], 'game');

	if (!bgmPlaying) {
		bgmPlaying = true;
		bgm = play('bgm', { volume: .1, loop: true });
	}
	cursor('none');
	buildLevel(currentLevel);

	// ====== PLAYER CHARACTER ======
	let player = get('player')[0];
	updateHealthUI(player.hp());
	
	onUpdate('player', player => camPos(player.pos));
	player.onCollide('cat', () => {
		playerDamage();
	});

	player.onCollide('barf', () => {
		playerDamage();
	})
	
	player.onCollide('potion', potion => {
		player.heal(1);
		playerHealth++;
		play('heal', { volume: .5 });
		updateHealthUI(player.hp());
		potion.destroy();
	});

	on("hurt", "player", player => {
		player.color = rgb(255, 0, 0);
		wait(.5, () => player.color = null);
	});

	on("death", "player", () => {
		bgm.pause();
		bgmPlaying = false;
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
				sprite('heart'),
				scale(SCALE),
				pos(40 + (63 * i), 40	),
				layer('ui'),
				fixed(),
				'heart'
			])
		}
	}

	// ====== CAT LOGIC ======
	function catFollow(cat) {
		if (cat.pos.dist(player.pos) <= 500 || cat.aggro === true) {
			cat.aggro = true;
			if (!cat.stationary) {
				cat.moveTo(player.pos, cat.moveSpeed + 10);
			}
			if (player.pos.x > cat.pos.x) {
				cat.flipX(true);
			} else {
				cat.flipX(false);
			}
		} 
	}
	
	// BOSS FIGHT LOGIC
	if (currentLevel === 7) {
		let boss = get('boss')[0];
		let spawnInterval = setInterval(() => {
			spawnEnemies(boss.pos);
		}, rand(7000, 10000));
		boss.on('death', () => {
			play('bossDie', {volume: .3});
			wait(.25, () => play('bossDie', {volume: .3}));
			wait(.5, () => play('bossDie', {volume: .3}));
			clearInterval(spawnInterval)
		});
		player.on('death', () => clearInterval(spawnInterval));
	}
	function spawnEnemies(pos) {
		add([
			k.sprite('cats2', { anim: 'eliteIdle'}),
			k.pos(pos.x - rand(64, 96), pos.y - rand(64, 96)),
			k.area(),
			k.scale(SCALE),
			k.origin('center'),
			k.layer('game'),
			health(5),
			{
				aggro: true,
				timesFed: 0,
				buffed: true,
				moveSpeed: 70,
				growModifier: .5,
				meowLoop: setInterval(() => {
					play('eliteMeow', { volume: .2 });
				}, rand(3000, 6000))
			},
			"cat",
			"elite",
		]);
	}

	let throwers = get('throw');
	loop(1.5, () => {
		for (let thrower of throwers) {
			if (thrower.aggro) {
				thrower.play('calicoThrow');
				if (thrower.hp() > 0) {
					let fishbone = add([
						sprite('fishbone'),
						pos(thrower.pos.x, thrower.pos.y),
						area(),
						move(player.pos.angle(thrower.pos), 350),
						scale(SCALE),
						rotate(0),
						origin('center'),
						"enemyProjectile",
					]);
					fishbone.onUpdate(() => {
						fishbone.angle -= 300 * dt();
					});
				}
			}
		}
	}),

	onUpdate('cat', cat => catFollow(cat));

	on("death", "cat", cat => {
		clearInterval(cat.meowLoop);
		if (cat.throwLoop) {
			clearInterval(cat.throwLoop);
		}
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
			player.onCollide('staircase', () => {
				play('footsteps');
				currentLevel++;
				go('transition');
			})
		}
	});


	// ===== INPUT =====
	// walk / idle 
	onKeyPress(['w', 'a', 's', 'd'], () => {
		player.play('walk');
	});
	onKeyRelease(['w', 'a', 's', 'd'], () => {
		if (
			!isKeyDown('w') &&
			!isKeyDown('a') &&
			!isKeyDown('s') &&
			!isKeyDown('d') 
			) {
				player.play('idle');
		}
	});

	// movement
	onKeyDown('a', () => {
		player.move(-150, 0);
	});
	onKeyDown('d', () => {
		player.move(150, 0);
	});
	onKeyDown('w', () => {
		player.move(0, -150);
	});
	onKeyDown('s', () => {
		player.move(0, 150);
	});

	// flipX
	onKeyPress('a', () => {
		player.flipX(false);
	});
	onKeyPress('d', () => {
		player.flipX(true);
	});

	// fullscreen
	onKeyPress('f', () => {
		fullscreen(!isFullscreen());
	});

	// ====== PROJECTILE LOGIC ======
	// spawn projectiles
	onKeyPress('left', () => {
		spawnProjectile(LEFT);
		player.flipX(false);
	});
	onKeyPress('right', () => {
		spawnProjectile(RIGHT);
		player.flipX(true);
	});
	onKeyPress('up', () => {
		spawnProjectile(UP);
	});
	onKeyPress('down', () => {
		spawnProjectile(DOWN);
	});

	function spawnProjectile(dir) {
		if (!player.inCooldown) {
			player.inCooldown = true;
			player.play('throw');
			wait(player.cooldownTime, () => {
				player.inCooldown = false;
				if (
					!isKeyDown('w') &&
					!isKeyDown('a') &&
					!isKeyDown('s') &&
					!isKeyDown('d') 
				) {
					player.play('idle');
				} else {
					player.play('walk');
				}
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
			projectile.onUpdate(() => {
				projectile.angle += 300 * dt();
			});
		}
	}

	

	// ====== PROJECILE COLLISIONS ======
	onCollide('cat', 'projectile', (cat, projectile) => {
		destroy(projectile);
		if (cat.hp() > 1) {
			play('grow');
		}
		cat.hurt(1);
		cat.timesFed++;
		cat.scaleTo(SCALE + cat.timesFed * cat.growModifier);
	});

	onCollide("projectile", "wall", (projectile) => {
		projectile.destroy();
		add([
			sprite('puff', {anim: 'puff'}),
			pos(projectile.pos.x , projectile.pos.y),
			scale(SCALE),
			lifespan(.5),
			origin('center')
		]);
	});
	onCollide("enemyProjectile", "wall", (projectile) => {
		projectile.destroy();
		add([
			sprite('puff', {anim: 'puff'}),
			pos(projectile.pos.x , projectile.pos.y),
			scale(SCALE),
			lifespan(.5),
			origin('center')
		]);
	});

	onCollide("enemyProjectile", "player", (projectile) => {
		projectile.destroy();
		playerDamage();
	})

	onCollide("projectile", "enemyProjectile", (projectile, enemyProjectile) => {
		projectile.destroy();
		enemyProjectile.destroy();
		add([
			sprite('puff', {anim: 'puff'}),
			pos((enemyProjectile.pos.x + projectile.pos.x) / 2 , 
				(enemyProjectile.pos.y + projectile.pos.y) / 2),
			scale(SCALE),
			lifespan(.5),
			origin('center')
		]);
	})

	function playerDamage() {
		if (player.invulnerable) {
			return;
		}
		play('hit');
		playerHealth--;
		player.hurt(1);
		player.invulnerable = true;
		updateHealthUI(player.hp());
		let flicker = setInterval(() => {
			player.opacity = player.opacity == 1 ? .4 : 1; 
		}, 150);
		wait(1, () => {
			clearInterval(flicker)
			player.opacity = 1;
			player.invulnerable = false;
		});
	}

	
	onCollide('player', 'elite', (player, elite) => {
		elite.play('eliteAttack');
	});
	
	
	// ====== COLLISION DIST TOGGLE ======
	onUpdate('cat', c => {
		c.solid = c.pos.dist(player.pos) <= 64 * SCALE;
	});
	onUpdate('wall', w => {
		w.solid = w.pos.dist(player.pos) <= 64 * SCALE;
	});

}); 
// =========== END SCENE ===========

scene('mainMenu', () => {
	add([
		sprite('splashScreen'),
		pos(0, 0),
		layer('bg')
	])
	let pressSpace = add([
		text('Press SPACE to Play', {
			size: 40,
			font: "sink"
		}),
		pos(width() / 2, height() / 2 + 150),
		origin('top')
	]);
	loop(2, () => {
		pressSpace.opacity = 1;
		wait(1, () => {
			pressSpace.opacity = 0;
		});
	});
	onKeyPress('space', () => {
		go('intro');
	});
	onKeyPress('f', () => {
		fullscreen(!isFullscreen());
	})
});

scene('gameOver', () => {
	add([
		sprite('gameOverScreen'),
		pos(0, 0),
		layer('bg')
	]);
	let pressSpace = add([
		text('Press SPACE to Play Again', {
			size: 25,
			font: "sink"
		}),
		pos(width() / 2, height() / 2 + 150),
		origin('top')
	]);
	loop(2, () => {
		pressSpace.opacity = 1;
		wait(1, () => {
			pressSpace.opacity = 0;
		});
	});
	onKeyPress(['space'], () => {
		go('transition');
	});
});

scene('transition', () => {
	if (currentLevel === 0) {
		playerHealth = 3;
	}
	if (currentLevel < 8) {
		add([
			pos(0, 0),
			color(0,0,0),
			rect(width(), height(), {
				fill: true,
			}),
			layer('game'),
		]);
		add([
			text(currentLevel < 7 ? `Layer ${currentLevel + 1}` : `The Wizard's Lair`, {
				font: 'sink',
				size: 40,
			}),
			pos(camPos().x, camPos().y),
			origin('center'),
			layer('ui'),
			fixed(),
			stay(),
			lifespan(2.5, { fade: 1 })
		])
		wait(1.5, () => go('game'));
	} else {
		bgm.pause();
		bgmPlaying = false;
		wait(1.5, () => go('win'));
	}
});

scene('intro', () => {
	let introMusic = play('introMusic', {volume: .1})
	add([
		sprite('intro1'),
		pos(0, 0),
		layer('bg'),
		lifespan(5, { fade: 1 })
	]);
	add([
		text('SPACE to skip', {
			size: 20,
			font: "sinko"
		}),
		pos(width() - 250, height() - 30),
		origin('left'),
		lifespan(3, {fade: 1})
	])
	wait(5, () => {
		add([
			sprite(`intro2`),
			pos(0, 0),
			layer('bg'),
			lifespan(5, { fade: 1 })
		]);
	});
	wait(10, () => {
		add([
			sprite(`intro3`),
			pos(0, 0),
			layer('bg'),
			lifespan(5, { fade: 1 })
		]);
	});
	wait(15, () => {
		add([
			sprite(`intro4`),
			pos(0, 0),
			layer('bg'),
			lifespan(5, { fade: 1 })
		]);
	});
	wait(20, () => {
		add([
			sprite(`intro5`),
			pos(0, 0),
			layer('bg'),
			lifespan(5, { fade: 1 })
		]);
	});
	wait(25, () => {
		add([
			sprite(`intro6`),
			pos(0, 0),
			layer('bg'),
		]);
		let pressSpace = add([
				text('Press SPACE to Play', {
					size: 40,
					font: "sinko"
				}),
				pos(width() / 2, height() / 2 + 200),
				origin('top')
			]);
			loop(2, () => {
				pressSpace.opacity = 1;
				wait(1, () => {
					pressSpace.opacity = 0;
				});
			});
	});
	onKeyPress('space', () => {
		go('transition');
		introMusic.pause();
	})
	onKeyPress('f', () => {
		fullscreen(!isFullscreen());
	});
});

scene('win', () => {
	play('explode')
	play('win', { volume: .6 });
	play('bgm', { volume: .3, loop: true })
	add([
		sprite('winScreen'),
		pos(0, 0),
		layer('bg')
	])
	onKeyPress('space', () => {
		go('mainMenu');
	});
});

go('mainMenu');