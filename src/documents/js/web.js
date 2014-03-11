
console.log('foo from web.js');
$ = require('jquery-browserify');

$(window).ready(function (ev) {
  var button = $('.tidepool-upload');
  button.on('configure', function (ev, data) {
    console.log('xxx configure', ev, data, arguments);
  });
});

