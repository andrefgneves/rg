riot.tag2('rg-include', '<div> {responseText} </div>', '', '', function(opts) {
var _this = this;

var fetch = function fetch() {
	var req = new XMLHttpRequest();
	req.onload = function (resp) {
		if (opts.include.unsafe) _this.root.innerHTML = req.responseText;else _this.responseText = req.responseText;
		_this.update();
		_this.trigger('loaded');
	};
	req.open('get', opts.include.url, true);
	req.send();
	_this.trigger('loading');
};

this.on('mount', function () {
	fetch();
});
}, '{ }');
