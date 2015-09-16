(function(){Meteor.startup(function(){
	
});




ServiceConfiguration.configurations.upsert(
  { service: "google" },
  {
    $set: {
      clientId: process.env['ACCOUNTS_GOOGLE_ID'],
      loginStyle: "popup",
      secret: process.env['ACCOUNTS_GOOGLE_SECRET']
    }
  }
);



})();
