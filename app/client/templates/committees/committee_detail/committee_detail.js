/*****************************************************************************/
/* CommitteeDetail: Event Handlers */
/*****************************************************************************/
Template.CommitteeDetail.events({
	
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
