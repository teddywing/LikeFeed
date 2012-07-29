(function() {
	fs.core.queryFQL = function(fqlQuery, fqlCallback) {
		var fqlURL = "fql?q=" + fqlQuery.replace(/ /g, "+");
		Ti.API.info("https://graph.facebook.com/" + fqlURL);
		Ti.Facebook.requestWithGraphPath(fqlURL, {}, 'GET', fqlCallback);
	};
	
	fs.core.handleFQLResponse = function(response, eventName) {
		Ti.App.fireEvent('app:msg.loader', {text:"Event: " + eventName });
		if (response.success) {
			Ti.API.info(eventName + ": FQL response: got " + response.result.length + " Bytes");
			if (response.result.length < 100) {
				Ti.API.info("> " + response.result);
			}
			var data = JSON.parse(response.result);
			Ti.API.info(eventName + ": FQL response: parsed " + data.length + " entries");
			Ti.App.fireEvent(eventName, {data: data});
		} else if (response.error) {
			Ti.API.info(eventName + ": FQL response error: " + response.error);
			Ti.App.fireEvent("processFQLError", {what: response.error});
		} else {
			Ti.API.info(eventName + ": FQL response error: UNKNOWN");
			Ti.App.fireEvent("processFQLError", {what: "unrecognized query response"});
		}
	}; // LATER: find some way to handle timeout (via Ti.Facebook....)

	// --------------------------------------------
	//          processFriendIDs
	// --------------------------------------------
	fs.core.handleFriendIDsFQLResponse = function (result) { fs.core.handleFQLResponse(result, "processFriendIDs"); };
	fs.core.queryFriendIDsFQL = function() {
		Ti.API.info("calling queryFriendIDsFQL");
		Ti.App.fireEvent('app:msg.loader', {text:"Getting Friend IDs."});

		var query = "SELECT uid, name, pic_square FROM user WHERE uid IN (SELECT uid2 FROM friend WHERE uid1 = " + Ti.Facebook.uid + ")"
		output_log( query );
		Ti.Facebook.request( 'fql.query', {query: query}, fs.core.handleFriendIDsFQLResponse );
	};

	// --------------------------------------------
	//          processLikeIDs
	// --------------------------------------------
	
	fs.core.handleLikeIDsFQLResponse = function (result) { fs.core.handleFQLResponse(result, "processLikeIDs"); };
	fs.core.queryLikeIDsFQL = function(friend_ids) {
		Ti.API.info("calling queryLikeIDsFQL:");
		Ti.App.fireEvent('app:msg.loader', {text:"Pulling likes."});
		var query = "SELECT page_id, created_time, uid FROM page_fan WHERE uid IN (" + friend_ids.join() + ")";
		output_log( query );
		Ti.Facebook.request('fql.query', {query: query}, fs.core.handleLikeIDsFQLResponse);
	};
	
	// --------------------------------------------
	//          processLikeIDs
	// --------------------------------------------

	fs.core.handleAllFriendLikeIDsFQLResponse = function (result) { 
		output_log( result );
		fs.core.handleFQLResponse(result, "processLikeIDs"); 
	};
	fs.core.queryAllFriendLikeIDsFQL = function() {
		Ti.API.info("calling queryAllFriendLikeIDsFQL");
		var ts = Math.round((new Date()).getTime() / 1000);
		ts = ts - 2 * 14 * 24 * 60 * 60;

		Ti.App.fireEvent('app:msg.loader', {text:"Pulling all friends' likes."});

		// BAH!  Why is the result from this query via API different from the result on
		// https://developers.facebook.com/tools/explorer?fql=SELECT%20page_id%2C%20created_time%2C%20uid%20FROM%20page_fan%20WHERE%20uid%20IN%20(SELECT%20uid2%20FROM%20friend%20WHERE%20uid1%20%3D%20me())%20limit%205
		var query = "SELECT page_id, created_time, uid FROM page_fan WHERE uid IN (SELECT uid2 FROM friend WHERE uid1 = me() ) limit 5"; // " + Ti.Facebook.uid + " // and created_time > " + ts;
		output_log( query );
		Ti.Facebook.request('fql.query', {query: query}, fs.core.handleAllFriendLikeIDsFQLResponse);
	};
	
	// --------------------------------------------
	//          processLikes
	// --------------------------------------------
	
	fs.core.handleLikesFQLResponse = function (result) { fs.core.handleFQLResponse(result, "processLikes"); };
	fs.core.queryLikesFQL = function(page_ids) {
		Ti.API.info("calling queryLikesFQL");
		
		//var query = "SELECT page_id, name, description, page_url, pic_square, fan_count, type, website, general_info ";
		//query += "FROM page WHERE page_id ";
		//query += "IN (SELECT page_id FROM page_fan WHERE uid ";
		//query += "IN (SELECT uid2 FROM friend WHERE uid1 = " + Titanium.Facebook.uid + "))";
		//query += " limit 20";
		var query = "SELECT page_id, name, description, page_url, pic_square, fan_count, type, website, general_info ";
		query += "FROM page WHERE page_id IN (" + page_ids.join() + ")";
		output_log( query );
		Ti.Facebook.request('fql.query', {query: query}, fs.core.handleLikesFQLResponse);
	};
	
	// --------------------------------------------
	//          fetchMoreLikes
	// --------------------------------------------

	fs.core.fetchMoreLikes = function(numLikesMore) {
		numLikesMore = Math.min((fs.data.reverseChronoLikedIDs.length - fs.data.numLikesFetched), numLikesMore);
		Ti.API.info("calling fetchMoreLikes: fetching more = " + numLikesMore + ", currently have: " + fs.data.numLikesFetched + ", total: " + fs.data.reverseChronoLikedIDs.length);
		page_ids = Array();
		for (var i = fs.data.numLikesFetched; i < fs.data.numLikesFetched + numLikesMore; i++) {
			page_ids.push(fs.data.reverseChronoLikedIDs[i].pid);
		}
		fs.core.queryLikesFQL(page_ids);
	};
	
})();
