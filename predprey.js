// Setup simulation!
args = getArgs({width:100, height:100, scale:5, pred:10, prey:10});
world = new World(args);

ground = {
  color: world.createColor(0,60,0),
};

pred = {
  color: world.createColor(200,70,0),
  step: function(sense) {
    return choice(directions)
  },
  interact: function(other) {
    if(other == ground)
      return [ground, ground] // didn't eat or swap positions with predator, die.
    return [pred, pred]
  }
}

/*
 * prey reproduces into empty cells
 */
prey = {
  color: world.createColor(0, 200, 0),
  step: function(sense) {
    return choice(directions)
  },
  interact: function(other) {
    if(other == pred)
      return [pred, pred] // predator eats you and breeds

    // ground - breed
    // prey - swap positions
    // either way, prey prey
    return [prey, prey]
  }
};

plot = new Plot([pred.color, prey.color]);
simulate({
  world: world,
  setup: function(world) {
    // fill the world
    for(var r = world.HEIGHT; r-->0 ;)
    for(var c = world.WIDTH; c-->0 ;)
      world.set(r,c, ground);

    for(var count = world.CELLS * args.pred / 100 ; count-->0 ;)
      world.set(rint(world.HEIGHT), rint(world.WIDTH), pred);

    for(var count = world.CELLS * args.prey / 100 ; count-->0 ;)
      world.set(rint(world.HEIGHT), rint(world.WIDTH), prey);
  },
  step: function() {
    data = {
      'pred':0,
      'prey':0,
    }

    for(var r = world.HEIGHT; r-->0 ;)
    for(var c = world.WIDTH; c-->0 ;)
    {
      switch(world.world[r][c]) {
        case pred: data.pred ++; break;
        case prey: data.prey ++; break;
      }
    }
    var sum = data.pred + data.prey
    // zoom to .4 to .6
    // by doing (x-.4)*5
    plot.addData([
        (data.pred / sum -.4)*5,
        (data.prey / sum -.4)*5])


  }
});
