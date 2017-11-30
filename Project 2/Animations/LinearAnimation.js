/**
 * LinearAnimation class that is an extension of Animation class.
 * This class makes an object travel linearly through a scene,
 * between assign control point with a certain speed.
 * @param scene - Scene to apply the animation to
 * @param id - Animation identification string
 * @param animationSpeed - Animation linear speed.
 * @param controlPoints - Animation control points that object will go by([[x1,y1,z1],[x2,y2,z2]])
**/
class LinearAnimation extends Animation
{
  constructor(scene, id, animationSpeed, controlPoints)
  {
    //calls the parent class constructor (Animation)
    super(scene, id, animationSpeed);

    //contains animations control points
    this.cPoints = controlPoints;

    this.currentPoint = 0;

    //elapsed time
    this.elapsedTime = 0;
  }

  /**
   * Updates animation elapsed time, by increasing it by the Time parameter
   * @param Time - time interval
  **/
  updateElpasedTime(Time)
  {
    this.elapsedTime += Time;
  }

  /**
   * Returns animation ID
  **/
  get id()
  {
    return this.ID;
  }

  /**
   * Returns animation speed
  **/
  get animationSpeed()
  {
    return this.speed;
  }

  /**
   * Returns the initial point of the animation, witch is the first point
   * in the control point array
  **/
  get initialPoint()
  {
    return this.cPoints[0];
  }

  /**
   * Returns the number of times that an object must change direction
  **/
  get numberOfDirections()
  {
    return this.cPoints.length - 1;
  }

  /**
   * Returns control points array
  **/
  get controlP()
  {
    return this.cPoints;
  }

  /**
   * Returns an array with all directions that the animation will have to take
  **/
  get directions()
  {
    var dir = [];

    let x, y, z;

    let num = this.numberOfDirections;

    let points = this.controlP;

    for(let i = 0; i < num; i++)
    {
      x = points[i + 1][0] - points[i][0];
      y = points[i + 1][1] - points[i][1];
      z = points[i + 1][2] - points[i][2];

      dir.push([x, y, z]);
    }

    return dir;
  }

  /**
   * Returns the distance that the object has covered in a given moment
  **/
  get traveled()
  {
    return this.animationSpeed * this.elapsedTime;
  }

  /**
   * Returns the distance that the object has covered in a given moment
   * @param p1 - point coordinates [x, y, z]
   * @param p2 - point coordinates [x, y, z]
  **/
  distanceBetweenPoints(p1, p2)
  {
    let dx, dy, dz;

    dx = p2[0] - p1[0];

    dy = p2[1] - p1[1];

    dz = p2[2] - p1[2];

    return Math.hypot(dx, dy, dz);
  }

  /**
   * Returns the distance that the object will have to make until animation finishes
  **/
  get totalDistance()
  {
    let total = 0;

    let points = this.controlP;

    //goes through each point and the next to calculate distance between them
    for(var i = 0; i < points.length - 1; i++)
      total += this.distanceBetweenPoints(points[i], points[i+1]);

    return total;
  }

  /**
   * Returns the time that will take from the begin to the end of the animation
  **/
  animationSpan()
  {
    return this.totalDistance / this.animationSpeed;
  }

  /**
   * Returns direction that the object is travelling at the moment
   * It also updates the current point value
  **/
  currentDirection()
  {
    // gets the traveled distance
    var distanceCovered = this.traveled;

    //gets animation control points
    var points = this.controlP;

    //gets the animation directions
    var dir = this.directions;

/*goes through all points, calculates distance between them, and subtracts them.
 when 'distanceCovered' is equal or less than 0,
 means that that is the current direction, and returns it*/
    for(var i = 0; i < points.length - 1; i++)
    {
      distanceCovered -= this.distanceBetweenPoints(points[i], points[i+1]);

      if(distanceCovered <= 0)
      {
        //updates current point
        this.currentPoint = i;

        return dir[i];
      }
    }

    //updates current point
    this.currentPoint = dir.length - 1;

    return dir[dir.length - 1];
  }

  /**
   * Calculates speed in x, y and z
  **/
  calculateAxisSpeeds()
  {
    //calculates distace between the current point and the next one
    let d = this.distanceBetweenPoints(this.cPoints[this.currentPoint], this.cPoints[this.currentPoint + 1]);

    //gets all the directions
    let dir = this.directions;

    //calculates the time that the object must take until it gets to the next point
    let t = d / this.animationSpeed;

    /*returns the speed acording to the diference between each point according
    to the tame that the object must take, in each coordinate*/
    return [dir[this.currentPoint][0] / t, dir[this.currentPoint][1] / t, dir[this.currentPoint][2] / t];
  }

  /**
   * Returns a translation matrix with the movement in a certain interval of time.
   * @param diff - time interval
  **/
  movement(diff)
  {
  //gets current direction
  var dir = this.currentDirection();

  //gets the speeds in different coordinates
  let v = this.calculateAxisSpeeds();

	let P = this.cPoints;

	let t = this.elapsedTime;

	for(let i = 0; i < this.currentPoint; i++)
		t -= this.distanceBetweenPoints(P[i], P[i+1]) / this.speed;

  /*calculates a array trans(lation), that corresponds to the translation,
     based on speed and time interval*/
  var trans = [
              P[this.currentPoint][0] + v[0] * t, //x
				      P[this.currentPoint][1] + v[1] * t, //y
              P[this.currentPoint][2] + v[2] * t, //z
            ];

    //returns it
    return trans;
  }

  /**
   * Returns the correct matrix for a given scene moment
   * @param diffTime - time interval
   * @param totalSceneTime - scene elapsed time
  **/
  correctMatrix(diffTime, totalSceneTime)
  {
    //if time in scene is bigger than animationSpan means that there isn t movement
    if(totalSceneTime >= this.animationSpan())
	  {
    	let Matrix = mat4.create();

    	let Translation = this.cPoints[this.cPoints.length - 1];

    	let directionAngle = Math.atan2(Translation[2], Translation[0]);

    	mat4.translate(Matrix, Matrix, Translation);

    	mat4.rotateY(Matrix, Matrix, directionAngle);

    	return Matrix;
    }
    else
    {
  		this.updateElpasedTime(diffTime);

  		let Matrix = mat4.create();

  		let Translation = this.movement(diff);

  		let directionAngle = Math.atan2(Translation[2], Translation[0]);

  		mat4.translate(Matrix, Matrix, Translation);

  		mat4.rotateY(Matrix, Matrix, directionAngle);

  		return Matrix;
  	}
  }
}
