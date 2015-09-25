CommitteesController = RouteController.extend({
  subscriptions: function () {
  Meteor.subscribe('members');
  Meteor.subscribe('committees');
  Meteor.subscribe('membercommitteetrack');
  },

  data: function () {
    // return a global data context like this:
    // Items.findOne({_id: this.params._id});
  },

  action: function () {
    this.render('Committees', { /* data: {} */});
  },
  detail: function(){
    this.render('CommitteeDetail', { data: function(){
      return Committees.findOne({_id: this.params._id})
    }});
  },
  edit: function(){
    this.state.set('isEditing', true);
    this.render('CommitteeDetail', { data: function(){
      return Committees.findOne({_id: this.params._id})
    }});
  },
  add: function(){
    this.state.set('isCreating', true);
    this.render('CommitteeDetail', {});
  }
});
