(function() {
	fs.ui.createWebViewWin = function(_args) {
		var options = _args || {}
		
		var win = Ti.UI.createWindow({
			barColor: fs.ui.styles.navBarColour,
			title: (options['title']) ? options['title'] : '',
			backButtonTitle: 'Back'
		});
		
		var webview = Ti.UI.createWebView({
			url: options['url'],
			top: -44 // Removes the Facebook navbar. Eventually, we should only do this on facebook webviews, but as long as we only have facebook webviews, we can just hard-code it in there.
		});
		
		win.add(webview);
		
		return win;
	};
})();
