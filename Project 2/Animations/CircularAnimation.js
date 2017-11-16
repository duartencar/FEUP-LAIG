/**
 * CircularAnimation class that is an extension of Animation class.
 * This class makes an object rotate around a given center,
 *at a radius distance.
**/
class CircularAnimation extends Animation
{
  constructor(scene, id, animationSpeed, centerCoords, radius, initAng, rotAng)
  {
    //calls the parent class constructor (Animation)
    super(scene, id, animationSpeed);

    //animation center coordinates
    this.centerCoords = centerCoords;

    //rotation radius
    this.rad = radius;

    //initial angle of rotation in degrees
    this.initAng = initAng;

    //animation rotation angle
    this.rotAng = rotAng;

    //contains the angle of rotation of an animation at a given moment
    this.currAngle = initAng;

    //animation rotation angle
    this.elapsedTime = 0;

    this.initialM(centerCoords, radius, initAng);
  }

  //sets the initial matrix for the animation...
  initialM(center, radius, initAng)
  {
    let cos = Math.cos(initAng);

    let sin = Math.sin(initAng);

    let rcos = radius * cos;

    let rsin = radius * sin;

    let translation = vec4.create();

    let transMatrix = mat4.create();

    let rotMatrix = mat4.create();

    vec4.set(translation, center[0] + rcos, center[1], center[2] + rsin, 1);

    mat4.translate(transMatrix, transMatrix, translation);

    mat4.rotateY(rotMatrix, rotMatrix, initAng * DEGREE_TO_RAD);

    mat4.multiply(this.animationMatrix, rotMatrix, transMatrix);
  }

  //sets elapsed time
  set updateElpasedTime(Time)
  {
    this.elapsedTime = Time;
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

  //returns the distance of an animation
  get totalDistance ()
  {
    return this.rotAng * Math.PI * this.radius / 180;
  }

  //returns the span of an animation
  get animationSpan ()
  {
    return this.totalDistance / this.speed;
  }

  //returns angular speed
  get angularSpeed()
  {
    return this.rotAng / this.animationSpan;
  }

  //returns current angle value
  get currentAngle()
  {
    return this.currAngle;
  }

  //updates current angle value acording to rotation speed and time interval
  updateCurrentAngle(diff)
  {
    this.currAnlge += this.angularSpeed * diff;
  }

  //returns the current direction of the animation
  currentDirection()
  {
    let x = -1.0 * this.radius * Math.sin(this.currentAngle);

    let z = this.radius * Math.cos(this.currentAngle);

    return [x, z];
  }

  //returns the movement matrix
  movement(diff)
  {
    let cos = Math.cos(this.currAngle);

    let sin = Math.sin(this.currAngle);

    let rcos = this.radius * cos;

    let rsin = this.radius * sin;

    let previous = vec3.create();

    let now = vec3.create();

    vec3.set(previous, rcos, 0, rsin);

    this.updateCurrentAngle(diff);

    let cos = Math.cos(this.currAngle);

    let sin = Math.sin(this.currAngle); //CRIAR METODOS

    let rcos = this.radius * cos;

    let rsin = this.radius * sin;

    vec3.set(now,  rcos, 0, rsin);

    now.sub(previous);

    var movMatrix = mat4.create();

    mat4.translate(movMatrix, movMatrix, now);

    return movMatrix;
  }

  //returns the final matrix
  position(diff)
  {

  }
}
