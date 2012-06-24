(function() {
	fs.ui = {};
	
	fs.ui.styles = {
		navBarColour: '#8c2a2a'
	};
})();

Ti.include(
	'/friendship/ui/ApplicationWindow.js',
	'/friendship/ui/LikeList.js',
	'/friendship/ui/LoginWindow.js',
	'/friendship/ui/WebView.js',
	'/friendship/ui/ActivityIndicator.js'
)
