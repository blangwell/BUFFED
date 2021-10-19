import kaboom from "https://unpkg.com/kaboom@next/dist/kaboom.mjs";
import loadSprites from "./load.js";

const SCALE = 3;

kaboom({
	background: [0,0,0]
});

loadSprites();

addLevel([
	// "wwwwwwwwwwwwwwwwwwww",
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
	"                    ",
], {
	width: 16 * SCALE,
	height: 16 * SCALE,
	" ": () => [
		sprite("floorTiles", { frame: ~~rand(0, 7) }),
		scale(SCALE),
		origin('center')
	],
	"t": () => [
		sprite("wallFaceTiles", { frame: ~~rand(0,6 ) }),
		scale(SCALE),
		origin('center')
	]
});

let map = addLevel([
	"wwwwwwwwwwwwwwwwwwww",
	"l $      $        $r",
	"l                  r",
	"l                  r",
	"l                  r",
	"l                  r",
	"l                  r",
	"l                  r",
	"l                  r",
	"l                  r",
	"l                  r",
	"l                  r",
], {
	width: 16 * SCALE,
	height: 16 * SCALE,
	"$": () => [
		sprite("skeleton"),
		scale(SCALE),
		area(),
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
	
})


const ogre = add([
	sprite('fantasy', {anim: 'ogreIdle'}),
	pos(width() / 2, height() / 2),
	origin('center'),
	area(),
	solid(),
	scale(SCALE),
	rotate(0)
]);
console.log(ogre);
ogre.direction = 'right';

keyPress(['left', 'a', 'right', 'd'], () => {
	ogre.play('ogreWalk');
});
keyDown(['left', 'a'], () => {
	ogre.move(-150, 0)
	if (ogre.direction === 'right') {
		ogre.flipX(true);
	}
	ogre.direction = 'left';
});
keyDown(['right', 'd'], () => {
	ogre.move(150, 0)
	if (ogre.direction === 'left') {
		ogre.flipX(true);
	}
	ogre.direction = 'right';
});
keyDown(['up', 'w'], () => {
	ogre.move(0, -150)
})
keyDown(['down', 's'], () => {
	ogre.move(0, 150)
})
keyRelease(['left', 'a', 'right', 'd'], () => {
	ogre.play('ogreIdle');
})


add([
	sprite('fantasy', {anim: 'ogreWalk'}),
	pos(width() / 2, (height() / 2) + 50),
	origin('center'),
	scale(SCALE)
])
