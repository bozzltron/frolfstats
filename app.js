// Frolf stats

// Models
Courses = new Meteor.Collection("courses");
Games = new Meteor.Collection("games");
Users = new Meteor.Collection("users");
Groups = new Meteor.Collection("groups");

// Session vars
Session.set('course_id', null);
Session.set('results', null);
Session.set('game', null);

if (Meteor.is_client) { 
  
  // Confirm before leaving the page
  window.onbeforeunload = function() {
    return "You will loose your data if you leave.";
  }

  // Setup home view
  var homeView = Backbone.View.extend({
    initialize: function() {
      _.bindAll(this, 'render');  
    },
    template: function() {
      Meteor.render(function() {
        return Template.body();
      });
    },
    render: function() {
      console.log(this.el);
      $(this.el).empty().append(this.template());
    }
  });

  var homeRouter = Backbone.Router.extend({

    routes : {
      '#' : 'body',
      '' : 'body'
    },

    body : function(){
      $('.view').hide();
      $('#home').show();
    }

  });

  // Kickoff Router
  new homeRouter();

  // Backbone Router
  Meteor.startup(function () {
    Backbone.history.start();
  });
}

if (Meteor.is_server) {
  Meteor.startup(function () {
    Courses.remove({zipcode:50010});
    if (Courses.find().count() === 0) {
     Courses.insert({name:"Carroll Marty", zipcode:50010});
     Courses.insert({name:"North Ames", zipcode:50010});
    }
  });
}