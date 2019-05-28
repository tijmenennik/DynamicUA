chrome.webRequest.onBeforeSendHeaders.addListener(
    function (details) {
        for (var i = 0; i < details.requestHeaders.length; ++i) {
            if (details.requestHeaders[i].name === 'User-Agent') {
                console.log('User agent is being replaced');
                details.requestHeaders[i].value = 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/74.0.3729.169 Safari/537.36';
                break;
            }
        }
        return { requestHeaders: details.requestHeaders };
    },
    { urls: ['<all_urls>'] },
    ['blocking', 'requestHeaders']
);

chrome.runtime.onInstalled.addListener(function () {
    chrome.cookies.getAll({ domain: 'youtube.com' }, function (cookies) {
        for (var i = 0; i < cookies.length; i++) {
            chrome.cookies.remove({ url: 'https://www.youtube.com' + cookies[i].path, name: cookies[i].name });
        }
    });
});