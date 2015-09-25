Template.MasterLayout.helpers({
	active: function(path){		
	    if(Router.current().route.path(this) === path ){
	      return "active";
	    } else {
	      return "";
	    }
  	}
});

Template.MasterLayout.events({
	'click [data-logout]':function (e,tmpl){
		Meteor.logout();
		Router.go('/');
	}
	,
	'click [data-login]': function (e,tmpl){
		Meteor.loginWithGoogle({
			requestPermissions: ['email']
			}, function(err){
				if(err)
					Notifications.error('Login error', err.reason);
			});
	}
});
