
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
window.addEventListener('message', function onMessage (ev) {
  console.log('web page', ev, ev.data);
  var master = chrome.runtime.connect(ev.data.configure, {name: 'device'});
  var choice = $('.devices .choice:first');
  var name = choice.find('.name').text( );
  console.log('connecting', choice, name);
  master.postMessage({connect: name});
  master.onMessage.addListener(function (msg) {
    var args = Array.prototype.slice.call(arguments);
    console.log('data from device?', args.length, args, msg, new Uint8Array(msg.data) );
    if (msg.url) {
      var xhr = new XMLHttpRequest( );
      xhr.open('GET', msg.url, true);
      xhr.responseType = 'arraybuffer';
      xhr.onloadend = function (e) {
        console.log('has bytes', bytes);
        var bytes = new Uint8Array(this.response);
        console.log('has bytes', bytes);
      }
      xhr.send( );
    }
  });
});

$(window).ready(function (ev) {
  var button = $('.tidepool-upload');
  button.on('configure', function (ev, data) {
    console.log('xxx configure', ev, data, arguments);
  });

});

