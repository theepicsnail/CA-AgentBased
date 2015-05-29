// General purpose interaction function!
function handleInteraction(src, dst) {
  // [h]uman, [z]ombie, [w]all, [g]round interaction
  //  h z w g
  //h 4 3 1 2
  //z 3 4 1 2
  //w 1 1 1 1
  //g 2 2 1 2

  //Walls can't move, and things can't move into walls. no. (case 1)
  if(src == wall || dst == wall)
    return [src, dst]

  // anything can move to open ground (case 2)
  // weird. dst == ground, src == ground... shouldn't happen but whatever.
  if(dst == ground)
    return [ground, src]


  if(src == zombie || dst == zombie)
  if(src == human || dst == human) {
    // human zombie interaction. case (3)
    return [zombie, zombie]
  }

  // human human, zombie zombie, case(4)
  return [src, dst]
}

function addHouse(world, row, col) {
  for(var i = -7; i <= 7; i++) {
    world.set(row + i, col + 7, wall);
    world.set(row + i, col - 7, wall);
    world.set(row + 7, col + i, wall);
    world.set(row - 7, col + i, wall);
  }

  // Make a door
  switch(rint(4)) {
    case 0: world.set(row-7, col, ground); break;
    case 1: world.set(row+7, col, ground); break;
    case 2: world.set(row, col-7, ground); break;
    case 3: world.set(row, col+7, ground); break;
  }
}



// Setup simulation!
args = getArgs({width:100, height:100, scale:5, percent:10});
world = new World(args);

ground = {
  color: world.createColor(80,80,80),
};
wall = {
  color: world.createColor(0,0,0),
}
human = {
  color: world.createColor(0, 255, 0),
  step: function(sense) {
    return choice(directions)
  },
  interact: function(other) {
    return handleInteraction(this, other)
  }
};

zombie = {
  color: world.createColor(127,0,127),
  step: function(sense) {
    // if there's a human next to us, attack!
    var neighbors = sense(1); // sense +- 1 in each direction.
    // 0 1 2
    // 3 4 5
    // 6 7 8
    if (neighbors[1] == human)
      return dir.north;
    if (neighbors[3] == human)
      return dir.west;
    if (neighbors[5] == human)
      return dir.east;
    if (neighbors[7] == human)
      return dir.south;
    return choice(directions)
  },
  interact: function(other) {
    return handleInteraction(this, other)
  }
}

p = new Plot([zombie.color, human.color]);
simulate({
  world: world,
  setup: function(world) {
    // fill the world
    for(var r = world.HEIGHT; r-->0 ;)
    for(var c = world.WIDTH; c-->0 ;)
      world.set(r,c, ground);

    // add some people (10)
    for(var count = world.CELLS * args.percent / 100 ; count-->0 ;)
      world.set(rint(world.HEIGHT), rint(world.WIDTH), human);

    for(var crow = 10; crow < world.HEIGHT; crow += 20)
    for(var ccol = 10; ccol < world.WIDTH; ccol += 20)
    addHouse(world, crow, ccol)

    // zombie attack!
    var r = rint(world.HEIGHT);
    var c = rint(world.WIDTH);
    while (world.get(r,c) == wall) {
      r = rint(world.HEIGHT);
      c = rint(world.WIDTH);
    }
    world.set(r,c, zombie);
  },
  step: function() {
    data = {
      'zombie':0,
      'human':0,
    }
    for(var r = world.HEIGHT; r-->0 ;)
    for(var c = world.WIDTH; c-->0 ;)
    {
      switch(world.world[r][c]) {
        case zombie: data.zombie ++; break;
        case human: data.human ++; break;
      }
    }
    var sum = data.zombie + data.human
    p.addData([data.zombie / sum, data.human / sum])

    if(data.human == 0)
      return true;
  }
});
