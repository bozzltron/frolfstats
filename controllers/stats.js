

if (Meteor.is_client) {

  Template.stats.alias = function(){

    return Session.get('user') ? Session.get('user').alias : 'Anonymous';
  }

  Template.stats.games = function(){
    var user = Session.get('user');
    var games = [];
    if(user) {
      games = Games.find({"user.alias" : user.alias}); 
    }
    return games;
  };

  var statsView = Backbone.View.extend({
    initialize: function() {
      _.bindAll(this, 'render');
      this.template = Template.stats();
      this.render();
    },
    render: function() {
      $(this.el).empty().append(this.template);
    }
  });

  var statsRouter = Backbone.Router.extend({

    routes : {
      'stats' : 'stats'
    },

    stats : function(){
      new statsView({el:$('#body')});
    }

  });

  // Kickoff Router
  new statsRouter();

}