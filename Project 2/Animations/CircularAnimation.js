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
    this.initAng = initAng * DEGREE_TO_RAD;

    //animation rotation angle
    this.rotAng = rotAng * DEGREE_TO_RAD;

    //contains the angle of rotation of an animation at a given moment
    this.currAngle = initAng * DEGREE_TO_RAD;

    //animation rotation angle
    this.elapsedTime = 0;

    //animation initial matrix
    this.animationMatrix = mat4.create();
  }

  //returns the animation Matrix
  get Matrix()
  {
    return this.animationMatrix;
  }

  //transforms the matrix with a given 'anotherMatrix'
  transformMatrix(anotherMatrix)
  {
    mat4.multiply(this.animationMatrix, this.animationMatrix, anotherMatrix);
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

  //returns animation radius to the center
  get radius()
  {
    return this.rad;
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
    return (this.rotAng * this.radius); //VAI DAR MERDA, CORRIGIR
  }

  //returns the span of an animation
  animationSpan()
  {
    return (this.totalDistance / this.speed);
  }

  //returns angular speed
  get angularSpeed()
  {
    return (this.rotAng / this.animationSpan());
  }

  //returns current angle value
  get currentAngle()
  {
    return this.currAngle;
  }

  //updates current angle value acording to rotation speed and time interval
  updateCurrentAngle(diff)
  {
    this.currAngle += this.angularSpeed * diff;
  }

  //returns the current direction of the animation
  currentDirection()
  {
    var x = -1.0 * this.radius * Math.sin(this.currentAngle);

    var z = this.radius * Math.cos(this.currentAngle);

    return [x, z];
  }

  //returns the rotation of the object
  rotation()
  {
    var rotMatrix = mat4.create();

    mat4.rotateY(rotMatrix, rotMatrix, this.currentAngle % (2 * Math.PI));

    return rotMatrix;
  }

  cos(rad)
  {
    return Math.cos(rad);
  }

  sin(rad)
  {
    return Math.sin(rad);
  }

  rcos(rad)
  {
    return this.radius * this.cos(rad);
  }

  rsin(rad)
  {
    return this.radius * this.sin(rad);
  }

  //returns the movement matrix
  movement(diff)
  {
    var previous = vec3.create();

    var now = vec3.create();

    vec3.set(previous, this.rcos(this.currAngle), 0, this.rsin(this.currAngle));

    this.updateCurrentAngle(diff);

    vec3.set(now, this.rcos(this.currAngle), 0, this.rsin(this.currAngle));

    vec3.sub(now, now, previous);

    var movMatrix = mat4.create();

    mat4.translate(movMatrix, movMatrix, now);

    return movMatrix;
  }

  rotateMatrix(rotationMatrix)
  {
    this.animationMatrix[0] = 1;

    this.animationMatrix[2] = 0;

    this.animationMatrix[8] = 0;

    this.animationMatrix[10] = 1;

    this.transformMatrix(rotationMatrix);
  }

  translateMatrix(translationMatrix)
  {
    this.animationMatrix[12] = 0;

    this.animationMatrix[14] = 0;

    this.transformMatrix(translationMatrix);
  }

  //returns first position (t = 0)
  initialPoint()
  {
    var dir = vec3.create();

    vec3.set(dir, this.rcos(this.initialAngle), 0, this.rsin(this.initialAngle));

    return dir;
  }

  //returns the final matrix
  position(diff)
  {
    var translation = this.movement(diff);

    var rot = this.rotation();

    this.rotateMatrix(rot);

    this.translateMatrix(translation);

    return this.Matrix;
  }

  correctMatrix(diffTime, totalSceneTime)
  {
    if(totalSceneTime >= this.animationSpan())
      return mat4.create();
    else
    {
      if(totalSceneTime != this.elapsedTime)
      {
        this.updateElpasedTime(diffTime);

        let Matrix = this.movement(diffTime);

        mat4.rotateY(Matrix, mat4.create(), this.currAngle);

        return Matrix;
      }
      else if ((totalSceneTime == 0) && (this.elapsedTime == 0))
      {
        var dir = this.initialPoint();

        var Matrix = mat4.create();

        mat4.rotateY(Matrix, Matrix, this.initialAngle);

        mat4.translate(Matrix, Matrix, dir);

        return Matrix;
      }
      else
        return mat4.create();
    }
  }
}
