document.getElementById('config').value = chrome.extension.getBackgroundPage().localStorage.getItem('config') || '';

document.getElementById('save').addEventListener('click', function () {
	chrome.extension.getBackgroundPage().localStorage.setItem('config', document.getElementById('config').value);
	chrome.extension.getBackgroundPage().getConfig();
}, false);