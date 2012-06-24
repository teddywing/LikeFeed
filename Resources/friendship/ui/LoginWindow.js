(function() {
	function createFBLoginButton () {
		// Don't forget to set your appid and requested permissions, else the login button
		// won't be effective.
		
		Titanium.Facebook.addEventListener('login', function(e) {
			if (e.success) {
				alert('Logged in');
			}
		});
		Titanium.Facebook.addEventListener('logout', function(e) {
			alert('Logged out');
		});
		
		// add the button.  Note that it doesn't need a click event or anything.
		return Titanium.Facebook.createLoginButton({
			top: 50,
			style: 'wide'
		});
	};
})();
