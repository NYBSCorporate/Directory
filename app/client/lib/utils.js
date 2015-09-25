templateDecode = function (value){
	return value.replace("_"," ");
}

Meteor.startup(function () {
    _.extend(Notifications.defaultOptions, {
        timeout: 5000
    });
});