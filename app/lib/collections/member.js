

Members = new Mongo.Collection('members');
Members.attachSchema(new SimpleSchema({
    name: {
        type: String,
        label: "name",
    },
    role: {
        type: String,
        label: "role",
    },
    department: {
        type: String,
        label: "department",
        optional: true
    },
    phone: {
        type: String,
        label: "phone",
        autoform: {
            afFieldInput: {
                type: "tel"
            }
        }
    },
    email: {
        type: String,
        label: "email",
        regEx: SimpleSchema.RegEx.Email
    },
    location: {
        type: String,
        label: "location"
    },
    description:{
        type: String,
        label: "description",
        autoform: {
            rows: 5
        },
        optional:true
    },
    reportsTo: {
        type: String,
        label: "Reports To",
        optional: true
    },
    memberships: {
        type: Object,
        optional: true,
        blackbox: true
    },
    createdAt: {
        type: Date,
        optional: true
    },
    avatarURL: {
        type: String
    }
}));

/*
Meteor.startup(function(){
  //Members.remove({});
  Members.insert({
    name: "Antoine Arlaud", 
    role: "CTO", 
    email: "antoine@newyorkbeesanctuary.org",
    avatarURL: "images/antoine.jpeg",
    department: "Technology",
    phone:"857-350-7709",
    location: "New York, NY",
    description: "Antoine Arlaud, Solutions Engineer at Akamai" });
  Members.insert({
    name: "Helena Arlaud", 
    role: "COO", 
    email: "antoine@newyorkbeesanctuary.org",
    avatarURL: "images/antoine.jpeg",
    department: "Technology",
    phone:"857-350-7709",
    location: "New York, NY",
    description: "Antoine Arlaud, Solutions Engineer at Akamai" });
  Members.insert({
    name: "Guillaume Gauthereau", 
    role: "CEO", 
    email: "antoine@newyorkbeesanctuary.org",
    avatarURL: "images/antoine.jpeg",
    department: "Technology",
    phone:"857-350-7709",
    location: "New York, NY",
    description: "Antoine Arlaud, Solutions Engineer at Akamai" });

});
*/
