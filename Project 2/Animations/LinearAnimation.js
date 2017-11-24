/**
 * LinearAnimation class that is an extension of Animation class.
 * This class makes an object travel linearly through a scene,
 * between assign control point with a certain speed.
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

    let x, y, z;

    let num = this.numberOfDirections;

    let points = this.controlP;

    for(var i = 0; i < num; i++)
    {
      x = points[i + 1][0] - points[i][0];
      y = points[i + 1][1] - points[i][1];
      z = points[i + 1][2] - points[i][2];

      dir.push([x, y, z]);
    }

    return dir;
  }

  //returns the traveled distance
  get traveled()
  {
    return this.animationSpeed * this.elapsedTime;
  }

  //calculates the distance between two points
  distanceBetweenPoints(p1, p2)
  {
    let dx, dy, dz;

    dx = p2[0] - p1[0];

    dy = p2[1] - p1[1];

    dz = p2[2] - p1[2];

    return Math.hypot(dx, dy, dz);
  }

  //returns the total distance than an object will travel with an animation
  get totalDistance()
  {
    let total = 0;

    let points = this.controlP;

    //goes through each point and the next to calculate distance between them
    for(var i = 0; i < points.length - 1; i++)
      total += this.distanceBetweenPoints(points[i], points[i+1]);

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
    var distanceCovered = this.traveled; // gets the traveled distance

    var points = this.controlP; //gets animation control points

    var dir = this.directions; //gets the animation directions

/*goes through all points, calculates distance between them, and subtracts them.
 when 'distanceCovered' is equal or less than 0,
 means that that is the current direction, and returns it*/
    for(var i = 0; i < points.length - 1; i++)
    {
      distanceCovered -= this.distanceBetweenPoints(points[i], points[i+1]);

      if(distanceCovered <= 0)
        return dir[i];
    }

    return dir[dir.length - 1];
  }

  //returns a matrix with the movement in a certain interval of time
  movement(diff)
  {
    var Matrix = mat4.create();

    var dir = this.currentDirection(); //gets current direction

    /*calculates a vector (trans), that corresponds to the translation,
     based on speed and time interval*/
    var trans = [
                dir[0] * this.speed * diff, //x
                dir[1] * this.speed * diff, //y
                dir[2] * this.speed * diff, //z
              ];

    //creates a matrix with the translation
    mat4.translate(Matrix, mat4.create(), trans);

    //returns it
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
      //if time in scene is diferent of the time in animation
      if ((totalSceneTime != this.elapsedTime) && (this.elapsedTime != 0))
      {
        //updates the animation time
        this.updateElpasedTime(diffTime);

        //creates a matrix
        var Matrix = mat4.create();

        //gets a matrix with the translation
        var mov = this.movement(diffTime);

        //gets the current movement direction
        var dir = this.currentDirection();

        //calculates angle of rotation
        var ang = Math.atan(dir[2] / dir[0]);

        //mat4.rotateY(Matrix, Matrix, ang);

        //multiplies the matrix for the translation one
        mat4.multiply(Matrix, Matrix, mov);

        //returns it
        return Matrix;
      }
      //if its the instant t=0 we just want to put the object on the initial point
      else if (this.elapsedTime == 0)
      {
        //create a Matrix
        var Matrix = mat4.create();

        //gets direction, witch is the first point
        var dir = this.initialPoint;

        //gets the angle of rotation
        var ang = Math.atan(dir[2] / dir[1]);

        //aplies it to the matrix
        mat4.rotateY(Matrix, mat4.create(), ang);

        //aplies the translation
        mat4.translate(Matrix, mat4.create(), dir);

        //updates the animation time
        this.updateElpasedTime(diffTime);

        //gets a matrix with the translation
        var mov = this.movement(diffTime);

        //multiplies the matrix for the translation one
        mat4.multiply(Matrix, Matrix, mov);

        //returns the matrix
        return Matrix;
      }
      else
        return mat4.create(); //returns identity because there sno movement
    }
  }
}
