
class userPlay
{
  /**
   * userPlay class construcor - contains the data from a game at a certain moment
   * @param player1 {boolean} - if it was player 1 playing true, else false
   * @param movedPiece {string} - moved piece name
   * @param whatPlace {string} - place name where the piece was moved
   * @param gameMatrix {array} - game matrix of the game
   * @param time {float} - time value
   * @param translation {array} - piece final position
  **/

  constructor(player1, movedPiece, whatPlace, gameMatrix, time, translation)
  {
    this.player1 = player1; //boolean

    this.movedPiece = movedPiece;

    this.place = whatPlace;

    this.matrixAtThatTime = gameMatrix;

    this.time = time;

    this.translation = translation;

    this.thrownPiece = null;
  }

  get matrix()
  {
    return this.matrixAtThatTime;
  }

  get wasPlayer1()
  {
    return this.player1;
  }

  get pieceMovedTo()
  {
    return this.place;
  }

  get whatTime()
  {
    return this.time;
  }

  get pieceMoved()
  {
    return this.movedPiece;
  }

  get movement()
  {
    return this.translation;
  }

  set thrown(pieceName)
  {
    this.thrownPiece = pieceName;
  }

  get pieceTobase()
  {
    return this.thrownPiece;
  }
}
