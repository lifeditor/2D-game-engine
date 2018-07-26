'use strict';

window.event = (function () {

  var Key = {
    A: 65,
    D: 68,
    W: 87,
    S: 83
  };

  var binds = [];
  var action = {};

  var setAction = function (value, evt) {
    var key = binds[evt.keyCode];

    if (key) {
      action[key] = value;
    }
  };

  var onMouseDown = function () {
  };

  var onMouseUp = function () {
  };

  var onKeyDown = function (evt) {
    setAction(true, evt);
  };

  var onKeyUp = function (evt) {
    setAction(false, evt);
  };

  return {

    init: function (canvas) {
      binds[Key.A] = 'left';
      binds[Key.D] = 'right';
      binds[Key.W] = 'up';
      binds[Key.S] = 'down';

      canvas.addEventListener('mousedown', onMouseDown);
      canvas.addEventListener('mouseup', onMouseUp);
      document.addEventListener('keydown', onKeyDown);
      document.addEventListener('keyup', onKeyUp);
    },

    free: function (canvas) {
      canvas.removeEventListener('mousedown', onMouseDown);
      canvas.removeEventListener('mouseup', onMouseUp);
      document.removeEventListener('keydown', onKeyDown);
      document.removeEventListener('keyup', onKeyUp);
    },

    getAction: function () {
      return action;
    }

  };

})();
