/**
 * Animation class, representing an animation assign to an object.
 * This class is an abstract class, and contains an animation basic information.
**/
class Animation
{
  constructor(scene, id, speed)
  {
    this.scene = scene;

    //animation id
    this.ID = id;

    //animation speed
    this.speed = speed;

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
}
