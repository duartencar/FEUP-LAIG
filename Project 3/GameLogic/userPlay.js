class userPlay
{
  constructor(player1, movedPiece, whatPlace, gameMatrix, time, translation)
  {
    this.player1 = player1; //boolean

    this.movedPiece = movedPiece;

    this.place = whatPlace;

    this.matrixAtThatTime = gameMatrix;

    this.time = time;

    this.translation = translation;
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
}
