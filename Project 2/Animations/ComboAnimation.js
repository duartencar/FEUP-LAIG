
class ComboAnimation
{
  constructor(scene, id, animations)
  {
    this.scene = scene;

    this.ID = id;

    this.animations = animations;
  }

  //returns animation ID
  get id()
  {
    return this.ID;
  }

  //returns animations array
  get animations()
  {
    return this.animations;
  }
}
