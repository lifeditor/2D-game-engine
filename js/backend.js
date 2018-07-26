'use strict';

(function () {

  var SUCCESS_CODE = 200;
  var TIMEOUT = 1000;

  window.backend = {

    load: function (onLoad, onError, url) {
      var xhr = new XMLHttpRequest();

      xhr.addEventListener('load', function () {
        if (xhr.status === SUCCESS_CODE) {
          onLoad(xhr.responseText);
        } else {
          onError('Статус ответа: ' + xhr.status + ' ' + xhr.statusText);
        }
      });
      xhr.addEventListener('error', function () {
        onError('Произошла ошибка соединения');
      });
      xhr.addEventListener('timeout', function () {
        onError('Запрос не успел выполниться за ' + xhr.timeout + 'мс');
      });

      xhr.timeout = TIMEOUT;
      xhr.open('GET', url);
      xhr.send();

    }

  };

})();
