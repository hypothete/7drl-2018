function Display (selector, gridWidth, gridHeight, tileWidth, tileHeight) {

  let tilesets = {};

  let can = document.querySelector(selector);
  if (!can) {
    console.error('could not find ' + selector);
    return;
  }
  let ctx = can.getContext('2d');
  can.width = gridWidth * tileWidth;
  can.height = gridHeight * tileHeight;

  return {
    addTileset,
    drawMap,
    drawTile,
    drawText,
    getElement
  };

  function addTileset (name, src, mapping) {
    return new Promise((resolve, reject) => {
      let tileImg = new Image();
      tileImg.onload = function tilesLoaded () {
        tilesets[name] = new Tileset(name, tileImg, mapping);
        resolve(tilesets[name]);
      };
      tileImg.onerror = function tilesError () {
        console.error('error loading tileset ' + name);
        reject();
      };
      tileImg.src = src;
    });
  }

  function drawMap (tilesetName, map) {
    // first load the tileset for the map tiles and draw
    let tileset = tilesets[tilesetName];
    if (typeof tileset === 'undefined') {
      console.error('couldn\'t load tileset ' + tilesetName);
      return;
    }
    for (let i=0; i<gridWidth; i++) {
      for (let j=0; j<gridHeight; j++) {
        drawTile(tilesetName, map.getTile(i,j), i, j);
      }
    }

    // draw items
    let mapItems = map.getItems();
    for (let item of mapItems) {
      drawTile(item.item.tilesetName, item.item.char, item.x, item.y);
    }

    // draw monsters
    let mapMonsters = map.getMonsters();
    for (let monster of mapMonsters) {
      drawTile(monster.monster.tilesetName, monster.monster.char, monster.x, monster.y);
    }
  }

  function drawTile (tilesetName, char, gridX, gridY) {
    let tileset = tilesets[tilesetName];
    if (typeof tileset === 'undefined') {
      console.error('couldn\'t load tileset ' + tilesetName);
      return;
    }
    let mappedChar = tileset.mapping[char];
    if (typeof mappedChar === 'undefined') {
      console.error('no mapping in tileset ' + tilesetName + ' for char ' + char);
      return;
    }
    ctx.drawImage(
      tileset.image,
      mappedChar[0] * tileWidth,
      mappedChar[1] * tileHeight,
      tileWidth,
      tileHeight,
      gridX * tileWidth,
      gridY * tileHeight,
      tileWidth,
      tileHeight
    );
  }

  function drawText (text, gridX, gridY, textWidth, textHeight, textCol, font, bgCol) {
    if (typeof bgCol !== 'undefined') {
      ctx.fillStyle = bgCol;
      ctx.fillRect(
        gridX * tileWidth,
        gridY * tileHeight,
        tileWidth * textWidth,
        tileHeight * textHeight
      );
    }
    if (typeof font !== 'undefined') {
      ctx.font = font;
    }
    ctx.fillStyle = textCol;
    ctx.fillText(
      text,
      gridX * tileWidth,
      gridY * tileHeight,
      tileWidth * textWidth
    );
  }

  function getElement () {
    return can;
  }

}

function Tileset (name, image, mapping) {
  return {
    name, image, mapping
  };
}
