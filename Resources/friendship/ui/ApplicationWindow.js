(function() {
	fs.ui.createApplicationTabGroup = function() {
		var tab_group = Ti.UI.createTabGroup();
		Ti.UI.currentTabGroup = tab_group;
		
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
