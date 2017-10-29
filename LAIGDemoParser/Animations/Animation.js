/**
 * Animation class, representing an animation assign to an object.
 * This class is an abstract class, and contains an animation basic information.
 * @constructor
**/

class Animation
{
  constructor(scene, id, duration)
  {
    this.scene = scene;

    //animation id
    this.ID = id;

    //animation duration
    this.duration = duration;

    //animation initial matrix
    this.animationMatrix = mat4.create();
  }
}
