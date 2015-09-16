(function(){Accounts.config({
	restrictCreationByEmailDomain: 'newyorkbeesanctuary.org'
});


Accounts.onCreateUser(function(options, user){
	// Exposing key information from Google Login
	options.profile.email = user.services.google.email;
	options.profile.picture = user.services.google.picture;
	user.profile = options.profile;	

	Members.update({email: options.profile.email},
					{
						$set: {
							avatarURL: options.profile.picture
						}
					});
	
	Meteor.setInterval(function(){
		defineRole(user._id, options.profile.email);
	}, 100);
	
	return user;
});

function defineRole(id, email){
	Roles.addUsersToRoles(id, 'default-user');
		if(email == 'antoine@newyorkbeesanctuary.org'){
			Roles.addUsersToRoles(id, 'admin');
		}
}






})();
