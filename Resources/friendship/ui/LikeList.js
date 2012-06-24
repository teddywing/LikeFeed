(function() {
	function add_test_data(ll_view)
	{
		ll_view.appendRow( 
			create_row( {
				pic_square: "images/fb_test_profile.jpg",
				name: "Test Name",
				description: "Description Description Description Description Description Description Description Description Description Description Description Description ",
				fan_count: "15", 
				page_url: "http://www.google.com",
				website: "http://www.google.com"
			} ) 
		);
		
		ll_view.appendRow( 
			create_row( {
				pic_square: "images/fb_test_profile.jpg",
				name: "Test Name",
				description: "Description Description Description Description Description Description Description Description Description Description Description Description ",
				fan_count: "2", 
				page_url: "http://www.google.com",
				website: "http://www.google.com"
			} ) 
		);		
	}
	
	function create_row( key )
	{
		// Ti.UI.createAlertDialog( {title:"key " + key.name} ).show();

		// Reason for Factory: templating format of the row
		var row = Ti.UI.createTableViewRow();

		row.addEventListener('click', function(e) {
			Ti.UI.currentTabGroup.activeTab.open(fs.ui.createWebViewWin({
				title: key.name,
				url: key.page_url
			}));
		});
		
			/*		
			fan_count
			page_url
			website
			*/

		var profile_icon = Ti.UI.createImageView({
			image:key.pic_square,
			width:50,
			height:50,
			left:0,
			top:0
		});

		var thumb_icon = Ti.UI.createImageView({
			image:"images/thumbup.png",
			width:15,
			height:15,
			left:profile_icon.width + 2,
			top:2
		});
		
		var fan_c = Ti.UI.createLabel({
			text: key.fan_count,
			font:{fontSize:10,fontWeight:'bold'},
			color:'#3b5997',
			//backgroundColor:'lightblue',
			width:'auto',
			textAlign:'center',
			top:2,
			left:thumb_icon.left + thumb_icon.width + 2,
			height:'auto'
		});

		if( fan_c.width < 10 ) fan_c.width = 10;

		var title = Ti.UI.createLabel({
			text:key.name,
			font:{fontSize:12,fontWeight:'bold'},
			width:'auto',
			textAlign:'left',
			top:2,
			left:fan_c.left + fan_c.width + 2,
			height:'auto',
			wordWrap:'true'
		});

		var description = Ti.UI.createLabel({
			text:key.description,
			font:{fontSize:12,fontWeight:'single'},
			width:'auto',
			textAlign:'left',
			top: title.height,
			left:profile_icon.width + 2,
			height:36,
			wordWrap:'true',
			html:true
		});
		
		

		row.height = 50;
		
		row.add( profile_icon );
		row.add( thumb_icon );
		row.add(fan_c);
		row.add( title );
		row.add( description );
		
		return row;
	}
	
	fs.ui.createLikeList = function() {
		var ll_view = Ti.UI.createTableView();
		/*
		ll_view.addEventListener('click', function(e) {
			Ti.UI.currentTabGroup.activeTab.open(fs.ui.createWebViewWin({
				title: e.title,
				url: e.url
			}));
		});
		*/

		// add_test_data( ll_view );
		
		
		Ti.API.addEventListener( "processPosts", function( list ) {
			if( list.list.length == 0 )
				Ti.UI.createAlertDialog( {title:"Sorry, but the request returned 0 items."} ).show();
			for ( key in list.list ) {
				ll_view.appendRow( create_row( list.list[key] ) );
			}
		});
		
		return ll_view;
	};
 })();
