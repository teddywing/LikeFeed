(function() {
	fs.ui.createLikeList = function() {
		var ll_view = Ti.UI.createTableView();
		
		ll_view.addEventListener('click', function(e) {
			Ti.UI.currentTabGroup.activeTab.open(fs.ui.createWebViewWin({
				title: e.title,
				url: e.url
			}));
		});
		
		return ll_view;
	};
})();
