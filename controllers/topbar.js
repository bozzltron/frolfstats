if (Meteor.is_client) { 
  
  Template.topbar.course = function(){
    var sesh = Session.get('course_id');
    return sesh ? Courses.findOne({_id:sesh}).name : 'Find a Course';
  };

}