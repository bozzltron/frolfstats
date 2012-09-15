
if (Meteor.is_client) { 

  function modal_alert(msg, type) {
    $(".modal-messages").append($('<div class="alert alert-'+type+'">').html(msg));
  }

  Template.nav.events = {
    'click #btn-siginin' : function(){

      var alias = $('#alias').val();
      var pin = $('#pin').val();

      // Look for the alias
      if(Users.findOne({alias:alias})) {
        var user = Users.findOne({alias:alias, pin:pin});
        modal_alert('Welcome Back :' + alias, 'success');
        if(!user) {
          modal_alert('This Alias Already Exists. Your Pin Did Not Match', 'error');
        }
      } else {
        var user = Users.insert({alias:alias, pin:pin});
        var game = Games.findOne({_id:Session.get('game')});
        if(game) {
          game.user = user;
          Games.update({_id:Session.get('game')}, game);
        }
        modal_alert('Your Created A New Account As :' + alias, 'success');
      }
      
      Session.set('user', user);

      return false;
    }
  };

  Template.nav.alias = function(){
    var user = Users.findOne({_id:Session.get('user')});
    return user ? user.alias : null;
  };
  
}