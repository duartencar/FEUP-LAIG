function myCircle(scene, slices, radius){
	CGFobject.call(this,scene);

	this.slices = slices;
	this.radius = radius;

	this.initBuffers();
}

myCircle.prototype = Object.create(CGFobject.prototype);
myCircle.prototype.constructor = myCircle;

myCircle.prototype.initBuffers = function(){

	this.vertices = new Array();

	this.normals = new Array();

	this.indices = new Array();

	this.initaltext = new Array();

  var x = 0;

  var y = 0;

  var ang = (2 * Math.PI) / this.slices;

  for (i = 0; i < this.slices; i++)
  {
    this.vertices.push(Math.cos(ang * i) * this.radius);
    this.vertices.push(Math.sin(ang * i) * this.radius);
    this.vertices.push(0);
    this.vertices.push(Math.cos(ang * (i + 1)) * this.radius);
    this.vertices.push(Math.sin(ang * (i + 1)) * this.radius);
    this.vertices.push(0);
    this.vertices.push(0, 0, 0);

    this.indices.push(this.vertices.length / 3 - 3);
    this.indices.push(this.vertices.length / 3 - 2);
    this.indices.push(this.vertices.length / 3 - 1);

    this.normals.push(0, 0, 1);
		this.normals.push(0, 0, 1);
		this.normals.push(0, 0, 1);

    this.initaltext.push(0.5 + Math.cos(ang * i) / 2, 0.5 - Math.sin(ang * i) / 2);
    this.initaltext.push(0.5 + Math.cos(ang * (i + 1)) / 2, 0.5 - Math.sin(ang * (i + 1)) / 2);
    this.initaltext.push(0.5, 0.5);
  }

  this.vertices.push(Math.cos(ang), Math.sin(ang));

  this.texCoords = this.initaltext.slice();

	this.primitiveType = this.scene.gl.TRIANGLES;

	this.initGLBuffers();
}




