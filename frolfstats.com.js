// Frolf stats

// Models
Courses = new Meteor.Collection("courses");
Games = new Meteor.Collection("games");
Users = new Meteor.Collection("users");

// ID of currently selected course
Session.set('course_id', null);

Session.set('results', null);

Session.set('game', null);

if (Meteor.is_client) { 
  
  // Confirm before leaving the page
  window.onbeforeunload = function() {
    return "You will loose your data if you leave.";
  }

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