(function() {
	fs.ui.createApplicationTabGroup = function() {
		var tab_group = Ti.UI.createTabGroup();
		Ti.UI.currentTabGroup = tab_group;
		
		var refresh_button = Ti.UI.createButton({
			image: 'images/refresh.png',
			height: 5
		});
		refresh_button.addEventListener('click', fs.ui.refreshLikeList);
		
		var win = Ti.UI.createWindow({
			//title: 'FriendShip',
    		tabBarHidden: true,
    		leftNavButton: refresh_button
		});
		var loading = fs.ui.createLoadingView();
		win.add(loading);
		
		var tab = Titanium.UI.createTab({  
    		icon:'KS_nav_views.png',
    		title:'Likes',
    		window: win
		});
		
		win.add(fs.ui.createLikeList());
		fs.ui.refreshLikeList();
		tab_group.addTab(tab);
		
		return tab_group;
	};
})();
