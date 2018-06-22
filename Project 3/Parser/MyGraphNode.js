/**
 * MyGraphNode class, representing an intermediate node in the scene graph.
 * @constructor
**/

function MyGraphNode(graph, nodeID)
{
  this.graph = graph;

  this.nodeID = nodeID;

  // IDs of child nodes.
  this.children = [];

  // IDs of child nodes.
  this.leaves = [];

  // The material ID.
  this.materialID = null;

  // The texture ID.
  this.textureID = null;

  // If node is selectable or not
  this.selectable = false;

  // Shader applied status
  this.shaderStatus = false;

  // The animation ID.
  this.animations = [];

  //the total duration of the node animation
  this.animationsSpan = 0;

  this.animationIndex = 0;

  // This matrix will contain the current transformation matrix
  this.aniMatrix = mat4.create();

  // The node Matrix creation
  this.transformMatrix = mat4.create();

  // Seting the initial matrix to the identity matrix
  mat4.identity(this.transformMatrix);
}

/**
 * Adds the reference (ID) of another node to this node's children array.
 */
MyGraphNode.prototype.addChild = function(nodeID)
{
  this.children.push(nodeID);
};

/**
 * Adds a leaf to this node's leaves array.
 */
MyGraphNode.prototype.addLeaf = function(leaf)
{
  this.leaves.push(leaf);
};

/**
 * Prints the node leaves.
 */
MyGraphNode.prototype.showLeaves = function()
{
  console.log(this.leaves);
};

/**
 * Sets node to seletable.
 */
MyGraphNode.prototype.setSelectable = function()
{
  this.selectable = true;
};

/**
 * Prints the node Children.
 */
MyGraphNode.prototype.showChildren = function()
{
  console.log(this.children);
};

/**
 * Adds an animations
 */
MyGraphNode.prototype.addAnimation = function(animation)
{
  this.animations.push(animation);
};

/**
 * Resets animation rotation
 */
MyGraphNode.prototype.resetAnimationRotation = function()
{
  this.aniMatrix[0] = 1;

  this.aniMatrix[2] = 0;

  this.aniMatrix[8] = 0;

  this.aniMatrix[10] = 1;
};

/**
 * Resets animation transformation
 */
MyGraphNode.prototype.resetAnimationtranslation = function()
{
  this.aniMatrix = mat4.create();
};

/**
 * Returns the total time of the nodes animation
 */
MyGraphNode.prototype.getNodeAnimationsDuration = function ()
{
  let t = 0;

  for(let i = 0; i < this.animations.length; i++)
    t += this.animations[i].animationSpan();

  return t;
}

MyGraphNode.prototype.correctAnimationIndex = function (sceneTime)
{
  for(let i = 0, l = this.animations.length; i < l; i++)
  {
    sceneTime -= this.animations[i].animationSpan;

    if(sceneTime < 0) {
      return i;
    }
  }

  return this.animations.length - 1;
}

/**
 * Sets the value of materialID
 */
MyGraphNode.prototype.setMaterialID = function(materialID)
{
  this.materialID = materialID;
};

/**
 * Sets the value of textureID
 */
MyGraphNode.prototype.setTextureID = function(textureID)
{
  this.textureID = textureID;
};

/**
 * Returns the material ID of the node.
 */
MyGraphNode.prototype.getMaterialID = function ()
{
  return this.materialID;
};

/**
 * Returns the texture ID of the node.
 */
MyGraphNode.prototype.getTextureID = function ()
{
  return this.textureID;
};

/**
 * Returns the Animation ID of the node.
 */
MyGraphNode.prototype.getAnimations = function ()
{
  if(this.animations.length == 0)
    return null;
  else
    return this.animations;
};

/**
 * Returns the leaves of the node.
 */
MyGraphNode.prototype.getLeaves = function()
{
  return this.leaves;
};

/**
 * Returns the children of the node.
 */
MyGraphNode.prototype.getChildren = function ()
{
  return this.children;
};

/**
 * Analyses a node. It's a recursive funtion.
 */
MyGraphNode.prototype.analyse = function (scene, Tmatrix, fatherTexture, fatherMaterial, Time, DifferentShader)
{
  //Get the node children
  let nodeChildren = this.getChildren();

  //Get the node Leafs
  let nodeLeafs = this.getLeaves();

  //Create a new Matrix
  let newMatrix = mat4.create();

  let Diff;

  if(this.selectable && (scene.game.stateIndex == 0 || scene.game.stateIndex == 1 || scene.game.stateIndex == 2))
  {
    scene.pickID++;

    scene.registerForPick(scene.pickID, this);
  }

  //if the DifferentShader paraneter is false it is going to check if it is the selected node
  if ((DifferentShader == false) && (scene.game.possiblePicks.length != 0))
  {
    //if the selected node name is equal to this node name, activates selected shader
    if((Diff = scene.toShade.indexOf(this.nodeID) >= 0) == true) {
      scene.setActiveShader(scene.shaders[1]);
    }
  }

  this.textureID == "null" ? newText = fatherTexture : newText = this.textureID;

  this.materialID == "null" ? newMat = fatherMaterial : newMat = this.materialID;

  if(this.nodeID == 'Dice-1' || this.nodeID == 'Dice-2'|| this.nodeID == 'Dice-3' || this.nodeID == 'Dice-4')
  {
    let mustRotate = scene.returnDicePosition(this.nodeID);

    let alreadyRotated = scene.rotatedOnce[scene.diceToIndex[this.nodeID]];

    if(mustRotate == true && alreadyRotated== false)
    {
      mat4.rotateX(this.transformMatrix, this.transformMatrix, -Math.PI/2);

      scene.rotatedOnce[scene.diceToIndex[this.nodeID]] = true;
    }
  }

  //If this node doesn t has a animation it inherits the fathers node animation
  if(this.getAnimations() != null)
  {
    //vector with animations
    let animations = this.getAnimations();

    let animationIndex = this.correctAnimationIndex(scene.elapsedTime);

    if(this.animationIndex != animationIndex) {
      this.aniMatrix = mat4.create();

      this.animationIndex = animationIndex;
    }

    let t = scene.elapsedTime;

    for(let i = 0; i < animationIndex; i++) {
      t -= this.animations[i].animationSpan;
    }

    //creates a Matrix to store the matrix with animation transformation
    let trans = mat4.create();

    //gets the animation transformation matrix
    if(scene.resetingPieces.length == 0)
      trans = animations[animationIndex].correctMatrix(Time, t - scene.game.lastPlay.whatTime);
    else
      trans = animations[animationIndex].correctMatrix(Time, t - scene.resetTime);

    //apllies no animation matrix that belongs to node
    mat4.multiply(newMatrix, newMatrix, trans);
  }

  //first applies the animation matrix
  mat4.multiply(newMatrix, newMatrix, Tmatrix);

  //Set the newMatrix to be the multiplication of the parent node matrix and this node matrix
  mat4.multiply(newMatrix, newMatrix, this.transformMatrix);

  //Analyses all the node children, calling this function
  for (var i = 0; i < nodeChildren.length; i++)
    this.graph.nodes[nodeChildren[i]].analyse(scene, newMatrix, newText, newMat, Time, Diff);

  //Displays all the node Leafs
  for (var i = 0; i < nodeLeafs.length; i++) {
    nodeLeafs[i].draw(newMatrix, newText, newMat);
  }

  //Only the node that activated the shader can disactivate the shader
  if(Diff == true) {
    scene.setActiveShader(scene.defaultShader);
  }
};
