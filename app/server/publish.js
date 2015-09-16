/**
 * Meteor.publish('items', function (param1, param2) {
 *  this.ready();
 * });
 */
Meteor.publish('members', function(){
	//if(!this.userId) return this.ready();
	return Members.find();
});

Meteor.publish('member', function(id){
	//if(!this.userId) return this.ready();
	return Members.find({_id: id});
});

Meteor.publish('committees', function(){
	//if(!this.userId) return this.ready();
	return Committees.find();
});

Meteor.publish('membercommitteetrack', function(){
	//if(!this.userId) return this.ready();
	return MemberCommitteeTrack.find();
});