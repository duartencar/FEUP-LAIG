var PIECE_ANIMATION_SPEED = 9;

class GameLogic
{
  constructor()
  {
    this.currentState = 0;

    this.states =
    {
       'WaitingDiceRolling': 0,
       'WaitingBoardPick': 1,
       'WaitingPick': 2,
       'MovingPickedPieace': 3,
       'MovingCamera':4,
       'LookingAtDices':5,
       'ResetingGame':6
    };

    this.P1Pieces = ['P1A', 'P1B', 'P1C', 'P1D', 'P1E', 'P1F', 'P1G'];

    this.P2Pieces = ['P2A', 'P2B', 'P2C', 'P2D', 'P2E', 'P2F', 'P2G'];

    this.P1Time = 0;

    this.P2Time = 0;

    this.possiblePicks = [];

    this.saveDiceMatrix = [mat4.create(), mat4.create(), mat4.create(), mat4.create()];

    //vector with the player plays
    this.plays = [];

    //if it s true then is the player one tur to play, if it s false its player2 turn
    this.player1 = true;

    this.P1numberOfPlays = 0;

    this.P2numberOfPlays = 0;

    this.XMLtoVector =
    {
      'Throw-Again-Cubes-1': 9,
      'Throw-Again-Cubes-16': 21,
      'Normal-Cube-2': 7,
      'Normal-Cube-3': 5,
      'Normal-Cube-4': 3,
      'Normal-Cube-17': 19,
      'Normal-Cube-5': 10,
      'Normal-Cube-6': 11,
      'Normal-Cube-7': 12,
      'Super-Cube-12': 13,
      'Normal-Cube-13': 14,
      'Normal-Cube-14': 15,
      'Normal-Cube-15': 16,
      'Normal-Cube-18': 17,
      'Throw-Again-Cubes-8': 8,
      'Throw-Again-Cubes-20': 20,
      'Normal-Cube-9': 6,
      'Normal-Cube-10': 4,
      'Normal-Cube-11': 2,
      'Normal-Cube-19': 18,
      'P1-Base': 0,
      'P2-Base':1,
      'P1-Finish':22,
      'P2-Finish':23
    };

    this.vectorToXML = [];

    this.XMLtoCoordinates =
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

    this.gameMatrix = [];

    this.dices =
    [
     [true, false, true, false],
     [true, false, true, false],
     [true, false, true, false],
     [true, false, true, false]
    ];

    this.watchingDicesTime = 0;

    this.specialPlaces = ['Throw-Again-Cubes-1', 'Throw-Again-Cubes-16', 'Throw-Again-Cubes-8', 'Throw-Again-Cubes-20', 'Super-Cube-12'];

    this.gameMatrixInit();

    this.vectorToXMLinit();
  }

  updatePlayerTime(diff)
  {
    if(this.player1)
      this.P1Time += diff;
    else
      this.P2Time += diff;
  }

  resetPlayersTime()
  {
    this.P1Time = 0;

    this.P2Time = 0;
  }

  resetGame()
  {
    this.resetPlayersTime();

    this.player1 = true;

    this.P1numberOfPlays = 0;

    this.P2numberOfPlays = 0;

    this.gameMatrix[0] = [];

    this.gameMatrix[1] = [];

    this.gameMatrixInit();
  }

  checkPlayerTimeLimit()
  {
    if(this.player1)
    {
      if(this.P1Time >= 60)
        return true;
    }
    else
    {
      if(this.P2Time >= 60)
        return true;
    }

    return false;
  }


  get isPlayer1Playing()
  {
    return this.player1;
  }

  get state ()
  {
    return this.states[this.currentState];
  }

  get stateIndex ()
  {
    return this.currentState;
  }

  get dicesMatrix()
  {
    return this.dices;
  }

  get matrix()
  {
    return this.gameMatrix;
  }

  get lastPlay()
  {
    return this.plays[this.plays.length - 1];
  }

  get secondLastPlay()
  {
    return this.plays[this.plays.length - 2];
  }

  isSpecialCube(place)
  {
    if(this.specialPlaces.indexOf(place) >= 0)
      return true;
    else
      return false;
  }

  set dicesValue(x)
  {
    this.dicesResult = x;
  }

  pieceAtVectorIndex(index)
  {
    return this.gameMatrix[index];
  }

  resetDices(scene)
  {
    this.dicesValue = 0;

    this.watchingDicesTime = 0;

    scene.rotatedOnce = [false, false, false, false];

    scene.dicesResult = [true, true, true, true];
  }

  saveMatrix(x, index)
  {
    mat4.copy(this.saveDiceMatrix[index], x);
  }

  changePlayer(scene)
  {
    this.player1 = !this.player1;

    if(scene.rotatedOnce[0])
      mat4.rotateX(scene.graph.nodes['Dice-1'].transformMatrix, scene.graph.nodes['Dice-1'].transformMatrix, Math.PI/2);
    if(scene.rotatedOnce[1])
      mat4.rotateX(scene.graph.nodes['Dice-2'].transformMatrix, scene.graph.nodes['Dice-2'].transformMatrix, Math.PI/2);
    if(scene.rotatedOnce[2])
      mat4.rotateX(scene.graph.nodes['Dice-3'].transformMatrix, scene.graph.nodes['Dice-3'].transformMatrix, Math.PI/2);
    if(scene.rotatedOnce[3])
      mat4.rotateX(scene.graph.nodes['Dice-4'].transformMatrix, scene.graph.nodes['Dice-4'].transformMatrix, Math.PI/2);


    if(this.player1)
      this.P2numberOfPlays++;
    else
      this.P1numberOfPlays++;

    this.resetDices(scene);

    this.newState = 0;
  }

  repeatPlayer(scene)
  {
    if(scene.rotatedOnce[0])
      mat4.rotateX(scene.graph.nodes['Dice-1'].transformMatrix, scene.graph.nodes['Dice-1'].transformMatrix, Math.PI/2);
    if(scene.rotatedOnce[1])
      mat4.rotateX(scene.graph.nodes['Dice-2'].transformMatrix, scene.graph.nodes['Dice-2'].transformMatrix, Math.PI/2);
    if(scene.rotatedOnce[2])
      mat4.rotateX(scene.graph.nodes['Dice-3'].transformMatrix, scene.graph.nodes['Dice-3'].transformMatrix, Math.PI/2);
    if(scene.rotatedOnce[3])
      mat4.rotateX(scene.graph.nodes['Dice-4'].transformMatrix, scene.graph.nodes['Dice-4'].transformMatrix, Math.PI/2);

    if(this.player1)
      this.P2numberOfPlays++;
    else
      this.P1numberOfPlays++;

    this.resetDices(scene);

    this.newState = 0;
  }

  gameMatrixInit()
  {
    for(var key in this.XMLtoVector)
      this.gameMatrix[this.XMLtoVector[key]] = [];

    var p1 = this.P1Pieces;

    var p2 = this.P2Pieces;

    for(let i = 0; i < p1.length; i++)
      this.gameMatrix[this.XMLtoVector["P1-Base"]].push(p1[i]);

    for(let i = 0; i < p2.length; i++)
      this.gameMatrix[this.XMLtoVector["P2-Base"]].push(p2[i]);

    this.plays.push(new userPlay(false, 'none', 'none', this.cloneGameMatrix(), 0, [0, 0, 0]));
  }

  vectorToXMLinit()
  {
    for(var key in this.XMLtoVector)
      this.vectorToXML[this.XMLtoVector[key]] = key;
  }

  set newState (index)
  {
    if(!isNaN(index) && index >= 0 && index <= 6)
      this.currentState = index;
  }

  returnDiceResult(random)
  {
    let dados = this.dicesMatrix;

    let result = [];

    for(let i = 0; i < random.length; i++)
      result.push(dados[i][random[i]]);

    return result;
  }

  updateDicesTime(diff)
  {
    this.watchingDicesTime += diff;
  }

  resetwatchingDicesTime()
  {
    this.watchingDicesTime = 0;
  }

  get watchDicesTime()
  {
    return this.watchingDicesTime;
  }

  pieceInPlace(placeName)
  {
    if(placeName != 'P1-Finish' && placeName != 'P2-Finish')
      return this.gameMatrix[this.XMLtoVector[placeName]];
    else
      return [];
  }

  isEnemyPiece(pieceName)
  {
    if(this.player1)
    {
      if(this.P1Pieces.indexOf(pieceName) >= 0)
        return false;
      else
        return true;
    }
    else
    {
      if(this.P2Pieces.indexOf(pieceName) >= 0)
        return false;
      else
        return true;
    }
  }

  setPossiblePiecesPick()
  {
    this.possiblePicks = [];

    if(this.player1)
    {
      for(let i = 0; i < this.P1Pieces.length; i++)
      {
        //If the piece has not reach the end yet it s suitable for picking
        if(this.gameMatrix[this.XMLtoVector["P1-Finish"]].indexOf(this.P1Pieces[i]) == -1)
        {
          let x = this.P1Pieces[i];

          this.possiblePicks.push(x);
        }
      }
    }
    else
    {
      for(let i = 0; i < this.P2Pieces.length; i++)
      {
        //If the piece has not reach the end yet it s suitable for picking
        if(this.gameMatrix[this.XMLtoVector["P1-Finish"]].indexOf(this.P2Pieces[i]) == -1)
        {
          let x = this.P2Pieces[i];

          this.possiblePicks.push(x);
        }
      }
    }
  }

  get possiblePiecesPick()
  {
    return this.possiblePicks;
  }

  getCurrentPiecePlace(pieceName)
  {
    for(var key in this.XMLtoVector)
    {
      let x = this.gameMatrix[this.XMLtoVector[key]];

      if(x.indexOf(pieceName) >= 0)
        return this.XMLtoVector[key];
    }

    return null;
  }

  cloneGameMatrix()
  {
    var clone = [];

    for(let i = 0; i < this.gameMatrix.length; i++)
      clone.push(this.gameMatrix[i].slice());

    return clone;
  }

  getBezierPointsVector(initialPoint, finalPoint, height)
  {
    let x = [];

    x.push(initialPoint);

    let z = [];

    let k = [];

    for(let i = 0; i < 3; i++)
    {
      if(i == 1)
      {
        z[i] = initialPoint[i] + 6;
        k[i] = finalPoint[i] + 6;
      }
      else
      {
        z[i] = initialPoint[i];
        k[i] = finalPoint[i];
      }
    }
    x.push(z);

    x.push(k);

    x.push(finalPoint);

    return x;
  }

  getMov(p1, p2)
  {
    let p3 = [];

    for(let i = 0; i < 3; i++)
      p3.push(p2[i] - p1[i]);

    return p3;
  }

  getPieceAnimation(scene, pieceName, nextPlace)
  {
    let previousPlaceIndex = this.getCurrentPiecePlace(pieceName);

    let previousPlaceName = this.vectorToXML[previousPlaceIndex];

    let previousCoor;

    if(previousPlaceIndex == 0 || previousPlaceIndex == 1)
    {
      let x;

      if(this.player1)
        x = this.P1Pieces.indexOf(pieceName);
      else
        x = this.P2Pieces.indexOf(pieceName);

      let previousArray = this.XMLtoCoordinates[previousPlaceName];

      previousCoor = previousArray[x];
    }
    else
       previousCoor = this.XMLtoCoordinates[previousPlaceName];

    let nextCoor;

    if(nextPlace != 'P1-Finish' && nextPlace != 'P2-Finish')
      nextCoor =  this.XMLtoCoordinates[nextPlace];
    else if(nextPlace == 'P1-Finish')
      nextCoor = this.XMLtoCoordinates[nextPlace][this.P1Pieces.indexOf(pieceName)];
    else
      nextCoor = this.XMLtoCoordinates[nextPlace][this.P2Pieces.indexOf(pieceName)];

    let mov = this.getMov(previousCoor, nextCoor);

    let bezPoints = this.getBezierPointsVector([0,0,0], mov, scene.height);

    let newAnimation = new BezierAnimation(scene, pieceName, scene.pieceAnimationSpeed, bezPoints);

    return newAnimation;
  }

  updateGameMatrix(scene, pieceMoved, toWhere)
  {
    let previousLocationInVector = this.getCurrentPiecePlace(pieceMoved);

    if(this.gameMatrix[this.XMLtoVector[toWhere]].length != 0)
    {
      let thrownPiece = this.pieceAtVectorIndex(this.XMLtoVector[toWhere]);

      let x;

      let nextCoor;

      if(this.player1)
      {
        x = this.P2Pieces.indexOf(thrownPiece[0]);

        this.gameMatrix[this.XMLtoVector['P2-Base']][x] = thrownPiece[0];

        nextCoor = this.XMLtoCoordinates['P2-Base'][x];
      }
      else
      {
        x = this.P1Pieces.indexOf(thrownPiece[0]);

        this.gameMatrix[this.XMLtoVector['P1-Base']][x] = thrownPiece[0];

        nextCoor = this.XMLtoCoordinates['P1-Base'][x];
      }

      let previousCoor = this.XMLtoCoordinates[toWhere];

      let mov = this.getMov(previousCoor, nextCoor);

      let bezPoints = this.getBezierPointsVector([0,0,0], mov,  scene.height);

      let newAnimation = new BezierAnimation(scene, thrownPiece[0], scene.pieceAnimationSpeed, bezPoints);

      scene.graph.nodes[thrownPiece[0]].animations.push(newAnimation);

      let last = this.lastPlay;

      last.thrown = thrownPiece[0];
    }

    if(toWhere != 'P1-Finish' && toWhere != 'P2-Finish')
      this.gameMatrix[this.XMLtoVector[toWhere]] = [pieceMoved];
    else
      this.gameMatrix[this.XMLtoVector[toWhere]].push(pieceMoved);


    if(previousLocationInVector > 1)
      this.gameMatrix[previousLocationInVector] = [];
    else
    {
      if(this.player1)
        this.gameMatrix[previousLocationInVector][this.P1Pieces.indexOf(pieceMoved)] = "";
      else
        this.gameMatrix[previousLocationInVector][this.P2Pieces.indexOf(pieceMoved)] = "";
    }
  }

  pickedPieceNextPlace(pieceName, diceResult)
  {
    let currentMatrixPositionInVector = this.getCurrentPiecePlace(pieceName);

    if(currentMatrixPositionInVector == null)
      return null;

    if(this.player1) //PLAYER1 PLAYING
    {
      if(currentMatrixPositionInVector / 2 + diceResult < 5)
      {
        let nextIndex = currentMatrixPositionInVector + diceResult * 2;

        //means that the player has already a piece on the place
        if(this.gameMatrix[nextIndex].length != 0)
          return null;
        else
        {
          var x = this.vectorToXML[nextIndex];

          return x;
        }

      }
      else if(currentMatrixPositionInVector / 2 + diceResult >= 5 && currentMatrixPositionInVector <= 8 && currentMatrixPositionInVector > 0)
      {
        let nextIndex = currentMatrixPositionInVector;

        for(let i = 0; i < diceResult; i++)
        {
          if(nextIndex <= 8)
            nextIndex += 2;
          else
            nextIndex++;
        }

        if(nextIndex == 13 && this.gameMatrix[nextIndex].length != 0)
          return null;
        else if(this.gameMatrix[nextIndex].length != 0 && this.isEnemyPiece(this.gameMatrix[nextIndex][0]) == false)
          return null;
        else
        {
          var x = this.vectorToXML[nextIndex];

          return x;
        }
      }
      else if(currentMatrixPositionInVector >= 10 && currentMatrixPositionInVector <= 13)
      {
        let nextIndex = currentMatrixPositionInVector + diceResult;

        if(nextIndex == 13 && this.gameMatrix[nextIndex].length != 0)
          return null;
        else if(this.gameMatrix[nextIndex].length != 0 && this.isEnemyPiece(this.gameMatrix[nextIndex][0]) == false)
          return null;
        else
        {
          var x = this.vectorToXML[nextIndex];

          return x;
        }
      }
      else if(currentMatrixPositionInVector > 13 && currentMatrixPositionInVector <= 17)
      {
        let nextIndex = currentMatrixPositionInVector;

        for(let i = 0; i < diceResult; i++)
        {
          if(nextIndex <= 17)
            nextIndex++;
          else
            nextIndex += 2;
        }

        if(nextIndex > 22)
          return null;
        else if(this.gameMatrix[nextIndex].length != 0 && this.isEnemyPiece(this.gameMatrix[nextIndex][0]) == false && nextIndex != 22)
          return null;
        else
        {
          var x = this.vectorToXML[nextIndex];

          return x;
        }
      }
      else if(currentMatrixPositionInVector > 17 && currentMatrixPositionInVector <= 20)
      {
        let nextIndex = currentMatrixPositionInVector;

        nextIndex += 2 * diceResult;

        if(nextIndex > 22)
          return null;
        else if(nextIndex < 22 && this.gameMatrix[nextIndex].length != 0)
          return null;
        else
        {
          var x = this.vectorToXML[nextIndex];

          return x;
        }
      }
      else
        return null;
    }
    else //PLAYER2 PLAYING
    {
      if(Math.round(currentMatrixPositionInVector / 2) +  diceResult - 1 < 5)
      {
        let nextIndex = currentMatrixPositionInVector + diceResult * 2;

        if(this.gameMatrix[nextIndex].length != 0)
          return null;
        else
        {
          var x = this.vectorToXML[nextIndex];

          return x;
        }
      }
      else if(Math.round(currentMatrixPositionInVector / 2) +  diceResult - 1 >= 5 && currentMatrixPositionInVector <= 9 && currentMatrixPositionInVector > 1)
      {
        let nextIndex = currentMatrixPositionInVector;

        for(let i = 0; i < diceResult; i++)
        {
          if(nextIndex <= 7)
            nextIndex += 2;
          else
            nextIndex++;
        }

        if(nextIndex == 13 && this.gameMatrix[nextIndex].length != 0)
          return null;
        else if(this.gameMatrix[nextIndex].length != 0 && this.isEnemyPiece(this.gameMatrix[nextIndex][0]) == false)
          return null;
        else
        {
          var x = this.vectorToXML[nextIndex];

          return x;
        }
      }
      else if(currentMatrixPositionInVector >= 10 && currentMatrixPositionInVector <= 13)
      {
        let nextIndex = currentMatrixPositionInVector + diceResult;

        if(nextIndex == 13 && this.gameMatrix[nextIndex].length != 0)
          return null;
        else if(this.gameMatrix[nextIndex].length != 0 && this.isEnemyPiece(this.gameMatrix[nextIndex][0]) == false)
          return null;
        else
        {
          var x = this.vectorToXML[nextIndex];

          return x;
        }
      }
      else if(currentMatrixPositionInVector > 13 && currentMatrixPositionInVector <= 17)
      {
        let nextIndex = currentMatrixPositionInVector;

        for(let i = 0; i < diceResult; i++)
        {
          if(nextIndex < 17)
            nextIndex++;
          else
            nextIndex += 2;
        }

        if(nextIndex > 23)
          return null;
        else if(this.gameMatrix[nextIndex].length != 0 && this.isEnemyPiece(this.gameMatrix[nextIndex][0]) == false && nextIndex != 23)
          return null;
        else
        {
          var x = this.vectorToXML[nextIndex];

          return x;
        }
      }
      else if(currentMatrixPositionInVector > 17 && currentMatrixPositionInVector < 22)
      {
        let nextIndex = currentMatrixPositionInVector;

        nextIndex += 2 * diceResult;

        if(nextIndex > 23)
          return null;
        else if(nextIndex < 23 && this.gameMatrix[nextIndex].length != 0)
          return null;
        else
        {
          var x = this.vectorToXML[nextIndex];

          return x;
        }
      }
    }
  }
}
