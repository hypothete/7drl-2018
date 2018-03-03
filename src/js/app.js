if (!ROT.isSupported()) {
    alert("The rot.js library isn't supported by your browser.");
} else {
    // Good to go!
}

var game = new Game(32, 24);
game.init();

//ROT.RNG.setSeed(1234);

function Game (w,h) {
  let display,
    player,
    map = new Map('start', 32, 24),
    scheduler = new ROT.Scheduler.Simple(),
    engine = new ROT.Engine(scheduler);
  let game = {
    init,
    drawMap
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
          scaleMode: WebGLazy.SCALE_MODES.MULTIPLES,
          source: display.getElement()
        });

        generateMap();
        generatePotions();
        createPlayer('tumblr');
        engine.start();
        game.drawMap();
      })
  }

  function generateMap () {
    let self = this;
    let mpp = new ROT.Map.Cellular(w, h);
    mpp.randomize(0.5);
    for (let j=0; j<3; j++) {
      mpp.create(function(x, y, wall) {
        map.setTile(x, y, wall ? '.' : '#');
      });
    }
  }

  function drawMap () {
    display.drawMap('pkmn', map);
    if (player) {
      player.draw();
    }
  }

  function generatePotions () {
    for (let i=0; i<10; i++) {
      let randTile = map.getRandomFloor();
      map.addItem(
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
    let floor = map.getRandomFloor();
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
        if (map.inMap(newPos[0], newPos[1])){
          let mapTile = map.getTile(newPos[0], newPos[1]);
          if (mapTile === '.') {
            player.x += dir[0];
            player.y += dir[1];
          }
        }
      }
      game.drawMap();
      window.removeEventListener('keyup', player);
      engine.unlock();
    }
  }
}
