/**
 * MyGraphNode class, representing an intermediate node in the scene graph.
 * @constructor
**/

function MyGraphNode(graph, nodeID) {
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
MyGraphNode.prototype.addChild = function(nodeID) {
    this.children.push(nodeID);
}

/**
 * Adds a leaf to this node's leaves array.
 */
MyGraphNode.prototype.addChild = function(leaf) {
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

MyGraphNode.prototype.analyse = function (id) {
    var nodeLeafs = this.getLeaves();

    if(nodeLeafs.length != 0)
    {
        for(var i = 0; i <  nodeLeafs.length; i++)
            this.graph.nodes[nodeLeafs[i]].analyse(nodeLeafs[i]);
    }
    else
    {
        console.log("got to bottom at " + id);
    }
}


