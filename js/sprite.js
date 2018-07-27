'use strict';

window.sprite = (function () {

  var Url = {
    JSON: 'data/sprite.json',
    IMAGE: 'data/object.png'
  };

  var image;
  var sprites = [];

  var parse = function (data) {
    var frames = JSON.parse(data).frames;

    for (var name in frames) {
      if (frames[name]) {
        var frame = frames[name].frame;

        sprites
          .push({name: name, x: frame.x, y: frame.y, w: frame.w, h: frame.h});
      }
    }
  };

  var onLoad = function (data) {
    parse(data);
  };

  return {

    init: function () {
      window.backend.load(onLoad, null, Url.JSON);
      image = new Image();
      image.src = Url.IMAGE;
    },

    render: function (ctx, name, x, y) {
      var sprite = sprites.filter(function (value) {
        return (value.name === name);
      })[0];

      ctx.drawImage(image, sprite.x, sprite.y, sprite.w, sprite.h,
          x, y, sprite.w, sprite.h);
    }

  };

})();
