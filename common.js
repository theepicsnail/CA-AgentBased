
function World(config) {
  // rows/cols
  console.log(config)
  this.WIDTH = config.width || 100;
  this.HEIGHT = config.height || 100;
  this.CELLS = this.WIDTH * this.HEIGHT;

  // size of each cell in pixels.
  this.SCALE = config.scale || 1;

  this.canvas = document.getElementById("world");
  this.canvas.style.imageRendering = "pixelated";
  this.canvas.style.width = this.WIDTH * this.SCALE;
  this.canvas.style.height = this.HEIGHT * this.SCALE;
  this.canvas.width = this.WIDTH;
  this.canvas.height = this.HEIGHT;
  this.ctx = this.canvas.getContext('2d');

  // Fill the world with 'undefined'
  this.world = []
  for(var r = this.HEIGHT ; r-->0 ;) {
    var row = [];
    this.world.push(row);
    for(var c = this.WIDTH; c-->0 ;) {
      row.push(undefined);
    }
  }
}

// supports negative and overflow indexing.
// (negative is .. 'good enough' but not right)
World.prototype.get = function(row, col) {
  var row = (row + this.HEIGHT) % this.HEIGHT;
  var col = (col + this.WIDTH) % this.WIDTH;
  return this.world[row][col];
}

World.prototype.set = function(row, col, val) {
  var row = (row + this.HEIGHT) % this.HEIGHT;
  var col = (col + this.WIDTH) % this.WIDTH;
  this.world[row][col] = val;
  this.ctx.putImageData(this.world[row][col].color, col, row)
}

World.prototype.getNeighborhood = function(row, col, radius) {
  var neighborhood = [];
  for(var dr = -radius; dr <= radius; dr ++)
  for(var dc = -radius; dc <= radius; dc ++)
  {
    neighborhood.push(this.get(row+dr, col+dc))
  }
  return neighborhood;
}

// Updates a bunch of randomly selected cells
// normal iteration causes problems for cells that move right or down
// since they get updated multiple times in 1 pass.
// This way makes that problem less of a problem
// It does miss some cells and get others 2 or more times,
// but it all averages out.
World.prototype.step = function() {
  for(var count = this.CELLS; count-->0 ;) {
    this.updateCell(rint(this.HEIGHT), rint(this.WIDTH));
  }
}

// Call a cells 'step(sense)' method.
World.prototype.updateCell = function(r,c) {
  var cell = this.get(r,c);
  if(cell == undefined)
    return console.warn("Undefined cell at ", r, c);

  if(cell.step == undefined) // no step function? no problem.
    return

  var world = this;
  var action = cell.step(function(radius){
    return world.getNeighborhood(r,c,radius);
  });

  // For this to work, step needs to return
  // dir.something not a list. This compares references not values
  if(action == dir.none)
    return

  var dest = this.get(r + action[0], c + action[1]);

  var res = cell.interact(dest);
  this.set(r,c, res[0])
  this.set(r+action[0], c+action[1], res[1])
}

World.prototype.createColor = function(r,g,b) {
  color = this.ctx.createImageData(1,1);
  color.data[0]=r;
  color.data[1]=g;
  color.data[2]=b;
  color.data[3]=255;
  return color
}

// Utilities and the like.
dir = {
  none: [0,0],
  north: [-1, 0],
  south: [1, 0],
  west: [0,-1],
  east: [0,1],
}
directions = [dir.north, dir.west, dir.south, dir.east]

function rint(max) {
  return (Math.random()*max)|0;
}
function choice(list) {
  return list[rint(list.length)];
}

function simulate(config) {
  var frames = 0;
  var world = config.world;
  config.setup(world)

  mainLoop = function() {
    world.step();
    if(config.step)
      if(config.step()==true)
        return;

    frames ++;
    requestAnimationFrame(mainLoop);
  };

  setInterval(function(){
    console.log("Fps:", frames);
    frames = 0;
  },1000);

  mainLoop();
}

/* 'parse' the args passed in as the hash from the location.
 * url.com/#foo=bar,baz=3
 * returns { 'foo':'bar', 'baz':3 }
 *
 * Hacky and breaks on anything kind of tricky.
 */
function getArgs(baseConfig) {
  baseConfig = baseConfig || {};
  var arglist = location.hash.substr(1).split(",");
  for(var id in arglist) {
    var parts = arglist[id].split("=")
    if(parts.length != 2)
    {
      console.log("Skipping arg", id, arglist[id], "Expected 'key=value' format.");
      continue
    }

    var val = parseInt(parts[1]);
    if (val == NaN) {
      val = parts[1];
    }
    baseConfig[parts[0]]=val;
  }


  var args = [];
  for(var key in baseConfig) {
    args.push(key + "=" + baseConfig[key])
  }
  location.hash = args.join(",");
  return baseConfig;
}
