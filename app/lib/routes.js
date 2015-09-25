var OnBeforeActions;

OnBeforeActions = {
    loginRequired: function() {
      if (!Meteor.userId()) {
        this.render('Login');
        //return pause();
      } else {
      	this.next();
      }
    },
    adminRequired: function() {
        if(Roles.userIsInRole(Meteor.userId(), ['admin'])) {
          this.next();
        } else {
          console.log('Access Denied');
          Router.go('people');
        }
    }
};

Router.onBeforeAction(OnBeforeActions.loginRequired, {
    only: ['people', 'committees', 'people.detail', 'people.edit']
});

Router.onBeforeAction(OnBeforeActions.adminRequired, {
    only: ['committees.add', 'people.add']
});

Router.configure({
  layoutTemplate: 'MasterLayout',
  loadingTemplate: 'Loading',
  notFoundTemplate: 'NotFound'
});

Router.route('people', {
  name: 'people',
  controller: 'PeopleController',
  action: 'action',
  where: 'client'
});


Router.route('people/:_id', {
	name: 'people.detail',
	controller: 'PeopleController',
	action: 'detail',
	wnere: 'client'
})

Router.route('people/:_id/edit', {
	name: 'people.edit',
	controller: 'PeopleController',
	action: 'edit',
	wnere: 'client'
})

Router.route('add/people', {
  name: 'people.add',
  controller: 'PeopleController',
  action: 'add',
  where: 'client'
});

Router.route('/', function(){
    this.redirect('/people');
});
Router.route('/login', function(){
    this.redirect('/people');
});

Router.route('committees', {
  name: 'committees',
  controller: 'CommitteesController',
  action: 'action',
  where: 'client'
});

Router.route('committees/:_id', {
  name: 'committees.detail',
  controller: 'CommitteesController',
  action: 'detail',
  where: 'client'
});

Router.route('committees/:_id/edit', {
  name: 'committees.edit',
  controller: 'CommitteesController',
  action: 'edit',
  where: 'client'
});

Router.route('add/committees', {
  name: 'committees.add',
  controller: 'CommitteesController',
  action: 'add',
  where: 'client'
});