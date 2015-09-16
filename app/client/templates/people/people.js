/*****************************************************************************/
/* People: Event Handlers */
/*****************************************************************************/
Template.People.events({
});

/*****************************************************************************/
/* People: Helpers */
/*****************************************************************************/
Template.People.helpers({
	members: function(){
		return Members.find({}, {sort: {name: 1}});
	},
	member_committees: function(member_id){
    
    var memberCursor = MemberCommitteeTrack.find({member_id: member_id});
    var committeesId = memberCursor.map(function(p){ return p.committee_id});

    var memberCommitteeCursor = Committees.find({_id: {$in: committeesId}});

    return memberCommitteeCursor;
  },

  chair: function(){
    // Getting the member_id from parent template to know what member we are talking about
    var member_id = Template.parentData(1)._id;
    // Need to know which committee and which member to know the role
    return MemberCommitteeTrack.findOne({committee_id: this._id, member_id: member_id});
  }
});

/*****************************************************************************/
/* People: Lifecycle Hooks */
/*****************************************************************************/
Template.People.created = function () {
	Members.initEasySearch('name');
};

Template.People.rendered = function () {
};

Template.People.destroyed = function () {
};

