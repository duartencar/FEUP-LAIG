/**
 * MyGraphLeaf class, representing a leaf in the scene graph.
 * @constructor
**/

function MyGraphLeaf(graph, xmlelem)
{
    this.graph = graph;

    this.xmlelem = xmlelem;

    this.LeafType = xmlelem.getAttribute("type");

    this.LeafArgs = xmlelem.getAttribute("args").split(" ");
}

MyGraphLeaf.prototype.printLeafType = function ()
{
  console.log(this.LeafType);
}

MyGraphLeaf.prototype.printLeafArgs = function ()
{
  console.log(this.LeafArgs);
}

MyGraphLeaf.prototype.printxmlelem = function ()
{
  console.log(this.xmlelem);
}

MyGraphLeaf.prototype.getLeaf = function (scene)
{
  switch(this.LeafType)
  {
    case "cylinder":
        if(this.LeafArgs.length != 7)
        {
            console.log("Worng number of args for cylinder ( must be 7)");
            break;
        }
        else
        {
          var Leaf = new myCylinder(scene, parseFloat(this.LeafArgs[0]), parseFloat(this.LeafArgs[1]), parseFloat(this.LeafArgs[2]), parseFloat(this.LeafArgs[3]), parseFloat(this.LeafArgs[4]), this.LeafArgs[5], this.LeafArgs[6]);
          break;
        }

    case "rectangle":
      if(this.LeafArgs.length != 4)
      {
        console.log("Worng number of args for rectangle ( must be 4)");
        break;
      }
      else
      {
        var Leaf = new myRectangle(scene, this.LeafArgs[0], this.LeafArgs[1], this.LeafArgs[2], this.LeafArgs[3]);
        break;
      }
    case "triangle":
      if(this.LeafArgs.length != 9)
      {
        console.log("Worng number of args for triangle ( must be 6)");
        break;
      }
      else
      {
        var Leaf = new myTriangle(scene, this.LeafArgs[0], this.LeafArgs[1], this.LeafArgs[2], this.LeafArgs[3], this.LeafArgs[4], this.LeafArgs[5], this.LeafArgs[6], this.LeafArgs[7], this.LeafArgs[8]);
        break;
      }
    case "sphere":
      if(this.LeafArgs.length != 3)
      {
        console.log("Worng number of args for sphere ( must be 3)");
        break;
      }
      else
      {
        var Leaf = new mySphere(scene, this.LeafArgs[0], this.LeafArgs[1], this.LeafArgs[2]);
        break;
      }
  }

  return Leaf;
}

MyGraphLeaf.prototype.draw = function(scene, toDraw, Matrix, Texture, Material)
{
  scene.pushMatrix();

    if(Material == "null")
      var appearance = scene.graph.materials["defaultMaterial"];
    else
      var appearance = scene.graph.materials[Material];

    if(Texture != "clear" && Material != "null")
      appearance.setTexture(scene.graph.textures[Texture][0]);

    appearance.apply();

    scene.multMatrix(Matrix);

    toDraw.display();

  scene.popMatrix();
}

