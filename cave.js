args = getArgs({width:100, height:100, scale:3, percent:40, minWalls:4, maxWalls:9});
world = new World(args);
dirs = [dir.north, dir.south, dir.west, dir.east]

wall = {
  color: world.createColor(128, 64, 0),
  step: function(sense) {
    var neighbors = sense(1);
    var walls = 0;
    for(var i = 0 ; i < 9 ; i++)
      if(neighbors[i] == wall)
        walls += 1;
    if(walls > args.minWalls && walls <= args.maxWalls)
     return dir.none;
    return choice(dirs)
  },
  interact: function(other) {
    return [other, this];
  }
};

space = {
  color: world.createColor(64, 32, 0),
  step: function(sense) {
    return dir.none;
  }
};

simulate({
  world: world,
  setup: function(world) {
    for(var r = world.HEIGHT; r-->0 ;)
    {
      world.set(r,0, wall);
      world.set(r,world.WIDTH-1, wall);
      for(var c = world.WIDTH-1; c-->1 ;) {
        world.set(r,c,space);
      }
    }

    for(var c = world.WIDTH; c-->0 ;) {
      world.set(0,c, wall);
      world.set(world.HEIGHT-1,c, wall);
    }

    for(var count = world.CELLS * args.percent / 100 ; count-->0 ;)
      world.set(rint(world.HEIGHT), rint(world.WIDTH), wall);

  }
});
