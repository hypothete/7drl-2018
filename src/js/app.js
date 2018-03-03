if (!ROT.isSupported()) {
    alert("The rot.js library isn't supported by your browser.");
} else {
    // Good to go!
}

var game = new Game(20, 18);
game.init();

ROT.RNG.setSeed(1234);

function Game (w,h) {
  let display,
    player,
    world = new World(w, h),
    scheduler = new ROT.Scheduler.Simple(),
    engine = new ROT.Engine(scheduler);
  let game = {
    mapIndex: 0,
    init,
    drawMap,
    getActiveMap
  };
  return game;

  function init () {

      display = new Display(
        '#display',
        w, h,
        32, 32
      );

      display.addTileset('pkmn', 'img/rby.png', {
        '@': [1, 1],
        '#': [1, 0],
        '.': [4, 0],
        '*': [2, 0]
      })
      .then(() => {
        new WebGLazy({
          background: 'white',
          scaleMode: WebGLazy.SCALE_MODES.FIT,
          source: display.getElement(),
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
    display.drawMap('pkmn', activeMap);
    if (player) {
      player.draw();
    }
  }

  function getActiveMap () {
    return world.getMap(game.mapIndex);
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
    player = new Player(name, floor.x, floor.y);
    scheduler.add(player, true);
  }

  function Player (name, x, y) {
    let keyMap = {
      37: 3,
      38: 0,
      39: 1,
      40: 2
    };

    let player = {
      name, x, y, draw, act,
      handleEvent
    };

    return player;

    function draw () {
      display.drawTile('pkmn', '@', player.x, player.y);
    }

    function act () {
      engine.lock();
      window.addEventListener('keyup', player);
    }

    function handleEvent (e) {
      // called by event listeners
      let keyDir = keyMap[e.keyCode];
      if (typeof keyDir === 'undefined') return;
      let dir = ROT.DIRS[4][keyDir];
      if (typeof dir !== 'undefined') {
        let newPos = [player.x + dir[0], player.y + dir[1]];
        let activeMap = game.getActiveMap();
        if (activeMap.inMap(newPos[0], newPos[1])){
          let newTile = activeMap.check(newPos[0], newPos[1]);
          if (newTile.tile === '.' && newTile.monsters.length === 0) {
            player.x += dir[0];
            player.y += dir[1];
            game.drawMap();
            if (newTile.items.length) {
              itemList = newTile.items.map(item => item.item.name).join(', ');
              display.drawText (
                itemList, 1, h-5, w-2, 4, 'white', '16px Impact', 'black');
            }
          }
        }
      }
      window.removeEventListener('keyup', player);
      engine.unlock();
    }
  }
}
