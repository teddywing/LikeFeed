var fs = {};


(function() {
	fs.app = {};
	fs.app.isAndroid = (Ti.Platform.osname === 'android');
})();

Ti.include(
	'/friendship/config/config.js',
	'/friendship/ui/ui.js',
	'/friendship/core/core.js'
);
