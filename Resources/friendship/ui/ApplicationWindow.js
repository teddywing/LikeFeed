(function() {
	fs.ui.createApplicationTabGroup = function() {
		var tab_group = Ti.UI.createTabGroup();
		Ti.UI.currentTabGroup = tab_group;
		
		var login_button = Ti.Facebook.createLoginButton();
		var refresh_button = Ti.UI.createButton({
			image: 'images/refresh.png',
			width: 10.0,
			height: 10.0,
		}); // TODO: figure out how to resize buttons
		refresh_button.addEventListener('click', fs.ui.refreshLikeList);
		
		var win = Ti.UI.createWindow({
			//title: 'FriendShip',
    		tabBarHidden: true,
    		leftNavButton: refresh_button,
    		rightNavButton: login_button, // TODO: remove before deployment
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
