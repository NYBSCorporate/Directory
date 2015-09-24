Committees = new Mongo.Collection('committees');

Committees.attachSchema(new SimpleSchema({
	name: {
		type: String,
		label: "Committee name",
	},
	description:{
		type: String,
		autoform: {
			rows: 5
		}
	}
}));


/*
Meteor.startup(function(){
  //Committees.remove({});
  Committees.insert({name: "Land", 
    description: "This committee is focusing on securing a land on which the sanctuary would be built."});
  Committees.insert({name: "Technology", description: "Technology"});
  Committees.insert({name: "Land", description: "Land"});

});*/
