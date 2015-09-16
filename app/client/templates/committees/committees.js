/*****************************************************************************/
/* Committees: Event Handlers */
/*****************************************************************************/
Template.Committees.events({
});

/*****************************************************************************/
/* Committees: Helpers */
/*****************************************************************************/
Template.Committees.helpers({
	committees: function(){
		return Committees.find({});
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
/* Committees: Lifecycle Hooks */
/*****************************************************************************/
Template.Committees.created = function () {
};

Template.Committees.rendered = function () {
};

Template.Committees.destroyed = function () {
};
