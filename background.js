var filters = {
	urls: ["<all_urls>"],
	types: ["main_frame", "sub_frame", "stylesheet", "script", "image", "object", "xmlhttprequest"]
};

var hostname_regexp = /^https?:\/\/([^\/]*)/;

var getHostname = function (url) {
	var result = url.match(hostname_regexp);
	return result ? result[1] : "";
};

var whiteList = [];

var getConfig = function () {
	var newWhiteList = [];
	window.localStorage.getItem('config').split('\n').forEach(function (line) {
		line = line.trim();
		if (line.length > 0) {
			try {
				newWhiteList.push(new RegExp('^' + line + '$', 'i'));
			} catch (e) {}
		}

	});
	whiteList =  newWhiteList;
};

getConfig();

chrome.webRequest.onCompleted.addListener(function (details) {
	var requestHostname = getHostname(details.url);
	var i,l,match;

	for (i = 0, l = whiteList.length; i < l; i++) {
		if (match = requestHostname.match(whiteList[i])) {
			setTimeout(function () {
				chrome.tabs.sendMessage(details.tabId, {"hostname" : requestHostname, "ip" : details.fromCache ? 'fromCache' : details.ip})
			}, 2000);
		}
	}
}, filters)