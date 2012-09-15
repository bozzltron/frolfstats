
if (Meteor.is_client) { 
  
  Template.result.events = {
    'click a' : function(e){
      Session.set('course_id', this._id);
    }
  };

}