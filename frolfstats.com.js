// Frol stats

Courses = new Meteor.Collection("courses");
Games = new Meteor.Collection("games");

// ID of currently selected course
Session.set('course_id', null);

Session.set('results', null);

Session.set('game', null);

if (Meteor.is_client) { 
  
  Template.find.preserve({
    'input[id]': function (node) { return node.id; }
  });

  Template.topbar.course = function(){
    var sesh = Session.get('course_id');
    return sesh ? Courses.findOne({_id:sesh}).name : 'Find a Course';
  };

  Template.find.events = ({
    'keyup #term"' : function (e) {
      Session.set('results', Courses.find({zipcode:parseInt($('#term').val(),10)}));
    }
  });

  Template.find.results = function(){
    return Session.get('results');
  };

  Template.course.events = {
    'click a' : function(){

      // Start a game
      if(!Session.get('game')){
        Games.insert({scorecard:[{score:3, par:3}], currentHole:1, scoreOverTime:[0], course:Session.get('course_id')}, function(err, result){

          Session.set('game', result);
          console.log('started game ' + Session.get('game'));
        });
      } 
    }
  };

  Template.result.events = {
    'click a' : function(e){
      Session.set('course_id', this._id);
    }
  };

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

  Template.hole.score = function(){
    var game = Games.findOne({_id:Session.get('game')});    
    return game ? game.scorecard[game.currentHole - 1].score : '';
  };

  Template.hole.par = function(){
    var game = Games.findOne({_id:Session.get('game')});    
    return game ? game.scorecard[game.currentHole - 1].par : '';
  };

  function calcScore(ary) {
    var sum = 0;
    $.each(ary, function(i, e){
      sum = sum + e;
    });
    return sum;
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
      game.scoreOverTime[game.currentHole-1] =  game.scorecard[game.currentHole-1].score - game.scorecard[game.currentHole-1].par;
      Games.update({_id:Session.get('game')}, game);
    },

    'click .score .plus' : function(){
      var game = Games.findOne({_id:Session.get('game')});
      game.scorecard[game.currentHole - 1].score++;
      game.scoreOverTime[game.currentHole-1] = game.scorecard[game.currentHole-1].score - game.scorecard[game.currentHole-1].par;
      Games.update({_id:Session.get('game')},game);
    },

    'click .next-hole' : function(){
      var game = Games.findOne({_id:Session.get('game')});
      game.scorecard[game.currentHole] = {score:3, par:3}; 
      game.scoreOverTime[game.currentHole-1] = game.scorecard[game.currentHole-1].score - game.scorecard[game.currentHole-1].par;
      game.currentHole++;
      Games.update({_id:Session.get('game')},game);
    },

    'click #lasthole' : function() {
      var game = Games.findOne({_id:Session.get('game')});
      Session.set('last_hole', true); 
      game.scoreOverTime[game.currentHole-1] = game.scorecard[game.currentHole-1].score - game.scorecard[game.currentHole-1].par;

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

  Template.gamereport.numOfHoles = function(){
    var game = Games.findOne({_id:Session.get('game')});
    return game.scorecard.length;
  };

  Template.gamereport.finalScore = function(){
    var game = Games.findOne({_id:Session.get('game')});
    var parSum = 0;
    var scoreSum = 0;
    $.each(game.scorecard, function(i, e){
      parSum += e.par;
      scoreSum += e.score;
    });
    return scoreSum - parSum;
  };

  Template.gamereport.rendered = Template.hole.rendered = function(){

    var game = Games.findOne({_id:Session.get('game')});

    // Build arrays
    var labelAry = [];
    $.each(game.scoreOverTime, function(i, e){
      labelAry.push(i + 1);
    });

    console.log('scores', game.scoreOverTime);
    console.log('labels', labelAry);

    var obj = new RGraph.Line('cvs', game.scoreOverTime);
    obj.Set('chart.xaxispos', 'center');
    obj.Set('chart.yaxispos', 'left');
    obj.Set('chart.ylabels', false);
    obj.Set('chart.background.grid.vlines', false);
    obj.Set('chart.background.grid.border', false);
    obj.Set('chart.units.post', ' score');
    obj.Set('chart.hmargin', 0);
    obj.Set('chart.labels', labelAry);
    obj.Set('chart.linewidth', 5);
    obj.Set('chart.shadow', true);
    obj.Set('chart.shadow.offsetx', 0);
    obj.Set('chart.shadow.offsety', 0);
    obj.Set('chart.shadow.offsety', 0);
    obj.Set('chart.shadow.blur', 15);
    obj.Set('chart.shadow.color', '#aaa');
    obj.Set('chart.colors', ['red','black']);
    obj.Set('chart.curvy', true);
    obj.Set('chart.curvy.tickmarks', false);


    /**
    * This draws the scale for the line chart manually
    */
    obj.ondraw = function (obj)
    {
        var ca = obj.canvas;
        var co = obj.context;

        co.fillStyle = '#666';
        var units = obj.Get('chart.units.post');
        var size = 8;
        var font = 'Arial';

        for (var i=0; i<obj.scale.length; i++) {

            var x    = obj.Get('chart.gutter.left') - 5;
            var y    = obj.getYCoord(obj.scale[i]) - 2;
            var text = obj.scale[i].toString() + units;

            RGraph.Text(co, font,size,x,y,text)
        }
        
        // Draw the zero (it isn't normally drawn)
        RGraph.Text(co,font,size,x,ca.height - obj.Get('chart.gutter.bottom') - 2,'0' + units);
        
        // Because we're not drawing an axis, draw an extra grid line
        co.beginPath();
            co.strokeStyle = obj.Get('chart.background.grid.color');
            co.moveTo(obj.Get('chart.gutter.left'), AA(this, ca.height - obj.Get('chart.gutter.bottom')));
            co.lineTo(ca.width - obj.Get('chart.gutter.right'), AA(this, obj.canvas.height - obj.Get('chart.gutter.bottom')) );
        co.stroke();
    }
        RGraph.Effects.Line.jQuery.Trace(obj, {'duration': 750});

  };

  // Confirm before leaving the page
  window.onbeforeunload = function() {
    return "You will loose your data if you leave.";
  }

}

if (Meteor.is_server) {
  Meteor.startup(function () {
    Courses.remove({zipcode:50010});
    if (Courses.find().count() === 0) {
     Courses.insert({name:"Carroll Marty", zipcode:50010});
     Courses.insert({name:"North Ames", zipcode:50010});
    }
  });
}