
if (Meteor.is_client) { 
  
  Template.result.events = {
    'click a' : function(e){
    	console.log(this);
    	console.log('course_id', this._id);
      Session.set('course_id', this._id);
    }
  };

}