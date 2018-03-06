function Player (name, game, x, y) {
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
    game.display.drawAnimation('tumbleweed', 0, player.x, player.y);
  }

  function act () {
    game.engine.lock();
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
            game.display.drawTextbox (
              itemList, 'white', '16px Monospace', 'black');
          }
        }
      }
      else {
        // we might be walking offscreen to the next map
        if (newPos[1] < 0) {
          // going up a map
          player.y = h-1;
          game.mapIndex ++;
          game.drawMap();
        }
        else if (newPos[1] >= h) {
          // going down
          player.y = 0;
          game.mapIndex --;
          game.drawMap();
        }
        else {
          console.error('Tried to walk off the map!')
        }
      }
    }
    window.removeEventListener('keyup', player);
    game.engine.unlock();
  }
}
