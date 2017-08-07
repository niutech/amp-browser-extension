// Copyright 2017 Jerzy Głowacki

(function () {
    var html = document.documentElement;

    function stopAndGoTo(url) {
        window.stop();
        html.innerHTML = '';
        location.replace(url);
    }

    function getCacheUrl(url) {
        url = new URL(url);
        return 'https://' + url.hostname.replace(/-/g, '--').replace(/\./g, '-') + '.cdn.ampproject.org/c/' + (url.protocol === "https:" ? 's/' : '') + url.hostname + url.pathname + url.search;
    }

    function init() {
        var isAmp = html.hasAttribute("amp") || html.hasAttribute("⚡") || html.hasAttribute('mip');
        var linkAmp = document.querySelector("link[rel='amphtml']");
        var linkCanonical = document.querySelector("link[rel='canonical']");
        var isGoogleCache = location.hostname.indexOf("cdn.ampproject.org") > -1;
        var liteAtfContent = document.getElementById("lite-atf-content");

        if (isGoogleCache) {
            var fwdlink = document.querySelector(".fwdlnk");
            if (fwdlink) { //TODO: Check for 404 status and redirect
                return stopAndGoTo(fwdlink.href);
            }
        }

        var amp = {
            source: "AMPBrowser",
            isAmp: isAmp,
            hostname: location.hostname,
            ampUrl: linkAmp ? linkAmp.href : "",
            ampCacheUrl: linkAmp ? getCacheUrl(linkAmp.href) : "",
            canonicalUrl: linkCanonical ? linkCanonical.href : ""
        };

        chrome.runtime.sendMessage(amp, function (response) {
            if (response && response.url) {
                stopAndGoTo(response.url);
            }
        });
    }

    setTimeout(init, 10);
}());