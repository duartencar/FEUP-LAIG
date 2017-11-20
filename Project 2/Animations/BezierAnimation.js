
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

  //returns initial points
  get initialPoint()
  {
    return this.cPoints[0];
  }


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

    var L2 = this.middlePoint(this.cPoints[0], this.cPoints[1]);

    this.transformedPoints.push(L2);

    var H = this.middlePoint(this.cPoints[1], this.cPoints[2]);

    var L3 = this.middlePoint(L2, H);

    this.transformedPoints.push(L3);

    var R3 = this.middlePoint(this.cPoints[2], this.cPoints[3]);

    var R2 = this.middlePoint(H, R3);

    var L4 = this.middlePoint(L3, R2);

    this.transformedPoints.push(L4);

    this.transformedPoints.push(R2);

    this.transformedPoints.push(R3);

    this.transformedPoints.push(this.cPoints[3]);
  }
}
