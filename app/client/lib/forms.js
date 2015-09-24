var membership_document_array;

var hooksObject = {
  before: {

    // Replace `formType` with the form `type` attribute to which this hook applies
    insert: function(doc) {
      // Potentially alter the doc
     if(this.formId.substring(6, this.formId.length-4) == "Member"){
        /* Capturing and updating Committee Membership information */
          membership_document_array = new Array;
          var currentTemplate = this.template;
          var id = ""; //to be updated in after hook, after data insertion
          var checkedCheckboxes = currentTemplate.findAll('input[type=checkbox]:not([name=administrator]):checked');
          
          if(checkedCheckboxes.length > 0){
            checkedCheckboxes.forEach(function(checkbox){
              var in_committee_role = currentTemplate.find('input[name='+checkbox.name+'_committee_role]').value;
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
            
            membership_document_array.push(membership_document);
          }
            

     doc.avatarURL = "/images/genericAvatar.jpg";
     doc.createdAt = Date.now();
     }
     
     return doc;
    },
    update: function(doc){
      if(this.formId.substring(6, this.formId.length-4) == "Member"){
        var existingAvatar = this.avatarURL;
        /* Capturing and updating Committee Membership information */
          membership_document_array = new Array;
          var currentTemplate = this.template;
          var id = this.docId; //to be updated in after hook, after data insertion
          var checkedCheckboxes = currentTemplate.findAll('input[type=checkbox]:not([name=administrator]):checked');
          
          if(checkedCheckboxes.length > 0){
            checkedCheckboxes.forEach(function(checkbox){
              var in_committee_role = currentTemplate.find('input[name='+checkbox.name+'_committee_role]').value;
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
            
            membership_document_array.push(membership_document);
            
          }
          
          Meteor.call('upsertBulkCommitteeMembershipData', membership_document_array, function(error, result){
            if(error){
              console.log(error);
            } else {
              //console.log(result);
            }
          });
            
     doc.$set.avatarURL = existingAvatar;
     doc.$set.updatedAt = Date.now();
     }
     
     return doc;
    }
  },
  after: {
    insert: function(error, result){
      if(result != false){
        if(this.formId.substring(6, this.formId.length-4) == "Member"){
          membership_document_array.forEach(function(index,value){
            index.member_id = result;
          });
          Meteor.call('upsertBulkCommitteeMembershipData', membership_document_array, function(error, result){
            if(error){
              console.log(error);
            } else {
              //console.log(result);
            }
          });

        } 
      }
      
    }
  },
 // Called when any submit operation succeeds
  onSuccess: function(formType, result) {
 	//console.log(formType + " " + result + " and form id is "+this.formId+ " and docid is "+this.docId);
  	// All forms are named insert/update<name>form. Extracting substring to know what collection is being changed as it
  	// usually takes the user to the details route
  	switch(this.formId.substring(6, this.formId.length-4)){
  		case "Committee":
  			Router.go('committees.detail', {_id: this.docId});
  			break;

		case "Member":
      //=console.log(this);
			Router.go('people.detail', {_id: this.docId});
  			break;

  		default:
  			Router.go('people');
  	}
  	//Router.go('committees.detail', {_id: result});
  },

  // Called when any submit operation fails
  onError: function(formType, error) {
  	console.log("Error while performing "+formType+ " with error "+error);
  }

}

// run the hook for all forms in the app (global hook)
AutoForm.addHooks(null, hooksObject);