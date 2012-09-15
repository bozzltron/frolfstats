// Course

if (Meteor.is_client) { 

  Template.course.events = {
    'click a' : function(){

      // Start a game
      if(!Session.get('game')){
        Games.insert({scorecard:[{score:3, par:3}], currentHole:1, scoreOverTime:[0], course:Session.get('course_id'), user:Session.get('user')}, function(err, result){

          Session.set('game', result);
          console.log('started game ' + Session.get('game'));
        });
      } 
    }
  };

}