
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
  animationSpan()
  {
    let totalSpan = 0;

    for(let i = 0; i < this.animations.length; i++)
      totalSpan += this.animations[i].animationSpan();

    return totalSpan;
  }

  //returns the adequate animation index according to time
  correctAnimationIndex(Time)
  {
    for(let i = 0; i < this.animations.length; i++)
    {
      Time -= this.animations[i].animationSpan();

      if(Time < 0)
        return i;
    }

    return this.animations[this.animations.length - 1];
  }

  //returns the correct matrix for a given moment
  correctMatrix(diffTime, totalSceneTime)
  {
    if(totalSceneTime > this.animationSpan())
      return mat4.create();
    else
    {
      let aniIndex = this.correctAnimationIndex(totalSceneTime);

      let t = totalSceneTime;

      for(let i = 0; i < aniIndex; i++)
        t -= this.animations[i].animationSpan();

        console.log("a retornar combo t-> " + totalSceneTime);

      let Matrix = this.animations[aniIndex].correctMatrix(diffTime, t);

      console.log(Matrix);

      return Matrix;
    }
  }
}
