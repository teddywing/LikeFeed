(function() {
	fs.data = {};
	fs.data.friends = Array();
	fs.data.likeIDs = Array();
	fs.data.reverseChronoLikedIDs = Array();
	fs.data.numLikesFetched = 0;
	fs.data.NUM_LIKES_PER_FETCH = 20;
	fs.data.isQueryingMore = false;
})();