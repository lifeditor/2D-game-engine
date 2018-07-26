'use strict';

window.map = (function () {

  var ERROR_LOAD =
    'Ошибка загрузки данных карты. Воспользуйтесь другим браузером.';

  var Url = {
    JSON: 'data/map.json',
    IMAGE_PATH: 'data/'
  };

  var mapData = null;
  var tileData = null;
  var tileSize = {width: 0, height: 0};
  var columnCount = 0;
  var tilesets = [];
  var info = document.querySelector('.map_info').children[0];

  var parse = function (data) {
    mapData = JSON.parse(data);
    columnCount = mapData.width;
    tileSize.width = mapData.tilewidth;
    tileSize.height = mapData.tileheight;

    mapData.tilesets.forEach(function (tileset) {
      var img = new Image();
      img.src = Url.IMAGE_PATH + tileset.image;
      var tilesetObject = {
        firstgid: tileset.firstgid,
        image: img,
        name: tileset.name,
        columnCount: Math.floor(tileset.imagewidth / tileSize.width),
        rowCount: Math.floor(tileset.imageheight / tileSize.height)
      };
      tilesets.push(tilesetObject);
    });

    mapData.layers.forEach(function (layer) {
      if (layer.type === 'tilelayer') {
        tileData = layer.data;
      } else if (layer.type === 'objectgroup') {
        window.entity.createEntities(layer.objects);
      }
    });
  };

  var getTile = function (tileId) {
    var getTileset = function (tileset) {
      if (tileset.firstgid <= tileId) {
        return true;
      }
      return false;
    };

    var tile = {};
    var tileset = tilesets.filter(getTileset)[0];
    var id = tileId - tileset.firstgid;

    tile.img = tileset.image;
    tile.x = (id % tileset.columnCount) * tileSize.width;
    tile.y = Math.floor(id / tileset.columnCount) * tileSize.height;

    return tile;
  };

  var drawTiles = function (ctx, tiles) {
    if (tiles === null || (!tiles)) {
      return;
    }
    tiles.forEach(function (tileId, i) {
      var tile = getTile(tileId);
      var pX = (i % columnCount) * tileSize.width;
      var pY = Math.floor(i / columnCount) * tileSize.height;

      ctx.drawImage(tile.img, tile.x, tile.y, tileSize.width,
          tileSize.height, pX, pY, tileSize.width, tileSize.height);
    });
  };

  var onLoad = function (data) {
    parse(data);
  };

  var onError = function () {
    info.textContent = ERROR_LOAD;
  };

  return {

    init: function () {
      window.backend.load(onLoad, onError, Url.JSON);
    },

    render: function (ctx) {
      drawTiles(ctx, tileData);
    },

    getTileId: function (x, y) {
      var index = Math.floor(y / tileSize.width) * columnCount +
                  Math.floor(x / tileSize.height);

      return tileData[index];
    }

  };

})();
