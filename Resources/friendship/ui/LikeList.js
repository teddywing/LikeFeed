(function() {
	function create_row( title )
	{
		// Reason for Factory: templating format of the row
		var row = Ti.UI.createTableViewRow();
		
		var profile_icon = Ti.UI.createImageView({
			url:"images/fb_test_profile.jpg",
			width:50,
			height:50,
			left:0,
			top:0
		});

		var content = Ti.UI.createLabel({
			text:title,
			font:{fontSize:12,fontWeight:'bold'},
			width:'auto',
			textAlign:'left',
			top:2,
			left:52,
			height:26
		});

		row.height = 50;
		
		row.add( profile_icon );
		row.add( content );
		
		return row;
	}
	
	fs.ui.addItems = function( items )
	{
		for( item in items ){
			Ti.API.info( item );
		} 
		
	}
	
	fs.ui.createLikeList = function() {
		var ll_view = Ti.UI.createTableView();
		
		ll_view.addEventListener('click', function(e) {
			Ti.UI.currentTabGroup.activeTab.open(fs.ui.createWebViewWin({
				title: e.title,
				url: e.url
			}));
		});
		
		ll_view.appendRow( create_row( 'OMG, I like totally like Skrillex.') );
		ll_view.appendRow( create_row( 'Seriously, this is amazing.  You totally need to party.') );
		
		Ti.API.addEventListener( "processPosts", fs.ui.addItems );
		
		return ll_view;
	};
 })();
