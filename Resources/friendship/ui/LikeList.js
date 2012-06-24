(function() {
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
			description
			fan_count
			page_url
			website
			*/

		var profile_icon = Ti.UI.createImageView({
			url:key.pic_square,
			width:50,
			height:50,
			left:0,
			top:0
		});

		var content = Ti.UI.createLabel({
			text:key.name,
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
		
		Ti.API.addEventListener( "processPosts", function( list ) {
			//Ti.UI.createAlertDialog( {title:"Items: " + list.list.length} ).show();
			for ( key in list.list ) {
				ll_view.appendRow( create_row( list.list[key] ) );
			}
		});
		
		return ll_view;
	};
 })();
