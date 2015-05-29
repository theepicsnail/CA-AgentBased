args = getArgs({width:100, height:100, scale:3, corals:1, percent:10});
world = new World(args);

water = {
  color: world.createColor(0,0,200),
  step: function(sense) {
    return dir.none;
  }
};

coral = {
  color: world.createColor(127, 64, 0),
  step: function(sense) {
    return dir.none;
  }
};

particle = {
  color: world.createColor(0,0,80),
  step: function(sense) {
    return choice([
        dir.north, dir.south, dir.west, dir.east,
        dir.south // give south higher probability
    ])
  },

  interact: function(other) {
    // interact returns the new values for
    // [where 'this' is, where 'other' is]

    // Particle touches coral? it becomes coral.
    if(other == coral)
      return [coral, coral]

    // Otherwise, it moves to the new spot
    // (This swaps positions with whatever is in other)
    return [other, this]
  }
};

simulate({
  world: world,
  setup: function(world) {
    // fill the world with water
    for(var r = world.HEIGHT; r-->0 ;)
    for(var c = world.WIDTH; c-->0 ;)
      world.set(r,c, water);

    // add some particles
    for(var count = world.CELLS * args.percent / 100 ; count-->0 ;)
      world.set(rint(world.HEIGHT), rint(world.WIDTH), particle);

    // seed the corals
    var gap = world.WIDTH / args.corals;
    for(var col = gap/2; col < world.WIDTH ; col += gap)
      world.set(world.HEIGHT-5, col|0, coral);
  }
});
