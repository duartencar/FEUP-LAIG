/**
 * MyGraphLeaf class, representing a leaf in the scene graph.
 * @constructor
**/

function MyGraphLeaf(graph, xmlelem)
{
    this.graph = graph;

    this.xmlelem = xmlelem;

    //gets the the type attribute from de xml element
    this.LeafType = xmlelem.getAttribute("type");

    //gets the the args attribute from de xml element
    this.LeafArgs = this.setArgs(xmlelem);

    //Only have elements with patch Leafs
    this.patchLines = [];
}

/**
 * prints the Leaf type
 **/
MyGraphLeaf.prototype.printLeafType = function ()
{
  console.log(this.LeafType);
};

/**
 * prints the Leaf args
 **/
MyGraphLeaf.prototype.printLeafArgs = function ()
{
  console.log(this.LeafArgs);
};

/**
 * prints the Leaf xml element
 **/
MyGraphLeaf.prototype.printxmlelem = function ()
{
  console.log(this.xmlelem);
};

/**
 * adds a group of Cpoints that form a CpLine
 **/
MyGraphLeaf.prototype.addPatchLine = function (x)
{
  this.patchLines.push(x);
};

MyGraphLeaf.prototype.setArgs = function (xmlelem)
{
  let unChecked = xmlelem.getAttribute("args").split(" ");

  let checked = [];

  for(let i = 0, l = unChecked.length; i < l; i++) {
    if (unChecked[i] != "") {
      checked.push(unChecked[i]);
    }
  }

  return checked;
};

/**
 * creates an CGF object according to the Leaf type and returns it
 **/
MyGraphLeaf.prototype.getLeaf = function (scene)
{
  let Leaf = null;

  switch(this.LeafType)
  {
    case "cylinder":
      this.LeafArgs.length != 7 ? console.log("Worng number of args for cylinder ( must be 7)") : Leaf = new myCylinder(scene, parseFloat(this.LeafArgs[0]), parseFloat(this.LeafArgs[1]), parseFloat(this.LeafArgs[2]), parseFloat(this.LeafArgs[3]), parseFloat(this.LeafArgs[4]), this.LeafArgs[5], this.LeafArgs[6]);
          
      break;
    case "rectangle":
      this.LeafArgs.length != 4 ? console.log("Worng number of args for rectangle ( must be 4)") : Leaf = new myRectangle(scene, parseFloat(this.LeafArgs[0]), parseFloat(this.LeafArgs[1]), parseFloat(this.LeafArgs[2]), parseFloat(this.LeafArgs[3]));
        
      break;
    case "triangle":
      this.LeafArgs.length != 9 ? console.log("Worng number of args for triangle ( must be 6)") : Leaf = new myTriangle(scene, this.LeafArgs[0], this.LeafArgs[1], this.LeafArgs[2], this.LeafArgs[3], this.LeafArgs[4], this.LeafArgs[5], this.LeafArgs[6], this.LeafArgs[7], this.LeafArgs[8]);

      break;
    case "sphere":
      this.LeafArgs.length != 3 ? console.log("Worng number of args for sphere ( must be 3)") : Leaf = new mySphere(scene, parseFloat(this.LeafArgs[0]), parseFloat(this.LeafArgs[1]), parseFloat(this.LeafArgs[2]));
      
      break;
    case "patch":
      this.LeafArgs.length != 2 ? console.log("Worng number of args for patch ( must be 2)") : Leaf = new myPatch(scene, this.LeafArgs[0], this.LeafArgs[1], this.patchLines);
      
      break;
    default:
      console.log(this.LeafType + " is not ready yet!");
  }

  return Leaf;
};

/**
 * Draws a Leaf
 * toDraw - object to draw
 * Matrix - the transformation matrix that will be 'applied'
 * Texture - the texture that will be apllied to the object
 * Material- the material that will be applied to the object
 **/
MyGraphLeaf.prototype.draw = function(scene, toDraw, Matrix, Texture, Material)
{
  let appearance = null;
  
  scene.pushMatrix();

    Material == "null" ? appearance = scene.graph.materials["defaultMaterial"] : appearance = scene.graph.materials[Material];

    //It will only a aplly a texture if there is a material
    if(Texture != "clear" && Material != "null" && Texture != "null")
    {
      //applies the texture
      appearance.setTexture(scene.graph.textures[Texture][0]);

      //if the object is a rectangle or a triangle it will check for the amplif_factor attribute
      if((toDraw instanceof myRectangle || toDraw instanceof myTriangle) && (scene.graph.textures[Texture][1] != 1.0 || scene.graph.textures[Texture][2] != 1.0))
        toDraw.ampText(scene.graph.textures[Texture][1], scene.graph.textures[Texture][2]);
    }

    //applies the appearance
    appearance.apply();

    //applies the transformation matrix
    scene.multMatrix(Matrix);

    //displays object
    toDraw.display();

    //reset material texture
    appearance.setTexture(null);

  scene.popMatrix();
};

