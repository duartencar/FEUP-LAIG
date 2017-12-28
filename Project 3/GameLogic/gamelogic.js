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
       'LookingAtDices':5
    };

    this.P1Pieces = ['P1A', 'P1B', 'P1C', 'P1D', 'P1E', 'P1F', 'P1G'];

    this.P2Pieces = ['P2A', 'P2B', 'P2C', 'P2D', 'P2E', 'P2F', 'P2G'];

    this.possiblePicks = [];

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
     'Throw-Again-Cubes-1': [3, 3],
     'Throw-Again-Cubes-16': [39, 3],
     'Normal-Cube-2': [9, 3],
     'Normal-Cube-3': [15, 3],
     'Normal-Cube-4': [21, 3],
     'Normal-Cube-17': [45, 3],
     'Normal-Cube-5': [3, 9],
     'Normal-Cube-6': [9, 9],
     'Normal-Cube-7': [15, 9],
     'Super-Cube-12': [21, 9],
     'Normal-Cube-13': [27, 9],
     'Normal-Cube-14': [33, 9],
     'Normal-Cube-15': [39, 9],
     'Normal-Cube-18': [45, 9],
     'Throw-Again-Cubes-8': [9, 15],
     'Throw-Again-Cubes-20': [9, 15],
     'Normal-Cube-9': [9, 15],
     'Normal-Cube-10': [9, 15],
     'Normal-Cube-11': [9, 15],
     'Normal-Cube-19': [9, 15],
     'P1-Base': [9, 15],
     'P2-Base':[9, 15],
     'P1-Finish':[9, 15],
     'P2-Finish':[9, 3]
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

    this.gameMatrixInit();

    this.vectorToXMLinit();
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

  gameMatrixInit()
  {
    for(var key in this.XMLtoVector)
      this.gameMatrix[this.XMLtoVector[key]] = [];

    this.gameMatrix[this.XMLtoVector["P1-Base"]] = this.P1Pieces;

    this.gameMatrix[this.XMLtoVector["P2-Base"]] = this.P2Pieces;
  }

  vectorToXMLinit()
  {
    for(var key in this.XMLtoVector)
      this.vectorToXML[this.XMLtoVector[key]] = key;
  }

  set newState (index)
  {
    if(!isNaN(index) && index >= 0 && index <= 5)
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

  pickedPieceNextPlace(pieceName, diceResult)
  {
    let currentMatrixPositionInVector = this.getCurrentPiecePlace(pieceName);

    if(currentMatrixPositionInVector == null)
      return null;

    if(this.player1)
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
      else if(currentMatrixPositionInVector >= 10 && currentMatrixPositionInVector <= 17)
      {

      }
      else
      {

      }
    }
    else
    {

    }
  }
}
