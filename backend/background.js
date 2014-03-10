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
  port.onMessage.addListener(listener('port from onConnectExternal onMessage'));
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

chrome.app.runtime.onLaunched.addListener(function() { 
  // Tell your app what to launch and how.
  console.log('app is launched');
});
