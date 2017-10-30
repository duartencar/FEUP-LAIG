/**
 * Created by juntas on 07-10-2017.
 */

function mySphere(scene, radius, sections, parts)
{
  CGFobject.call(this, scene);

  this.radius = radius;

  this.sections = sections;

  this.parts = parts;

  this.initBuffers();
}

mySphere.prototype = Object.create(CGFobject.prototype);

mySphere.prototype.constructor = mySphere;

mySphere.prototype.initBuffers = function()
{
  this.vertices = new Array();

  this.indices = new Array();

  this.normals = new Array();

  this.vertices = new Array();

  this.initaltext = new Array();

  var long = (2 * Math.PI) / this.sections; //longitude

  var lat = (Math.PI) / this.parts; //latitude

  var numberOfVertices = 0;

  var x, y, z;

  for (var i = 0; i <= this.sections; i++)
  {
    for (var k = 0; k <= this.parts; k++)
    {
      x = Math.cos(long * i) * Math.sin(lat * k);

      y = Math.sin(long * i) * Math.sin(lat * k);

      z = Math.cos(lat * k);

      this.vertices.push(x * this.radius);

      this.vertices.push(y * this.radius);

      this.vertices.push(z * this.radius);

      this.normals.push(x, y, z);

      numberOfVertices++;

      if(i > 0 && k > 0)
      {
        this.indices.push(numberOfVertices - this.parts - 1);

        this.indices.push(numberOfVertices - 1);

        this.indices.push(numberOfVertices - this.parts - 2);

        this.indices.push(numberOfVertices - 1);

        this.indices.push(numberOfVertices - 2);

        this.indices.push(numberOfVertices - this.parts - 2);
      }

      this.initaltext.push(1 / 2 * x + 1 / 2);

      this.initaltext.push(1 / 2 - y * 1 / 2);
    }
  }

  this.texCoords =  this.initaltext.slice();

  this.primitiveType = this.scene.gl.TRIANGLES;

  this.initGLBuffers();
};