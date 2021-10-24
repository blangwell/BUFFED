import { k } from './load.js';
import { SCALE } from './main.js';

const LEVEL_LIST =  [
	{ // LEVEL 1
		floor: [
			"ssssssssssssssssssss",
			"ssssssssssssssssssss",
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
			"a--$---------$----$d",
			"a-----------p------d",
			"a------------------d",
			"a-----h------------d",
			"a------------------d",
			"a------------------d",
			"a---------------b--d",
			"a-o----------------d",
			"zxxxxxxxxxxxxxxxxxxc",
		]
	}, { // LEVEL 2
		floor: [
			"ssssssssssssssssssssssssssssssssssss",
			"ssssssssssssssssssssssssssssssssssss",
			"sssssssssssssss       ssssssssssssss",
			"sssssssssssssss       ssssssssssssss",
			"sssssssssssssss       ssssssssssssss",
			"                                    ",
			"                                    ",
			"                                    ",
			"                                    ",
			"                                    ",
		],
		map: [
			"wwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwww",
			"----------$--------------$------$---",
			"a-------------d---h---a------------d",
			"wwwwwwwwwwwwwww----o--wwwwwwwwwwwwww",
			"a----------------------------------d",
			"a--------b-------------------------d",
			"a---------------p------------------d",
			"a----------------------------------d",
			"a---o--------------------------b---d",
			"zxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxc",
		]
	}, { // LEVEL 3
		floor: [
			"sssssssssssssssssssssssssssss",
			"                             ",
			"                             ",
			"                             ",
			"                             ",
			"                             ",
			"                             ",
			"                             ",
			"                             ",
			"                             ",
		],
		map: [
			"wwwwwwwwwwwwwwwwwwwwwwwwwwwww",
			"a---------------------------d",
			"a--------o------------------d",
			"a---------------------------d",
			"a---------------------------d",
			"a-----b-----------p---------d",
			"a---------------------------d",
			"a----------o-------------b--d",
			"a------------------------h--d",
			"zxxxxxxxxxxxxxxxxxxxxxxxxxxxc",
		]
	}, { // LEVEL 4
		floor: [
			"sssssssssss",
			"           ",
			"           ",
			"           ",
			"           ",
			"           ",
			"           ",
			"           ",
			"           ",
			"           ",
			"           ",
			"           ",
			"           ",
			"           ",
			"---     ---",
			"---     ---",
			"---     ---",
			"---     ---",
			"---     ---",
			"sssssssssss",
			"sssssssssss",
		],
		map: [
			"wwwwwwwwwww",
			"a----o----d",
			"a---------d",
			"a---------d",
			"a----p----d",
			"a---------d",
			"a---------d",
			"a---------d",
			"a---------d",
			"a---------d",
			"ao-----o--d",
			"a---------d",
			// "a---------d",
			"a--------bd",
			"zxxa---dxxc",
			"sssa---dsss",
			"sssa---dsss",
			"sssa-b-dsss",
			"sssa-h-dsss",
			"ssszxxxcsss",
			// "sssssssssss",
		]
	}, { // LEVEL 5
		floor: [
			"sssssssssssssss",
			"sssssssssssssss",
			"ssssss  sssssss",
			"ssss      sssss",
			"ss           ss",
			"               ",
			"               ",
			"               ",
			"               ",
			"               ",
			"ss          sss",
			"ss          sss",
			"sssssss     sss",
			"sssssss     sss",
			"sssssssssssssss",
			"sssssssssssssss",
			"sssssssssssssss",
		],
		map: [
			"wwwwwwwwwwwwwww",
			"------xx-------",
			"ssssxx--xxsssss",
			"ssxxa--p--zxxss",
			"xc-----------zx",
			"a-------------d",
			"a-------------d",
			"a-------------d",
			"a---------b---d",
			"a-------------d",
			"wwa--o------aww",
			"a-a------b--a--",
			"aswwwww----ha--",
			"zxxxxxcxxxxxa--",
		]
	}, { // LEVEL 6
		floor: [
			"ssssssssssssssssssssssssssssssssss",
			"                                  ",
			"                                  ",
			"                                  ",
			"                                  ",
			"                                  ",
			"ssssssssssssssssssssssssssssssssss"
		],
		map: [
			"wwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwd",
			"a--------------------------------d",
			"a--------------------------------d",
			"ab---p---------------------------d",
			"a--------------------------------d",
			"zxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxc",
		]
	}, { // LEVEL 7
		floor: [
			"-----       -----",
			"-----       -----",
			"-----       -----",
			"-----       -----",
			"-----       -----",
			"-----       -----",
			"-----       -----",
			"-----       -----",
			"-----       -----",
			"-----       -----",
			"-----       -----",
			"-----       -----",
			"-----       -----",
			"                 ",
			"                 ",
			"                 ",
			"                 ",
			"                 ",
			"                 ",
			"                 ",
			"-----       -----",
			"-----       -----",
			"-----       -----",
			"-----       -----",
			"-----       -----",

		],
		map: [
			"-----wwwwwww-----",
			"-----a-----d-----",
			"-----a--p--d-----",
			"-----a-----d-----",
			"-----a-----d-----",
			"-----a-----d-----",
			"-----a-----d-----",
			"-----a-----d-----",
			"-----a-----d-----",
			"-----a-----d-----",
			"-----a-----d-----",
			"-----a-----d-----",
			"-----a-----d-----",
			"wwwww-------wwwww",
			"a---------------d",
			"a---------------d",
			"a---------------d",
			"a---------------d",
			"a---------------d",
			"zxxxx-------xxxxc",
			"----d-------a----",
			"----d-------a----",
			"----d-------a----",
			"----d-------a----",
			"----dxxxxxxxa----",
		]
	}, { // LEVEL 8
		floor: [

		],
		map: [

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
	"k": () => [
		sprite('crosshair'),
		scale(SCALE - 1),
		origin('center'),
		z(3),
		"crosshair"
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
	"d": () => [
		k.sprite("wallR"),
		k.scale(SCALE),
		k.area({ offset: vec2(28, 20) }),
		k.solid(),
		k.layer('game'),
		k.origin('center'),
		"wall"
	],
	"a": () => [
		k.sprite("wallL"),
		k.scale(SCALE),
		k.area({ offset: vec2(-25,0) }),
		k.solid(),
		k.layer('game'),
		k.origin('center'),
		"wall"
	],
	"z": () => [
		k.sprite("wallBL"),
		k.scale(SCALE),
		k.area({ offset: vec2(-10, 20) }),
		k.solid(),
		k.layer('game'),
		k.origin('center'),
		"wall"
	],
	"c": () => [
		k.sprite("wallBR"),
		k.scale(SCALE),
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
		k.scale(SCALE),
		k.area({ width: 25, height: 25, offset: { x: 0, y: 10 } }),
		k.solid(),
		k.health(3),
		{
			aggro: false,
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