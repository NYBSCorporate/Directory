/*****************************************************************************/
/* Server Only Methods */
/*****************************************************************************/
Meteor.methods({
  	upsertBulkCommitteeMembershipData: function(documents){
	  	if(Roles.userIsInRole(Meteor.userId(), ['admin', 'members-manager']) || isUserMember(documents[0].member_id)) {
	  		var writeResult = MemberCommitteeTrack.remove({member_id: documents[0].member_id});

		  	documents.forEach(function(document){
		  		if(document._id == 'clearAll'){  			
		  			return 'Cleared All membership for member_id '+document.member_id;
		  		} else {
		  			writeResult = MemberCommitteeTrack.update({
		  				_id: document._id
		  			}, { $set:
		  				{
		  					member_id: document.member_id,
		  					committee_id: document.committee_id,
		  					in_committee_role: document.in_committee_role
		  				}
		  			},
		  			{upsert: true});
		  			return 'Updated MemberCommitteeTrack Collection';
		  		}
		  		//console.log("Updated " + writeResult + " Results in MemberCommitteeTrack");
		  	});
		} else {
		  	return 'Access denied';
		}
  	
  },

  	updateReportTo: function(id ,reportId){
  		if(Roles.userIsInRole(Meteor.userId(), ['admin', 'members-manager'])){
  			writeResult = Members.update({
  				_id: id
  			}, {
  				$set: {
  					reportsTo: reportId
  				}
  			},
  			{upsert: true});
  		} else {
  			return 'Access denied';
  		}
				
	}
});



