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

      var objectMoveX = obj.moveX;
      var objectMoveY = obj.moveY;
      var objectWidth = obj.width;
      var objectHeight = obj.height;

      if (objectMoveX === 0 && objectMoveY === 0) {
        return;
      }

      var newX = obj.x + Math.floor(objectMoveX * obj.speed);
      var newY = obj.y + Math.floor(objectMoveY * obj.speed);

      var entity = window.game.getEntity(obj, newX, newY);

      if (entity && obj.onEntityCatch) {
        obj.onEntityCatch(entity);
      }

      var tileIds = [
        window.map.getTileId(newX, newY),
        window.map.getTileId(newX + objectWidth, newY),
        window.map.getTileId(newX, newY + objectHeight),
        window.map.getTileId(newX + objectWidth, newY + objectHeight)
      ];

      function isMove(id) {
        return (id === TileId.SPACE);
      }

      function isWinner(id) {
        return (id === TileId.WIN);
      }

      if (tileIds.every(isMove)) {
        obj.x = newX;
        obj.y = newY;
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
