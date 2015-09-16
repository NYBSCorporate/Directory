/*****************************************************************************/
/* CommitteeDetail: Event Handlers */
/*****************************************************************************/
Template.CommitteeDetail.events({
	'submit .edit-committee': function(e,tmpl){
		e.preventDefault();

		var name=tmpl.find('input[name=name]').value;
		var description=tmpl.find('textarea[name=description]').value;

		var id = this._id;
		if(Roles.userIsInRole(id, ['admin','committees_manager'])){
			Committees.update({_id:id},{
				$set: {
					name:name,
					description: description,
					updatedAt: new Date
				}
			});
			Router.go('committees.detail', {_id: id});
		} else {
			console.log("Access Denied");
			Router.go('committees');
		}

		
	},
	'submit .add-committee': function(e,tmpl){
		e.preventDefault();

		var name=tmpl.find('input[name=name]').value;
		var description=tmpl.find('textarea[name=description]').value;

		var id = Committees.insert({
				name:name,
				description: description,
				createdAt: new Date
		});

		Router.go('committees.detail', {_id: id});
	},
	'click [data-remove]':function (e,tmpl){
		var id = this._id;
		Committees.remove({_id:id});
		Router.go('committees');
	},
});

/*****************************************************************************/
/* CommitteeDetail: Helpers */
/*****************************************************************************/
Template.CommitteeDetail.helpers({
	committee: function(){
		return Committees.find({_id: this.params._id});
	},
	committee_members: function(committee_id){

    var committeeCursor = MemberCommitteeTrack.find({committee_id: committee_id});
    var userIds = committeeCursor.map(function(p){ return p.member_id});

    var committeeMemberCursor = Members.find({_id: {$in: userIds}});

    return committeeMemberCursor;
  },

  chair: function(){
    var committee_id = Template.parentData(1)._id;
    return MemberCommitteeTrack.findOne({committee_id:committee_id, member_id: this._id});
  }
});

/*****************************************************************************/
/* CommitteeDetail: Lifecycle Hooks */
/*****************************************************************************/
Template.CommitteeDetail.created = function () {
};

Template.CommitteeDetail.rendered = function () {
};

Template.CommitteeDetail.destroyed = function () {
};
