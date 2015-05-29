
function Plot(colors) {
  body = document.getElementsByTagName("body")[0];
  this.canvas = document.createElement("canvas");
  this.canvas.height = 100;
  container = document.createElement("div")
  container.appendChild(this.canvas);
  body.appendChild(container);
  this.ctx = this.canvas.getContext('2d');
  this.pid = 0; // point id

  this.colors = [];
  for(var i in colors){
    var data = colors[i].data;
    this.colors[i] = rgbToHex(data[0], data[1], data[2])
  }
}

Plot.prototype.addData = function(values) {
  var ctx = this.ctx;
  var y = 100;
  console.log(values)
  for(var cid in this.colors) {
    ctx.strokeStyle = this.colors[cid];
    ctx.beginPath();
    ctx.moveTo(this.pid, y);
    y -= values[cid] * this.canvas.height;
    ctx.lineTo(this.pid, y);
    ctx.stroke();
    ctx.closePath();
  }

  this.pid+=1;

  if (this.pid == this.canvas.width) {
    var data = this.ctx.getImageData(0,0,
      this.canvas.width, this.canvas.height)
    this.canvas.width *= 2
    this.canvas.style.width = this.canvas.width
    this.ctx.putImageData(data,0,0)
  }
}


function rgbToHex(r, g, b) {
      return "#" + (
          (1 << 24) +
          (r << 16) +
          (g << 8) + b).toString(16).slice(1);
}
