(function(){isUserMember = function(id){
	var currentUser = Meteor.user();
    var member = Members.findOne({_id: id});   
    return currentUser.profile.email == member.email? true: false;
}

})();
