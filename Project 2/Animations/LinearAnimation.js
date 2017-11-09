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

  //sets elapsed time
  elapsed(time)
  {
    this.elapsedTime = time;
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

  //returns control points array
  get controlP()
  {
    return this.cPoints;
  }

  //returns an array with all directions
  get directions()
  {
    var dir = [];

    var x, y, z;

    var num = this.numberOfDirections;

    var points = this.controlP;

    for(let i = 0; i < num; i++)
    {
      x = points[i + 1][0] - points[i][0];
      y = points[i + 1][1] - points[i][1];
      z = points[i + 1][2] - points[i][2];

      dir.push([x, y, z]);
    }

    return dir;
  }

  //returns the total distance than an object will travel with an animation
  get totalDistance()
  {
    var total = 0;

    var points = this.controlP;

    var distanceBetweenPoints = function(p1, p2)
    {
      var dx, dy, dz;

      dx = p2[0] - p1[0];

      dy = p2[1] - p1[1];

      dz = p2[2] - p1[2];

      return Math.hypot(dx, dy, dz);
    }

    for(var i = 0; i < points.lenght - 1; i++)
      total += distanceBetweenPoints(points[i], points[i+1]);

    return total;
  }

  //returns the time that will take from the begin to the end of the animation
  get animationSpan()
  {
    return this.totalDistance / this.animationSpeed;
  }

  currentDirection()
  {
    var distanceCovered = this.animationSpeed * this.elapsedTime;

    var points = this.controlP;

    var dir = this.directions;

    var distanceBetweenPoints = function(p1, p2)
    {
      var dx, dy, dz;

      dx = p2[0] - p1[0];

      dy = p2[1] - p1[1];

      dz = p2[2] - p1[2];

      return Math.hypot(dx, dy, dz);
    }

    for(let i = 0; i < points.length - 1; i++)
    {
      distanceCovered -= distanceBetweenPoints(points[i], points[i+1]);

      if(distanceCovered <= 0)
        return dir[i];
    }

    return dir[points.length - 1];
  }

  /*//returns a matrix with the transformation matrix
  get movement()
  {

  }*/
}
