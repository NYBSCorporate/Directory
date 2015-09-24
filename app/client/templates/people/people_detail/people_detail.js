

/*****************************************************************************/
/* PeopleDetail: Event Handlers */
/*****************************************************************************/
Template.PeopleDetail.events({
	'click [data-remove]': function (e,tmpl){
		var membership_document_array = new Array;
    	var id = this._id;
		Members.remove({_id:id});

		// Clearing up all committees membership for member being removed
		var membership_document = 
			{
				_id: "clearAll",
				member_id: id
			}
		membership_document_array.push(membership_document);
		Meteor.call('upsertBulkCommitteeMembershipData', membership_document_array, function(error, result){
			if(error){
				console.log(error);
			} else {
				//console.log(result);
			}
		});


		Router.go('people');
	}
});

/*****************************************************************************/
/* PeopleDetail: Helpers */
/*****************************************************************************/
Template.PeopleDetail.helpers({
   member: function(){
		return Members.find({_id: this.params._id});

	},
   member_committees: function(member_id){
    var memberCursor = MemberCommitteeTrack.find({member_id: member_id});
    var committeesId = memberCursor.map(function(p){ return p.committee_id});

    var memberCommitteeCursor = Committees.find({_id: {$in: committeesId}});

    return memberCommitteeCursor;
  	},

  chair: function(){
  	var return_value;
    // Getting the member_id from parent template to know what member we are talking about
    if(Template.parentData(1) != null){
    	var member_id = Template.parentData(1)._id;
    	// Need to know which committee and which member to know the role
    	var role=MemberCommitteeTrack.findOne({committee_id: this._id, member_id: member_id});
    	return_value = role != null ? role: "";	
    } else {
    	return_value = "";
    }
    return return_value;
 	},
  in_committee_role: function(){
    // Getting the member_id from parent template to know what member we are talking about
    if(Template.parentData(1) != null){
	   	var committeeName = this.name;
	   	var membership = Template.parentData(1).memberships;
	   	return membership != null ? membership : "";
	}

    if(Template.parentData(1) != null){
    	var member_id = Template.parentData(1)._id;
    	// Need to know which committee and which member to know the role
    	var role=MemberCommitteeTrack.findOne({committee_id: this._id, member_id: member_id});
    	return_value = role != null ? role: "";	
    } else {
    	return_value = "";
    }
    return return_value;
  },
  report: function(){
  	var reportDetails = Members.find({_id: this.reportsTo});
  	if(reportDetails != null){
  		return reportDetails;
  	} else {
  		reportDetails = {name: "none", avatarURL: '/images/genericAvatar.jpg'}
  		return reportDetails;
  	}
  	
  },
  isMe: function(email){
  	return email === Meteor.user().profile.email;
  },
  committees: function(){
  	return Committees.find();
  },
  isMember: function(){
  	var return_value;
  	// Getting the member_id from parent template to know what member we are talking about
    if(Template.parentData(1) != null){
    	var member_id = Template.parentData(1)._id;
    	// If findone brings something back, then membership is confirmed, otherwise false
    	var record = MemberCommitteeTrack.findOne({committee_id: this._id, member_id: member_id});
  		return_value = record != null ? "checked": "";
    } else {
    	return_value = "";
    }
    return return_value;
  },
  memberList: function(){
  	return Members.find().map(function(c){
  		return {label: c.name, value: c._id}
  	});
  },
  shouldBeDisabled: function(){
  	return !Roles.userIsInRole(Meteor.userId(), ['admin', 'members-manager']) ? true : ' ';
  },
  disabled: function(){
  	return !Roles.userIsInRole(Meteor.userId(), ['admin', 'members-manager']) ? 'disabled' : '';
  }
});

/*****************************************************************************/
/* PeopleDetail: Lifecycle Hooks */
/*****************************************************************************/
Template.PeopleDetail.created = function () {
};

Template.PeopleDetail.rendered = function () {

};

Template.PeopleDetail.destroyed = function () {
};
