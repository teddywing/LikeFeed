(function() {
	fs.ui.createWebViewWin = function(_args) {
		var options = _args || {}
		
		var win = Ti.UI.createWindow({
			title: (options['title']) ? options['title'] : '',
			backButtonTitle: 'Back'
		});
		
		var webview = Ti.UI.createWebView({
			url: options['url']
		});
		
		win.add(webview);
		
		return win;
	};
})();
