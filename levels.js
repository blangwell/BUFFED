import { k } from './load.js';
import { SCALE } from './main.js';

const LEVEL_LIST =  [
	{ // LEVEL 1
		floor: [
			"ssssssssssssssssssss",
			"                    ",
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
			",xxxxxxxxxxxxxxxxxx.",
		]
	}, { // LEVEL 2
		floor: [
			"sssssssssssssssssssssssssssssssssssssssssss",
			"                                           ",
			"                                           ",
			"                                           ",
			"                                           ",
			"                                           ",
			"                                           ",
			"                                           ",
		],
		map: [
			"wwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwww",
			"l                                      o  r",
			"l                                         r",
			"l                                         r",
			"l              p                          r",
			"l                          h              r",
			"l   o                                 b   r",
			",xxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxr",
		]
	}, { // LEVEL 3
		floor: [
			"ssssssssssssssssssssssssssssssssssssss",
			"                                      ",
			"                                      ",
			"                                      ",
			"                                      ",
			"                                      ",
			"                                      ",
			"                                      ",
			"                                      ",
			"                                      ",
		],
		map: [
			"wwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwww",
			"l                                    r",
			"l        o                           r",
			"l                                    r",
			"l                                    r",
			"l     b           p                  r",
			"l                                    r",
			"l                               b    r",
			"l                                 h  r",
			",xxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxx.",
		]
	}
];

const mapKey = {
	" ": () => [
		k.sprite("floorV2", { frame: ~~rand(0, 7) }),
		k.origin('center'),
		k.scale(SCALE - 1.5),
		k.layer('bg')
	],
	"s": () => [
		k.sprite("wallFaceTiles", { frame: ~~rand(0, 6) }),
		k.scale(SCALE),
		k.origin('center'),
		k.layer('bg'),
		"wall"
	],
	"p": () => [
		k.sprite('pc', { anim: 'idle' }),
		k.origin('center'),
		k.layer('game'),
		k.scale(SCALE),
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
		k.scale(SCALE),
		k.area({ offset: vec2(0, -25) }),
		k.solid(),
		k.layer('game'),
		k.origin('center')
	],
	"h": () => [
		k.sprite("potionRed"),
		k.scale(SCALE + 1),
		k.area({ width: 8, height: 8 }),
		k.layer('game'),
		k.origin('center'),
		"potion"
	],
	"w": () => [
		k.sprite("wallB"),
		k.scale(SCALE),
		k.area({ offset: vec2(0, 20) }),
		k.solid(),
		k.layer('game'),
		k.origin('bot'),
		"wall"
	],
	"x": () => [
		k.sprite("wallB"),
		k.scale(SCALE),
		k.area({ offset: vec2(0, 20) }),
		k.solid(),
		k.layer('game'),
		k.origin('center'),
		"wall"
	],
	"r": () => [
		k.sprite("wallR"),
		k.scale(SCALE),
		k.area({ offset: vec2(28, 20) }),
		k.solid(),
		k.layer('game'),
		k.origin('center'),
		"wall"
	],
	"l": () => [
		k.sprite("wallL"),
		k.scale(SCALE),
		k.area({ offset: vec2(-25,0) }),
		k.solid(),
		k.layer('game'),
		k.origin('center'),
		"wall"
	],
	",": () => [
		k.sprite("wallBL"),
		k.scale(SCALE),
		k.area({ offset: vec2(-10, 20) }),
		k.solid(),
		k.layer('game'),
		k.origin('center'),
		"wall"
	],
	".": () => [
		k.sprite("wallBR"),
		k.scale(SCALE),
		k.area({ offset: vec2(0, 20) }),
		k.solid(),
		k.layer('game'),
		k.origin('center'),
		"wall"
	],
	"d": () => [
		k.sprite('door', { anim: 'locked' }),
		k.scale(SCALE),
		k.area(),
		k.solid(),
		k.layer('game'),
		k.origin('center'),
		"door"
	],
	"b": () => [
		k.sprite('cats', { anim: 'blackIdle' }),
		k.origin('center'),
		k.layer('game'),
		k.scale(SCALE),
		k.area({ width: 25, height: 25, offset: { x: 0, y: 10 } }),
		k.solid(),
		k.health(3),
		{
			timesFed: 0,
			moveSpeed: 50,
			buffed: true,
			meowLoop: setInterval(() => {
				play('meow');
			}, rand(2000, 5000))
		},
		"cat"
	],
	"o": () => [
		k.sprite('cats', { anim: 'orangeIdle' }),
		k.origin('center'),
		k.layer('game'),
		k.scale(SCALE),
		k.area({ width: 25, height: 25,  offset: { x: 0, y: 10 } }),
		k.solid(),
		k.health(3),
		{
			timesFed: 0,
			moveSpeed: 50,
			buffed: true,
			meowLoop: setInterval(() => {
				play('meow');
			}, rand(2000, 5000))
		},
		"cat"
	]
}

export function buildLevel(levelNum) {
	if (!LEVEL_LIST[levelNum]) {
		return k.go('gameOver');
		
	}
	addLevel(LEVEL_LIST[levelNum]["floor"], {
		width: 16 * SCALE,
		height: 16 * SCALE,
		...mapKey	
	});
	addLevel(LEVEL_LIST[levelNum]["map"], {
		width: 16 * SCALE,
		height: 16 * SCALE,
		...mapKey
	});
}

export function addFloor() {
	addLevel(LEVELS.one.floor, {
		width: 16 * SCALE,
		height: 16 * SCALE,
		...mapKey	
	});
}

export function addMap() {
	addLevel(LEVELS.one.map, {
		width: 16 * SCALE,
		height: 16 * SCALE,
		...mapKey
	});
}