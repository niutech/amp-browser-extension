// Copyright 2018 Jerzy Głowacki

(function () {
    chrome.runtime.getBackgroundPage(function (background) {
        var autoMode = document.getElementById("automode");
        var devMode = document.getElementById("devmode");
        var cacheMode = document.getElementById("cachemode");
        var saveDataMode = document.getElementById("savedatamode");
        var excluded = document.getElementById("excluded");
        var saved = document.getElementById("saved");

        autoMode.checked = background.autoMode;
        devMode.checked = background.devMode;
        cacheMode.checked = background.cacheMode;
        saveDataMode.checked = background.saveDataMode;
        excluded.value = background.excluded;

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
        excluded.addEventListener("change", function () {
            localStorage.setItem("excluded", this.value);
            background.excluded = this.value;
            triggerSaved();
        });

        var triggerSaved = function () {
            saved.hidden = false;
            setTimeout(function () { saved.hidden = true; }, 1000);
        };
    });
}());