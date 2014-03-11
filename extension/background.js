console.log('from extension background');

chrome.runtime.onMessageExternal.addListener(listener('onMessageExternal'));
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
chrome.runtime.onConnect.addListener(function onConnect (port) {
  console.log('connected', port);
  chrome.management.getAll(function (result) {
    console.log('sending list');
    port.postMessage({apps: result});
    port.onMessage.addListener(dispatch);
  });
});

function dispatch (msg, port) {
  console.log('from background content dispatch');
  if (msg.type == 'version') {
    chrome.management.getAll(function withApps (result) {
      port.postMessage({apps: result});
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


