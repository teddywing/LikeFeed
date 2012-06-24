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
			// Refresh the like list
			
			win.close();
		});
		
		friend_table = Ti.UI.createTableView();
		
		// Sort friends list alphabetically
		//
		
		for (var i = 0; i < fs.data.friends.length; i++) {
			var row = Ti.UI.createTableViewRow({
				selectionStyle: 'none'
			});
			var name = Ti.UI.createLabel({
				text: fs.data.friends[i].name,
				font: {fontSize: 16, fontWeight: 'bold'},
				left: 45
			});
			var avatar = Ti.UI.createImageView({
				image: fs.data.friends[i].pic_square,
				height: 35,
				width: 35,
				left: 5
			});
			var switch_button = Ti.UI.createSwitch({
				right: 5,
				value: false
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
