Ti.include('/friendship/friendship.js');

fs.app.mainTabGroup = fs.ui.createApplicationTabGroup();

// Login switch
if (Ti.Facebook.loggedIn) {
	fs.app.mainTabGroup.open();
}
else {
	fs.ui.loginWindow = fs.ui.createLoginWindow();
	fs.ui.loginWindow.open();
}
