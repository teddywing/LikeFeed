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
		// Reason for Factory: templating format of the row
		var row = Ti.UI.createTableViewRow(/*{
			hasChild: true // messes up the layout currently. Try later.
		}*/);

		row.addEventListener('click', function(e) {
			Ti.UI.currentTabGroup.activeTab.open(fs.ui.createWebViewWin({
				title: key.name,
				url: key.page_url
			}));
		});
		
		var profile_icon = Ti.UI.createImageView({
			image:key.pic_square,
			width:50,
			height:50,
			left:5,
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
			left: 5,
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
			left: profile_icon.width + 12,
			height:'auto'
		});
		 
		var title = Ti.UI.createLabel({
			text:key.name,
			font:{fontSize:16,fontWeight:'bold'},
			width:'auto',
			textAlign:'left',
			top:item_type.height + 2,
			left: profile_icon.width + 14,
			height:18,
			wordWrap:false
		});

		var liked_by = Ti.UI.createLabel({
			text: key.friend_name,
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
			font:{fontSize:14,fontWeight:'single'},
			height: 15,
			width:'auto',
			textAlign:'left',
			top: title.top + title.height,
			left:profile_icon.width + 14,
			height:'auto',
			wordWrap:true
		});
		
		var max_height = MAX_ROW_HEIGHT - description.top;
		
		if( description.height > max_height ) description.height = max_height; 
		
		
		var item_view = Ti.UI.createView({
			height: 'auto',
			top: 5,
			bottom: 5
		});

		row.height = 'auto';
		
		item_view.add( profile_icon );
		// row.add( thumb_icon );
		item_view.add(fan_c);
		item_view.add( title );
		item_view.add(liked_by);
		item_view.add( item_type );
		item_view.add( description );
		
		row.add(item_view);
		
		return row;
	};

	
	function friend_name_from_uid(uid) {
		var result = "???";
		if (uid.toString() in fs.data.friends) {
			result = fs.data.friends[uid.toString()].name;
		}
		return result;
	};
	
	fs.ui.createLikeList = function() {
		var ll_view = Ti.UI.createTableView();
		ll_view.maxRowHeight = MAX_ROW_HEIGHT;
		
		var loading = fs.ui.createLoadingView();
		ll_view.add(loading);
		
		//add_test_data( ll_view );
		
		//Ti.App.fireEvent('app:show.loader');
		
		Ti.API.addEventListener("processFriendIDs", function(e) {
			fs.data.friends = Array();
			for (var i = 0; i < e.data.length; i++) {
				fs.data.friends[e.data[i].uid.toString()] = {uid: e.data[i].uid, pic: e.data[i].pic_square, name: e.data[i].name, selected: true};
			}
			
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

			ll_view.setData(Array());
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
					fs.data.reverseChronoLikedIDs.push({pid: tuples[i][0], count: tuples[i][1].count, time: tuples[i][1].time, uid: tuples[i][1].uid});
	   			}
	   			fs.data.numLikesFetched = 0;
	   			
	   			ll_view.footerTitle = "0 / " + fs.data.reverseChronoLikedIDs.length + " loaded";
	   			
	   			fs.data.isQueryingMore = true;
	   			fs.core.fetchMoreLikes(fs.data.NUM_LIKES_PER_FETCH);
	   		} else {
	   			fs.data.isQueryingMore = false;
	   			ll_view.footerTitle = "0 / 0 loaded";
				Ti.App.fireEvent('app:hide.loader');
	   		} 
		});
				
		Ti.API.addEventListener("processLikes", function(e) {
			for ( key in e.data ) {
				
				e.data[key].more = fs.data.reverseChronoLikedIDs[fs.data.numLikesFetched];
				e.data[key].friend_name = friend_name_from_uid(e.data[key].more.uid);		
				fs.data.numLikesFetched++;
				ll_view.appendRow(create_row(e.data[key]));
			}
			
  			ll_view.footerTitle = fs.data.numLikesFetched + " / " + fs.data.reverseChronoLikedIDs.length + " loaded";
  			fs.data.isQueryingMore = false;

			Ti.App.fireEvent('app:hide.loader');
		});
		
		ll_view.addEventListener("scroll", function(e) {
			if (fs.app.isAndroid && (e.totalItemCount < e.firstVisibleItem + e.visibleItemCount + 3)
            		|| (!fs.app.isAndroid && (e.contentOffset.y + e.size.height + 100 > e.contentSize.height))) {
        		if (fs.data.numLikesFetched < fs.data.reverseChronoLikedIDs.length) {
        			if (!fs.data.isQueryingMore) {
            			fs.data.isQueryingMore = true;
						fs.core.fetchMoreLikes(fs.data.NUM_LIKES_PER_FETCH);
        			}
        		} else {
        			fs.data.isQueryingMore = false;
        		}
            }
	    });
				
		return ll_view;
	};
	
	fs.ui.refreshAllFriendsLikeList = function(e) {
		if (Ti.Facebook.loggedIn) {
			Ti.App.fireEvent('app:show.loader');
			fs.core.queryFriendIDsFQL();
		}
	};

	fs.ui.refreshLikeList = function(friend_ids) {
		if (Ti.Facebook.loggedIn) {
			Ti.App.fireEvent('app:show.loader');
			fs.core.queryLikeIDsFQL(friend_ids);
		}
	};
})();
