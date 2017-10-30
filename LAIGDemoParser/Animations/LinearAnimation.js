
class LinearAnimation extends Animation
{
  constructor(scene, id, duration, controlPoints, animationSpeed)
  {
    //calls the parent class constructor (Animation)
    super(scene, id, duration);

    //contains animations control points
    this.cPoints = controlPoints;

    //the animation speed
    this.aSpeed = animationSpeed
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
