(function() {
	function createFBLoginButton () {
		// Don't forget to set your appid and requested permissions, else the login button
		// won't be effective.
		
		Ti.Facebook.addEventListener('login', function(e) {
			if (e.success) {
				fs.app.mainTabGroup.open();
				Ti.App.fireEvent("refreshAllData");
			} else {
				alert('Could not log into Facebook');
			}
		});
		Ti.Facebook.addEventListener('logout', function(e) {
			alert('Logged out');
		});
		
		// add the button.  Note that it doesn't need a click event or anything.
		return Ti.Facebook.createLoginButton({
			top: 300,
			style: 'wide'
		});
	};
	
	fs.ui.createLoginWindow = function() {
		var tab_group = Ti.UI.createTabGroup();
		var win = Ti.UI.createWindow({
			navBarHidden: true,
			tabBarHidden: true,
			backgroundColor: fs.ui.styles.navBarColour
		});
		
		var icon = Ti.UI.createImageView({
			image:"images/SphnxLogo300.png",
			width:225,
			height:225,
			left: 'auto',
			top: 38
		});
		
		var view = Ti.UI.createView({
			backgroundColor: fs.ui.styles.navBarColour
		});
		
		var tab = Ti.UI.createTab({
			window: win
		});
		tab_group.addTab(tab);
		
		view.add(createFBLoginButton());
		view.add(icon);
		win.add(view);
		
		return tab_group;
	};

})();
