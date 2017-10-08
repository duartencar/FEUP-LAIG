function myTriangle(scene, x1, y1, z1, x2, y2, z2, x3, y3, z3, minS, maxS, minT, maxT) //p# array com as coordenadas do ponto #
{
  CGFobject.call(this,scene);

  this.p1 = [x1, y1, z1];

  this.p2 = [x2, y2, z2];

  this.p3 = [x3, y3, z3];

  this.minS = minS || 0;

  this.maxS = maxS || 1;

  this.minT = minT || 0;

  this.maxT = maxT || 1;

  this.initBuffers();
}

myTriangle.prototype = Object.create(CGFobject.prototype);

myTriangle.prototype.constructor = myTriangle;

myTriangle.prototype.initBuffers = function()
{
  this.vertices = this.p1;

  this.vertices = this.vertices.concat(this.p2);

  this.vertices = this.vertices.concat(this.p3);

  this.indices = [
    0, 1, 2
  ];

  this.normals = [
    0, 0, 1,
    0, 0, 1,
    0, 0, 1
  ];

  var x = Math.sqrt((this.p3[0] - this.p2[0]) * (this.p3[0] - this.p2[0]) +
    (this.p3[1] - this.p2[1]) * (this.p3[1] - this.p2[1]) +
    (this.p3[2] - this.p2[2]) * (this.p3[2] - this.p2[2]));

  var y = Math.sqrt((this.p1[0] - this.p3[0]) * (this.p1[0] - this.p3[0]) +
    (this.p1[1] - this.p3[1]) * (this.p1[1] - this.p3[1]) +
    (this.p1[2] - this.p3[2]) * (this.p1[2] - this.p3[2]));

  var z = Math.sqrt((this.p2[0] - this.p1[0]) * (this.p2[0] - this.p1[0]) +
    (this.p2[1] - this.p1[1]) * (this.p2[1] - this.p1[1]) +
    (this.p2[2] - this.p1[2]) * (this.p2[2] - this.p1[2]));

  var cos = (Math.pow(x, 2) - Math.pow(y, 2) + Math.pow(z, 2)) / (2 * x * z);

  var acos = Math.acos(cos);

  this.initaltext = [
    0, 0,
    z, 0,
    z - x * cos, x * Math.sin(acos)
  ];

  this.texCoords = this.initaltext.slice();

  this.primitiveType = this.scene.gl.TRIANGLES;

  this.initGLBuffers();
}
