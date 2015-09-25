

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


