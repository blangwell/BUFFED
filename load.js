
export default function loadSprites() {
	loadSprite('fantasy', './sprites/ssFantasy.png', {
		sliceX: 28.1,
		sliceY: 9.1,
		anims: {
			ogreIdle: { from: 29, to: 33, loop: true, speed: 3 },
			ogreWalk: { from: 58, to: 62, loop: true, speed: 5 }
		}
	});
	loadSpriteAtlas('./sprites/tmDungeon.png', './tilemap.json')

}