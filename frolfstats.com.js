// Frol stats

Courses = new Meteor.Collection("courses");
Games = new Meteor.Collection("games");

// ID of currently selected course
Session.set('course_id', null);

// Name of current hole
Session.set('hole_id', null);

Session.set('results', null);

if (Meteor.is_client) {
  
  Template.topbar.course = function(){
    var sesh = Session.get('course_id');
    return sesh ? Courses.findOne({_id:sesh}).name : 'Find a Course';
  };

  Template.find.events = {
    'keyup #term"' : function (e) {
      Session.set('results', Courses.find({zipcode:parseInt($('#term').val(),10)}) );
    }
  };

  Template.course.events = {
    'click a' : function(){
      alert("start course");
    }
  };

  Template.body.course_id = function(){
    return Session.get('course_id');
  };

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