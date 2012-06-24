(function() {
	fs.ui.createApplicationTabGroup = function() {
		var tab_group = Ti.UI.createTabGroup();
		Ti.UI.currentTabGroup = tab_group;
		
//		var login_button = Ti.Facebook.createLoginButton();
		var refresh_button = Ti.UI.createButton({
			image: 'images/refresh.png',
			height: 5
		});
		refresh_button.addEventListener('click', fs.ui.refreshAllFriendsLikeList);
		
		var friend_selector_button = fs.ui.friendSelectorButton();
		
		var win = Ti.UI.createWindow({
			barColor: fs.ui.styles.navBarColour,
			title: 'Sphnx',
    		tabBarHidden: true,
    		leftNavButton: refresh_button,
			rightNavButton: friend_selector_button
		});
		var loading = fs.ui.createLoadingView();
		win.add(loading);
		
		var tab = Titanium.UI.createTab({  
    		icon:'KS_nav_views.png',
    		title:'Likes',
    		window: win
		});
		
		win.add(fs.ui.createLikeList());

		Ti.API.addEventListener("processFQLError", function(e) {
			alert(e.what);
		});
		
		Ti.API.addEventListener("refreshAllData", function(e) {
			if (Ti.Facebook.loggedIn) {
				Ti.App.fireEvent('app:show.loader');
				fs.core.queryFriendIDsFQL();
			}
		})
		Ti.API.fireEvent("refreshAllData");
		
		tab_group.addTab(tab);
		
		return tab_group;
	};
})();
