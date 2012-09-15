
if (Meteor.is_client) { 

  function modal_alert(msg, type) {
    $(".modal-messages").empty().append($('<div class="alert alert-'+type+'">').html(msg));
  }

  Template.nav.events = {
    'click #btn-siginin' : function(){

      var alias = $('#alias').val();
      var pin = $('#pin').val();

      // Look for the alias
      var user = Users.findOne({alias:alias, pin:pin});
      if(user) {
        modal_alert('Welcome Back :' + alias, 'success');
        Session.set('user', user);
        $('#signin').modal('hide');
      } else {
        modal_alert('Your Alias And Pin Did Not Match', 'error');
      }
      
      return false;
    },

    'click #btn-register' : function() {

      var alias = $('#alias').val();
      var pin = $('#pin').val();  
      var user = Users.findOne({alias:alias, pin:pin});
      var username = Users.findOne({alias:alias});  
      var valid = true;        

      if(alias == '' || pin == ''){
        modal_alert('You Cannot Leave Fields Empty :', 'error');
        valid = false;
      }

      if(pin.length != 4){
        modal_alert('Your Pin Must Be 4 Digits Long :', 'error');
        valid = false;
      }

      if(user) {
        modal_alert('This User Already Exists.  Try Logging In.', 'error');
        valid = false;        
      }

      if(username) {
        modal_alert('This Alias Is Already In Use.  Try Again.', 'error');
        valid = false;        
      }      

      if(valid) {
        var user = Users.insert({alias:alias, pin:pin});
        var game = Games.findOne({_id:Session.get('game')});
        if(game) {
          game.user = user;
          Games.update({_id:Session.get('game')}, game);
        }
        Session.set('user', user);
        modal_alert('Your Created A New Account As :' + alias, 'success');
        $('#signin').modal('hide');
      }

      return false;
    }

  };

  Template.nav.alias = function(){
    var user = Session.get('user');
    return user ? user.alias : null;
  };
  
}