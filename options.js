// Copyright 2017 Jerzy Głowacki

(function () {
    chrome.runtime.getBackgroundPage(function (background) {
        var autoMode = document.getElementById("automode");
        var devMode = document.getElementById("devmode");
        var cacheMode = document.getElementById("cachemode");
        var saveDataMode = document.getElementById("savedatamode");
        var adBlockMode = document.getElementById("adblockmode");
        var ifAdBlockMode = document.getElementById("ifadblockmode");
        var excepted = document.getElementById("excepted");
        var blocked = document.getElementById("blocked");
        var saved = document.getElementById("saved");

        autoMode.checked = background.autoMode;
        devMode.checked = background.devMode;
        cacheMode.checked = background.cacheMode;
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
            background.unsetAdBlock();
            background.setAdBlock();
            triggerSaved();
        });
        blocked.addEventListener("change", function () {
            localStorage.setItem("blocked", this.value);
            background.blocked = this.value;
            background.unsetAdBlock();
            background.setAdBlock();
            triggerSaved();
        });

        var triggerSaved = function () {
            saved.hidden = false;
            setTimeout(function () { saved.hidden = true; }, 1000);
        };
    });
}());