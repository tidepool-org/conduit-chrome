console.log('from background');

chrome.runtime.onMessageExternal.addListener(listener('onMessage'));
chrome.runtime.onMessage.addListener(listener('onMessage'));
chrome.runtime.onInstalled.addListener(function onInstall (event) {
  console.log('installed', event, arguments);
});
chrome.runtime.onStartup.addListener(function onStartup (event) {
  console.log('started', event, arguments);
});
chrome.runtime.onSuspend.addListener(function onSuspend (event) {
  console.log('suspending', event, arguments);
});
chrome.runtime.onConnect.addListener(function onConnect (event) {
  console.log('connected', event, arguments);
});
chrome.runtime.onConnectExternal.addListener(function onConnect (port) {
  console.log('connected external', event, arguments);
  port.onMessage.addListener(dispatcher);
});

function runDevices (msg, port) {
  console.log(msg, port.name);
  var connInfo;
  var serial = chrome.serial.connect(msg.connect, function (info) {
    connInfo = info;
  });
  function toSerial (msg, port) {
    console.log('toSerial', msg);
    serial.send(connInfo.connectionId, msg);
  }
  function toChrome (info) {
    if (info.connectionId == connInfo.connectionId) {
      var blob = new Blob([info.data], {type: 'arraybuffer'});
      var url = URL.createObjectURL(blob);
      var v = new Uint8Array(info.data);
      var view = Array.prototype.slice.apply(v);
      console.log('data from serial', v, view, info.data.byteLength);
      port.postMessage({type: 'data',  data: view, url: false});
    }
  }
  chrome.serial.onReceive.addListener(toChrome);
}

function dispatcher (msg, port) {
  console.log(port.name);
  if (port.name == 'device') {
    console.log('setting up device');
    runDevices(msg, port)
  }
  if (msg.cmd == 'find') {
    var r = new RegExp(msg.matches || "*");
    function whitelist (elem) {
      return elem.match(r) ? elem : null;
    }
    function paths (elem) {
      return elem.path ? elem.path : elem
    }
    chrome.serial.getDevices(function devices (devices) {
      var matched = devices.map(paths).filter(whitelist);
      port.postMessage({ports: matched});
    });
  }
}

function listener (msg) {
  function onMessage (request, sender, sendResponse) {
    console.log(msg, arguments);
    console.log('request', request);
    console.log('sender', sender);
    console.log('sendResponse', sendResponse);
  }
  return onMessage;
}

chrome.app.runtime.onLaunched.addListener(function() { 
  // Tell your app what to launch and how.
  console.log('app is launched');
});
