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

MyGraphNode.prototype.getLeaves = function()
{
  return this.leaves;
}

MyGraphNode.prototype.getChildren = function ()
{
  return this.children;
}

MyGraphNode.prototype.analyse = function (scene, id, Tmatrix)
{
  var nodeChildren = this.getChildren();

  var nodeLeafs = this.getLeaves();

  var newMatrix = mat4.create();

  mat4.multiply(newMatrix, Tmatrix, this.transformMatrix);

  for (var i = 0; i < nodeChildren.length; i++)
    this.graph.nodes[nodeChildren[i]].analyse(scene, nodeChildren[i], newMatrix);

  for(var i = 0; i < nodeLeafs.length; i++)
  {
    for (var i = 0; i < nodeLeafs.length; i++)
    {
      var Leaf = new MyGraphLeaf(nodeLeafs[i].graph, nodeLeafs[i].xmlelem);

      var toDraw = Leaf.getLeaf(scene);

      scene.pushMatrix();

        scene.multMatrix(newMatrix);

        toDraw.display();

      scene.popMatrix();
    }
  }
}
