Accounts.config({
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

Accounts.onLogin(function(attempt_info_object){
	if(attempt_info_object != null){
		var email = attempt_info_object.user.profile.email;
		var member = Members.find({email: email}, {fields: {_id: 1, avatarURL: 1}}).fetch();
		var googleAvatar = attempt_info_object.user.services.google.picture;
		if(member[0].avatarURL != googleAvatar){
			Members.update({_id: member[0]._id},
							{ $set: {
								avatarURL: googleAvatar
							}}
			);
			console.log('Updated profile picture for member '+member[0]._id);
		}
	}
});
	
function defineRole(id, email){
	Roles.addUsersToRoles(id, 'default-user');
		if(email == 'antoine@newyorkbeesanctuary.org'){
			Roles.addUsersToRoles(id, 'admin');
		}
}





