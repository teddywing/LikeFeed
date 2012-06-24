(function() {
	fs.core.queryFQL = function(fqlQuery, fqlCallback) {
		var fqlURL = "fql?q=" + fqlQuery.replace(/ /g, "+");
		Ti.API.info("https://graph.facebook.com/" + fqlURL);
		Ti.Facebook.requestWithGraphPath(fqlURL, {}, 'GET', fqlCallback);
	};
	
	fs.core.handleFQLResponse = function(response, eventName) {
		if (response.success) {
			var data = JSON.parse(response.result);
			Ti.API.fireEvent(eventName, {data: data});
		} else if (response.error) {
			Ti.API.fireEvent("processFQLError", {what: response.error}); // TODO: add event listener to processFQLError and print the .what field
		} else {
			Ti.API.fireEvent("processFQLError", {what: "unrecognized query response"});
		}
	}; // TODO: find some way to handle timeout (via Ti.Facebook....)

	fs.core.handleFriendIDsFQLResponse = function (result) { fs.core.handleFQLResponse(result, "processFriendIDs"); };
	fs.core.queryFriendIDsFQL = function() {
		var query = "SELECT uid, name, pic_square FROM user WHERE uid IN (SELECT uid2 FROM friend WHERE uid1 = " + Ti.Facebook.uid + ")"
		Ti.Facebook.request('fql.query', {query: query}, fs.core.handleFriendIDsFQLResponse);
	};

	fs.core.handleLikeIDsFQLResponse = function (result) { fs.core.handleFQLResponse(result, "processLikeIDs"); };
	fs.core.queryLikeIDsFQL = function(friend_ids) {
		var query = "SELECT page_id, created_time FROM page_fan WHERE uid IN (" + friend_ids.join() + ")";
		Ti.Facebook.request('fql.query', {query: query}, fs.core.handleLikeIDsFQLResponse);
	};
	
	fs.core.handleAllFriendLikeIDsFQLResponse = function (result) { fs.core.handleFQLResponse(result, "processLikeIDs"); };
	fs.core.queryAllFriendLikeIDsFQL = function() {
		var query = "SELECT page_id, created_time FROM page_fan WHERE uid IN (SELECT uid2 FROM friend WHERE uid1 = " + Ti.Facebook.uid + ")";
		Ti.Facebook.request('fql.query', {query: query}, fs.core.handleAllFriendLikeIDsFQLResponse);
	};
	
	fs.core.handleLikesFQLResponse = function (result) { fs.core.handleFQLResponse(result, "processLikes"); };
	fs.core.queryLikesFQL = function(page_ids) {
		//var query = "SELECT page_id, name, description, page_url, pic_square, fan_count, type, website, general_info ";
		//query += "FROM page WHERE page_id ";
		//query += "IN (SELECT page_id FROM page_fan WHERE uid ";
		//query += "IN (SELECT uid2 FROM friend WHERE uid1 = " + Titanium.Facebook.uid + "))";
		//query += " limit 20";
		var query = "SELECT page_id, name, description, page_url, pic_square, fan_count, type, website, general_info ";
		query += "FROM page WHERE page_id IN (" + page_ids.join() + ")";
		Ti.Facebook.request('fql.query', {query: query}, fs.core.handleLikesFQLResponse);
	};
})();
