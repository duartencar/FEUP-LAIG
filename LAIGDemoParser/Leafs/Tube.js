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

  this.initaltext = new Array();

  var progression = (this.base - this.top) / (this.stacks);

  var patchX = 1 / this.slices;

  var patchY = 1 / this.stacks;

  var x = 0;

  var y = 0;

  var rot = (2 * Math.PI) / this.slices;

  for(var i = 0; i <= this.stacks; i++)
  {
    for(var k = 0; k < this.slices; k++)
    {
      this.vertices.push(Math.cos(rot * k) * ((this.stacks - i) * progression + this.top)); //x
      this.vertices.push(Math.sin(rot * k) * ((this.stacks - i) * progression + this.top)); //y
      this.vertices.push(i / this.stacks * this.height);                                    //z

      this.normals.push(Math.cos(rot * k), Math.sin(rot * k), 0);

      this.initaltext.push(x, y);

      x += patchX;
    }

    x = 0;

    y += patchY;
  }

  for(var i = 0; i < this.stacks; i++)
  {
    for(var k = 0; k < this.slices - 1; k++)
    {
      this.indices.push(i * this.slices + k);

      this.indices.push(i * this.slices + k + 1);

      this.indices.push((i + 1) * this.slices + k);

      this.indices.push(i * this.slices + k + 1);

      this.indices.push((i + 1) * this.slices + k + 1);

      this.indices.push((i + 1) * this.slices + k);
    }

    this.indices.push(i * this.slices + this.slices - 1)

    this.indices.push(i * this.slices)

    this.indices.push((i + 1) * this.slices + this.slices - 1);

    this.indices.push(i * this.slices);

    this.indices.push(i * this.slices + this.slices);

    this.indices.push((i + 1) * this.slices + this.slices - 1);
  }

  this.texCoords =  this.initaltext.slice();

  this.primitiveType = this.scene.gl.TRIANGLES;

  this.initGLBuffers();
};

myTube.prototype.ampText = function(ampS, ampT)
{
  var newTextCoords = [];

  for(var i = 0; i < this.texCoords.length; i += 2)
  {
    newTextCoords.push(this.texCoords[i] / ampS);

    newTextCoords.push(this.texCoords[i + 1] / ampT);
  }

  this.texCoords = newTextCoords;

  this.updateTexCoordsGLBuffers();
};