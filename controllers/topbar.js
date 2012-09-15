if (Meteor.is_client) { 
  
  Template.topbar.course = function(){
    var sesh = Session.get('course_id');
    var course = Courses.findOne({_id:sesh});
    return course ? course.name : 'Find a Course';
  };

}