 /**
 * MyInterface class, creating a GUI interface.
 * @constructor
 */
function MyInterface()
{
  //call CGFinterface constructor
  CGFinterface.call(this);
};

MyInterface.prototype = Object.create(CGFinterface.prototype);

MyInterface.prototype.constructor = MyInterface;

/**
 * Initializes the interface.
 * @param {CGFapplication} application
 */
MyInterface.prototype.init = function(application)
{
  // call CGFinterface init
  CGFinterface.prototype.init.call(this, application);

  // init GUI. For more information on the methods, check:
  //  http://workshop.chromeexperiments.com/examples/gui

  this.gui = new dat.GUI();

  // add a group of controls (and open/expand by defult)

  return true;
};

/**
 * Adds a folder containing the IDs of the lights passed as parameter.
 */
MyInterface.prototype.addLightsGroup = function(lights)
{
  var group = this.gui.addFolder("Lights");

  group.open();

  // add two check boxes to the group. The identifiers must be members variables of the scene initialized in scene.init as boolean
  // e.g. this.option1=true; this.option2=false;

  for (var key in lights)
  {
    if (lights.hasOwnProperty(key))
    {
      this.scene.lightValues[key] = lights[key][0];

      group.add(this.scene.lightValues, key);
    }
  }
}

/*
 * Adds a folder containing the IDs of the nodes which are "selectable" passed as a parameter.
 */
MyInterface.prototype.addSelectablesGroup = function(selectables)
{
  let selectablesDict = {};

  for(let i = 0; i < selectables.length; i++)
    selectablesDict[selectables[i].nodeID] = i;

  this.gui.add(this.scene, 'selectedNode', selectablesDict).name('Node').onChange(function(x)
  {
    this.scene.selectedNode = x;
  });

  console.log("Added selectables Group");
}

MyInterface.prototype.addShadersGroup = function()
{
  this.gui.add(this.scene, 'selectedShader',
  {
    'Default Shadding': -1,
    'Flat Shading': 0,
    'Scale over time': 1,
    'Passing a varying parameter from VS -> FS': 2,
    'Simple texturing': 3,
    'Multiple textures in the FS': 4,
    'Multiple textures in VS and FS': 5,
    'Sepia': 6,
    'Convolution': 7
  }).name('Shader').onChange(function(x)
  {
    this.scene.selectedShader = x;
  });

  console.log("Added Shaders Group");
}
