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

	fs.core.handleAllFriendPostsFQLResponse = function (result) { fs.core.handleFQLResponse(result, "processPosts"); };
	fs.core.queryAllFriendPostsFQL = function() { // TODO: make a variant that takes in user list and other filter info
		var query = "SELECT page_id, name, description, page_url, pic_square, fan_count, type, website, general_info ";
		query += "FROM page WHERE page_id ";
		query += "IN (SELECT page_id FROM page_fan WHERE uid ";
		//query += "= " + Ti.Facebook.uid + ")";
		query += "IN (SELECT uid2 FROM friend WHERE uid1 = " + Titanium.Facebook.uid + "))";
		query += " limit 20"; // TODO: remove the limit
		Ti.API.info(query); // TODO: remove debug printout
		Ti.Facebook.request('fql.query', {query: query}, fs.core.handleAllFriendPostsFQLResponse);
	};	
})();
