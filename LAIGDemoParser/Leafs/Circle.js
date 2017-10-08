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

	var x = 0;
	var y = 0;
	var z = 0;

	this.vertices.push(x,y,z);

	var currentAngle = 0;

	for(var i = 0; i < this.slices; i++){
		x = Math.sin(currentAngle);
		y = Math.cos(currentAngle);

		this.vertices.push(x, y, z);
		this.normals.push(x, y, z);

		if( i != (this.slices - 1)){
			currentAngle += ((Math.PI*2) / 	this.slices);
		
			x = Math.sin(currentAngle);
			y = Math.cos(currentAngle);

			this.vertices.push(x,y,z);
			this.normals.push(x,y,z);

			this.indices.push(0, i+1, i+2);
		}
		else{
			this.indices.push(0, i+1, 1);
		}
	}
	this.primitiveType = this.scene.gl.TRIANGLES;
 	this.initGLBuffers();
}




