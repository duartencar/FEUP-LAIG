/**
 * LinearAnimation class that is an extension of Animation class.
 * This class makes an object travel linearly through a scene,
 *between assign control point with a certain spee.
**/
class LinearAnimation extends Animation
{
  constructor(scene, id, animationSpeed, controlPoints)
  {
    //calls the parent class constructor (Animation)
    super(scene, id, animationSpeed);

    //contains animations control points
    this.cPoints = controlPoints;
  }

  //returns animation ID
  get id()
  {
    return this.ID;
  }
  //returns animation speed
  get animationSpeed()
  {
    return this.speed;
  }
}
