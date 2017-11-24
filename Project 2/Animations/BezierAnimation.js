
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

    this.calculateNewPoints()
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

  //sets elapsed time
  updateElpasedTime(Time)
  {
    this.elapsedTime += Time;
  }

  //returns initial points
  get initialPoint()
  {
    return this.cPoints[0];
  }

  //returns transformedPoints
  get P()
  {
    return this.transformedPoints;
  }

  //returns control Points vector
  get Points()
  {
    return this.cPoints;
  }

  //returns the point in the middle of p1 and p2
  middlePoint(p1, p2)
  {
    let middleP = [0, 0, 0];

    middleP[0] = (p1[0] + p2[0]) / 2;

    middleP[1] = (p1[1] + p2[1]) / 2;

    middleP[2] = (p1[2] + p2[2]) / 2;

    return middleP;
  }

  //calculate convex hull cPoints
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

  //returns the first point
  initialPoint()
  {
    return this.transformedPoints[0];
  }

  //returns the number of times that an object must change direction
  get numberOfDirections()
  {
    return this.transformedPoints.length - 1;
  }

  //returns distance between p1 and p2
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

    let points = this.P;

    for(var i = 0; i < points.length - 1; i++)
      total += this.distanceBetweenPoints(points[i], points[i+1]);

    return total;
  }

  //returns the time that will take from the begin to the end of the animation
  animationSpan()
  {
    return this.totalDistance / this.animationSpeed;
  }

  //Beziers curve require that time is between 0 and 1
  mapTime(Time)
  {
    return Time / this.animationSpan();
  }

  calcMultiplier(iteration, Time)
  {
    let diffTime = Math.pow((1 - Time), (3 - iteration));

    let t = Math.pow(Time, iteration);

    if(iteration == 1 || iteration == 2)
      t *= 3;

    return t * diffTime;
  }

  BezierPoint(Time)
  {
    let finalPoint = [0, 0, 0]; // x, y, z

    let P = this.Points;

    for (let i = 0; i < 4; i++)
    {
      finalPoint[0] += this.calcMultiplier(i, Time) * P[i][0];

      finalPoint[1] += this.calcMultiplier(i, Time) * P[i][1];

      finalPoint[2] += this.calcMultiplier(i, Time) * P[i][2];
    }

    return finalPoint;
  }

  movement(diffTime)
  {
    let previous = this.BezierPoint(this.mapTime(this.elapsedTime));

    this.updateElpasedTime(diffTime);

    let now = this.BezierPoint(this.mapTime(this.elapsedTime));

    let mov = vec3.create();

    vec3.set(mov, now[0] - previous[0], now[1] - previous[1], now[2] - previous[2]);

    let movMatrix = mat4.create();

    mat4.translate(movMatrix, movMatrix, mov);

    return movMatrix;
  }

  correctMatrix(diffTime, totalSceneTime)
  {

    if(totalSceneTime >= this.animationSpan())
      return mat4.create();
    else
    {
      if((totalSceneTime != this.elapsedTime) && (this.elapsedTime != 0))
      {
        let trans = this.movement(diffTime);

        return trans;
      }
      else if(this.elapsedTime == 0)
      {
        let dir = this.initialPoint();

        let Matrix = mat4.create();

        mat4.translate(Matrix, Matrix, dir);

        let trans = this.movement(diffTime);

        mat4.multiply(Matrix, Matrix, trans);

        return Matrix;
      }
      else
        return mat4.create();
    }
  }
}
