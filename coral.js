world = new World(100, 100, 3);

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
    for(var r = 100; r-->0 ;)
    for(var c = 100; c-->0 ;)
      world.set(r,c, water);

    // add some particles
    for(var count = 1000; count-->0 ;)
      world.set(rint(100), rint(100), particle);

    // seed the coral
    world.set(99, 50, coral);
  }
});
