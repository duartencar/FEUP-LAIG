
class CameraTransition
{
  constructor(previousCamera, nextCamera, speed, typeOFtransition)
  {
    this.previousCamera = previousCamera;

    this.nextCamera = nextCamera;

    this.speed = speed;

    this.time = 0;

    if(typeOFtransition == 'CIRCULAR' || typeOFtransition == 'LINEAR')
      this.type = typeOFtransition;
    else
      return null;
  }

  get movementVector()
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

  get distance()
  {
    let mov = this.movementVector;

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
    let mov = this.movementVector;

    let tar = this.targetMovementVector;

    vec3.normalize(mov, mov);

    vec3.normalize(tar, tar);

    vec3.scale(mov, mov, this.speed);

    vec3.scale(tar, tar, this.speed);

    return [mov, tar];
  }
};
