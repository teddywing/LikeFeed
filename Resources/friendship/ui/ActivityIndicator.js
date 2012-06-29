(function() {
	fs.ui.createLoadingView = function() {
		var loading_view = Ti.UI.createView({
			height: 100,
			width: 100,
			visible: false
		});
		
		var background = Ti.UI.createView({
			backgroundColor: '#222',
			opacity: 0.82,
			borderRadius: 10
		});
		var loader = Ti.UI.createActivityIndicator({
			style: (fs.app.isAndroid) ? null : Titanium.UI.iPhone.ActivityIndicatorStyle.BIG
		});
		
		loading_view.add(background);
		loading_view.add(loader);
		loader.show();
		
		Ti.App.addEventListener('app:show.loader', function() {
			if (!loading_view.visible) {
				loading_view.visible = true;
			}
		});
		
		Ti.App.addEventListener('app:hide.loader', function() {
			loading_view.visible = false;
		});
		
		return loading_view;
	};
})();
