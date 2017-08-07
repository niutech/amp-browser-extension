// Copyright 2017 Jerzy Głowacki

(function () {
    var html = document.documentElement;

    function stopAndGoTo(url) {
        window.stop();
        html.innerHTML = '';
        location.replace(url);
    }

    // function getGwlUrl() {
    //     return "https://googleweblight.com/?lite_url=" + encodeURIComponent(location.href);
    // }
    //
    // function getOriginalUrl(url) {
    //     return decodeURIComponent(url.substring(url.indexOf('?lite_url=') + 10).split('&')[0]);
    // }

    function getCacheUrl(url) {
        url = new URL(url);
        return 'https://' + url.hostname.replace(/-/g, '--').replace(/\./g, '-') + '.cdn.ampproject.org/c/' + (url.protocol === "https:" ? 's/' : '') + url.hostname + url.pathname + url.search;
    }

    // function setViewport(el, width) {
    //     el.style.margin = "0 auto";
    //     el.style.maxWidth = width;
    // }

    // function onClickGWL(e) {
    //     var el = e.target;
    //     while (el && el !== document) {
    //         if (el.matches("a[href*='/?lite_url=']")) {
    //             el.href = getOriginalUrl(el.href);
    //             break;
    //         }
    //         el = el.parentNode;
    //     }
    // }

    function init() {
        var isAmp = html.hasAttribute("amp") || html.hasAttribute("⚡") || html.hasAttribute('mip');
        var linkAmp = document.querySelector("link[rel='amphtml']");
        var linkCanonical = document.querySelector("link[rel='canonical']");
        var isGoogleCache = location.hostname.indexOf("cdn.ampproject.org") > -1;
        var liteAtfContent = document.getElementById("lite-atf-content");
        //var hasTranscodingFailed = liteAtfContent && liteAtfContent.innerText.indexOf("Transcoding test failed") === 0;

        // if (isAmp) {
        //     setViewport(html, "1000px");
        //     // if (linkCanonical) {
        //     //     document.querySelectorAll("a[href^='" + linkCanonical.href + "']").forEach(function (a) {
        //     //         a.href += "#noredirect=1";
        //     //     });
        //     // }
        // } else if (liteAtfContent) {
        //     setViewport(liteAtfContent, "800px");
        //     //document.addEventListener("click", onClickGWL);
        // } else
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