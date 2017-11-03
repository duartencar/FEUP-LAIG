
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
}
