function myTriangle(scene, p1, p2, p3) //p# array com as coordenadas do ponto #
{
    CGFobject.call(this,scene);

    this.p1 = p1;

    this.p2 = p2;

    this.p3 = p3;

    this.initBuffers();
}

myTriangle.prototype = Object.create(CGFobject.prototype);

myTriangle.prototype.constructor = myTriangle;

myTriangle.prototype.initBuffers = function() {

    this.vertices = p1 + p2 + p3;

    this.indices = [0, 1, 2];

    //falta o vetor das normais e das texCoords

    this.primitiveType=this.scene.gl.TRIANGLES;

    this.initGLBuffers();
}