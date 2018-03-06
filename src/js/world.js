function World (mapWidth, mapHeight) {
  let maps = [];

  return {
    generate,
    getMap
  }

  function generate () {
    for (let i=0; i<20; i++) {
      let map = new Map('start', mapWidth, mapHeight);
      maps.push(map);
      let mpp = new ROT.Map.Cellular(mapWidth, mapHeight);
      mpp.randomize(0.55);
      for (let j=0; j<3; j++) {
        mpp.create(function(x, y, wall) {
          if (y === 0 || y === mapHeight-1) {
            wall = false;
          }
          if (x === 0 || x == mapWidth-1 ) {
            wall = true;
          }
          map.setTile(x, y, wall ? '#' : '.');
        });
      }
    }
  }

  function getMap (i) {
    return maps[i];
  }
}
