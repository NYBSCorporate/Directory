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


