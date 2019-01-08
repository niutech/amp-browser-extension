// Copyright 2018 Jerzy Głowacki

(function () {
    chrome.runtime.getBackgroundPage(function (background) {
        var autoMode = document.getElementById("automode");
        var devMode = document.getElementById("devmode");
        var cacheMode = document.getElementById("cachemode");
        var saveDataMode = document.getElementById("savedatamode");
        var excluded = document.getElementById("excluded");
        var saved = document.getElementById("saved");

        chrome.storage.sync.get(null, function(storage) {
            autoMode.checked = storage.autoMode;
            devMode.checked = storage.devMode;
            cacheMode.checked = storage.cacheMode;
            saveDataMode.checked = storage.saveDataMode;
            excluded.value = storage.excluded;
        });

        autoMode.addEventListener("change", function () {
            chrome.storage.sync.set({autoMode: this.checked}, function () {
                background.autoMode = this.checked;
                triggerSaved();
            });
        });
        devMode.addEventListener("change", function () {
            chrome.storage.sync.set({devMode: this.checked}, function () {
                background.devMode = this.checked;
                triggerSaved();
            });
        });
        cacheMode.addEventListener("change", function () {
            chrome.storage.sync.set({cacheMode: this.checked}, function () {
                background.cacheMode = this.checked;
                triggerSaved();
            });
        });
        saveDataMode.addEventListener("change", function () {
            chrome.storage.sync.set({saveDataMode: this.checked}, function () {
                background.saveDataMode = this.checked;
                background.triggerSaveData();
                triggerSaved();
            });
        });
        excluded.addEventListener("change", function () {
            chrome.storage.sync.set({excluded: this.value}, function () {
                background.excluded = this.value;
                triggerSaved();
            });
        });

        var triggerSaved = function () {
            saved.hidden = false;
            setTimeout(function () { saved.hidden = true; }, 1000);
        };
    });
}());