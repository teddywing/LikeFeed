(function() {
	fs.core.queryFQL = function(fqlQuery, fqlCallback) {
		var fqlURL = "fql?q=" + fqlQuery.replace(/ /g, "+");
		//Ti.API.info("https://graph.facebook.com/" + fqlURL);
		Ti.Facebook.requestWithGraphPath(fqlURL, {}, 'GET', fqlCallback);
	};
	
	fs.core.handleFQLResponse = function(response, eventName) {
		if (response.success) {
			//Ti.API.info(eventName + ": FQL response: got " + response.result.length + " Bytes");
			if (response.result.length < 100) {
				//Ti.API.info("> " + response.result);
			}
			var data = JSON.parse(response.result);
			//Ti.API.info(eventName + ": FQL response: parsed " + data.length + " entries");
			Ti.App.fireEvent(eventName, {data: data});
		} else if (response.error) {
			//Ti.API.info(eventName + ": FQL response error: " + response.error);
			Ti.App.fireEvent("processFQLError", {what: response.error});
		} else {
			//Ti.API.info(eventName + ": FQL response error: UNKNOWN");
			Ti.App.fireEvent("processFQLError", {what: "unrecognized query response"});
		}
	}; // LATER: find some way to handle timeout (via Ti.Facebook....)

	fs.core.handleFriendIDsFQLResponse = function (result) { fs.core.handleFQLResponse(result, "processFriendIDs"); };
	fs.core.queryFriendIDsFQL = function() {
		////Ti.API.info("calling queryFriendIDsFQL");
		var query = "SELECT uid, name, pic_square FROM user WHERE uid IN (SELECT uid2 FROM friend WHERE uid1 = " + Ti.Facebook.uid + ")"
		Ti.Facebook.request('fql.query', {query: query}, fs.core.handleFriendIDsFQLResponse);
	};

	fs.core.handleLikeIDsFQLResponse = function (result) { fs.core.handleFQLResponse(result, "processLikeIDs"); };
	fs.core.queryLikeIDsFQL = function(friend_ids) {
		//Ti.API.info("calling queryLikeIDsFQL:");
		var query = "SELECT page_id, created_time, uid FROM page_fan WHERE uid IN (" + friend_ids.join() + ")";
		//Ti.API.info(query);
		Ti.Facebook.request('fql.query', {query: query}, fs.core.handleLikeIDsFQLResponse);
	};
	
	fs.core.handleAllFriendLikeIDsFQLResponse = function (result) { fs.core.handleFQLResponse(result, "processLikeIDs"); };
	fs.core.queryAllFriendLikeIDsFQL = function() {
		//Ti.API.info("calling queryAllFriendLikeIDsFQL");
		var query = "SELECT page_id, created_time, uid FROM page_fan WHERE uid IN (SELECT uid2 FROM friend WHERE uid1 = " + Ti.Facebook.uid + ")";
		Ti.Facebook.request('fql.query', {query: query}, fs.core.handleAllFriendLikeIDsFQLResponse);
	};
	
	fs.core.handleLikesFQLResponse = function (result) { fs.core.handleFQLResponse(result, "processLikes"); };
	fs.core.queryLikesFQL = function(page_ids) {
		//Ti.API.info("calling queryLikesFQL");
		
		//var query = "SELECT page_id, name, description, page_url, pic_square, fan_count, type, website, general_info ";
		//query += "FROM page WHERE page_id ";
		//query += "IN (SELECT page_id FROM page_fan WHERE uid ";
		//query += "IN (SELECT uid2 FROM friend WHERE uid1 = " + Titanium.Facebook.uid + "))";
		//query += " limit 20";
		var query = "SELECT page_id, name, description, page_url, pic_square, fan_count, type, website, general_info ";
		query += "FROM page WHERE page_id IN (" + page_ids.join() + ")";
		Ti.Facebook.request('fql.query', {query: query}, fs.core.handleLikesFQLResponse);
	};
	
	fs.core.fetchMoreLikes = function(numLikesMore) {
		numLikesMore = Math.min((fs.data.reverseChronoLikedIDs.length - fs.data.numLikesFetched), numLikesMore);
		//Ti.API.info("calling fetchMoreLikes: fetching more = " + numLikesMore + ", currently have: " + fs.data.numLikesFetched + ", total: " + fs.data.reverseChronoLikedIDs.length);
		page_ids = Array();
		for (var i = fs.data.numLikesFetched; i < fs.data.numLikesFetched + numLikesMore; i++) {
			page_ids.push(fs.data.reverseChronoLikedIDs[i].pid);
		}
		fs.core.queryLikesFQL(page_ids);
	};
	
})();
