var container;
var cache = {};
var needRender = false;

var getIPClassName = function (ip) {
	var arr;

	if (ip === 'fromCache') {
		return 'cache';
	}
	else {
		arr = ip.split('.');
		if (arr[0] === '10') {
			return 'internal';
		}

		if (arr[0] === '172' && arr[1] >= 16 && arr[1] <= 31) {
			return 'internal';
		}

		if (arr[0] === '192' && arr[1] === '168') {
			return 'internal';
		}

		return ' ';
	}
};

var render = function () {
	var result = [];
	var hostname

	if (!container) {
		container = document.createElement('div');
		container.setAttribute('id', 'which-host-container');
		document.body.appendChild(container);
	}
	
	Object.keys(cache).forEach(function (hostname) {
		result.push('<div class="item"><span class="hostname">' + hostname + '</span>' + cache[hostname].map(function (ip) {return '<span class="ip ' + getIPClassName(ip) + '">' + ip + '</span>'}).join('') + '</div>');
	});

	container.innerHTML = result.join(' ');

	needRender = false;
};

chrome.runtime.onMessage.addListener(function(message){
	if (!cache[message.hostname]) {
		needRender = true;
		cache[message.hostname] = [message.ip];
	}
	else if (cache[message.hostname].indexOf(message.ip) == -1) {
		needRender = true;
		cache[message.hostname].push(message.ip);
	}
	
	if (needRender) {
		render();
	}
});