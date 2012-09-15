// Hole

if (Meteor.is_client) { 

  Template.hole.score = function(){
    var game = Games.findOne({_id:Session.get('game')});    
    return game ? game.scorecard[game.currentHole - 1].score : '';
  };

  Template.hole.par = function(){
    var game = Games.findOne({_id:Session.get('game')});    
    return game ? game.scorecard[game.currentHole - 1].par : '';
  };

  Template.hole.party = function() {
    var game = Games.findOne({_id:Session.get('game')}); 
    var party = Games.find({course:Session.get('course_id'), currentHole:game.currentHole});    
    return party;
  };

  function calcScore(game) {
    var carryOver = game.scoreOverTime[game.currentHole-2] ? game.scoreOverTime[game.currentHole-2] : 0;
    game.scoreOverTime[game.currentHole-1] = carryOver + (game.scorecard[game.currentHole-1].score - game.scorecard[game.currentHole-1].par);
    game.currentScore = game.scoreOverTime[game.currentHole-1];
    console.log(carryOver, '+', game.scorecard[game.currentHole-1].score - game.scorecard[game.currentHole-1].par, '=', game.scoreOverTime[game.currentHole-1]);
    return game;
  }

  Template.hole.events = {

    'click .par .minus' : function(){
      var game = Games.findOne({_id:Session.get('game')});
      game.scorecard[game.currentHole - 1].par--;
      Games.update({_id:Session.get('game')}, game);
    },

    'click .par .plus' : function(){
      var game = Games.findOne({_id:Session.get('game')});
      game.scorecard[game.currentHole - 1].par++;
      Games.update({_id:Session.get('game')},game);
    },

    'click .score .minus' : function(){
      var game = Games.findOne({_id:Session.get('game')});
      game.scorecard[game.currentHole - 1].score--;
      game = calcScore(game);
      Games.update({_id:Session.get('game')}, game);
    },

    'click .score .plus' : function(){
      var game = Games.findOne({_id:Session.get('game')});
      game.scorecard[game.currentHole - 1].score++;
      game = calcScore(game);
      Games.update({_id:Session.get('game')},game);
    },

    'click .next-hole' : function(){
      var game = Games.findOne({_id:Session.get('game')});
      game.scorecard[game.currentHole] = {score:3, par:3}; 
      game = calcScore(game);
      game.currentHole++;
      Games.update({_id:Session.get('game')},game);
    },

    'click #lasthole' : function() {
      var game = Games.findOne({_id:Session.get('game')});
      Session.set('last_hole', true); 
      game = calcScore(game);
    },

    'click .back' : function() {
      var game = Games.findOne({_id:Session.get('game')});
      if(game.currentHole > 1){
        game.currentHole--;
      } else {
        game.currentHole = null;
      }
      Games.update({_id:Session.get('game')},game);
    },

  };
}