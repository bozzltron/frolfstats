if (Meteor.is_client) { 
  
  Template.find.preserve({
    'input[id]': function (node) { return node.id; }
  });

  Template.find.events = ({
    'keyup #term"' : function (e) {
      Session.set('results', Courses.find({zipcode:parseInt($('#term').val(),10)}));
    }
  });

  Template.find.results = function(){
    return Session.get('results');
  };  

}