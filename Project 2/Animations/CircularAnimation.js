/**
 * CircularAnimation class that is an extension of Animation class.
 * This class makes an object rotate around a given center,
 *at a radius distance.
**/
class CircularAnimation extends Animation
{
  constructor(scene, id, centerCoords, radius, initAng, rotAng, animationSpeed)
  {
    //calls the parent class constructor (Animation)
    super(scene, id, animationSpeed);

    //animation center coordinates
    this.centerCoords = centerCoords;

    //rotation radius
    this.radius = radius;

    //initial angle of rotation in degrees
    this.initAng = initAng;

    //animation ending angle in degrees
    this.rotAng = rotAng;
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

  //returns animation radius to the center
  get radius()
  {
    return this.radius;
  }

  //returns the starting angle of the animation
  get initialAngle()
  {
    return this.initAng;
  }

  //returns how much the object is going to rotate
  get rotationAngle()
  {
    return this.rotAng;
  }

  //returns the final rotation of the object
  get totalRotation ()
  {
    return initialAngle() + rotationAngle();
  }
}
