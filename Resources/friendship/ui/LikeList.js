(function() {
	var MAX_ROW_HEIGHT = 150;
	var lookup = {
		'BOOK':'#b0d3a4', 
		'SHOW':'#c7b0b5',
		'MUSICIAN/BAND':'#c7bbb0',
		'MOVIE':'#ccc399',
		'TV SHOW':'#5c9aa7'
	};
	
	function getTypeColor(type_str)
	{
		var r = lookup[type_str];
		if( r ) return r;
		return '#bbbbbb';
	}
	
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
				description: "Description Description Description. Description Description Description Description Description Description Description Description Description ",
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
			backgroundColor: getTypeColor( key.type ),
			width:'auto',
			textAlign:'left',
			top:2,
			left: profile_icon.width + 2,
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

		var liked_by = Ti.UI.createLabel({
			text: " Friend Bob ",
			font:{fontSize:11,fontWeight:'single'},
			
			//color: 'white',
			//backgroundColor:"#d1d5e0",
			
			color: '#aaaaaa',
			
			width:'auto',
			textAlign:'left',
			top:2,
			height:'auto'
		});

		liked_by.left = 320 - liked_by.width;

		key.description = key.description.replace(/<(?:.|\n)*?>/gm, '');
		if( key.description.indexOf('.') > 0 ){
			key.description = key.description.substr( 0, key.description.indexOf('.') + 1 ) ;
		} 

		var description = Ti.UI.createLabel({
			text:key.description,
			font:{fontSize:12,fontWeight:'single'},
			width:'auto',
			textAlign:'left',
			top: title.top + title.height,
			left:profile_icon.width + 4,
			height:'auto',
			wordWrap:true
		});
		
		var max_height = MAX_ROW_HEIGHT - description.top;
		
		if( description.height > max_height ) description.height = max_height; 
		
		

		row.height = 'auto';
		
		row.add( profile_icon );
		// row.add( thumb_icon );
		row.add(fan_c);
		row.add( title );
		row.add(liked_by);
		row.add( item_type );
		row.add( description );

		
		return row;
	};
	
	function sortLikeIDsByTime(a, b) { // TODO: deprecated
  		return ((a.time > b.time) ? -1 : ((a.time < b.time) ? 1 : 0));
	};
	
	fs.ui.createLikeList = function() {
		var ll_view = Ti.UI.createTableView();
		ll_view.maxRowHeight = MAX_ROW_HEIGHT;
		
		var loading = fs.ui.createLoadingView();
		ll_view.add(loading);
		
		add_test_data( ll_view );
		
		//Ti.App.fireEvent('app:show.loader');
		
		Ti.API.addEventListener("processFriendIDs", function(e) {
			fs.data.friends = e.data;
			fs.core.queryAllFriendLikeIDsFQL();
		});
				
		Ti.API.addEventListener("processLikeIDs", function(e) {
			fs.data.likeIDs = Array();
            fs.data.reverseChronoLikedIDs = Array();

			for ( key in e.data ) {
				pid = e.data[key].page_id + '';
				tm = e.data[key].created_time;
				uid = e.data[key].uid;
				
				if (pid in fs.data.likeIDs) {
					fs.data.likeIDs[pid].count += 1;
					
					if (tm >= fs.data.likeIDs[pid].time) {
						fs.data.likeIDs[pid].time = tm;
						fs.data.likeIDs[pid].uid = uid;
					}
				} else {
					fs.data.likeIDs[pid] = {count: 1, time: tm, uid: uid};
				}
			}

			if (e.data.length > 0) {			
				var tuples = [];
	
				for (var key in fs.data.likeIDs) {
					tuples.push([key, fs.data.likeIDs[key]]);
				}
				tuples.sort(function(a, b) {
	    			a = a[1].time;
	    			b = b[1].time;
	    			return a < b ? 1 : (a > b ? -1 : 0);
				});
	
				for (var i = 0; i < tuples.length; i++) {
					fs.data.reverseChronoLikedIDs.push(tuples[i][0]);
					//Ti.API.info(tuples[i][0] + ' ' + tuples[i][1].time);
	   			}
	   			fs.data.numLikesFetched = 0;
	   			
	   			ll_view.footerTitle = "0 / " + fs.data.reverseChronoLikedIDs.length + " loaded";
	   			
	   			fs.core.fetchMoreLikes(fs.data.NUM_LIKES_PER_FETCH);
	   		} else {
	   			ll_view.footerTitle = "0 / 0 loaded";
				Ti.App.fireEvent('app:hide.loader');
	   		} 
		});
				
		Ti.API.addEventListener("processLikes", function(e) {
			for ( key in e.data ) {
				fs.data.numLikesFetched++;
				ll_view.appendRow(create_row(e.data[key]));
			}
			
  			ll_view.footerTitle = fs.data.numLikesFetched + " / " + fs.data.reverseChronoLikedIDs.length + " loaded";
			/*
			if (fs.data.numLikesFetched < fs.data.reverseChronoLikedIDs.length) {
				fs.core.fetchMoreLikes(fs.data.NUM_LIKES_PER_FETCH);
			}
			*/
			// TODO: when UI scrolls to bottom, can call this (might need mutex)
			Ti.App.fireEvent('app:hide.loader');
		});
		
		ll_view.addEventListener("scrollEnd", function(e) {
			Ti.API.info("scroll ended");
			Ti.API.info(e.contentOffset);
		});
				
		return ll_view;
	};
	
	fs.ui.refreshLikeList = function(e) {
		if (Ti.Facebook.loggedIn) {
			Ti.App.fireEvent('app:show.loader');
			fs.core.queryAllFriendLikeIDsFQL(); // TODO: switch to friend_ids version of query
		}
	};
})();
