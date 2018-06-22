var DEGREE_TO_RAD = Math.PI / 180;

var diff = 0.033;

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

  this.file = null;

  //holds normal dice and rotated dice
  this.dicesMatrix = [];

  this.activeCameraIndex = 0;

  this.selectables = [];

  this.toShade = [];

  this.shaders = [];

  this.resetingPieces = [];

  this.resetTime = 0;

  this.pickID = 0;

  this.height = 0;

  this.lookAtDicesTime = 1.5;

  this.cameraTransitionsSpeed = null;

  this.pieceAnimationSpeed = null;

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

  this.nFrames = 0;
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

XMLscene.prototype.setSpeeds = function(filename)
{
  if(filename == 'GameBoard.xml')
  {
    this.pieceAnimationSpeed = 9;

    this.cameraTransitionsSpeed = 2;

    this.height = 6;

    this.game.XMLtoCoordinates =
    {
     'Throw-Again-Cubes-1': [3, 6, 3],
     'Throw-Again-Cubes-16': [39, 6, 3],
     'Normal-Cube-2': [9, 6, 3],
     'Normal-Cube-3': [15, 6, 3],
     'Normal-Cube-4': [21, 6, 3],
     'Normal-Cube-17': [45, 6, 3],
     'Normal-Cube-5': [3, 6, 9],
     'Normal-Cube-6': [9, 6, 9],
     'Normal-Cube-7': [15, 6, 9],
     'Super-Cube-12': [21, 6, 9],
     'Normal-Cube-13': [27, 6, 9],
     'Normal-Cube-14': [33, 6, 9],
     'Normal-Cube-15': [39, 6, 9],
     'Normal-Cube-18': [45, 6, 9],
     'Throw-Again-Cubes-8': [3, 6, 15],
     'Throw-Again-Cubes-20': [39, 6, 15],
     'Normal-Cube-9': [9, 6, 15],
     'Normal-Cube-10': [15, 6, 15],
     'Normal-Cube-11': [21, 6, 15],
     'Normal-Cube-19': [45, 6, 15],
     'P1-Base': [[3, 6, 29], [9, 6, 29], [15, 6, 29], [21, 6, 29], [27, 6, 29], [33, 6, 29], [39, 6, 29]],
     'P2-Base': [[3, 6, -13], [9, 6, -13], [15, 6, -13], [21, 6, -13], [27, 6, -13], [33, 6, -13], [39, 6, -13]],
     'P1-Finish':[[-6, 6, 26], [-6, 6, 20], [-6, 6, 14], [-6, 6, 8], [-6, 6, 2], [-6, 6, -4], [-6, 6, -10]],
     'P2-Finish':[[55, 6, -2], [55, 6, -4], [55, 6, 2], [55, 6, 8], [55, 6, 14], [55, 6, 20], [55, 6, 26]]
    };
  }
  else if(filename == 'Bar.xml')
  {
    this.pieceAnimationSpeed = 0.9;

    this.cameraTransitionsSpeed = 0.09;

    this.height = 0.6;

    this.game.XMLtoCoordinates =
    {
     'Throw-Again-Cubes-1': [0.3, 0.6, 0.3],
     'Throw-Again-Cubes-16': [3.9, 0.6, 0.3],
     'Normal-Cube-2': [0.9, 0.6, 0.3],
     'Normal-Cube-3': [1.5, 0.6, 0.3],
     'Normal-Cube-4': [2.1, 0.6, 0.3],
     'Normal-Cube-17': [4.5, 0.6, 0.3],
     'Normal-Cube-5': [0.3, 0.6, 0.9],
     'Normal-Cube-6': [0.9, 0.6, 0.9],
     'Normal-Cube-7': [1.5, 0.6, 0.9],
     'Super-Cube-12': [2.1, 0.6, 0.9],
     'Normal-Cube-13': [2.7, 0.6, 0.9],
     'Normal-Cube-14': [3.3, 0.6, 0.9],
     'Normal-Cube-15': [3.9, 0.6, 0.9],
     'Normal-Cube-18': [4.5, 0.6, 0.9],
     'Throw-Again-Cubes-8': [0.3, 0.6, 1.5],
     'Throw-Again-Cubes-20': [3.9, 0.6, 1.5],
     'Normal-Cube-9': [0.9, 0.6, 1.5],
     'Normal-Cube-10': [1.5, 0.6, 1.5],
     'Normal-Cube-11': [2.1, 0.6, 1.5],
     'Normal-Cube-19': [4.5, 0.6, 1.5],
     'P1-Base': [[0.3, 0.6, 2.9], [0.9, 0.6, 2.9], [1.5, 0.6, 2.9], [2.1, 0.6, 2.9], [2.7, 0.6, 2.9], [3.3, 0.6, 2.9], [3.9, 0.6, 2.9]],
     'P2-Base': [[0.3, 0.6, -1.3], [0.9, 0.6, -1.3], [1.5, 0.6, -1.3], [2.1, 0.6, -1.3], [2.7, 0.6, -1.3], [3.3, 0.6, -1.3], [3.9, 0.6, -1.3]],
     'P1-Finish':[[-0.6, 0.6, 26], [-0.6, 0.6, 20], [-0.6, 0.6, 14], [-0.6, 0.6, 0.8], [-0.6, 0.6, 0.2], [-0.6, 0.6, -0.4], [-0.6, 0.6, -1.0]],
     'P2-Finish':[[55, 6, -2], [55, 6, -4], [55, 6, 2], [55, 6, 8], [55, 6, 14], [55, 6, 20], [55, 6, 26]]
    };
  }
  else {
    console.log("Ficheiro estranho");
  }
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
  this.camera = this.cameras[this.camerasID[0]];

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

  this.interface.gameControlsGroup(this);

  this.interface.gameSettings(this);
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
			for (let i=0, l = this.pickResults.length; i< l; i++)
      {
				var obj = this.pickResults[i][0];

				if (obj)
				{
					var customId = this.pickResults[i][1];

					console.log("Picked object: " + obj.nodeID + ", with pick id " + customId);

          //if picked object name is one of possible picks or one of shaded objects
          if(this.game.possiblePicks.indexOf(obj.nodeID) >= 0 || this.toShade.indexOf(obj.nodeID) >= 0)
          {
            if(this.game.stateIndex == 2) //WAITING PIECE PICK
            {
              //if there is no object shaded and the user hasn t pick the previously shaded object
              if(this.toShade.length == 0 && this.toShade[0] != obj.nodeID)
              {
                //shade the piece
                this.toShade.push(obj.nodeID);

                //get the place where the piece can go
                var s = this.game.pickedPieceNextPlace(obj.nodeID, this.numberOfSteps);

                //if the piece can go somewhere
                if(s != null)
                {
                  //shade it
                  this.toShade.push(s);

                  //change state for waiting place pick
                  this.game.newState = 1;
                }
              }
              else //if player has picked the previously shaded piece, unshade it
                this.toShade = [];
            }
            else if(this.game.stateIndex == 1) //WAITING BOARD PICK
            {
              //if player has picked the previously shaded piece, unshade it
              if(obj.nodeID == this.toShade[0])
              {
                this.toShade = []; //unPick

                //change state to waiting piece pick
                this.game.newState = 2;
              }
              else if(obj.nodeID == this.toShade[1]) //WHEN PLACE GETS SELECTED
              {//if player picks a valid place then change game state to moving piece
                this.game.newState = 3;

                //try to get the piece name that is on that place
                let pieceInToShade = this.game.pieceInPlace(this.toShade[1]);

                //if there is no piece in the selected place or the piece in the place is an enemy piece, gmae will allow the play
                if(pieceInToShade.length == 0 || this.game.isEnemyPiece(pieceInToShade[0]))
                {
                  //gets the animation to the piece
                  let pieceAnimation = this.game.getPieceAnimation(this, this.toShade[0], obj.nodeID);

                  //adds it to the node
                  this.graph.nodes[this.toShade[0]].animations.push(pieceAnimation);

                  //gets piece translation
                  let trans = pieceAnimation.BezierPoint(pieceAnimation.animationSpan);

                  //creates a play object
                  let newPlay = new userPlay(this.game.isPlayer1Playing, this.toShade[0], this.toShade[1], this.game.cloneGameMatrix(), this.elapsedTime, trans);

                  //adds it to the plays vector
                  this.game.plays.push(newPlay);

                  //updates game Matrix
                  this.game.updateGameMatrix(this, this.toShade[0], this.toShade[1]);

                  //UnShades all shaded objects
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

  for(let i = 0, l = result.length; i < l; i++)
    if(result[i] == true)
      steps++;

  //Moving Camera state enable
  this.dicesResult = result;

  this.numberOfSteps = steps;

  if(this.game.player1 == true)
    this.cameraTransition = new CameraTransition(this.cloneCamera(this.cameras['player1-view']), this.cloneCamera(this.cameras['dice-view']), this.cameraTransitionsSpeed, 'LINEAR', 5);
  else
    this.cameraTransition = new CameraTransition(this.cloneCamera(this.cameras['player2-view']), this.cloneCamera(this.cameras['dice-view']), this.cameraTransitionsSpeed, 'LINEAR', 5);

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

  let mov = this.reverseMov(lastPlay.translation);

  let bezPoints = this.game.getBezierPointsVector([0,0,0], mov, this.height);

  let newAnimation = new BezierAnimation(this, pieceToMoveBack, this.pieceAnimationSpeed, bezPoints);

  this.graph.nodes[pieceToMoveBack].animations.push(newAnimation);

  let newPlay = new userPlay(!this.game.isPlayer1Playing, pieceToMoveBack, moveBackTo, this.game.cloneGameMatrix(), this.elapsedTime, mov);

  if(lastPlay.pieceTobase != null)
  {
    let thrownPiece = lastPlay.pieceTobase;

    var thrownPieceActualPositionInVector = this.searchPieceAtAMatrix(this.game.matrix, thrownPiece);

    let thrownPieceActualCoor;

    if(thrownPieceActualPositionInVector[0] != 0 && thrownPieceActualPositionInVector[0] != 1)
      thrownPieceActualCoor = this.game.XMLtoCoordinates[this.game.vectorToXML[thrownPieceActualPositionInVector[0]]];
    else
    {
      let thrownPiecePlace = this.game.vectorToXML[thrownPieceActualPositionInVector[0]];

      thrownPieceActualCoor = this.game.XMLtoCoordinates[thrownPiecePlace][thrownPieceActualPositionInVector[1]];
    }


    let thrownPiecePreviousCoor = this.game.XMLtoCoordinates[backFrom];

    let thrownMov = this.game.getMov(thrownPieceActualCoor, thrownPiecePreviousCoor);

    let thownBezPoints = this.game.getBezierPointsVector([0,0,0], thrownMov, this.height);

    let thrownNewAnimation = new BezierAnimation(this, thrownPiece, this.pieceAnimationSpeed, thownBezPoints);

    this.graph.nodes[thrownPiece].animations.push(thrownNewAnimation);

    newPlay.thrown = thrownPiece;
  }

  if(search[0] != 0 && search[0] != 1)
    this.game.gameMatrix[search[0]].push(pieceToMoveBack);
  else
    this.game.gameMatrix[search[0]][search[1]] = pieceToMoveBack;

  if(lastPlay.pieceTobase == null)
    this.game.gameMatrix[this.game.XMLtoVector[backFrom]] = [];
  else
  {
    this.game.gameMatrix[this.game.XMLtoVector[backFrom]] = [newPlay.pieceTobase];

    if(thrownPieceActualPositionInVector[0] != 0 && thrownPieceActualPositionInVector[0] != 1)
      this.game.gameMatrix[thrownPieceActualPositionInVector[0]] = [];
    else
      this.game.gameMatrix[thrownPieceActualPositionInVector[0]][thrownPieceActualPositionInVector[1]] = [];
  }

  this.game.plays.push(newPlay);

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

XMLscene.prototype.resetGame = function()
{
  for(let i = 2; i < 24; i++)
  {
    if(this.game.gameMatrix[i].length != 0)
    {
      var pieceName = this.game.gameMatrix[i].slice();

      var piece = pieceName[0];

      this.resetingPieces.push(pieceName.slice());

      let previousPlaceName = this.game.vectorToXML[i];

      let previousCoor = this.game.XMLtoCoordinates[previousPlaceName];

      let nextCoor;

      if(this.game.P1Pieces.indexOf(piece) >= 0)
        nextCoor = this.game.XMLtoCoordinates['P1-Base'][this.game.P1Pieces.indexOf(piece)];
      else
        nextCoor = this.game.XMLtoCoordinates['P2-Base'][this.game.P2Pieces.indexOf(piece)];

      let mov = this.game.getMov(previousCoor, nextCoor);

      let bezPoints = this.game.getBezierPointsVector([0,0,0], mov, this.height);

      let newAnimation = new BezierAnimation(this, piece, this.pieceAnimationSpeed, bezPoints);

      this.graph.nodes[piece].animations.push(newAnimation);
    }
  }

  this.game.resetGame();

  this.game.newState = 6;

  this.resetTime = this.elapsedTime;
}

/**
 * Checks if current player has exceeded 1 minute limit.
 * If it has, changes player and camera.
 */
XMLscene.prototype.checkIfPlayerExceedsLimit = function()
{
  if(this.game.checkPlayerTimeLimit())
  {
    if(this.game.player1)
    {
      this.cameraTransition = new CameraTransition(this.cloneCamera(this.cameras['player1-view']), this.cloneCamera(this.cameras['player2-view']), this.cameraTransitionsSpeed, 'LINEAR', 0);

      this.game.changePlayer();
    }
    else
    {
      this.cameraTransition = new CameraTransition(this.cloneCamera(this.cameras['player2-view']), this.cloneCamera(this.cameras['player1-view']), this.cameraTransitionsSpeed, 'LINEAR', 0);

      this.game.changePlayer();
    }
  }
}

/**
 * Displays the scene.
 */
XMLscene.prototype.display = function()
{
  //if game is waiting for a player to pick a piece or a board place, log the pick
  //and take care of players times
  if(this.game.stateIndex == 0 || this.game.stateIndex == 1 || this.game.stateIndex == 2)
  {
    this.logPicking();

    //update current player time
    this.game.updatePlayerTime(diff);

    //check if a player as exceed the 1 minute limit
    this.checkIfPlayerExceedsLimit();
  }

  //if there is an active camera transition update it
  if(this.cameraTransition != null)
    this.updateCamera(diff);

  if(this.game.stateIndex == 0)         //WAITING DICE ROLLING
  {
    //reset shade vectro, so nothing is shaded
    this.toShade = [];

    //open gui
    this.interface.gui.closed = false;
  }

  else if(this.game.stateIndex == 5)    //LOOKING AT DICES
  {
    //update locking at dices time
    this.game.updateDicesTime(diff);

    //if it looking at dices time is over then get a new camera transition
    if(this.game.watchDicesTime >= this.lookAtDicesTime)
    {
      if(this.game.player1) //if it s player one playing
      {
        //if player got at least 1 in dice rolling move to player prespective
        if(this.numberOfSteps != 0)
          this.cameraTransition = new CameraTransition(this.cloneCamera(this.cameras['dice-view']), this.cloneCamera(this.cameras['player1-view']), this.cameraTransitionsSpeed, 'LINEAR', 2);
        else //else move to player 2 prespective
          {
            this.cameraTransition = new CameraTransition(this.cloneCamera(this.cameras['dice-view']), this.cloneCamera(this.cameras['player2-view']), this.cameraTransitionsSpeed, 'LINEAR', 0);

            //change player playing
            this.game.changePlayer(this);
          }
      }
      else //if its player 2 playing
      {
        //if player got at least 1 in dice rolling move to player prespective
        if(this.numberOfSteps != 0)
          this.cameraTransition = new CameraTransition(this.cloneCamera(this.cameras['dice-view']), this.cloneCamera(this.cameras['player2-view']), this.cameraTransitionsSpeed, 'LINEAR', 2);
        else //else move to player 1 prespective
        {
          this.cameraTransition = new CameraTransition(this.cloneCamera(this.cameras['dice-view']), this.cloneCamera(this.cameras['player1-view']), this.cameraTransitionsSpeed, 'LINEAR', 0);

          //change player playing
          this.game.changePlayer(this);
        }
      }

      //reset watch dices times
      this.game.resetwatchingDicesTime();

      //change pieces that can be picked
      this.game.setPossiblePiecesPick();
    }
  }
  else if(this.game.stateIndex == 3) //MOVING PIECE
  {
    //reset shade vectro, so nothing is shaded
    this.toShade = [];

    //reset players time
    this.game.resetPlayersTime();

    //get last play
    let lastPlay = this.game.lastPlay;

    //get the piece that is moving
    let movingPiece = lastPlay.pieceMoved;

    //get the moment where piece started to move
    let atWhatTime = lastPlay.whatTime;

    //get the piece animation
    let movingPieceCurrentAnimation = this.graph.nodes[movingPiece].animations[0];

    //get the piece that was moved by the current moving piece
    let thrownPiece = lastPlay.pieceTobase;

    let thrownPieceCurrentAnimation;

    //if there is a thrown piece gets it s animation
    if(thrownPiece != null)
      thrownPieceCurrentAnimation = this.graph.nodes[thrownPiece].animations[0];

    //If there is one piece moving and its animation is complete
    if(movingPieceCurrentAnimation.isAnimationsComplete(this.elapsedTime - atWhatTime) >= 1.0 && thrownPiece == null)
    {
      //get the piece translation
      let translation = lastPlay.movement;

      //apply the tranlation to the piece node matrix
      mat4.translate(this.graph.nodes[movingPiece].transformMatrix, this.graph.nodes[movingPiece].transformMatrix, translation);

      //remove the animation from node
      this.graph.nodes[movingPiece].animations = [];

      //If the last was to a special cube, then current player plays again
      if(this.game.isSpecialCube(lastPlay.pieceMovedTo))
        this.game.repeatPlayer(this);
      else
      {  //else moves camera to the other player and changes player
        if(this.game.player1)
          this.cameraTransition = new CameraTransition(this.cloneCamera(this.cameras['player1-view']), this.cloneCamera(this.cameras['player2-view']), this.cameraTransitionsSpeed, 'LINEAR', 0);
        else
          this.cameraTransition = new CameraTransition(this.cloneCamera(this.cameras['player2-view']), this.cloneCamera(this.cameras['player1-view']), this.cameraTransitionsSpeed, 'LINEAR', 0);

        this.game.changePlayer(this);
      }
    }//if there are two pieces oving and both animations are finished
    else if(movingPieceCurrentAnimation.isAnimationsComplete(this.elapsedTime - atWhatTime) >= 1.0 && thrownPiece != null && thrownPieceCurrentAnimation.isAnimationsComplete(this.elapsedTime - atWhatTime) >= 1.0)
    {
      //get the piece translation
      let translation = lastPlay.movement;

      //apply the tranlation to the piece node matrix
      mat4.translate(this.graph.nodes[movingPiece].transformMatrix, this.graph.nodes[movingPiece].transformMatrix, translation);

      //remove the animation from node
      this.graph.nodes[movingPiece].animations = [];

      //apply the tranlation to the other piece node matrix
      mat4.translate(this.graph.nodes[thrownPiece].transformMatrix, this.graph.nodes[thrownPiece].transformMatrix, thrownPieceCurrentAnimation.lastPoint);

      //remove the animation from node
      this.graph.nodes[thrownPiece].animations = [];

      //changes player
      if(this.game.player1)
        this.cameraTransition = new CameraTransition(this.cloneCamera(this.cameras['player1-view']), this.cloneCamera(this.cameras['player2-view']), this.cameraTransitionsSpeed, 'LINEAR', 0);
      else
        this.cameraTransition = new CameraTransition(this.cloneCamera(this.cameras['player2-view']), this.cloneCamera(this.cameras['player1-view']), this.cameraTransitionsSpeed, 'LINEAR', 0);

      this.game.changePlayer(this);
    }
  }

  else if(this.game.stateIndex == 6) //RESETING GAME
  {
      //puts players time at 0 secs
      this.game.resetPlayersTime();

      //if there are no more pieces moving
      if(this.resetingPieces.length == 0)
      {
        //if it was player 2 playing get new camera transition to player 1
        if(!this.player1)
          this.cameraTransition = new CameraTransition(this.cloneCamera(this.cameras['player2-view']), this.cloneCamera(this.cameras['player1-view']), this.cameraTransitionsSpeed, 'LINEAR', 0);
        else //else just change game state to waiting dice rolling
          this.game.newState = 0;
      }

      //goes through every currently reseting piece
      for(let i = 0, l = this.resetingPieces.length; i < l; i++)
      {
        //gets the piece name at i index
        let resetingPieceName = this.resetingPieces[i];

        //gets it s animation
        let pieceAnimation = this.graph.nodes[resetingPieceName].animations[0];

        //if piece animation is complete
        if(pieceAnimation.isAnimationsComplete(this.elapsedTime - this.resetTime) >= 1.0)
        {
          //get the piece translation
          let translation = pieceAnimation.lastPoint;

          //take off the animation
          this.graph.nodes[resetingPieceName].animations = [];

          //aplly it to the piece node
          mat4.translate(this.graph.nodes[resetingPieceName].transformMatrix, this.graph.nodes[resetingPieceName].transformMatrix, translation);

          //remove piece from the reseting piece vector
          this.resetingPieces.splice(i, 1); //removes the pieces

          i--;
        }
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

  this.nFrames++;
}
