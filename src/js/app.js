if (!ROT.isSupported()) {
    alert("The rot.js library isn't supported by your browser.");
} else {
    // Good to go!
}

var game = new Game(20, 18);
game.init();

ROT.RNG.setSeed(1234);

function Game (w,h) {
  let player,
    world = new World(w, h),
    scheduler = new ROT.Scheduler.Simple(),
    engine = new ROT.Engine(scheduler);
  let game = {
    mapIndex: 0,
    engine,
    display,
    init,
    drawMap,
    getActiveMap,
    loadTilesets
  };
  return game;

  function init () {

      game.display = new Display(
        '#display',
        w, h,
        32, 32
      );

      game.loadTilesets()
      .then(() => {
        new WebGLazy({
          background: 'white',
          scaleMode: WebGLazy.SCALE_MODES.FIT,
          source: game.display.getElement(),
          allowDownscaling: true
        });

        world.generate();
        generatePotions();
        createPlayer('tumblr');
        engine.start();
        game.drawMap();
      })
  }

  function drawMap () {
    let activeMap = game.getActiveMap();
    game.display.drawMap('pkmn', activeMap);
    if (player) {
      player.draw();
    }
  }

  function getActiveMap () {
    return world.getMap(game.mapIndex);
  }

  function loadTilesets () {
    return Promise.all([
      game.display.addTileset('pkmn', 'img/rby.png', {
        '@': [1, 1],
        '#': [1, 0],
        '.': [4, 0],
        '*': [2, 0]
      }),
      game.display.addTileset('tumbleweed', 'img/tumbleweed.png', {
        '@': [0, 0]
      })
    ]);
  }

  function generatePotions () {
    let activeMap = game.getActiveMap();
    for (let i=0; i<3; i++) {
      let randTile = activeMap.getRandomFloor();
      activeMap.addItem(
        {
          name: 'potion',
          char: '*',
          tilesetName: 'pkmn'
        },
        randTile.x,
        randTile.y
      );
    }
  }

  function createPlayer (name) {
    let activeMap = game.getActiveMap();
    let floor = activeMap.getRandomFloor();
    player = new Player(name, game, floor.x, floor.y);
    scheduler.add(player, true);
  }
}
