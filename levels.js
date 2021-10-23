import { k, gameConfig } from './load.js';

const LEVELS = {
	one: {
		floor: [
			"wwwwwwwwwwwwwwwwwwww",
			"tttttttttttttttttttt",
			"                    ",
			"                    ",
			"                    ",
			"                    ",
			"                    ",
			"                    ",
			"                    ",
			"                    ",
			"                    ",
			"                    "
		],
		map: [
			"wwwwwwwwwwwwwwwwwwww",
			"l  $      $       $r",
			"l           p      r",
			"l                  r",
			"l     h            r",
			"l                  r",
			"l                  r",
			"l                  r",
			"l               b  r",
			"l o                r",
			"l                  r",
			"awwwwwwwwwwwwwwwwwwd",
		]
	}
}
export function addFloor(scale) {
	addLevel(LEVELS.one.floor, {
		width: 16 * scale,
		height: 16 * scale,
		" ": () => [
			k.sprite("floorTiles", { frame: ~~rand(0, 7) }),
			k.scale(scale),
			k.origin('center'),
			k.layer('bg')
		],
		"t": () => [
			k.sprite("wallFaceTiles", { frame: ~~rand(0, 6) }),
			k.scale(scale),
			k.origin('center'),
			k.layer('bg'),
			"wall"
		]
	});
}

export function addMap(scale) {
	addLevel(LEVELS.one.map, {
		width: 16 * scale,
		height: 16 * scale,
		"p": () => [
			k.sprite('pc', { anim: 'idle' }),
			k.origin('center'),
			k.layer('game'),
			k.scale(scale),
			k.area({ width: 16, height: 28 }),
			k.health(3),
			k.solid(),
			// k.z(2),
			{
				invulnerable: false,
				cooldownTime: .5,
				inCooldown: false,
			},
			"player"
		],
		"$": () => [
			k.sprite("skeleton"),
			k.scale(scale),
			k.area({ offset: vec2(0, -25) }),
			k.solid(),
			k.layer('game'),
			k.origin('center')
		],
		"h": () => [
			k.sprite("potionRed"),
			k.scale(scale),
			k.area({ width: 8, height: 8 }),
			k.layer('game'),
			k.origin('center'),
			"potion"
		],
		"w": () => [
			k.sprite("wallB"),
			k.scale(scale),
			k.area({ offset: vec2(0, 20) }),
			k.solid(),
			k.layer('game'),
			k.origin('center'),
			"wall"
		],
		"r": () => [
			k.sprite("wallR"),
			k.scale(scale),
			k.area({ offset: vec2(28, 20) }),
			k.solid(),
			k.layer('game'),
			k.origin('center'),
			"wall"
		],
		"l": () => [
			k.sprite("wallL"),
			k.scale(scale),
			k.area({ offset: vec2(-25,0) }),
			k.solid(),
			k.layer('game'),
			k.origin('center'),
			"wall"
		],
		"a": () => [
			k.sprite("wallBL"),
			k.scale(scale),
			k.area({ offset: vec2(-10, 20) }),
			k.solid(),
			k.layer('game'),
			k.origin('center'),
			"wall"
		],
		"d": () => [
			k.sprite("wallBR"),
			k.scale(scale),
			k.area({ offset: vec2(0, 20) }),
			k.solid(),
			k.layer('game'),
			k.origin('center'),
			"wall"
		],
		"b": () => [
			k.sprite('cats', { anim: 'blackIdle' }),
			k.origin('center'),
			k.layer('game'),
			k.scale(scale),
			k.area({ width: 25, height: 25, offset: { x: 0, y: 10 } }),
			k.solid(),
			k.health(3),
			{
				timesFed: 0,
				moveSpeed: 50,
				buffed: true
			},
			"cat"
		],
		"o": () => [
			k.sprite('cats', { anim: 'orangeIdle' }),
			k.origin('center'),
			k.layer('game'),
			k.scale(scale),
			k.area({ width: 25, height: 25,  offset: { x: 0, y: 10 } }),
			k.solid(),
			k.health(3),
			{
				timesFed: 0,
				moveSpeed: 50,
				buffed: true
			},
			"cat"
		]
	});
}