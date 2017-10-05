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
  this.materialID = null ;

  // The texture ID.
  this.textureID = null ;

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

MyGraphNode.prototype.analyse = function (id)
{
  var nodeChildren = this.getChildren();

  if(nodeChildren.length != 0)
  {
    for(var i = 0; i <  nodeChildren.length; i++)
      this.graph.nodes[nodeChildren[i]].analyse(nodeChildren[i]);
  }
  else
  {
    console.log("got to bottom at " + id);

    var nodeLeafs = this.getLeaves();

    for(var i = 0; i <  nodeLeafs.length; i++)
    {
      console.log("   LEAF ->  " + nodeLeafs[i].xmlelem.attributes[0].nodeValue);

      if(nodeLeafs[i].xmlelem.attributes[0].nodeValue == "rectangle")
        var rec = myRectangle(this.scene, -1, 1, 1, -1);

    }
  }
}
