(function() {
	fs.ui.friendSelectorButton = function() {
		var button = Ti.UI.createButton({
			image: 'images/friends.png'
		});
		
		button.addEventListener('click', function() {
			fs.ui.createFriendSelector().open();
		});
		
		return button;
	};
	
	fs.ui.createFriendSelector = function() {
		var done_button = Ti.UI.createButton({
			title: 'Done',
			style: Titanium.UI.iPhone.SystemButtonStyle.DONE
		});
		
		var win = Ti.UI.createWindow({
			title: 'Filter Friends',
			barColor: fs.ui.styles.navBarColour,
			modal: true,
			rightNavButton: done_button
		});
		
		done_button.addEventListener('click', function() {
			var friend_ids = Array();
			for (key in fs.data.friends) {
				if (fs.data.friends[key].selected) {
					friend_ids.push(fs.data.friends[key].uid);
				}
			}
			if (friend_ids.length > 0) {
				fs.ui.refreshLikeList(friend_ids);
			}
					
			win.close();
		});
		
		friend_table = Ti.UI.createTableView();
		
		var friends = [];
	
		for (var key in fs.data.friends) {
			friends.push(fs.data.friends[key]);
		}
		friends.sort(function(a, b) {
	    	a = a.name;
	    	b = b.name;
	    	return a > b ? 1 : (a < b ? -1 : 0);
		});
		
		for (var i = 0; i < friends.length; i++) {
			var row = Ti.UI.createTableViewRow({
				selectionStyle: 'none'
			});
			var name = Ti.UI.createLabel({
				text: friends[i].name,
				font: {fontSize: 16, fontWeight: 'bold'},
				left: 45
			});
			var avatar = Ti.UI.createImageView({
				image: friends[i].pic,
				height: 35,
				width: 35,
				left: 5
			});
			var switch_button = Ti.UI.createSwitch({
				right: 5,
				value: fs.data.friends[friends[i].uid.toString()].selected,
				SP_uidString: friends[i].uid.toString(),
			});
			switch_button.addEventListener("change", function(e) {
				fs.data.friends[this.SP_uidString].selected = e.value;
			});
			
			row.add(avatar);
			row.add(name);
			row.add(switch_button);
			
			friend_table.appendRow(row);
		}
		
		win.add(friend_table);
		
		return win;
	};
})();
