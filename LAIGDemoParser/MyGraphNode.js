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

MyGraphNode.prototype.analyse = function (scene, id, stack)
{
  var nodeChildren = this.getChildren();

  if(nodeChildren.length != 0)
  {
    var nextStack = stack;

    nextStack.push(this.transformMatrix);

    //console.log(stack);

    for(var i = 0; i <  nodeChildren.length; i++)
      this.graph.nodes[nodeChildren[i]].analyse(scene, nodeChildren[i], nextStack);
  }
  else
  {
    //console.log("got to bottom at " + id);

    var nodeLeafs = this.getLeaves();

    var LeafsArray = new Array();

    for(var i = 0; i <  nodeLeafs.length; i++)
    {
      //console.log("   LEAF ->  " + nodeLeafs[i].xmlelem.attributes[0].nodeValue);

<<<<<<< Updated upstream
      console.log(stack);

      if(nodeLeafs[i].xmlelem.attributes[0].nodeValue == "rectangle")
      {
        var argsV = nodeLeafs[i].xmlelem.attributes[1].nodeValue;

        var args = argsV.split(" ");

        if(args.length != 4)
          console.log("Wrong number of args for rectangle ( must be 4)");

        var rec = new myRectangle(scene, args[0], args[1], args[2], args[3]);

        scene.pushMatrix();

          for(var i = 0; i < stack.length; i++)
            scene.multMatrix(stack.pop());

          scene.multMatrix(this.graph.nodes[id].transformMatrix);

          rec.display();

        scene.popMatrix();
      }
      else if(nodeLeafs[i].xmlelem.attributes[0].nodeValue == "cylinder")
      {

        var argsV = nodeLeafs[i].xmlelem.attributes[1].value;

        var args = argsV.split(" ");
=======
      var Leaf = new MyGraphLeaf(nodeLeafs[i].graph, nodeLeafs[i].xmlelem);
>>>>>>> Stashed changes

      LeafsArray.push(Leaf);

<<<<<<< Updated upstream
        if(args.length != 5)
          console.log("Wrong number of args for cylinder ( must be 5)");

        var cyl = new myTube(scene, args[0], args[1], args[2], args[3], args[4]);
=======
      console.log(stack);
>>>>>>> Stashed changes

      var obj = Leaf.getLeaf(scene);

      scene.pushMatrix();

        for(var i = 0; i < stack.length; i++)
          scene.multMatrix(stack.pop());

        scene.multMatrix(this.graph.nodes[id].transformMatrix);

        obj.display();

      scene.popMatrix();
      }
<<<<<<< Updated upstream
      else if(nodeLeafs[i].xmlelem.attributes[0].nodeValue == "sphere1")
      {
        var argsV = nodeLeafs[i].xmlelem.attributes[2].nodeValue;

        var args = argsV.split(" ");

        if(args.length != 3)
          console.log("Wrong number of args for sphere ( must be 3)");

        var sphere = new mySphere(scene, args[0], args[1], args[2]);

        scene.pushMatrix();

          for(var i = 0; i < stack.length; i++)
            scene.multMatrix(stack.pop());

          scene.multMatrix(this.graph.nodes[id].transformMatrix);
=======
    }
>>>>>>> Stashed changes

    /*for(var i = 0; i < LeafsArray.length; i++)
    {
      LeafsArray[i].printxmlelem();
      LeafsArray[i].printLeafType();
      LeafsArray[i].printLeafArgs();
      LeafsArray[i].drawLeaf(scene, stack);
    }*/

}
