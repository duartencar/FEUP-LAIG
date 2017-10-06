function myRectangle(scene, lx, ly, rx, ry, minS, maxS, minT, maxT)
{
  CGFobject.call(this, scene);

  this.lx = lx;

  this.ly = ly;

  this.rx = rx;

  this.ry = ry;

  this.minS = minS || 0;

  this.maxS = maxS || 1;

  this.minT = minT || 0;

  this.maxT = maxT || 1;

  this.initBuffers();
};

myRectangle.prototype = Object.create(CGFobject.prototype);

myRectangle.prototype.constructor = myRectangle;

myRectangle.prototype.initBuffers = function()
{
  this.vertices = [
      this.lx, this.ly, 0, //0
      this.lx, this.ry, 0, //1
      this.rx, this.ry, 0, //2
      this.rx, this.ly, 0  //3
  ];

  this.indices = [
      0, 1, 2,
      2, 3, 0
  ];

  this.normals = [
      0, 0, 1,
      0, 0, 1,
      0, 0, 1,
      0, 0, 1
  ];

  this.texCoords = [
      this.minS, this.maxT,
      this.maxS, this.maxT,
      this.minS, this.minT,
      this.maxS, this.minT
  ];

  this.primitiveType = this.scene.gl.TRIANGLES;

  this.initGLBuffers();
};
