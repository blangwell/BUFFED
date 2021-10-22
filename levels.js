import { k } from './load.js';

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
			"l $      $        $r",
			"l                  r",
			"l                  r",
			"l    p             r",
			"l                  r",
			"l                  r",
			"l                  r",
			"l                  r",
			"l                  r",
			"l                  r",
			"wwwwwwwwwwwwwwwwwwww",
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
		"$": () => [
			k.sprite("skeleton"),
			k.scale(scale),
			k.area({ offset: vec2(0, -25) }),
			k.solid(),
			k.layer('game'),
			k.origin('center')
		],
		"p": () => [
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
			k.area({ offset: 20 }),
			k.solid(),
			k.layer('game'),
			k.origin('center'),
			"wall"
		],
		"r": () => [
			k.sprite("wallR"),
			k.scale(scale),
			k.area({ offset: 32 }),
			k.solid(),
			k.layer('game'),
			k.origin('top'),
			"wall"
		],
		"l": () => [
			k.sprite("wallL"),
			k.scale(scale),
			k.area({ offset: -32 }),
			k.solid(),
			k.layer('game'),
			k.origin('topleft'),
			"wall"
		]
	});
}