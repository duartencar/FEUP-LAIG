function myDiamond(scene, slices)
{
    CGFobject.call(this, scene);

    this.scene = scene;

    this.slices = slices;

    this.rotAngle = Math.PI * 2 / this.slices;

    this.triangle = new myTriangle(this.scene,
        0, 2, 0,
        0, 0, 0.5,
        0.5 * Math.sin(this.rotAngle), 0, 0.5 * Math.cos(this.rotAngle));
}

myDiamond.prototype = Object.create(CGFobject.prototype);

myDiamond.prototype.constructor = myDiamond;

myDiamond.prototype.display = function ()
{
    for(var i = 0; i < this.slices; i++)
    {
        this.scene.pushMatrix();
            this.scene.rotate(this.rotAngle * i, 0, 1, 0);
            this.triangle.display();
            this.scene.rotate(Math.PI, 0, 0, 1);
            this.triangle.display();
        this.scene.popMatrix();
    }
};