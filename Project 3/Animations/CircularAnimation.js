/**
  * CircularAnimation class that is an extension of Animation class.
  * This class makes an object rotate around a given center,
  * at a radius distance.
  * Circular animation construction
  * @param scene - Scene to apply the animation to
  * @param id - Animation identification string
  * @param animationSpeed - Animation linear speed.
  * @param centerCoords - Center of rotation coordinates array ([x, y, z]).
  * @param radius - Animation radius.
  * @param initAng - Animation initial angle.
  * @param rotAng - The angle that the object will rotate.
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

    //initial angle of rotation in radians
    this.initAng = initAng * DEGREE_TO_RAD;

    //animation rotation angle in radians
    this.rotAng = rotAng * DEGREE_TO_RAD;

    //contains the angle of rotation of an animation at a given moment in radians
    this.currAngle = initAng * DEGREE_TO_RAD;

    //animation rotation angle
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
   * Returns animation radius of rotation
  **/
  get radius()
  {
    return this.rad;
  }

  /**
   * Returns the starting angle of the animation
  **/
  get initialAngle()
  {
    return this.initAng;
  }

  /**
   * Returns how much the object is going to rotate
  **/
  get rotationAngle()
  {
    return this.rotAng;
  }

  /**
   * Returns the final rotation of the object
  **/
  get totalRotation ()
  {
    return initialAngle() + rotationAngle();
  }

  /**
   * Returns the distance of the animation
  **/
  get totalDistance ()
  {
    return Math.abs(this.rotAng * this.radius);
  }

  /**
   * Returns the span of an animation
  **/
  animationSpan()
  {
    return (this.totalDistance / this.speed);
  }

  /**
   * Returns angular speed
  **/
  get angularSpeed()
  {
    return (this.rotAng / this.animationSpan());
  }

  /**
   * Returns current angle value
  **/
  get currentAngle()
  {
    return this.currAngle;
  }

  /**
   * Updates current angle value acording to rotation speed and time interval
   * @param diff - time interval
  **/
  updateCurrentAngle(diff)
  {
    this.currAngle += this.angularSpeed * diff;

    if((this.currAngle % (2 * Math.Pi)) > Math.abs(this.initAng + this.rotAng))
      this.currAngle = this.initAng + this.rotAng;
  }

  /**
   * Returns the current direction of the animation
  **/
  currentDirection()
  {
    var x = -1.0 * this.radius * Math.sin(this.currentAngle);

    var z = this.radius * Math.cos(this.currentAngle);

    return [x, z];
  }

  /**
   * Returns a matrix  with the rotation to apply
  **/
  rotation()
  {
    var rotMatrix = mat4.create();

    mat4.rotateY(rotMatrix, rotMatrix, this.currentAngle % (2 * Math.PI));

    return rotMatrix;
  }

  /**
   * Returns the cos of an angle
   * @param rad - angle in radians
  **/
  cos(rad)
  {
    return Math.cos(rad);
  }

  /**
   * Returns the sin of an angle
   * @param rad - angle in radians
  **/
  sin(rad)
  {
    return Math.sin(rad);
  }

  /**
   * Returns the cos of angle multiplied by a circunference radius
   * @param rad - angle in radians
  **/
  rcos(rad)
  {
    return this.radius * this.cos(rad);
  }

  /**
   * Returns the sin of angle multiplied by a circunference radius
   * @param rad - angle in radians
  **/
  rsin(rad)
  {
    return this.radius * this.sin(rad);
  }

  /**
   * Returns a translation matrix with the movement in a certain interval of time.
   * @param diff - time interval
  **/
  movement(diff)
  {
    //sets a vec3 object, to store previous position
    var previous = vec3.create();

    //sets another vec3 object, to store the actual position
    var now = vec3.create();

    //sets the 'previous' vector with the non updated angle
    vec3.set(previous, this.rcos(this.currAngle), 0, this.rsin(this.currAngle));

    //updates the angle
    this.updateCurrentAngle(diff);

    //sets the 'now' vector with the updated angle
    vec3.set(now, this.rcos(this.currAngle), 0, this.rsin(this.currAngle));

    //subtracts the so we can get a translation vector, stored in the 'now' vector
    vec3.sub(now, now, previous);

    //creates a matrix that will hold the translation
    var movMatrix = mat4.create();

    //transforms the matrics with the 'now vector'
    mat4.translate(movMatrix, movMatrix, now);

    //returns it
    return movMatrix;
  }

  /**
   * Resets the angle of the matrix and apllies new one
   * @param rotationMatrix - matrix to rotate
  **/
  rotateMatrix(rotationMatrix)
  {
    //changes appropriate values, see rotation matrixes on the internet
    this.animationMatrix[0] = 1;

    this.animationMatrix[2] = 0;

    this.animationMatrix[8] = 0;

    this.animationMatrix[10] = 1;

    //aplies new rotation
    this.transformMatrix(rotationMatrix);
  }

  /**
   * Returns first position (t = 0)
  **/
  initialPoint()
  {
    //creates a vec3 object to store initial movement vector
    var dir = vec3.create();

    //sets the apropriate values
    vec3.set(dir, this.rcos(this.initialAngle) + this.centerCoords[0], 0 + this.centerCoords[1], this.rsin(this.initialAngle) + this.centerCoords[2]);

    //returns it
    return dir;
  }

  /**
   * Returns the final matrix
   * @param diff - time interval
  **/
  position(diff)
  {
    //gets the movementent Matrix
    var translation = this.movement(diff);

    // gets the rotation matrix
    var rot = this.rotation();

    //applies rotation matrix
    this.rotateMatrix(rot);

    //applies the translation matrix
    this.translateMatrix(translation);

    //returns the animationMatrix
    return this.Matrix;
  }

  /**
   * returns the apropriate matrix according to the time of the scene
   * @param diffTime - time interval
   * @param totalSceneTime - scene elapsed time
  **/
  correctMatrix(diffTime, totalSceneTime)
  {
    //if the the total scene time is bigger than the animation span means
    if(totalSceneTime >= this.animationSpan())
      return mat4.create();
    else
    {
      //if the time of the scene is diferent than in the animation
      if((totalSceneTime != this.elapsedTime) && (this.elapsedTime != 0))
      {
        //updates the time
        this.updateElpasedTime(diffTime);

        //creates a matrix with the translation
        let Matrix = this.movement(diffTime);

        //rotates the matrix according to current angle
        //mat4.rotateY(Matrix, mat4.create(), this.currAngle);

        //returns the matrix
        return Matrix;
      }
      //if it is the initial moment (t=0)
      else if (this.elapsedTime == 0)
      {
        //gets the direction for the initial point
        let dir = this.initialPoint();

        //creates a matrix to store the transformation
        let Matrix = mat4.create();

        //rotates for initial rotation
        //mat4.rotateY(Matrix, Matrix, this.initialAngle);

        //translates it in direction
        mat4.translate(Matrix, Matrix, dir);

        //updates the time
        this.updateElpasedTime(diffTime);

        //creates a matrix with the translation
        let mov = this.movement(diffTime);

        //multiplies the matrix for the translation one
        mat4.multiply(Matrix, Matrix, mov);

        //returns the matrix
        return Matrix;
      }
      else //return identity
        return mat4.create();
    }
  }
}