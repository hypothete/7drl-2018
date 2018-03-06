function Display (selector, gridWidth, gridHeight, tileWidth, tileHeight) {

  let tilesets = {};
  let animIntervals = {};

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
    drawTextbox,
    drawAnimation,
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

  function drawAnimation (tilesetName, sourceY, gridX, gridY) {

    animIntervals[tilesetName] = animIntervals[tilesetName] || {};
    let tileset = tilesets[tilesetName];
    if (typeof tileset === 'undefined') {
      console.error('couldn\'t load tileset ' + tilesetName);
      return;
    }
    if (animIntervals[tilesetName][sourceY]){
      clearInterval(animIntervals[tilesetName][sourceY]);
    }
    animIntervals[tilesetName][sourceY] = setInterval(function () {
      let timestamp = (Date.now()/200)%(tileset.image.width/tileWidth) | 0;
      let xOffset = tileWidth * timestamp;
      ctx.drawImage(
        tileset.image,
        xOffset,
        sourceY * tileHeight,
        tileWidth,
        tileHeight,
        gridX * tileWidth,
        gridY * tileHeight,
        tileWidth,
        tileHeight
      );
    }, 60);
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
      (gridX+1) * tileWidth,
      (gridY+1) * tileHeight,
      tileWidth * textWidth
    );
  }

  function drawTextbox(text, textCol, font, bgCol) {
    return drawText (text, 1, gridHeight-3, gridWidth-2, 2, 'white', '18px Zig', 'black');
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
