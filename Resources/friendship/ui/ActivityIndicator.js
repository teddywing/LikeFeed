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
		
		var loader_msg = Ti.UI.createLabel( {
			    text:'loading',
			    height:'auto',
			    width:'auto',
			    top:0,
			    color:'#fff',
			    font:{fontSize:10},
			    textAlign:'center'
		});
		
		loading_view.add(background);
		loading_view.add(loader);
		loading_view.add( loader_msg );
		loader.show();
		
		Ti.App.addEventListener('app:show.loader', function() {
			if (!loading_view.visible) {
				loading_view.visible = true;
			}
		});

		Ti.App.addEventListener('app:msg.loader', function(msg) {
			loader_msg.text = msg.text;
		});
		
		Ti.App.addEventListener('app:hide.loader', function() {
			loading_view.visible = false;
		});
		
		return loading_view;
	};
})();
