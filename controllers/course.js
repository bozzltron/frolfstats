// Course

if (Meteor.is_client) { 

  Template.course.name = function(){
    var sesh = Session.get('course_id');
    var course = Courses.findOne({_id:sesh});
    return (sesh && course) ? course.name : 'Find a Course';
  };

  Template.course.events = {
    'click a' : function(){

      // Start a game
      if(!Session.get('game')){
        Games.insert({
          scorecard:[{score:3, par:3}], 
          currentHole:1, 
          scoreOverTime:[0], 
          course:Session.get('course_id'), 
          courseName:Courses.findOne({"_id": Session.get('course_id')}).name,
          user:Session.get('user'), 
          date: new Date().getTime()},
          function(err, result){
            Session.set('game', result);
            console.log('started game ' + Session.get('game'));
        });
      } 
    }
  };

}