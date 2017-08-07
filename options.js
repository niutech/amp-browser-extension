// Copyright 2017 Jerzy Głowacki

(function () {
    chrome.runtime.getBackgroundPage(function (background) {
        var autoMode = document.getElementById("automode");
        //var gwlMode = document.getElementById("gwlmode");
        var devMode = document.getElementById("devmode");
        var cacheMode = document.getElementById("cachemode");
        //var proxyMode = document.getElementById("proxymode");
        var saveDataMode = document.getElementById("savedatamode");
        var adBlockMode = document.getElementById("adblockmode");
        var ifAdBlockMode = document.getElementById("ifadblockmode");
        var excepted = document.getElementById("excepted");
        var blocked = document.getElementById("blocked");
        //var reset = document.getElementById("reset");
        var saved = document.getElementById("saved");

        autoMode.checked = background.autoMode;
        //gwlMode.checked = background.gwlMode;
        devMode.checked = background.devMode;
        cacheMode.checked = background.cacheMode;
        //proxyMode.checked = background.proxyMode;
        saveDataMode.checked = background.saveDataMode;
        adBlockMode.checked = background.adBlockMode;
        ifAdBlockMode.hidden = !background.adBlockMode;
        excepted.value = background.excepted;
        blocked.value = background.blocked;

        autoMode.addEventListener("change", function () {
            localStorage.setItem("autoMode", this.checked);
            background.autoMode = this.checked;
            triggerSaved();
        });
        // gwlMode.addEventListener("change", function () {
        //     localStorage.setItem("gwlMode", this.checked);
        //     background.gwlMode = this.checked;
        //     triggerSaved();
        // });
        devMode.addEventListener("change", function () {
            localStorage.setItem("devMode", this.checked);
            background.devMode = this.checked;
            triggerSaved();
        });
        cacheMode.addEventListener("change", function () {
            localStorage.setItem("cacheMode", this.checked);
            background.cacheMode = this.checked;
            triggerSaved();
        });
        // proxyMode.addEventListener("change", function () {
        //     localStorage.setItem("proxyMode", this.checked);
        //     background.proxyMode = this.checked;
        //     background.triggerProxy();
        //     triggerSaved();
        // });
        saveDataMode.addEventListener("change", function () {
            localStorage.setItem("saveDataMode", this.checked);
            background.saveDataMode = this.checked;
            background.triggerSaveData();
            triggerSaved();
        });
        adBlockMode.addEventListener("change", function () {
            localStorage.setItem("adBlockMode", this.checked);
            background.adBlockMode = this.checked;
            ifAdBlockMode.hidden = !this.checked;
            background.triggerAdBlock();
            triggerSaved();
        });
        excepted.addEventListener("change", function () {
            localStorage.setItem("excepted", this.value);
            background.excepted = this.value;
            triggerSaved();
        });
        blocked.addEventListener("change", function () {
            localStorage.setItem("blocked", this.value);
            background.blocked = this.value;
            background.unsetAdBlock();
            background.setAdBlock();
            triggerSaved();
        });
        // reset.addEventListener("click", function () {
        //     localStorage.removeItem('totalBytes');
        //     background.sessionBytes = background.sessionOriginalBytes = 0;
        //     location.reload();
        // });

        var triggerSaved = function () {
            saved.hidden = false;
            setTimeout(function () { saved.hidden = true; }, 1000);
        };

        // document.getElementById('session-mbytes').innerText = Math.round(background.sessionBytes / 1048576); //MB
        // document.getElementById('session-mbytes-original').innerText =  Math.round(background.sessionOriginalBytes / 1048576); //MB
        // document.getElementById('session-percent').innerText = Math.round(100 - 100 * background.sessionBytes / background.sessionOriginalBytes); //%
        //
        // var totalBytes = JSON.parse(localStorage.getItem('totalBytes')) || {};
        // var totalBytesSent = Object.keys(totalBytes).reduce(function(i, j) { return i + totalBytes[j][0]; }, 0);
        // var totalBytesOriginal = Object.keys(totalBytes).reduce(function(i, j) { return i + totalBytes[j][1]; }, 0);
        //
        // document.getElementById('total-mbytes').innerText = Math.round(totalBytesSent / 1048576); //MB
        // document.getElementById('total-mbytes-original').innerText =  Math.round(totalBytesOriginal / 1048576); //MB
        // document.getElementById('total-percent').innerText =  Math.round(100 - 100 * totalBytesSent / totalBytesOriginal); //%

        // if (Object.keys(totalBytes).length) {
        //     var cumulativeBytesSent = Object.keys(totalBytes).reduce(function(i, j) { i.push((i.length && i[i.length-1] || 0) + Math.round(totalBytes[j][0] / 1048576)); return i; }, []);
        //     var cumulativeBytesOriginal = Object.keys(totalBytes).reduce(function(i, j) { i.push((i.length && i[i.length-1] || 0) + Math.round(totalBytes[j][1] / 1048576)); return i; }, []);
        //     new Chartist.Line('.ct-chart', {labels: Object.keys(totalBytes), series: [cumulativeBytesSent, cumulativeBytesOriginal]}, {showArea: true});
        // }

        // setInterval(function() {
        //     location.reload();
        // }, 300000); //Refresh stats every 5 minutes
    });
}());