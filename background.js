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


/* Delete YouTube cookies when the extension is installed, so it works instantly. */

chrome.runtime.onInstalled.addListener(() => {
    chrome.cookies.getAll({ domain: 'youtube.com' }, cookies => {
        for (const cookie of cookies) {
            chrome.cookies.remove({ url: `https://www.youtube.com${cookie.path}`, name: cookie.name });
        }
    });
});


/* Look if a new version is available. */

chrome.windows.onCreated.addListener(async () => {
    const response = await fetch(
        'https://raw.githubusercontent.com/tijmenennik/DynamicUA/master/manifest.json');

    const data = await response.json();
    
    // Compare versions.
    const currentVersion = chrome.runtime.getManifest().version;
    const latestVersion = data.version;

    if (currentVersion !== latestVersion) {
        // Create update notification.
        chrome.notifications.create(
            'update-notification', {
                type: 'basic',
                iconUrl: 'images/icon128.png',
                title: 'A new version of DynamicUA is available via GitHub.',
                message: 'Click to view the new version.'
            },
            () => {
                // Create notification click event.
                const url = 'https://github.com/tijmenennik/DynamicUA/releases/';
                chrome.notifications.onClicked.addListener(() => {
                    chrome.tabs.create({ url });
                });
            }
        );
    }
    console.log(data);
});
