/**
 * Created by juntas on 09-10-2017.
 */
function myCylinder(scene, height, base, top, slices, stacks, Tup, Tdown)
{
  CGFobject.call(this, scene);

  this.base = base;

  this.top = top;

  this.height = height;

  this.slices = slices;

  this.stacks = stacks;

  this.tube = new myTube(scene, this.base, this.top, this.height, this.slices, this.stacks);

  if(Tup)
    this.up = new myCircle(scene, this.slices, this.top);

  if(Tdown)
    this.down = new myCircle(scene, this.slices, this.base);
}

myCylinder.prototype = Object.create(CGFobject.prototype);

myCylinder.prototype.constructor = myCylinder;

myCylinder.prototype.display = function()
{
  this.tube.display();

  if(this.up != null)
  {
    this.scene.pushMatrix();

      this.scene.translate(0, 0, this.height);

      this.up.display();

    this.scene.popMatrix();
  }

  if(this.down != null)
  {
    this.scene.pushMatrix();

      this.scene.rotate(Math.PI, 0, 1, 0);

      this.scene.scale(-1, -1, 1);

      this.down.display();

    this.scene.popMatrix();
  }
};