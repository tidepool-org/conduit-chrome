console.log('from content script');
console.log('from content script', 'runtime', chrome.runtime);
console.log('from content script', 'app', chrome.app);
var $ = require('jquery-browserify');

chrome.runtime.onMessage.addListener(listener('runtime onMessage'));
chrome.runtime.onConnect.addListener(function onConnect (port) {
  console.log('connected', port, arguments);
  port.onMessage.addListener(listener('port from onConnect onMessage'));
  port.postMessage({'foo': 'bar'});
});

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
port.postMessage({msg: "version port"});
port.onMessage.addListener(dispatch);
function dispatch (ev, port) {
  console.log('dispatch', arguments);

}

var button = $('BUTTON.tidepool-upload');
console.log(button);
chrome.runtime.sendMessage({type: 'version'});
button.on('click', function (ev) {
  chrome.runtime.sendMessage({type: 'connect'});

});

