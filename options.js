// Copyright 2020 Jerzy Głowacki

(function () {
    chrome.runtime.getBackgroundPage(function (background) {
        var autoMode = document.getElementById("automode");
        var devMode = document.getElementById("devmode");
        var cacheMode = document.getElementById("cachemode");
        var saveDataMode = document.getElementById("savedatamode");
        var excluded = document.getElementById("excluded");
        var saved = document.getElementById("saved");

        chrome.storage.sync.get(null, function(storage) {
            autoMode.checked = storage.autoMode !== false;
            devMode.checked = storage.devMode === true;
            cacheMode.checked = storage.cacheMode !== false;
            saveDataMode.checked = storage.saveDataMode !== false;
            excluded.value = storage.excluded || "example.com";
        });

        autoMode.addEventListener("change", function () {
            chrome.storage.sync.set({autoMode: autoMode.checked}, function () {
                background.autoMode = autoMode.checked;
                triggerSaved();
            });
        });
        devMode.addEventListener("change", function () {
            chrome.storage.sync.set({devMode: devMode.checked}, function () {
                background.devMode = devMode.checked;
                triggerSaved();
            });
        });
        cacheMode.addEventListener("change", function () {
            chrome.storage.sync.set({cacheMode: cacheMode.checked}, function () {
                background.cacheMode = cacheMode.checked;
                triggerSaved();
            });
        });
        saveDataMode.addEventListener("change", function () {
            chrome.storage.sync.set({saveDataMode: saveDataMode.checked}, function () {
                background.saveDataMode = saveDataMode.checked;
                background.triggerSaveData();
                triggerSaved();
            });
        });
        excluded.addEventListener("change", function () {
            chrome.storage.sync.set({excluded: excluded.value}, function () {
                background.excluded = excluded.value;
                triggerSaved();
            });
        });

        var triggerSaved = function () {
            saved.hidden = false;
            setTimeout(function () { saved.hidden = true; }, 1000);
        };
    });
}());