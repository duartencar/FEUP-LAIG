
class CameraTransition
{
  constructor(previousCamera, nextCamera, speed, typeOFtransition, nextState)
  {
    var prev  = previousCamera;

    var next = nextCamera;

    this.previousCamera = prev;

    this.nextCamera = next;

    this.speed = speed;

    this.time = 0;

    this.nextState = nextState;

    if(typeOFtransition == 'CIRCULAR' || typeOFtransition == 'LINEAR')
      this.type = typeOFtransition;
    else
      return null;

    if(this.type == 'CIRCULAR')
    {
      this.center = this.centerCordinates;

      this.raio = this.radius;

      this.aSpeed = this.angularSpeed;
    }
  }

  get linearMovementVector()
  {
    let v = vec3.fromValues(
      this.nextCamera.position[0] - this.previousCamera.position[0],
      this.nextCamera.position[1] - this.previousCamera.position[1],
      this.nextCamera.position[2] - this.previousCamera.position[2]
    );

    return v;
  }

  get targetMovementVector()
  {
    let t = vec3.fromValues(
      this.nextCamera.target[0] - this.previousCamera.target[0],
      this.nextCamera.target[1] - this.previousCamera.target[1],
      this.nextCamera.target[2] - this.previousCamera.target[2]
    );

    return t;
  }

  get centerCordinates()
  {
    let t = vec3.fromValues(
      (this.nextCamera.position[0] - this.previousCamera.position[0]) / 2,
      (this.nextCamera.position[1] - this.previousCamera.position[1]) / 2,
      (this.nextCamera.position[2] - this.previousCamera.position[2]) / 2
    );

    return t;
  }

  get radius()
  {
    let radiusVector = 0;

    let center = this.center;

    let movVector = vec3.fromValues(
      (center[0] - this.previousCamera.position[0]),
      (center[1] - this.previousCamera.position[1]),
      (center[2] - this.previousCamera.position[2])
    );

    return Math.sqrt(movVector[0] * movVector[0] + movVector[1] * movVector[1] + movVector[2] * movVector[2]);
  }

  get circularDistance()
  {
    return Math.PI * this.raio;
  }

  get circularAnimationSpan()
  {
    return (this.circularDistance / this.speed);
  }

  get angularSpeed()
  {
    return Math.PI / this.circularAnimationSpan;
  }

  get rotationTranslation()
  {
    let x = vec3.fromValues(
      this.raio * Math.cos(this.time * this.aSpeed),
      0,
      this.raio * Math.sin(this.time * this.aSpeed)
    );

    return x;
  }

  get circularMovVector()
  {
    let mov = vec3.fromValues(0, 0, 0);

    let previousPos = vec3.fromValues(this.previousCamera.position[0], this.previousCamera.position[1], this.previousCamera.position[2]);

    let centerCoords = this.center;

    let translation = this.rotationTranslation;

    vec3.add(mov, mov, centerCoords);

    vec3.add(mov, mov, translation);

    vec3.sub(mov, mov, previousPos);

    return mov;
  }

  get distance()
  {
    let mov = this.linearMovementVector;

    return Math.sqrt(mov[0] * mov[0] + mov[1] * mov[1] + mov[2] * mov[2]);
  }

  get targetDistance ()
  {
    let tarMov = this.targetMovementVector;

    return Math.sqrt(tarMov[0] * tarMov[0] + tarMov[1] * tarMov[1] + tarMov[2] * tarMov[2]);
  }

  get transitionSpan()
  {
    return (this.distance / this.speed);
  }

  updateTime(diff)
  {
    this.time += diff;
  }

  transition(diff)
  {
    if(this.type == 'LINEAR')
    {
      let mov = this.linearMovementVector;

      let tar = this.targetMovementVector;

      vec3.normalize(mov, mov);

      vec3.normalize(tar, tar);

      vec3.scale(mov, mov, this.speed);

      vec3.scale(tar, tar, this.speed);

      return [mov, tar];
    }
    else
    {
      let mov = this.circularMovVector;

      let tar = this.targetMovementVector;

      vec3.normalize(tar, tar);

      vec3.scale(tar, tar, this.speed);

      return [mov, tar];
    }
  }
};
