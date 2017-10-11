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

  this.transformMatrix = mat4.create();

  mat4.identity(this.transformMatrix);
}

/**
 * Adds the reference (ID) of another node to this node's children array.
 */
MyGraphNode.prototype.addChild = function(nodeID)
{
  this.children.push(nodeID);
}

/**
 * Adds a leaf to this node's leaves array.
 */
MyGraphNode.prototype.addLeaf = function(leaf)
{
  this.leaves.push(leaf);
}

MyGraphNode.prototype.showLeaves = function()
{
  console.log(this.leaves);
}

MyGraphNode.prototype.showChildren = function()
{
  console.log(this.children);
}

MyGraphNode.prototype.getMaterialID = function ()
{
  return this.materialID;
}

MyGraphNode.prototype.getTextureID = function ()
{
  return this.textureID;
}

MyGraphNode.prototype.getLeaves = function()
{
  return this.leaves;
}

MyGraphNode.prototype.getChildren = function ()
{
  return this.children;
}

MyGraphNode.prototype.analyse = function (scene, Tmatrix, Text, Mat)
{
  var nodeChildren = this.getChildren();

  var nodeLeafs = this.getLeaves();

  var newMatrix = mat4.create();

  if(this.getTextureID() == "null")
  {
    if(Text != null)
      var newText = Text;
    else
      var newText = this.getTextureID();
  }
  else
    var newText = this.getTextureID();

  if(this.getMaterialID() == "null")
  {
    if (Mat != null)
      var newMat = Mat;
    else
      var newMat = this.getMaterialID();
  }
  else
    var newMat = this.getMaterialID();

  mat4.multiply(newMatrix, Tmatrix, this.transformMatrix);

  for (var i = 0; i < nodeChildren.length; i++)
    this.graph.nodes[nodeChildren[i]].analyse(scene, newMatrix, newText, newMat);

  for(var i = 0; i < nodeLeafs.length; i++)
  {
    for (var i = 0; i < nodeLeafs.length; i++)
    {
      var Leaf = new MyGraphLeaf(nodeLeafs[i].graph, nodeLeafs[i].xmlelem, scene);

      var toDraw = Leaf.getLeaf(scene);

      Leaf.draw(scene, toDraw, newMatrix, newText, newMat);
    }
  }
}
