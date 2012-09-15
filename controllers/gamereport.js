// Game Report

if (Meteor.is_client) { 

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
	
}