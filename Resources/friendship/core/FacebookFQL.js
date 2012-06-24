(function() {
	fs.core.queryFQL = function(fqlQuery, fqlCallback) {
		var fqlURL = "fql?q=" + fqlQuery.replace(/ /g, "+");
		Ti.API.info("https://graph.facebook.com/" + fqlURL);
		Ti.Facebook.requestWithGraphPath(fqlURL, {}, 'GET', fqlCallback);
	};
	
	fs.core.queryAllFriendPostsFQL = function() {
		var query = "SELECT page_id, name, description, page_url, pic_square, fan_count, type, website, general_info ";
		query += "FROM page WHERE page_id ";
		query += "IN (SELECT page_id FROM page_fan WHERE uid ";
		//query += "= " + Ti.Facebook.uid + ")";
		query += "IN (SELECT uid2 FROM friend WHERE uid1 = " + Titanium.Facebook.uid + "))";
		//query += "order by last_name limit 20";
		Ti.Facebook.request('fql.query', {query: query}, fs.core.handleAllFriendPostsFQL);
		// TODO: after calling this fn, display the loading animation
	};
	
	/*
	fs.core.handleFQLResponse = function(callback) {
	};
	*/
	
	fs.core.handleAllFriendPostsFQL = function(result) {
		if (result.success) {
			var postsList = JSON.parse(result.result);
			Ti.API.fireEvent("processPosts", postsList);
			/*
			Ti.API.info(postsList.length);
			Ti.API.info(postsList[0].name);
			Ti.API.info(postsList[0].page_id);
			Ti.API.info(postsList[0].website);
			*/
		} else if (result.error) {
			//Ti.API.info("ERROR: " + result.error); // TODO: remove
			Ti.API.fireEvent("processFQLError", {what:result.error});
		} else {
			//Ti.API.info("ERROR: unknown response from FQL query"); // TODO: remove
			Ti.API.fireEvent("processFQLError", {what:"unknown FQL response"});
		}
	}; // TODO: handle timeouts
	
})();
