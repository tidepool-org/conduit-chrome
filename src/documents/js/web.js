
console.log('foo from web.js');
$ = require('jquery-browserify');

var container = $('.tidepool-device-connect');
console.log('container', container);
container.on('configure', function (ev, choice) {
  console.log(ev, choice);
});
container.on('click', 'li.choice', function (ev) {
  console.log(ev);
});

$(window).ready(function (ev) {
  var button = $('.tidepool-upload');
  button.on('configure', function (ev, data) {
    console.log('xxx configure', ev, data, arguments);
  });

});

