Ti.include('/friendship/friendship.js');

fs.app.mainTabGroup = fs.ui.createApplicationTabGroup();

function output_log( str )
{
	Ti.API.info( str );
}
output_log( "created a file");

// Login switch
if (Ti.Facebook.loggedIn) {
	fs.app.mainTabGroup.open();
}
else {
	fs.ui.loginWindow = fs.ui.createLoginWindow();
	fs.ui.loginWindow.open();
}
