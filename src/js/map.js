function Map (name, width, height) {

  // tiles are chars - . for floor, # for wall, some other special types
  let tiles = [];

  // monsters and items are stored in wrappers like so: { monster, x, y }
  let monsters = [];
  let items = [];

  for (let i=0; i<width; i++) {
    tiles[i] = [];
    for (let j=0; j< height; j++) {
      tiles[i][j] = null;
    }
  }

  return {
    name,
    inMap,
    getTile,
    setTile,
    check,
    getRandomFloor,
    getItems,
    getMonsters,
    addItem,
    removeItem,
    addMonster,
    removeMonster
  };

  function inMap (x, y) {
    return x >= 0 && x < width && y >= 0 && y < height;
  }

  function getTile (x, y) {
    if (inMap(x,y)) {
      return tiles[x][y];
    }
    console.error(x + ',' +y + ' is not in the map.');
  }

  function setTile (x, y, v) {
    if (inMap(x,y)) {
      tiles[x][y] = v;
      return;
    }
    console.error('can\'t set tile: ' + x + ',' +y + ' is not in the map.');
  }

  function check (x, y) {
    let info = {
      tile: getTile(x,y),
      items: items.filter(item => {
        return item.x === x && item.y === y;
      }),
      monsters: monsters.filter(monster => {
        return monster.x === x && monster.y === y;
      }),
    };
    return info;
  }

  function getRandomFloor () {
    // returns a random open tile's coords
    let rx = ROT.RNG.getUniform() * width | 0;
    let ry = ROT.RNG.getUniform() * height | 0;
    while (tiles[rx][ry] !== '.') {
      rx = ROT.RNG.getUniform() * width | 0;
      ry = ROT.RNG.getUniform() * height | 0;
    }
    return { x: rx, y: ry };
  }

  function getItems () {
    return items;
  }

  function getMonsters () {
    return monsters;
  }

  function addItem (item, x, y) {
    items.push({ item, x, y });
  }

  function removeItem (item) {
    let itemIndex = items.findIndex(someItem => {
      return item === someItem;
    });
    if (itemIndex == -1) {
      console.log('item not found in map');
      return;
    }
    items.splice(itemIndex, 1);
  }

  function addMonster (monster, x, y) {
    monsters.push({ monster, x, y });
  }

  function removeMonster (monster) {
    let monsterIndex = monsters.findIndex(someMonster => {
      return monster === someMonster;
    });
    if (monsterIndex == -1) {
      console.log('monster not found in map');
      return;
    }
    monsters.splice(monsterIndex, 1);
  }
}
