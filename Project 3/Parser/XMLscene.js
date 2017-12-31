var DEGREE_TO_RAD = Math.PI / 180;

/**
 * XMLscene class, representing the scene that is to be rendered.
 * @constructor
 */
function XMLscene(interface)
{
  CGFscene.call(this);

  this.interface = interface;

  this.lightValues = {};

  let d = new Date();

  this.time = d.getTime();

  this.elapsedTime = 0;

  this.cameras = [];

  this.camerasID = [];

  //holds normal dice and rotated dice
  this.dicesMatrix = [];

  this.activeCameraIndex = 0;

  this.selectables = [];

  this.toShade = [];

  this.shaders = [];

  this.pickID = 0;

  this.rotatedOnce = [false, false, false, false];

  this.dicesResult = [true, true, true, true];

  this.diceToIndex =
  {
     'Dice-1': 0,
     'Dice-2': 1,
     'Dice-3': 2,
     'Dice-4': 3
  };

  this.numberOfSteps = 0;

  this.cameraTransition = null;

  this.game = new GameLogic();
}

XMLscene.prototype = Object.create(CGFscene.prototype);

XMLscene.prototype.constructor = XMLscene;

/**
 * Initializes the scene, setting some WebGL defaults, initializing the camera and the axis.
 */
XMLscene.prototype.init = function(application)
{
  CGFscene.prototype.init.call(this, application);

  this.initCameras();

  this.enableTextures(true);

  this.gl.clearDepth(100.0);

  this.gl.enable(this.gl.DEPTH_TEST);

  this.gl.enable(this.gl.CULL_FACE);

  this.gl.depthFunc(this.gl.LEQUAL);

  this.axis = new CGFaxis(this);

  this.setPickEnabled(true);
}


XMLscene.prototype.getDicesMatrix = function()
{
  var normal = mat4.create();

  var rotated = mat4.create();

  mat4.copy(normal, this.graph.nodes["Dice-1"].transformMatrix);

  mat4.copy(rotated, normal);

  mat4.rotateX(rotated, rotated, -Math.PI/2);

  this.dicesMatrix.push(normal);

  this.dicesMatrix.push(rotated);
}

/**
 * Initializes the scene lights with the values read from the LSX file.
 */
XMLscene.prototype.initLights = function()
{
  var i = 0;
  // Lights index.

  // Reads the lights from the scene graph.
  for (var key in this.graph.lights)
  {
    if (i >= 8)
      break;              // Only eight lights allowed by WebGL.

    if (this.graph.lights.hasOwnProperty(key))
    {
      var light = this.graph.lights[key];

      this.lights[i].setPosition(light[1][0], light[1][1], light[1][2], light[1][3]);

      this.lights[i].setAmbient(light[2][0], light[2][1], light[2][2], light[2][3]);

      this.lights[i].setDiffuse(light[3][0], light[3][1], light[3][2], light[3][3]);

      this.lights[i].setSpecular(light[4][0], light[4][1], light[4][2], light[4][3]);

      this.lights[i].setVisible(true);

      if (light[0])
          this.lights[i].enable();
      else
          this.lights[i].disable();

      this.lights[i].update();

      i++;
    }
  }
}

/**
 * Initializes the scene cameras.
 */
XMLscene.prototype.initCameras = function()
{
  this.camera = new CGFcamera(0.7, 0.1, 500, vec3.fromValues(0, 11, 20), vec3.fromValues(0, 0, 0));
}

/* Handler called when the graph is finally loaded.
 * As loading is asynchronous, this may be called already after the application has started the run loop
 */
XMLscene.prototype.onGraphLoaded = function()
{
  this.camera.near = this.graph.near;

  this.camera.far = this.graph.far;

  this.axis = new CGFaxis(this,this.graph.referenceLength);

  this.setGlobalAmbientLight(this.graph.ambientIllumination[0], this.graph.ambientIllumination[1],

  this.graph.ambientIllumination[2], this.graph.ambientIllumination[3]);

  this.gl.clearColor(this.graph.background[0], this.graph.background[1], this.graph.background[2], this.graph.background[3]);

  this.initLights();

  this.loadShaders();

  this.getDicesMatrix();

  // Adds lights group.
  this.interface.addLightsGroup(this.graph.lights);

  //this.interface.addSelectablesGroup(this.selectables);

  //this.interface.addShadersGroup(this);

  this.interface.addCamerasGroup(this);

  this.interface.addRollDiceGroup(this);
}

//Loads done shaders
XMLscene.prototype.loadShaders = function()
{
  console.log("Loading Shaders");

  let Shaders =
  [
    this.defaultShader,
		new CGFshader(this.gl, "../shaders/flat.vert", "../shaders/flat.frag"),
		new CGFshader(this.gl, "../shaders/uScale.vert", "../shaders/uScale.frag"),
		new CGFshader(this.gl, "../shaders/varying.vert", "../shaders/varying.frag")
	];

  this.shaders = Shaders;

  console.log("Done!");
}

XMLscene.prototype.updateScaleFactor = function(v)
{
	this.shaders[1].setUniformsValues({t: Math.cos(v / this.selectedSpeed)});

  this.shaders[2].setUniformsValues({t: Math.cos(v / this.selectedSpeed)});

  this.shaders[2].setUniformsValues({r: this.red / 256});

  this.shaders[2].setUniformsValues({g: this.green / 256});

  this.shaders[2].setUniformsValues({b: this.blue / 256});
}

XMLscene.prototype.logPicking = function ()
{
	if (this.pickMode == false)
  {
		if (this.pickResults != null && this.pickResults.length > 0)
    {
			for (var i=0; i< this.pickResults.length; i++)
      {
				var obj = this.pickResults[i][0];

				if (obj)
				{
					var customId = this.pickResults[i][1];

					console.log("Picked object: " + obj.nodeID + ", with pick id " + customId);

          if(this.game.possiblePicks.indexOf(obj.nodeID) >= 0 || this.toShade.indexOf(obj.nodeID) >= 0)
          {
            if(this.game.stateIndex == 2) //WAITING PIECE PICK
            {
              if(this.toShade.length == 0 && this.toShade[0] != obj.nodeID)
              {
                this.toShade.push(obj.nodeID);

                var s = this.game.pickedPieceNextPlace(obj.nodeID, this.numberOfSteps);

                if(s != null)
                {
                  this.toShade.push(s);

                  this.game.newState = 1;
                }
              }
              else
                this.toShade = [];
            }
            else if(this.game.stateIndex == 1) //WAITING BOARD PICK
            {
              if(obj.nodeID == this.toShade[0])
              {
                this.toShade = []; //unPick

                this.game.newState = 2;
              }
              else if(obj.nodeID == this.toShade[1]) //WHEN PLACE GETS SELECTED
              {
                this.game.newState = 3;

                let pieceInToShade = this.game.pieceInPlace(this.toShade[1]);

                if(pieceInToShade.length == 0 || this.game.isEnemyPiece(pieceInToShade[0]))
                {
                  let pieceAnimation = this.game.getPieceAnimation(this, this.toShade[0], obj.nodeID);

                  this.graph.nodes[this.toShade[0]].animations.push(pieceAnimation);

                  let trans = pieceAnimation.BezierPoint(pieceAnimation.animationSpan);

                  let newPlay = new userPlay(this.game.isPlayer1Playing, this.toShade[0], this.toShade[1], this.game.cloneGameMatrix(), this.elapsedTime, trans);

                  this.game.plays.push(newPlay);

                  this.game.updateGameMatrix(this, this.toShade[0], this.toShade[1]);

                  this.toShade = [];
                }
              }
            }
          }
				}
			}
      this.pickResults.splice(0,this.pickResults.length);
		}
	}
}

XMLscene.prototype.rollDice = function()
{
  let random = [
                Math.floor(Math.random() * 4),
                Math.floor(Math.random() * 4),
                Math.floor(Math.random() * 4),
                Math.floor(Math.random() * 4)
                ];

  let result = this.game.returnDiceResult(random);

  let steps = 0;

  for(let i = 0; i < result.length; i++)
    if(result[i] == true)
      steps++;

  //Moving Camera state enable
  this.dicesResult = result;

  this.numberOfSteps = steps;

  if(this.game.player1 == true)
    this.cameraTransition = new CameraTransition(this.cloneCamera(this.cameras['player1-view']), this.cloneCamera(this.cameras['dice-view']), 2.5, 'LINEAR', 5);
  else
    this.cameraTransition = new CameraTransition(this.cloneCamera(this.cameras['player2-view']), this.cloneCamera(this.cameras['dice-view']), 2.5, 'LINEAR', 5);

  this.interface.gui.closed = true;
}

XMLscene.prototype.searchPieceAtAMatrix = function(gameMatrix, pieceName)
{
  for(let i = 0; i < gameMatrix.length; i++)
    if(gameMatrix[i].indexOf(pieceName) >= 0)
      return [i, gameMatrix[i].indexOf(pieceName)];
}

XMLscene.prototype.reverseMov = function(movVector)
{
  let x = [];

  for(let i = 0; i < 3; i++)
    x.push(-1.0 * movVector[i]);

  return x;
}

XMLscene.prototype.undo = function()
{
  let lastPlay = this.game.lastPlay;

  let pieceToMoveBack = lastPlay.pieceMoved;

  let search = this.searchPieceAtAMatrix(lastPlay.matrix, pieceToMoveBack);

  let moveBackTo = this.game.vectorToXML[search[0]];

  let backFrom = lastPlay.pieceMovedTo;

/*
  if(moveBackTo != 'P1-Base' && moveBackTo != 'P2-Base')
    moveBackToCoor = this.game.XMLtoCoordinates[moveBackTo];
  else
  {
    if(lastPlay.wasPlayer1)
      moveBackToCoor = this.game.XMLtoCoordinates[moveBackTo][this.game.P1Pieces.indexOf(pieceToMoveBack)];
    else
      moveBackToCoor = this.game.XMLtoCoordinates[moveBackTo][this.game.P2Pieces.indexOf(pieceToMoveBack)];
  }

  let backFromCoor;

  if(backFrom != 'P1-Base' && backFrom != 'P2-Base')
    backFromCoor = this.game.XMLtoCoordinates[backFrom];
  else
  {
    if(lastPlay.wasPlayer1)
      backFromCoor = this.game.XMLtoCoordinates[backFrom][this.game.P1Pieces.indexOf(pieceToMoveBack)];
    else
      backFromCoor = this.game.XMLtoCoordinates[backFrom][this.game.P2Pieces.indexOf(pieceToMoveBack)];
  }*/

  let mov = this.reverseMov(lastPlay.translation);

  let bezPoints = this.game.getBezierPointsVector([0,0,0], mov);

  let newAnimation = new BezierAnimation(this, pieceToMoveBack, 9, bezPoints);

  this.graph.nodes[pieceToMoveBack].animations.push(newAnimation);

  if(lastPlay.pieceTobase != null)
    console.log("Mover outra peça");

  let newPlay = new userPlay(!this.game.isPlayer1Playing, pieceToMoveBack, moveBackTo, this.game.cloneGameMatrix(), this.elapsedTime, mov);

  this.game.plays.push(newPlay);

  if(search[0] != 0 && search[0] != 1)
    this.game.gameMatrix[search[0]].push(pieceToMoveBack);
  else
    this.game.gameMatrix[search[0]][search[1]] = pieceToMoveBack;

  this.game.gameMatrix[this.game.XMLtoVector[backFrom]] = [];

  this.game.newState = 3;
}

XMLscene.prototype.updateCamera = function(diff)
{
  this.cameraTransition.updateTime(diff);

  this.camera = this.cameraTransition.previousCamera;

  if(this.cameraTransition.transitionSpan < this.cameraTransition.time)
  {
    this.camera = this.cameraTransition.nextCamera;

    this.game.newState = this.cameraTransition.nextState;

    this.cameraTransition = null;
  }
  else
  {
    let x = this.cameraTransition.transition(diff);
    this.camera.position[0] += x[0][0];
    this.camera.position[1] += x[0][1];
    this.camera.position[2] += x[0][2];
    this.camera.target[0] += x[1][0];
    this.camera.target[1] += x[1][1];
    this.camera.target[2] += x[1][2];
    this.game.newState = 4;
  }
}

XMLscene.prototype.returnDicePosition = function(diceName)
{
  let x = this.dicesResult[this.diceToIndex[diceName]];

  return !x;
}

XMLscene.prototype.cloneCamera = function(cameraToClone)
{
  var x = new CGFcamera(cameraToClone.fov, cameraToClone.near, cameraToClone.far, cameraToClone.position, cameraToClone.target);

  return x;
}

/**
 * Displays the scene.
 */
XMLscene.prototype.display = function()
{
  this.logPicking();


  // ---- BEGIN Background, camera and axis setup

  /*let d = new Date();

  let t = d.getTime();*/

  let diff = 0.042;

  if(this.cameraTransition != null)
    this.updateCamera(diff);

  if(this.game.stateIndex == 0)         //WAITING DICE ROLLING
    this.interface.gui.closed = false;
  else if(this.game.stateIndex == 5)    //LOOKING AT DICES
  {
    this.game.updateDicesTime(diff);

    if(this.game.watchDicesTime >= 1.5)
    {
      if(this.game.player1)
      {
        if(this.numberOfSteps != 0)
          this.cameraTransition = new CameraTransition(this.cloneCamera(this.cameras['dice-view']), this.cloneCamera(this.cameras['player1-view']), 2.5, 'LINEAR', 2);
        else
          {
            this.cameraTransition = new CameraTransition(this.cloneCamera(this.cameras['dice-view']), this.cloneCamera(this.cameras['player2-view']), 2.5, 'LINEAR', 0);

            this.game.changePlayer(this);
          }
      }
      else
      {
        if(this.numberOfSteps != 0)
          this.cameraTransition = new CameraTransition(this.cloneCamera(this.cameras['dice-view']), this.cloneCamera(this.cameras['player2-view']), 2.5, 'LINEAR', 2);
        else
        {
          this.cameraTransition = new CameraTransition(this.cloneCamera(this.cameras['dice-view']), this.cloneCamera(this.cameras['player1-view']), 2.5, 'LINEAR', 0);

          this.game.changePlayer(this);
        }
      }

      this.game.resetwatchingDicesTime();

      this.game.setPossiblePiecesPick();
    }
  }
  else if(this.game.stateIndex == 3) //MOVING PIECE
  {
    let lastPlay = this.game.lastPlay;

    let movingPiece = lastPlay.pieceMoved;

    let atWhatTime = lastPlay.whatTime;

    let movingPieceCurrentAnimation = this.graph.nodes[movingPiece].animations[0];

    let thrownPiece = lastPlay.pieceTobase;

    let thrownPieceCurrentAnimation;

    if(thrownPiece != null)
      thrownPieceCurrentAnimation = this.graph.nodes[thrownPiece].animations[0];

    if(movingPieceCurrentAnimation.isAnimationsComplete(this.elapsedTime - atWhatTime) >= 1.0 && thrownPiece == null)
    {
      let translation = lastPlay.movement;

      mat4.translate(this.graph.nodes[movingPiece].transformMatrix, this.graph.nodes[movingPiece].transformMatrix, translation);

      this.graph.nodes[movingPiece].animations = [];

      if(this.game.isSpecialCube(lastPlay.pieceMovedTo))
        this.game.repeatPlayer(this);
      else
      {
        if(this.game.player1)
          this.cameraTransition = new CameraTransition(this.cloneCamera(this.cameras['player1-view']), this.cloneCamera(this.cameras['player2-view']), 2.5, 'LINEAR', 0);
        else
          this.cameraTransition = new CameraTransition(this.cloneCamera(this.cameras['player2-view']), this.cloneCamera(this.cameras['player1-view']), 2.5, 'LINEAR', 0);

        this.game.changePlayer(this);
      }
    }
    else if(movingPieceCurrentAnimation.isAnimationsComplete(this.elapsedTime - atWhatTime) >= 1.0 && thrownPiece != null && thrownPieceCurrentAnimation.isAnimationsComplete(this.elapsedTime - atWhatTime) >= 1.0)
    {
      let translation = lastPlay.movement;

      mat4.translate(this.graph.nodes[movingPiece].transformMatrix, this.graph.nodes[movingPiece].transformMatrix, translation);

      this.graph.nodes[movingPiece].animations = [];

      mat4.translate(this.graph.nodes[thrownPiece].transformMatrix, this.graph.nodes[thrownPiece].transformMatrix, thrownPieceCurrentAnimation.lastPoint);

      this.graph.nodes[thrownPiece].animations = [];

      if(this.game.player1)
        this.cameraTransition = new CameraTransition(this.cloneCamera(this.cameras['player1-view']), this.cloneCamera(this.cameras['player2-view']), 2.5, 'LINEAR', 0);
      else
        this.cameraTransition = new CameraTransition(this.cloneCamera(this.cameras['player2-view']), this.cloneCamera(this.cameras['player1-view']), 2.5, 'LINEAR', 0);

      this.game.changePlayer(this);
    }
  }

  // Clear image and depth buffer everytime we update the scene
  this.gl.viewport(0, 0, this.gl.canvas.width, this.gl.canvas.height);

  this.gl.clear(this.gl.COLOR_BUFFER_BIT | this.gl.DEPTH_BUFFER_BIT);

  // Initialize Model-View matrix as identity (no transformation
  this.updateProjectionMatrix();

  this.loadIdentity();

  // Apply transformations corresponding to the camera position relative to the origin
  this.applyViewMatrix();

  this.pushMatrix();

    if (this.graph.loadedOk)
    {
      // Applies initial transformations.
      this.multMatrix(this.graph.initialTransforms);

    	// Draw axis
    	this.axis.display();

      var i = 0;

      for (var key in this.lightValues)
      {
        if (this.lightValues.hasOwnProperty(key))
        {
          if (this.lightValues[key])
          {
            this.lights[i].setVisible(true);

            this.lights[i].enable();
          }
          else
          {
              this.lights[i].setVisible(false);

              this.lights[i].disable();
          }

          this.lights[i].update();

          i++;
        }
      }

      //this.updateScaleFactor(t);

      // Displays the scene.
      this.graph.displayScene(diff);

      this.time = t;

      this.elapsedTime += diff;

      this.pickID = 0;
    }
    else
    {
    	// Draw axis
    	this.axis.display();
    }

  this.popMatrix();
  // ---- END Background, camera and axis setup

  this.clearPickRegistration();

}
