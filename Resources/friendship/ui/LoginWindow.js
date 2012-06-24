(function() {
	function createFBLoginButton () {
		// Don't forget to set your appid and requested permissions, else the login button
		// won't be effective.
		
		Titanium.Facebook.addEventListener('login', function(e) {
			if (e.success) {
				fs.app.mainTabGroup.open();
			}
		});
		Titanium.Facebook.addEventListener('logout', function(e) {
			alert('Logged out');
		});
		
		// add the button.  Note that it doesn't need a click event or anything.
		return Titanium.Facebook.createLoginButton({
			top: 50,
			style: 'wide'
		});
	};
	
	fs.ui.createLoginWindow = function() {
		var tab_group = Ti.UI.createTabGroup();
		var win = Ti.UI.createWindow({
			title: 'FriendShip',
			tabBarHidden: true
		});
		var view = Ti.UI.createView({
			backgroundColor: '#fff'
		});
		
		var tab = Ti.UI.createTab({
			window: win
		});
		tab_group.addTab(tab);
		
		view.add(createFBLoginButton());
		win.add(view);
		
		return tab_group;
	}
	
})();
