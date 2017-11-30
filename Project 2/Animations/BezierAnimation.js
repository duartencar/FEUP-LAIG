/**
 * BezierAnimation class that is an extension of Animation class.
 * This class makes an object travel through a scene,
 * between 4 control points.
 * @param scene - Scene to apply the animation to
 * @param id - Animation identification string
 * @param animationSpeed - Animation linear speed.
 * @param controlPoints - Animation control points that object will go by([[x1,y1,z1],[x2,y2,z2]])
**/
class BezierAnimation extends Animation
{
  constructor(scene, id, animationSpeed, controlPoints)
  {
    //calls the parent class constructor (Animation)
    super(scene, id, animationSpeed);

    //contains animations control points, must have 4
    if(controlPoints.length == 4)
      this.cPoints = controlPoints;
    else
    {
      console.log("wrong number of control point for bezier animation");
      return null;
    }

    //elapsed time
    this.elapsedTime = 0;

    //Points that result from Casteljau Algorithm
    this.transformedPoints = [];

    //Creates Casteljau points
    this.calculateNewPoints();
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
   * Updates animation elapsed time, by increasing it by the Time parameter
   * @param Time - time interval
  **/
  updateElpasedTime(Time)
  {
    this.elapsedTime += Time;
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
   * Returns transformed points array
  **/
  get P()
  {
    return this.transformedPoints;
  }

  /**
   * Returns control Points vector
  **/
  get Points()
  {
    return this.cPoints;
  }

  /**
   * returns the point in the middle of p1 and p2
   * @param p1 - first point cordinates [x, y, z]
   * @param p2 - second point cordinates [x, y, z]
  **/
  middlePoint(p1, p2)
  {
    let middleP = [0, 0, 0];

    middleP[0] = (p1[0] + p2[0]) / 2;

    middleP[1] = (p1[1] + p2[1]) / 2;

    middleP[2] = (p1[2] + p2[2]) / 2;

    return middleP;
  }

  /**
   * calculate convex hull cPoints
  **/
  calculateNewPoints()
  {
    this.transformedPoints.push(this.cPoints[0]); //P1 = L1

    let L2 = this.middlePoint(this.cPoints[0], this.cPoints[1]);

    this.transformedPoints.push(L2);

    let H = this.middlePoint(this.cPoints[1], this.cPoints[2]);

    let L3 = this.middlePoint(L2, H);

    this.transformedPoints.push(L3);

    let R3 = this.middlePoint(this.cPoints[2], this.cPoints[3]);

    let R2 = this.middlePoint(H, R3);

    let L4 = this.middlePoint(L3, R2);

    this.transformedPoints.push(L4);

    this.transformedPoints.push(R2);

    this.transformedPoints.push(R3);

    this.transformedPoints.push(this.cPoints[3]);
  }

  /**
   * returns the first point
  **/
  initialPoint()
  {
    return this.transformedPoints[0];
  }

  /**
   * returns the number of times that an object must change direction
  **/
  get numberOfDirections()
  {
    return this.transformedPoints.length - 1;
  }

  /**
   * returns distance between p1 and p2
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
   * returns the total distance than an object will travel with an animation
  **/
  get totalDistance()
  {
    let total = 0;

    let points = this.P;

    for(var i = 0; i < points.length - 1; i++)
      total += this.distanceBetweenPoints(points[i], points[i+1]);

    return total;
  }

  /**
   * returns the time that will take from the begin to the end of the animation
  **/
  animationSpan()
  {
    return this.totalDistance / this.animationSpeed;
  }

  /**
   * Beziers curve require that time is between 0 and 1
   * @param Time - elapsed time since beginning
  **/
  mapTime(Time)
  {
    return Time / this.animationSpan();
  }

  /**
   * see Bezier formula
   * @param iteration - the iteration of the calculation
   * @param Time - elapsed time since beginning
  **/
  calcMultiplier(iteration, Time)
  {
    let diffTime = Math.pow((1 - Time), (3 - iteration));

    let t = Math.pow(Time, iteration);

    if(iteration == 1 || iteration == 2)
      t *= 3;

    return t * diffTime;
  }

  /**
   * calculates bezier point cordinates
   * @param Time - elapsed time since beginning
  **/
  BezierPoint(Time)
  {
    let finalPoint = [0, 0, 0]; // x, y, z

    let P = this.Points;

    let t = this.mapTime(Time);

    for (let i = 0; i < 4; i++)
    {
      finalPoint[0] += this.calcMultiplier(i, t) * P[i][0];

      finalPoint[1] += this.calcMultiplier(i, t) * P[i][1];

      finalPoint[2] += this.calcMultiplier(i, t) * P[i][2];
    }

    return finalPoint;
  }

  /**
   * Returns the correct matrix for a given scene moment
   * @param diffTime - time interval
   * @param totalSceneTime - scene elapsed time
  **/
  correctMatrix(diffTime, totalSceneTime)
  {
    if(totalSceneTime >= this.animationSpan())
    {
      let Matrix = mat4.create();

      let translation = this.BezierPoint(this.animationSpan());

      let angle = Math.atan2(translation[2], translation[0]);

      mat4.translate(Matrix, Matrix, translation);

  		//mat4.rotateY(Matrix, Matrix, angle);

  		return Matrix;
    }
    else
    {
      this.updateElpasedTime(diffTime);

      let Matrix = mat4.create();

      let translation = this.BezierPoint(this.elapsedTime);

      let angle = Math.atan2(translation[2], translation[0]);

      mat4.translate(Matrix, Matrix, translation);

  		//mat4.rotateY(Matrix, Matrix, angle);

  		return Matrix;
    }
  }
}
