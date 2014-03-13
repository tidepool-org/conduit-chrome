
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

(function ( ) {
  var es = require('event-stream');
  var Buffer = require('buffer').Buffer;
  var binary = require('binary');

window.addEventListener('message', function onMessage (ev) {
  // console.log('web page', ev, ev.data);
  if (ev.data == 'process-tick') {
    return true;
  }
  var master = chrome.runtime.connect(ev.data.configure, {name: 'device'});
  var choice = $('.devices .choice:first');
  var name = choice.find('.name').addClass('pending').text( );
  console.log('connecting', choice, name);
  app(name, master);

  /*
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
  */
});

function stream (master) {
  var input = es.through(function (d) {
    // console.log('xin', d.length);
    this.push(d);
  });
  master.onMessage.addListener(function fromPort (msg) {
    var data = new Buffer(new Uint8Array(msg.data));
    input.write(data);
  });
  var output = es.through(function to_serial (data) {
    var v = new Uint8Array(data);
    var view = Array.prototype.slice.apply(v);
    master.postMessage({type: 'data', data: view});
  });
  return es.duplex(output, input);

}


function app (name, master) {
  var driver = protocol( );
  var serial = stream(master);
  console.log('setting up app');
  master.postMessage({connect: name});
  driver.on('beacon', onSomething);
  // driver.on('msg', onSomething);
  var container = $('.tidepool-device-connect');
  var beacons = 0;
  function onSomething (vars) {
    beacons++;
    console.log('got beacon', beacons, vars);
    container.find('.beacon').addClass('received');
    setTimeout(removeBeacon, 3000);
  }
  var known = new Buffer([0x7E, 0x05, 0, 0, 0x1F, 0x8F]);
  // es.readArray([known.slice(0, 2), known.slice(2)]).pipe(driver);
  serial.pipe(driver);
  function removeBeacon ( ) {
      container.find('.beacon').removeClass('received');
  }

}
})( )


var protocol = (function exec ( ) {
  var binary = require('binary');
  var Buffer = require('buffer').Buffer;
  var es = require('event-stream');

  function protocol ( ) {
    function dispatch (vars) {
      console.log('dispatch', vars);
      if (vars.code == 0x05) {
        stream.emit('beacon', vars);
      } else {
        stream.emit('response', vars);
      }
      return this;
    }

    var known = new Buffer([0x7E, 0x05, 0, 0, 0x1F, 0x8F]);
    var stream = message.call(binary( ))
      .tap(dispatch)
      .loop(function onBeacon (end, vars) {
        message.call(this).tap(dispatch);
      })
    ;
    function message ( ) {
      console.log('incoming message');
      var self = this;
      return self
        .word8u('sync')
        .word8u('code')
        .word8u('length')
        .tap(function (vars) {
          if (vars.sync == 0x7E) {
            this
              .into('payload', function ( ) {
                this
                .buffer('body', vars.length === 0 ? 1 : vars.length)
              })
              .word8u('crc0')
              .word8u('crc1')
          }
        })
        ;
    }
    return stream;

  }
  return protocol;
})( );

$(window).ready(function (ev) {
  var button = $('.tidepool-upload');
  button.on('configure', function (ev, data) {
    console.log('xxx configure', ev, data, arguments);
  });

});

