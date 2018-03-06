function Player (name, game, x, y) {
  let keyMap = {
    37: 3,
    38: 0,
    39: 1,
    40: 2,
    190: 4, // .
    32: 5,  // space
    188: 6  // ,
  };

  let inventory = [];
  let activeMap = game.getActiveMap();
  let activeTile = activeMap.check(x, y);
  let activeText = false;

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


  function getActiveTile () {
    activeTile = activeMap.check(player.x, player.y);
    return activeTile;
  }

  function getActiveMap () {
    activeMap = game.getActiveMap();
    return activeMap;
  }

  function handleEvent (e) {
    // called by event listeners
    let keyDir = keyMap[e.keyCode];
    if (typeof keyDir === 'undefined') return;
    let dir = ROT.DIRS[4][keyDir];
    if (typeof dir !== 'undefined') {
      let newPos = [player.x + dir[0], player.y + dir[1]];

      if (activeMap.inMap(newPos[0], newPos[1])){
        let newTile = activeMap.check(newPos[0], newPos[1]);
        if (newTile.tile === '.' && newTile.monsters.length === 0) {
          player.x += dir[0];
          player.y += dir[1];
          getActiveTile();
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
        let mapSize = activeMap.getSize();
        if (newPos[1] < 0) {
          // going up a map
          player.y = mapSize[1]-1;
          game.mapIndex ++;
          getActiveMap();
          getActiveTile();
          game.drawMap();
        }
        else if (newPos[1] >= mapSize[1]) {
          // going down
          player.y = 0;
          game.mapIndex --;
          getActiveMap();
          getActiveTile();
          game.drawMap();
        }
        else {
          console.error('Tried to walk off the map!')
        }
      }
    }
    else {
      switch (keyDir) {
        case 4:
        // drop item
        let poppedItem = inventory.pop();
        activeMap.addItem(poppedItem, player.x, player.y);
        getActiveTile();
        game.display.drawTextbox (
          'dropped ' + poppedItem.name, 'white', '16px Monospace', 'black');
        break;
        case 5:
        game.drawMap();
        //basically just clears the screen for now
        break;
        case 6:
        // picks up one item
        if (activeTile) {
          let pickedItem = activeMap.pickItem(player.x, player.y);
          inventory.push(pickedItem);
          getActiveTile();
          game.drawMap();
          game.display.drawTextbox (
            'picked up ' + pickedItem.name, 'white', '16px Monospace', 'black');
        }
        break;
      }
    }
    window.removeEventListener('keyup', player);
    game.engine.unlock();
  }
}
