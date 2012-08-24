// Frol stats

Courses = new Meteor.Collection("courses");
Games = new Meteor.Collection("games");

// ID of currently selected course
Session.set('course_id', null);

Session.set('results', null);

Session.set('game', null);

if (Meteor.is_client) {

  Meteor.autosubscribe(function () {
    Meteor.subscribe("hole", Session.get("hole_id"));
    Meteor.subscribe("scorecard", Session.get("scorecard"));
  });
  
  Template.topbar.course = function(){
    var sesh = Session.get('course_id');
    return sesh ? Courses.findOne({_id:sesh}).name : 'Find a Course';
  };

  Template.find.events = {
    'keyup #term"' : function (e) {
      Session.set('results', Courses.find({zipcode:parseInt($('#term').val(),10)}) );
    }
  };

  Template.find.results = function(){
    return Session.get('results');
  };

  Template.course.events = {
    'click a' : function(){

      // Start a game
      if(!Session.get('game')){
        Games.insert({scorecard:[{score:3, par:3}], currentHole:1, course:Session.get('course_id')}, function(err, result){

          Session.set('game', result);
          console.log('started game ' + Session.get('game'));
        });
      } 
    }
  };

  Template.result.events = {
    'click a' : function(e){
      Session.set('course_id', this._id);
    }
  };

  Template.body.course_id = function(){
    return Session.get('course_id');  
  };

  Template.body.hole_id = Template.hole.hole_id = function(){
    var game = Games.findOne({_id:Session.get('game')});
    return game ? game.currentHole : '';
  };

  Template.hole.score = function(){
    var game = Games.findOne({_id:Session.get('game')});    
    return game ? game.scorecard[game.currentHole - 1].score : '';
  };

  Template.hole.par = function(){
    var game = Games.findOne({_id:Session.get('game')});    
    return game ? game.scorecard[game.currentHole - 1].par : '';
  };

  Template.hole.events = {

    'click .minus' : function(){
      var game = Games.findOne({_id:Session.get('game')});
      game.scorecard[game.currentHole - 1].score--;
      Games.update({_id:Session.get('game')}, game);
    },

    'click .plus' : function(){
      var game = Games.findOne({_id:Session.get('game')});
      game.scorecard[game.currentHole - 1].score++;
      Games.update({_id:Session.get('game')},game);
    },

    'click .next-hole' : function(){
      var game = Games.findOne({_id:Session.get('game')});
      game.scorecard[game.currentHole] = {score:3, par:3}; 
      game.currentHole++;
      Games.update({_id:Session.get('game')},game);
    }

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