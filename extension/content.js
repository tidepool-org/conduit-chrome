console.log('from content script');
var $ = require('jquery-browserify');

function listener (msg) {
  function onMessage (request, sender, sendResponse) {
    console.log(msg, arguments);
    console.log('request', request);
    console.log('sender', sender);
    console.log('sendResponse', sendResponse);
  }
  return onMessage;
}
var port = chrome.runtime.connect( );
port.postMessage({type: "apps"});
port.onMessage.addListener(dispatch);
function dispatch (msg, port) {
  console.log('dispatch', msg);
  if (msg.apps) {
    var apps = msg.apps.filter(function (elem) {
      return elem.isApp && elem.shortName == "conduit-chrome";
    });
    console.log('found apps', apps);
    var master = chrome.runtime.connect(apps[0].id);
    master.onMessage.addListener(function coordinator (cmd, P) {
      console.log("XX", "list of devices??", arguments);
    });
    master.postMessage({cmd: "find", matches: ".*(AsantePorter|usb|USB|Carelink).*"});

  }

}
$(document).ready(function init ( ) {
  console.log('doc ready');
  port.postMessage({type: 'version'});
});

var button = $('BUTTON.tidepool-upload');
if (button.is('BUTTON')) {
  button.on('click', function (ev) {
    chrome.runtime.sendMessage({type: 'connect'});

  });
}

chrome.runtime.onMessage.addListener(listener('runtime onMessage'));
chrome.runtime.onConnect.addListener(function onConnect (port) {
  console.log('connected', port, arguments);
  port.onMessage.addListener(listener('content port from onConnect onMessage'));
  port.postMessage({'foo': 'bar'});
});
