/**
 * Created by juntas on 23-10-2017.
 */
function myTree(scene, th, tb, ch, cb, nt)
{
  CGFobject.call(this, scene);

  this.scene = scene;

  this.th = th;

  this.tb = tb;

  this.ch = ch;

  this.cb = cb;

  this.nt = nt;

  if(this.ch > this.th)
  {
    console.log("Triangle height is bigger than Cone height");
    return null;
  }

  this.cone = new myCylinder(scene,this.th, this.tb, 0, 20, 20, 0, 1);

  this.triFront = new myTriangle(scene, 0, this.th, 0, 0, this.th - this.ch, 0, this.cb, this.th - this.ch, 0);

  this.triBack = new myTriangle(scene, 0, this.th - this.ch, 0, 0, this.th, 0, this.cb, this.th - this.ch, 0);

  this.rotAngle = 360 / this.nt;
}

myTree.prototype = Object.create(CGFobject.prototype);

myTree.prototype.constructor = myTree;

myTree.prototype.display = function()
{
  this.scene.pushMatrix();
    this.scene.rotate(-90 * Math.PI / 180, 1, 0, 0);
    this.cone.display();
  this.scene.popMatrix();

  for(var i = 0; i < this.nt; i++)
  {
    this.scene.pushMatrix();
      this.scene.rotate(this.rotAngle * i * Math.PI / 180, 0, 1, 0);
      this.triFront.display();
      this.triBack.display();
    this.scene.popMatrix();
  }
};