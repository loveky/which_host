var container;
var cache = {};
var needRender = false;

var render = function () {
	var result = [];
	var hostname

	if (!container) {
		container = document.createElement('div');
		container.setAttribute('id', 'which-host-container');
		document.body.appendChild(container);
	}
	
	Object.keys(cache).forEach(function (hostname) {
		result.push(hostname + ':' + cache[hostname].join(','));
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