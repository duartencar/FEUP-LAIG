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

    //elapsed time
    this.elapsedTime = 0;
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

  //returns the number of times that an object must change direction
  get numberOfDirections()
  {
    return this.cPoints.length - 1;
  }

  get controlP()
  {
    return this.cPoints;
  }

  get directions()
  {
    var dir = [];

    var x, y, z;

    var num = this.numberOfDirections;

    var points = this.controlP;

    for(var i = 0; i < num; i++)
    {
      x = points[i + 1][0] - points[i][0];
      y = points[i + 1][1] - points[i][1];
      z = points[i + 1][2] - points[i][2];

      dir.push([x, y, z]);
    }

    return dir;
  }

  /*//returns a matrix with the transformation matrix
  get movement()
  {

  }*/
}
