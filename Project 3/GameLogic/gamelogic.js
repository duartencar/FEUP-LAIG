class GameLogic
{
   constructor()
   {
      this.currentState = 0;

      this.states =
      {
         'WaitingDiceRolling': 0,
         'RollingDice': 1,
         'WaitingPick': 2,
         'MovingPickedPieace': 3,
         'MovingCamera':4
      };

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
     }

     this.gameMatrix = [];

     this.dices =
     [
       [true, false, true, false],
       [true, false, true, false],
       [true, false, true, false],
       [true, false, true, false]
     ];

     this.gameMatrixInit();
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
     this.gameMatrix[this.XMLtoVector["P1-Base"]] =
     [
       'P1A', 'P1B', 'P1C', 'P1D', 'P1E', 'P1F', 'P1G'
     ];

     this.gameMatrix[this.XMLtoVector["P2-Base"]] =
     [
       'P2A', 'P2B', 'P2C', 'P2D', 'P2E', 'P2F', 'P2G'
     ];
   }

   set newState (index)
   {
      if(!isNaN(index) && index >= 0 && index <= 4)
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
}
