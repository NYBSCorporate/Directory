PeopleController = RouteController.extend({
  subscriptions: function () {
    Meteor.subscribe('committees');
    Meteor.subscribe('membercommitteetrack');
    Meteor.subscribe('members');
    if(this.params._id != null){
     Meteor.subscribe('member',this.params._id) ;
    }
    
  },

  data: function () {
    // return a global data context like this:
    // Items.findOne({_id: this.params._id});
  },

  action: function () {
    // You can create as many action functions as you'd like.
    // This is the primary function for running your route.
    // Usually it just renders a template to a page. But it
    // might also perform some conditional logic. Override
    // the data context by providing it as an option in the
    // last parameter.
    this.render('People', { /* data: {} */});
  },

  detail: function(){
    this.render('PeopleDetail', { data: function(){
      return Members.findOne({_id: this.params._id})
    }});
  },

  edit: function(){
    this.state.set('isEditing', true);
    this.render('PeopleDetail', { data: function(){
      return Members.findOne({_id: this.params._id})
    }});
  },
  add: function(){
    this.state.set('isCreating', true);
    this.render('PeopleDetail',{});
  }
});
