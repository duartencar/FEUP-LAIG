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

  // The node Matrix creation
  this.transformMatrix = mat4.create();

  //Seting the initial matrix to the identity matrix
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
 * Prints the node Children.
 */
MyGraphNode.prototype.showChildren = function()
{
  console.log(this.children);
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
MyGraphNode.prototype.analyse = function (scene, Tmatrix, Text, Mat)
{
  let nodeChildren = this.getChildren();

  let nodeLeafs = this.getLeaves();

  let newMatrix = mat4.create();

  let newText = null;

  let newMat = null;
  
  let toDraw = null;

  if(this.getTextureID() == "null") {
    Text != null ? newText = Text : newText = this.getTextureID();
  }
  else {
    newText = this.getTextureID();
  }
    
  if(this.getMaterialID() == "null") {
    Mat != null ? newMat = Mat : newMat = this.getMaterialID();
  }
  else {
    newMat = this.getMaterialID();
  }
    
  mat4.multiply(newMatrix, Tmatrix, this.transformMatrix);

  for (let i = 0, l = nodeChildren.length; i < l; i++) {
    this.graph.nodes[nodeChildren[i]].analyse(scene, newMatrix, newText, newMat);
  }

  for (let i = 0, l = nodeLeafs.length; i < l; i++) {
    toDraw = nodeLeafs[i].getLeaf(scene);

    nodeLeafs[i].draw(scene, toDraw, newMatrix, newText, newMat);
  }
};
