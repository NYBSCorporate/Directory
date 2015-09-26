OrganizationController = RouteController.extend({
  subscriptions: function () {
    Meteor.subscribe('members');
  },

  data: function () {
    // return a global data context like this:
    // Items.findOne({_id: this.params._id});
  },

  action: function () {
    this.render('Organization', { /* data: {} */});
  }
});
