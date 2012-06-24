(function() {
	fs.ui.createApplicationTabGroup = function() {
		var tab_group = Ti.UI.createTabGroup();
		var win = Ti.UI.createWindow({
			title: 'FriendShip',
    		tabBarHidden: true
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
