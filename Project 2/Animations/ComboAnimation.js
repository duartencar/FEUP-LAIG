
class ComboAnimation
{
  constructor(scene, id, animations)
  {
    this.scene = scene;

    this.ID = id;

    this.animations = animations;

    this.elapsedTime = 0;
  }

  //returns animation ID
  get id()
  {
    return this.ID;
  }

  //returns animations array
  get animationsToDo()
  {
    return this.animations;
  }

  //adds the time interval to the animation elapsedTime
  updateElapsedTime(diff)
  {
    this.elapsedTime += diff;
  }

  //returns the total time of combo animation
  getAnimationSpan()
  {
    let totalSpan = 0;

    for(let i = 0; i < this.animations.length; i++)
      totalSpan += this.animations[i].animationSpan();

    return totalSpan;
  }

  //returns the correct matrix for a given moment
  correctMatrix(diffTime, totalSceneTime)
  {

  }
}
