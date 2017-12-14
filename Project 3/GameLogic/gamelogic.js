class GameLogic
{
   contructor()
   {
      this.currentState = 0;

      this.states =
      {
         'Main Menu': 0,
         'ComVsCom': 1,
         'UserVsCom': 2,
         'UserVsUser': 3,
         'Replay':4
      }
   }

   get state ()
   {
      return this.states[this.currentState];
   }

   get stateIndex ()
   {
      return this.currentState;
   }

   set newState (index)
   {
      if(!isNaN(index) && index >= 0 && index <= 4)
         this.currentState = index
   }
}
