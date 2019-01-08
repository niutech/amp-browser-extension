// Copyright 2019 Jerzy Głowacki

var autoMode = true;
var devMode = false;
var cacheMode = true;
var saveDataMode = true;
var excluded = "example.com";
var ampTabs = {};
var getAmpUrl = function (url) {
    url = new URL(url);
    return (cacheMode ? 'https://' + url.hostname.replace(/-/g, '--').replace(/\./g, '-') + '.cdn.ampproject.org/c/' + (url.protocol === "https:" ? 's/' : '') + url.hostname + url.pathname + url.search : url) + (devMode ? "#development=1" : '');
};
var googleUrls = ['https://*.google.com/search*', 'https://*.google.co.in/search*', 'https://*.google.co.jp/search*', 'https://*.google.co.uk/search*', 'https://*.google.de/search*', 'https://*.google.fr/search*', 'https://*.google.ru/search*', 'https://*.google.com.br/search*', 'https://*.google.com.hk/search*', 'https://*.google.it/search*', 'https://*.google.es/search*', 'https://*.google.ca/search*', 'https://*.google.com.mx/search*', 'https://*.google.co.kr/search*', 'https://*.google.com.tw/search*', 'https://*.google.com.tr/search*', 'https://*.google.com.au/search*', 'https://*.google.com.id/search*', 'https://*.google.pl/search*', 'https://*.google.com.eg/search*', 'https://*.google.co.th/search*', 'https://*.google.com.sa/search*', 'https://*.google.com.ar/search*', 'https://*.google.nl/search*', 'https://*.google.com.vn/search*', 'https://*.google.com.ph/search*', 'https://*.google.com.co/search*', 'https://*.google.com.ua/search*', 'https://*.google.com.ng/search*', 'https://*.google.com.bd/search*'];

chrome.storage.sync.get(null, function (storage) {
    autoMode = storage.autoMode !== false;
    devMode = storage.devMode === true;
    cacheMode = storage.cacheMode !== false;
    saveDataMode = storage.saveDataMode !== false;
    excluded = storage.excluded || "example.com";
    triggerSaveData();
});

/*** AMP ***/

chrome.runtime.onMessage.addListener(function (amp, sender, sendResponse) {
    if (amp.source !== "AMPBrowser") {
        return;
    }
    if (amp.isAmp) {
        chrome.browserAction.setIcon({tabId: sender.tab.id, path: 'img/icon48.png'});
        chrome.browserAction.setTitle({tabId: sender.tab.id, title: 'AMP HTML enabled. Click to disable.'});
    } else if (amp.ampUrl) {
        chrome.browserAction.setIcon({tabId: sender.tab.id, path: 'img/icon-inverted48.png'});
        chrome.browserAction.setTitle({tabId: sender.tab.id, title: 'AMP HTML detected. Click to enable.'});
    } else {
        chrome.browserAction.setIcon({tabId: sender.tab.id, path: 'img/icon-inactive48.png'});
        chrome.browserAction.setTitle({tabId: sender.tab.id, title: 'AMP HTML not detected'});
    }
    if (ampTabs[sender.tab.id] && ampTabs[sender.tab.id].canonicalUrl) {
        amp.previousUrl = ampTabs[sender.tab.id].canonicalUrl;
    }
    if ((ampTabs[sender.tab.id] && ampTabs[sender.tab.id].noRedirect) || (!amp.isAmp && amp.previousUrl === amp.canonicalUrl) || (excluded || '').indexOf(amp.hostname) > -1) {
        amp.noRedirect = true;
    }
    ampTabs[sender.tab.id] = amp;
    if (autoMode) {
        if (!amp.isAmp && !amp.noRedirect) {
            if (amp.ampUrl) {
                sendResponse({url: getAmpUrl(amp.ampUrl)});
            }
        } else {
            amp.noRedirect = false;
        }
    }
});

chrome.tabs.onRemoved.addListener(function (tabId) {
    delete ampTabs[tabId];
});

chrome.browserAction.onClicked.addListener(function (tab) {
    var amp = ampTabs[tab.id];
    if (amp.isAmp && amp.canonicalUrl) {
        amp.noRedirect = true;
        chrome.tabs.update(tab.id, {url: amp.canonicalUrl});
    } else if (!amp.isAmp && amp.ampUrl) {
        chrome.tabs.update(tab.id, {url: getAmpUrl(amp.ampUrl)});
    }
});

chrome.webRequest.onBeforeSendHeaders.addListener(function (details) {
        if (details.url.indexOf('AMPBrowser') > -1) {
            var headers = details.requestHeaders;
            headers.forEach(function (header) {
                if (header.name.toLowerCase() === 'user-agent') {
                    header.value = 'Mozilla/5.0 (Linux; Android 8.0; Pixel 2 Build/OPD3.170816.012) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/70.0.3538.110 Mobile Safari/537.36';
                }
            });
            return {requestHeaders: headers};
        }
    },
    {urls: googleUrls, types: ['xmlhttprequest']},
    ['blocking', 'requestHeaders']
);

/*** Save-Data Header ***/

var saveDataHeader = {
    name: 'Save-Data',
    value: 'on'
};
var onAddSaveDataHeader = function (details) {
    details.requestHeaders.push(saveDataHeader);
    return {requestHeaders: details.requestHeaders};
};
var setSaveData = function () {
    chrome.webRequest.onBeforeSendHeaders.addListener(
        onAddSaveDataHeader,
        {urls: ['http://*/*', 'https://*/*']},
        ['requestHeaders', 'blocking']
    );
};
var unsetSaveData = function () {
    chrome.webRequest.onBeforeSendHeaders.removeListener(onAddSaveDataHeader);
};
var triggerSaveData = function () {
    if (saveDataMode) {
        setSaveData();
    } else {
        unsetSaveData();
    }
};
