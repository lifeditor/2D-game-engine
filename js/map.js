'use strict';

window.map = (function () {

  var ERROR_LOAD =
    'Ошибка загрузки данных карты. Воспользуйтесь другим браузером.';

  var Url = {
    JSON: 'data/map.json',
    IMAGE_PATH: 'data/'
  };

  var info = document.querySelector('.map_info').children[0];

  var map = null;
  var tileSize = {width: 0, height: 0};
  var mapColumnCount = 0;

  var parse = function (data) {
    map = JSON.parse(data);
    mapColumnCount = map.width;
    tileSize.width = map.tilewidth;
    tileSize.height = map.tileheight;

    map.tilesets.forEach(function (tileset) {
      var img = new Image();
      img.src = Url.IMAGE_PATH + tileset.image;
      tileset.image = img;
    });

    map.layers.forEach(function (layer) {
      if (layer.type === 'tilelayer') {
        createTiles(layer.data);
      } else if (layer.type === 'objectgroup') {
        window.entity.createEntities(layer.objects);
      }
    });
  };

  var getCoords = function (index, count) {
    return {x: (index % count) * tileSize.width,
      y: Math.floor(index / count) * tileSize.height
    };
  };

  var createTiles = function (data) {
    var mapTileset = map.tilesets[0];
    var firstGid = mapTileset.firstgid;
    var columnCount = mapTileset.columns;
    var image = mapTileset.image;

    map.tiles = [];
    data.forEach(function (tileId, arrayIndex) {
      var tile = {};
      var obj =
        getCoords(tileId - firstGid, columnCount);

      tile.image = image;
      tile.x = obj.x;
      tile.y = obj.y;
      obj =
        getCoords(arrayIndex, mapColumnCount);
      tile.dX = obj.x;
      tile.dY = obj.y;
      tile.id = tileId;

      map.tiles.push(tile);
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
      map.tiles.forEach(function (tile) {
        ctx.drawImage(tile.image, tile.x, tile.y, tileSize.width,
            tileSize.height, tile.dX, tile.dY, tileSize.width, tileSize.height);
      });
    },

    getTileId: function (x, y) {
      var index = Math.floor(y / tileSize.width) * mapColumnCount +
                  Math.floor(x / tileSize.height);

      return map.tiles[index].id;
    }

  };

})();
