args = getArgs({
  //Screen
  width:200, height:200, scale:3,
  // How much to fill with 'rock'
  percent:40,

  // A number kind of related to how long to wait to start
  // low = wait until everything has settled
  // high = hurry up and go.
  // scale = 0 to around $percent above.
  waterfallStart:5,

  // How much of the space to fill with water
  waterFill:30});
world = new World(args);

moved = 0;
wall = {
  color: world.createColor(128, 64, 0),
  step: function(sense) {
    var neighbors = sense(1);
    var walls = 0;
    for(var i = 0 ; i < 9 ; i++)
      if(neighbors[i] == wall)
        walls += 1;
    if(walls > 4) {
     return dir.none;
    }
    moved += 1
    return choice(directions)
  },
  interact: function(other) {
    return [other, this];
  }
};

space = {
  color: world.createColor(64, 32, 0),
};


// Wall that doesn't move. Used during the waterfall state.
wall2 = {
  color: wall.color
}
water = {
  color: world.createColor(0,0,200),
  step: function(sense) {
    var neighbors = sense(1);
    // 0 1 2
    // 3 4 5
    // 6 7 8
    if(Math.random() > .5)
      return dir.none;

    if(neighbors[7] == space)
      return dir.south;
    return choice([dir.west, dir.east])

  },
  interact: function(other) {
    if(other == wall2)
      return [this, other]
    return [other, this]
  }
}
water2 = {
  color: world.createColor(50,50,200),
  step: water.step,
  interact: water.interact
}


function startWaterfall() {
  simulate({
    world: world,
    setup: function(world) {
      for(var r = world.HEIGHT; r-->0 ;)
      for(var c = world.WIDTH; c-->0 ;) {
        if(world.get(r,c) == wall) {
          var n = world.getNeighborhood(r,c,1)
          var wallCount = 0;
          for(var i = 0 ; i < 9 ; i++)
            if(n[i] == wall || n[i] == wall2)
              wallCount ++;
          if(wallCount >3)
            world.set(r,c, wall2);
          else
            world.set(r,c, space);
        }
        else if(Math.random() < args.waterFill/100) {
          world.set(r,c, choice([water, water2]))
        }
      }
    }
  })
}

simulate({
  world: world,
  setup: function(world) {
    for(var r = world.HEIGHT; r-->0 ;)
    {
      for(var c = world.WIDTH; c-->0 ;) {
        world.set(r,c,space);
      }
    }

    for(var count = world.CELLS * args.percent / 100 ; count-->0 ;)
      world.set(rint(world.HEIGHT), rint(world.WIDTH), wall);
  },
  step: function() {
    if(moved > args.waterfallStart / 100 * world.CELLS * args.percent / 100) {
      moved = 0;
      return;
    }
    startWaterfall()
    return true;
  }
});

