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
  updateElpasedTime(Time)
  {
    this.elapsedTime += Time;
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

  //returns initial points
  get initialPoint()
  {
    return this.cPoints[0];
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

    for(var i = 0; i < num; i++)
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
    let total = 0;

    let points = this.controlP;

    var distanceBetweenPoints = function(p1, p2)
    {
      var dx, dy, dz;

      dx = p2[0] - p1[0];

      dy = p2[1] - p1[1];

      dz = p2[2] - p1[2];

      return Math.hypot(dx, dy, dz);
    }

    for(var i = 0; i < points.length - 1; i++)
      total += distanceBetweenPoints(points[i], points[i+1]);

    return total;
  }

  //returns the time that will take from the begin to the end of the animation
  animationSpan()
  {
    return this.totalDistance / this.animationSpeed;
  }

  //returns the movement direction
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

    for(var i = 0; i < points.length - 1; i++)
    {
      distanceCovered -= distanceBetweenPoints(points[i], points[i+1]);

      if(distanceCovered <= 0)
        return dir[i];
    }

    return dir[points.length - 1];
  }

  //returns a matrix with the movement in a certain interval of time
  movement(diff)
  {
    var Matrix = mat4.create();

    var dir = this.currentDirection();

    var trans = [
                dir[0] * this.speed * diff, //x
                dir[1] * this.speed * diff, //y
                dir[2] * this.speed * diff, //z
              ];

    mat4.translate(Matrix, mat4.create(), trans);

    return Matrix;
  }

  //returns the correct matrix for a given scene moment
  correctMatrix(diffTime, totalSceneTime)
  {
    //if time in scene is bigger than animationSpan means that there isn t movement
    if(totalSceneTime >= this.animationSpan())
      return mat4.create(); //returns identity because there sno movement
    else
    {
      if (totalSceneTime != this.elapsedTime)
      {
        this.updateElpasedTime(diffTime);

        var trans = this.movement(diffTime);

        /*var dir = this.currentDirection();

        var ang = Math.atan(dir[2], dir[0]);

        mat4.rotateY(trans, trans, ang);*/

        return trans;
      }
      else if ((totalSceneTime == 0) && (this.elapsedTime == 0))
      {
        var Matrix = mat4.create();

        var dir = this.initialPoint;

        var ang = Math.atan(dir[0], dir[2]);

        //mat4.rotateY(Matrix, mat4.create(), ang);

        mat4.translate(Matrix, mat4.create(), dir);

        return Matrix;
      }
      else
        return mat4.create(); //returns identity because there sno movement
    }
  }
}
