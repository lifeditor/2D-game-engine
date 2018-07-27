'use strict';

window.game = (function () {

  var UPDATE_INTERVAL = 100;

  var Message = {
    WIN: 'Ура-а-a-a!!! Победа!!!',
    STOP: 'Попытка не удалась'
  };

  var Offset = {
    LEFT: 15,
    TOP: 25,
  };

  var action = {
    'left': {set: function () {
      player.moveX = -1;
    }},
    'right': {set: function () {
      player.moveX = 1;
    }},
    'up': {set: function () {
      player.moveY = -1;
    }},
    'down': {set: function () {
      player.moveY = 1;
    }}
  };

  var container = document.querySelector('.map_container');
  var canvas = container.querySelector('canvas');
  var ctx = canvas.getContext('2d');

  var timerId = null;
  var player = null;
  var entities = [];

  canvas.width = container.clientWidth;
  canvas.height = container.clientHeight;

  var updateWorld = function () {
    window.map.render(ctx);
    update();
  };

  var initPlayer = function (entity) {
    if (entity.type === window.entity.getPlayerType()) {
      player = entity;
    }
  };

  var update = function () {
    if (player === null) {
      stop(false);
      return;
    }

    player.moveX = 0;
    player.moveY = 0;

    var actionObject = window.event.getAction();

    for (var property in actionObject) {
      if (actionObject[property]) {
        action[property].set();
      }
    }

    entities.forEach(function (entity) {
      entity.update();
      entity.render(ctx);
    });

  };

  var start = function () {
    timerId = setInterval(updateWorld, UPDATE_INTERVAL);
  };

  var stop = function (win) {
    var text = (win) ? Message.WIN : Message.STOP;

    clearInterval(timerId);
    window.event.free(canvas);
    ctx.font = '30px Verdana bold';
    ctx.fillStyle = 'white';
    ctx.fillText(text, Offset.LEFT, Offset.TOP);
  };

  return {

    addEntity: function (entity) {
      entities.push(entity);
      initPlayer(entity);
    },

    destroyEntity: function (entity) {
      entities.splice(entities.indexOf(entity), 1);
      player = null;
    },

    getEntity: function (obj, x, y) {

      function selectEntity(entity) {
        if (entity.type !== obj.type) {
          if (x + obj.width < entity.x ||
              y + obj.height < entity.y ||
              x > entity.x + entity.width ||
              y > entity.y + entity.height
          ) {
            return false;
          }
          return true;
        }
        return false;
      }

      return entities.filter(selectEntity)[0];
    },

    init: function () {
      window.map.init();
      window.sprite.init();
      window.event.init(canvas);
      start();
    },

    stop: function (win) {
      stop(win);
    }

  };

})();
