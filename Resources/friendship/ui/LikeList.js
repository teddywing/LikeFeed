(function() {
	function addCommas(nStr)
	{
	  nStr += '';
	  x = nStr.split('.');
	  x1 = x[0];
	  x2 = x.length > 1 ? '.' + x[1] : '';
	  var rgx = /(\d+)(\d{3})/;
	  while (rgx.test(x1)) {
	    x1 = x1.replace(rgx, '$1' + ',' + '$2');
	  }
	  return x1 + x2;
	}

	function add_test_data(ll_view)
	{
		ll_view.appendRow( 
			create_row( {
				pic_square: "images/fb_test_profile.jpg",
				name: "Test Name",
				description: "Description Description Description Description Description Description Description Description Description Description Description Description ",
				fan_count: "1000000000000000", 
				page_url: "http://www.google.com",
				website: "http://www.google.com",
				type: "SHOW"
			} ) 
		);
		
		ll_view.appendRow( 
			create_row( {
				pic_square: "images/fb_test_profile.jpg",
				name: "Test Name",
				description: "Description Description Description Description Description Description Description Description Description Description Description Description ",
				fan_count: "2", 
				page_url: "http://www.google.com",
				website: "http://www.google.com",
				type: "BOOK"
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
			text: addCommas( (key.fan_count >= 10000000) ? Math.round((key.fan_count / 1000000)) + 'M' : key.fan_count ),
			font:{fontSize:10,fontWeight:'bold'},
			//color:'#3b5997',
			color:'white',
			backgroundColor:'black',
			width:50,
			textAlign:'right',
			top: 0,
			opacity:0.65,
			left: 0,
			height:'12'
		});
		fan_c.top = 50-fan_c.height;

		if( fan_c.width < 10 ) fan_c.width = 10;


		var item_type = Ti.UI.createLabel({
			text: " " + key.type + " ",
			font:{fontSize:11,fontWeight:'single'},
			color:'white',
			backgroundColor: '#b0d3a4',
			width:'auto',
			textAlign:'left',
			top:2,
			left: profile_icon.width + 2,
			height:'auto'
		});

		var liked_by = Ti.UI.createLabel({
			text: " Friend Bob ",
			font:{fontSize:11,fontWeight:'bold'},
			color: 'white',
			backgroundColor:"#d1d5e0",
			width:'auto',
			textAlign:'left',
			top:2,
			left: item_type.left + item_type.width + 2,
			height:'auto'
		});
		
		var title = Ti.UI.createLabel({
			text:key.name,
			font:{fontSize:12,fontWeight:'bold'},
			width:'auto',
			textAlign:'left',
			top:item_type.height + 2,
			left: profile_icon.width + 4,
			height:'auto',
			wordWrap:'true'
		});


		key.description = key.description.replace(/<(?:.|\n)*?>/gm, '');

		var description = Ti.UI.createLabel({
			text:key.description,
			font:{fontSize:12,fontWeight:'single'},
			width:'auto',
			textAlign:'left',
			top: title.top + title.height-5,
			left:profile_icon.width + 4
		});
		
		

		row.height = 50;
		
		row.add( profile_icon );
		// row.add( thumb_icon );
		row.add(fan_c);
		row.add( title );
		row.add(liked_by);
		row.add( item_type );
		row.add( description );
		
		return row;
	}
	
	fs.ui.createLikeList = function() {
		var ll_view = Ti.UI.createTableView();
		
		var loading = fs.ui.createLoadingView();
		ll_view.add(loading);
		
		add_test_data( ll_view );
		
		//Ti.App.fireEvent('app:show.loader');
		
		Ti.API.addEventListener("processPosts", function(d) {
			for ( key in d.data ) {
				ll_view.appendRow( create_row( d.data[key] ) );
			}
			
			Ti.App.fireEvent('app:hide.loader');
		});
				
		return ll_view;
	};
	
	fs.ui.refreshLikeList = function(e) {
		if (Ti.Facebook.loggedIn) {
			Ti.App.fireEvent('app:show.loader');
			fs.core.queryAllFriendPostsFQL();
		} else {
			Ti.Facebook.fireEvent('login');
		}
	};
})();
