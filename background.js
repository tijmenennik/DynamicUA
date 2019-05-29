/* Replace the user agent for websites declared in the manifest */

chrome.webRequest.onBeforeSendHeaders.addListener(
    function (details) {
        for (var i = 0; i < details.requestHeaders.length; ++i) {
            if (details.requestHeaders[i].name === 'User-Agent') {
                console.log('User agent is being replaced');
                details.requestHeaders[i].value = navigator.userAgent.split(' Edg')[0]; // Removes the Edge part of the user agent, but keeps all the other parts with the right version numbers
                break;
            }
        }
        return { requestHeaders: details.requestHeaders };
    },
    { urls: ['<all_urls>'] },
    ['blocking', 'requestHeaders']
);



/* Delete YouTube cookies when the extension is installed, so it works instantly */

chrome.runtime.onInstalled.addListener(function () {
    chrome.cookies.getAll({ domain: 'youtube.com' }, function (cookies) {
        for (var i = 0; i < cookies.length; i++) {
            chrome.cookies.remove({ url: 'https://www.youtube.com' + cookies[i].path, name: cookies[i].name });
        }
    });
});



/* Look if a new version is available */

chrome.windows.onCreated.addListener(function () {
    fetch('https://raw.githubusercontent.com/tijmenennik/DynamicUA/master/manifest.json')

        .then(function (response) {
            return response.json();
        })

        .then(function (data) {

            /* Compare versions */

            var currentVersion = chrome.runtime.getManifest().version;
            var latestVersion = data.version;

            if (currentVersion !== latestVersion) {

                /* Create update notification */

                chrome.notifications.create(
                    'update-notification', {
                        type: 'basic',
                        iconUrl: 'images/icon128.png',
                        title: 'A new version of DynamicUA is available via GitHub.',
                        message: 'Click to view the new version.'
                    },

                    function () {

                        /* Create notification click event*/

                        chrome.notifications.onClicked.addListener(function () {
                            chrome.tabs.create({ url: 'https://github.com/tijmenennik/DynamicUA/releases/' });
                        });
                    }

                );
            }

            console.log(data);
        })
})
