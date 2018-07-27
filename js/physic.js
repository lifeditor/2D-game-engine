'use strict';

window.physic = (function () {

  var TileId = {
    SPACE: 15,
    WIN: 16
  };

  var moves = [-1, 0, 1];
  var moveCount = moves.length;

  return {

    update: function (obj) {

      var objectX = obj.x;
      var objectY = obj.y;
      var objectMoveX = obj.moveX;
      var objectMoveY = obj.moveY;
      var objectWidth = obj.width;
      var objectHeight = obj.height;

      var entity = window.game.getEntity(obj, objectX, objectY);

      if (entity && obj.onEntityCatch) {
        obj.onEntityCatch(entity);
      }

      if (objectMoveX === 0 && objectMoveY === 0) {
        return;
      }

      var calcX = objectX + Math.floor(objectMoveX * obj.speed);
      var calcY = objectY + Math.floor(objectMoveY * obj.speed);

      var tileIds = [
        window.map.getTileId(calcX, calcY),
        window.map.getTileId(calcX + objectWidth, calcY),
        window.map.getTileId(calcX, calcY + objectHeight),
        window.map.getTileId(calcX + objectWidth, calcY + objectHeight)
      ];

      function isMove(id) {
        return (id === TileId.SPACE);
      }

      function isWinner(id) {
        return (id === TileId.WIN);
      }

      if (tileIds.every(isMove)) {
        obj.x = calcX;
        obj.y = calcY;
      } else {
        var objectType = obj.type;

        if (objectType === window.entity.getPlayerType() &&
            tileIds.some(isWinner)) {
          window.game.stop(true);
        }

        if (objectType === window.entity.getEnemyType()) {
          do {
            objectMoveX = moves[Math.floor((Math.random() * moveCount))];
            objectMoveY = moves[Math.floor((Math.random() * moveCount))];
          } while (objectMoveX === 0 && objectMoveY === 0);
          obj.moveX = objectMoveX;
          obj.moveY = objectMoveY;
        }
      }
    }

  };

})();
