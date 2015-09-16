

/*****************************************************************************/
/* PeopleDetail: Event Handlers */
/*****************************************************************************/
Template.PeopleDetail.events({
	'submit .edit-people': function(e,tmpl){
		e.preventDefault();

		var id = this._id;

		/* Capturing and updating Committee Membership information */
		var membership_document_array = new Array;
		var checkedCheckboxes = tmpl.findAll('input[type=checkbox]:checked');
		
		if(checkedCheckboxes.length > 0){
			checkedCheckboxes.forEach(function(checkbox){

				var in_committee_role = tmpl.find('input[name='+checkbox.name+'_committee_role]') != null ? tmpl.find('input[name='+checkbox.name+'_committee_role]').value :"";
				var memberCommitteeTrack = MemberCommitteeTrack.findOne({member_id:id, committee_id:Committees.findOne({name: templateDecode(checkbox.name)},{fields: {_id: 1}})._id});
				var membership_document = 
						{
							_id: memberCommitteeTrack != null? memberCommitteeTrack._id: "",
							member_id: id,
							committee_id: Committees.findOne({name: templateDecode(checkbox.name)},{fields: {_id: 1}})._id,
							in_committee_role: in_committee_role
						}
				membership_document_array.push(membership_document);
			});
		} else {

			var membership_document = 
			{
				_id: "clearAll",
				member_id: id
			}
			//console.log(membership_document);
			membership_document_array.push(membership_document);
		}
		
		
		Meteor.call('upsertBulkCommitteeMembershipData', membership_document_array, function(error, result){
			if(error){
				console.log(error);
			} else {
				//console.log(result);
			}
		});

		var checkedRadioBtn = tmpl.find('input[type=radio]:checked');
		if(checkedRadioBtn != null){
			var reportId = Members.findOne({name: templateDecode(checkedRadioBtn.id)},
				{fields: {_id: 1}})._id;
			Meteor.call('updateReportTo', id ,reportId, function(err, result){
				if(err){
					console.log(err);
				} else {
					//console.log(result);
				}
			})
		}

		/* Capturing and updating Member information */

		var name=tmpl.find('input[name=name]').value;
		var phone=tmpl.find('input[name=phone]').value;
		var location=tmpl.find('input[name=location]').value;
		var description=tmpl.find('textarea[name=description]').value;

		if(Roles.userIsInRole(id, ['admin','members_manager'])){
			var role=tmpl.find('input[name=role]').value;
			var department=tmpl.find('input[name=department]').value;
			if(Roles.userIsInRole(id, ['admin','members_manager'])){
				var email=tmpl.find('input[name=email]').value;
			}else{
				var email=tmpl.find('.member_email').value;
				console.log(email);
			}
			Members.update({_id:id},{
				$set: {
						name:name,
						role:role,
						department:department,
						phone: phone,
						email:email,
						location: location,
						description: description,
						updatedAt: new Date
				}
			});
			Router.go('people.detail', {_id: id});
		} else if(isUserMember(id)){
			Members.update({_id:id},{
				$set: {
						name:name,
						phone: phone,
						location: location,
						description: description,
						updatedAt: new Date
				}
			});
			Router.go('people.detail', {_id: id});
		} else {
			console.log('Access Denied');
			Router.go('people');
		}
		/* End of Capturing and updating Member information */	

		

		
	},

	'submit .add-people': function(e,tmpl){
		e.preventDefault();

		var name=tmpl.find('input[name=name]').value;
		var role=tmpl.find('input[name=role]').value;
		var department=tmpl.find('input[name=department]').value;
		var phone=tmpl.find('input[name=phone]').value;
		var email=tmpl.find('input[name=email]').value;
		var location=tmpl.find('input[name=location]').value;
		var description=tmpl.find('textarea[name=description]').value;
		var avatarURL = '/images/genericAvatar.jpg';

		var checkedRadioBtn = tmpl.find('input[type=radio]:checked');
		var reportId;
		if(checkedRadioBtn != null){
			reportId = Members.findOne({name: templateDecode(checkedRadioBtn.id)},
				{fields: {_id: 1}})._id;
		}

		var id  = Members.insert({
				name:name,
				role:role,
				department:department,
				phone: phone,
				email:email,
				location: location,
				description: description,
				avatarURL: avatarURL,
				reportsTo: reportId,
				createdAt: new Date
			});

		/* Capturing and updating Committee Membership information */
		var membership_document_array = new Array;
		var checkedCheckboxes = tmpl.findAll('input[type=checkbox]:not([name=administrator]):checked');
		
		if(checkedCheckboxes.length > 0){
			checkedCheckboxes.forEach(function(checkbox){
				var in_committee_role = tmpl.find('input[name='+checkbox.name+'_committee_role]').value;
				var memberCommitteeTrack = MemberCommitteeTrack.findOne({member_id:id, committee_id:Committees.findOne({name: templateDecode(checkbox.name)},{fields: {_id: 1}})._id});
				var membership_document = 
						{
							_id: memberCommitteeTrack != null? memberCommitteeTrack._id: "",
							member_id: id,
							committee_id: Committees.findOne({name: templateDecode(checkbox.name)},{fields: {_id: 1}})._id,
							in_committee_role: in_committee_role
						}
				membership_document_array.push(membership_document);
			});
		} else {

			var membership_document = 
			{
				_id: "clearAll",
				member_id: id
			}
			//console.log(membership_document);
			membership_document_array.push(membership_document);
		}
		
		
		Meteor.call('upsertBulkCommitteeMembershipData', membership_document_array, function(error, result){
			if(error){
				console.log(error);
			} else {
				//console.log(result);
			}
		});


		

		Router.go('people.detail', {_id: id});
	},
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
		Meteor.call('upsertBulkCommittteeMembershipData', membership_document_array, function(error, result){
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
  members: function(){
  	var member_id = this._id != null ? this._id: '';
  	return Members.find({_id: { $ne: member_id}});
  },
  isReport: function(id){

  	var member_id = '';
  	if(Template.parentData(1) != null){
    	member_id = Template.parentData(1)._id;
    }
    // Find the person the member reports to
    var report = Members.findOne({_id: member_id}, {fields: {reportsTo: 1}});
//    console.log(report);
    if(report != null){
    	report = report.reportsTo;
    } else {
    	report = '';
    }
    return report === id ? 'checked' :'';
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
