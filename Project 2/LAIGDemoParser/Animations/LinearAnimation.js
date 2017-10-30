/**
 * LinearAnimation class that is an extension of Animation class.
 * This class makes an object travel linearly through a scene,
 *between assign control point with a certain spee.
**/
class LinearAnimation extends Animation
{
  constructor(scene, id, duration, controlPoints, animationSpeed)
  {
    //calls the parent class constructor (Animation)
    super(scene, id, duration);

    //contains animations control points
    this.cPoints = controlPoints;

    //the animation speed
    this.aSpeed = animationSpeed;
  }

  //returns animation ID
  get id()
  {
    return this.ID;
  }

  //returns animaton duration
  get duration ()
  {
    return this.duration;
  }

  //returns animation speed
  get animationSpeed()
  {
    return this.aSpeed;
  }
}
