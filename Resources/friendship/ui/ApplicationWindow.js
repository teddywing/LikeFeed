(function() {
	fs.ui.createApplicationTabGroup = function() {
		var tab_group = Ti.UI.createTabGroup();
		
		var login_button = Ti.Facebook.createLoginButton({
			top: 50,
			style: 'wide'
		});
		
		var debug_button = Ti.UI.createButton({title: 'Debug'});
		debug_button.addEventListener('click', function(e) {
			Ti.API.info('Logged in: ' + JSON.stringify(Ti.Facebook.loggedIn));
			if (Ti.Facebook.loggedIn) {
				fs.core.queryAllFriendPostsFQL();
			}
		});
		
		var win = Ti.UI.createWindow({
			title: 'FriendShip',
    		tabBarHidden: true,
    		leftNavButton: debug_button,
    		rightNavButton: login_button,
		});
		
		var tab = Titanium.UI.createTab({  
    		icon:'KS_nav_views.png',
    		title:'Likes',
    		window: win
		});
		
		win.add(fs.ui.createLikeList());
		tab_group.addTab(tab);
		
		return tab_group;
	};
})();
