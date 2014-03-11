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
  port.onMessage.addListener(dispatch);
  chrome.management.getAll(function (result) {
    port.postMessage({apps: result});
  });
});
chrome.runtime.onConnectExternal.addListener(function onConnectExt (port) {
  console.log('connected external', port);
  port.onMessage.addListener(listener('port from onConnectExternal onMessage'));
  chrome.management.getAll(function (result) {
    port.postMessage({apps: result});
  });
});

function dispatch (msg, port) {
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


