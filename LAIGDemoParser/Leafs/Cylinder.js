/**
 * Created by juntas on 09-10-2017.
 */
function myCylinder(scene, height, base, top, slices, stacks)
{
  CGFobject.call(this, scene);

  this.base = base || 10;

  this.top = top || 10;

  this.height = height || 10;

  this.slices = slices || 10;

  this.stacks = stacks || 10;

  this.tube = new myTube(scene, this.base, this.top, this.height, this.slices, this.stacks);

  this.up = new myCircle(scene, this.slices, this.top);

  this.down = new myCircle(scene, this.slices, this.base);
}

myCylinder.prototype = Object.create(CGFobject.prototype);

myCylinder.prototype.constructor = myCylinder;

myCylinder.prototype.display = function() {
  this.tube.display();

  this.scene.pushMatrix();
    this.scene.translate(0, 0, this.height);

    this.up.display();
  this.scene.popMatrix();

  this.scene.pushMatrix();
    this.scene.rotate(Math.PI, 0, 1, 0);

    this.scene.scale(-1, -1, 1);

    this.down.display();
  this.scene.popMatrix();
}