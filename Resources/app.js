Ti.include('/friendship/friendship.js');

Ti.API.info("Running the app - app.js");

fs.app.mainTabGroup = fs.ui.createApplicationTabGroup();

// Login switch
if (Ti.Facebook.loggedIn) {
	fs.app.mainTabGroup.open();
}
else {
	fs.ui.loginWindow = fs.ui.createLoginWindow();
	fs.ui.loginWindow.open();
}
