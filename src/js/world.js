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
      mpp.randomize(0.5);
      for (let j=0; j<3; j++) {
        mpp.create(function(x, y, wall) {
          map.setTile(x, y, wall ? '#' : '.');
          if (x === 0 || y === 0 || x == mapWidth-1 || y == mapHeight-1) {
            map.setTile(x, y, '#');
          }
        });
      }
    }
  }

  function getMap (i) {
    return maps[i];
  }
}
