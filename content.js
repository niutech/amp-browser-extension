// Copyright 2018 Jerzy Głowacki

(function () {
    var html = document.documentElement;

    function stopAndGoTo(url) {
        window.stop();
        html.innerHTML = '';
        location.replace(url);
    }

    function cachedFetch(url, options) {
        var cached = sessionStorage.getItem(hashCode(url));
        if (cached) {
            return Promise.resolve(JSON.parse(cached));
        }
        return fetch(url, options).then(function (res) {
            res.clone().text().then(function (content) {
                try {
                    sessionStorage.setItem(hashCode(url), content);
                } catch (e) {
                }
            });
            return res.json();
        });
    }

    function hashCode(s) {
        var hash = 0;
        for (var i = 0; i < s.length; i++) {
            var chr = s.charCodeAt(i);
            hash = ((hash << 5) - hash) + chr;
            hash &= hash;
        }
        return hash;
    }

    function init() {
        var isAmp = html.hasAttribute("amp") || html.hasAttribute("⚡") || html.hasAttribute('mip');
        var linkAmp = document.querySelector("link[rel='amphtml'], link[rel='miphtml']");
        var linkCanonical = document.querySelector("link[rel='canonical']");
        var isGoogleCache = location.hostname.indexOf("cdn.ampproject.org") > -1;
        var isGoogleUrl = location.hostname.indexOf("google.") > -1 && location.pathname === "/url";
        var isGoogleSerp = location.hostname.indexOf("google.") > -1 && location.pathname === "/search";

        if (isGoogleCache) {
            var fwdLink = document.querySelector(".fwdlnk");
            if (fwdLink) {
                return stopAndGoTo(fwdLink.href);
            }
        } else if (isGoogleUrl) {
            var aLink = document.querySelector("a[href^='http']");
            if (aLink) {
                return stopAndGoTo(aLink.href);
            }
        } else if (isGoogleSerp) {
            document.addEventListener("DOMContentLoaded", function () {
                var ampIcon = " <img src='data:image/svg+xml,%3Csvg%20xmlns%3D%22http%3A%2F%2Fwww.w3.org%2F2000%2Fsvg%22%20viewBox%3D%220%200%2040%2040%22%3E%3Cpath%20fill%3D%22%230379C4%22%20d%3D%22M26.6%201l-4%2015.5h3.7c1%200%201.4.8.8%201.8l-12.7%2021c1.8.4%203.7.7%205.7.7%2011%200%2020-9%2020-20%200-8.7-5.6-16.2-13.4-19zm-9.3%2022.4h-3.6c-1%200-1.4-.8-.8-1.8L25.6.8C24%20.3%2022%200%2020%200%209%200%200%209%200%2020c0%208.7%205.6%2016.2%2013.4%2019l4-15.6z%22%2F%3E%3C%2Fsvg%3E' width='12' height='12' alt='AMP' title='AMP'>";
                var serpLinks = document.querySelectorAll("#res a[href][ping]:not([href*='.google.']):not([href*='twitter.com']):not([href*='wikipedia.org']):not([href*='googleusercontent.com'])");
                var urls = Array.prototype.map.call(serpLinks, function (link) {
                    return encodeURIComponent(link.href).replace(/'/g, "%27");
                }).slice(0, 50);
                cachedFetch("https://query.yahooapis.com/v1/public/yql?q=select%20*%20from%20jsonpost%20where%20url%3D'https%3A%2F%2Facceleratedmobilepageurl.googleapis.com%2Fv1%2FampUrls%3AbatchGet%3Fkey%3DAIzaSyCcQl-54dUpBvgPOISXs9CoAur9LFngUOg'%20and%20postdata%3D'urls%3D" + encodeURIComponent(urls.join("&urls=")) + "'&format=json&env=store%3A%2F%2Fdatatables.org%2Falltableswithkeys&_maxage=2592000").then(function (json) {
                    if (json && json.query && json.query.results && json.query.results.postresult && json.query.results.postresult.json) { //AMP Cache API
                        serpLinks.forEach(function (link) {
                            [].concat(json.query.results.postresult.json.ampUrls).forEach(function (url) {
                                if (url && url.originalUrl === link.href) {
                                    link.href = url.cdnAmpUrl;
                                    link.innerHTML += ampIcon;
                                    link.onmousedown = null;
                                }
                            });
                        });
                    } else { //Google fallback
                        cachedFetch(location.href + '&AMPBrowser').then(function (res) {
                            return res.text();
                        }).then(function (text) {
                            var html = (new DOMParser()).parseFromString(text, "text/html");
                            var ampLinks = html.querySelectorAll("a[data-amp]");
                            if (ampLinks) {
                                serpLinks.forEach(function (link) {
                                    ampLinks.forEach(function (ampLink) {
                                        if (ampLink.dataset.ampCur === link.href) {
                                            link.href = ampLink.href;
                                            link.innerHTML += ampIcon;
                                            link.onmousedown = null;
                                        }
                                    });
                                });
                            }
                        });
                    }
                });
            });
        }

        var amp = {
            source: "AMPBrowser",
            isAmp: isAmp,
            hostname: location.hostname,
            ampUrl: linkAmp ? linkAmp.href : "",
            canonicalUrl: linkCanonical ? linkCanonical.href : ""
        };

        chrome.runtime.sendMessage(amp, function (response) {
            if (response && response.url) {
                stopAndGoTo(response.url);
            }
        });
    }

    var tries = 5;
    var interval = setInterval(function () {
        if (document.querySelector('head') || !tries--) {
            clearInterval(interval);
            init();
        }
    }, 100);
}());