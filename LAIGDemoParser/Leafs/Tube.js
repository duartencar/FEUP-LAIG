/**
 * Created by juntas on 06-10-2017.
 */

function myTube(scene, base, top, height, slices, stacks)
{
  CGFobject.call(this, scene);

  this.base = base;

  this.top = top;

  this.height = height;

  this.slices = slices;

  this.stacks = stacks;

  this.initBuffers();
}

myTube.prototype = Object.create(CGFobject.prototype);

myTube.prototype.constructor = myTube;

myTube.prototype.initBuffers = function()
{
  this.vertices = new Array();

  this.indices = new Array();

  this.normals = new Array();

  this.texCoords = new Array();

  var progression = (this.base - this.top) / (this.stacks);

  var patchX = 1 / this.slices;

  var patchY = 1 / this.stacks;

  var x = 0;

  var y = 0;

  var rot = (2 * Math.PI) / this.slices;

  for(var i = 0; i <= this.stacks; i++, x = 0, y += patchY)
  {
    for(var k = 0; k < this.slices; k++, x += patchX)
    {
      this.vertices.push(Math.cos(rot * k) * ((this.stacks - i) * progression + this.top)); //x
      this.vertices.push(Math.sin(rot * k) * ((this.stacks - i) * progression + this.top)); //y
      this.vertices.push(i / this.stacks * this.height);                                    //z

      this.normals.push(Math.cos(rot * k), Math.sin(rot * k), 0);

      this.normals.push(x, y);
    }
  }
}