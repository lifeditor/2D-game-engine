'use strict';

window.entity = (function () {

  var EntityType = {
    PLAYER: 'Player',
    ENEMY: 'Enemy'
  };

  var EntityName = {
    PLAYER: 'player',
    ENEMY: 'enemy'
  };

  var EntitySpeed = {
    PLAYER: 6,
    ENEMY: 6
  };

  var factory = {};

  var Entity = {
    x: 0,
    y: 0,
    width: 0,
    height: 0,
    name: null,

    render: function (ctx) {
      window.sprite.render(ctx, this.name, this.x, this.y);
    },

    update: function () {
      window.physic.update(this);
    },

    destroy: function () {
      window.game.destroyEntity(this);
    },

    extend: function (proto) {
      var object = Object.create(this);
      for (var property in proto) {
        if (property) {
          object[property] = proto[property];
        }
      }
      return object;
    }
  };

  var Player = Entity.extend({
    type: EntityType.PLAYER,
    name: EntityName.PLAYER,
    speed: EntitySpeed.PLAYER,
    moveX: 0,
    moveY: 0,

    onEntityCatch: function (entity) {
      if (entity.type === EntityType.ENEMY) {
        this.destroy();
      }
    },
  });

  var Enemy = Entity.extend({
    type: EntityType.ENEMY,
    name: EntityName.ENEMY,
    speed: EntitySpeed.ENEMY,
    moveX: -1,
    moveY: 0,

    onEntityCatch: function (entity) {
      if (entity.type === EntityType.PLAYER) {
        window.game.destroyEntity(entity);
      }
    },
  });

  return {

    createEntities: function (objects) {
      factory[EntityType.PLAYER] = Player;
      factory[EntityType.ENEMY] = Enemy;
      objects.forEach(function (object) {
        try {
          var entity = Object.create(factory[object.type]);

          entity.x = object.x;
          entity.y = object.y;
          entity.width = object.width;
          entity.height = object.height;
          window.game.addEntity(entity);

        } catch (exception) {
          window.console.log(exception);
        }
      });
    },

    getPlayerType: function () {
      return EntityType.PLAYER;
    },

    getEnemyType: function () {
      return EntityType.ENEMY;
    }

  };

})();
