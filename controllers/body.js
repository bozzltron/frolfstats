if (Meteor.is_client) {
	
  Template.body.course_id = function(){
    return Session.get('course_id');  
  };

  Template.body.last_hole = function(){
    return Session.get('last_hole');  
  };  

  Template.body.hole_id = Template.hole.hole_id = function(){
    var game = Games.findOne({_id:Session.get('game')});
    return game ? game.currentHole : '';
  };
	
}