// this sets the background color of the master UIView (when there are no windows/tab groups on it)
Titanium.UI.setBackgroundColor('#000');

// create tab group
var tabGroup = Titanium.UI.createTabGroup();


//
// create base UI tab and root window
//
var win1 = Titanium.UI.createWindow({  
    title:'Tab 1',
    backgroundColor:'#fff'
});
var tab1 = Titanium.UI.createTab({  
    icon:'KS_nav_views.png',
    title:'Tab 1',
    window:win1
});

var label1 = Titanium.UI.createLabel({
	color:'#999',
	text:'I am Window 1',
	font:{fontSize:20,fontFamily:'Helvetica Neue'},
	textAlign:'center',
	width:'auto'
});

// Don't forget to set your appid and requested permissions, else the login button
// won't be effective.
Titanium.Facebook.appid = '258369447595838';
Titanium.Facebook.permissions = ['publish_stream'];
Titanium.Facebook.addEventListener('login', function(e) {
    if (e.success) {
        alert('Logged in');
    }
});
Titanium.Facebook.addEventListener('logout', function(e) {
    alert('Logged out');
});

// add the button.  Note that it doesn't need a click event or anything.
var fb_button = Titanium.Facebook.createLoginButton({ top: 50, style: 'wide' });
//Titanium.UI.currentWindow.add();

win1.add(label1);
win1.add(fb_button); 

//
// create controls tab and root window
//
var win2 = Titanium.UI.createWindow({  
    title:'Tab 2',
    backgroundColor:'#fff'
});
var tab2 = Titanium.UI.createTab({  
    icon:'KS_nav_ui.png',
    title:'Tab 2',
    window:win2
});

var label2 = Titanium.UI.createLabel({
	color:'#999',
	text:'I am Window 2',
	font:{fontSize:20,fontFamily:'Helvetica Neue'},
	textAlign:'center',
	width:'auto'
});

win2.add(label2);



//
//  add tabs
//
tabGroup.addTab(tab1);  
tabGroup.addTab(tab2);  


// open tab group
tabGroup.open();
