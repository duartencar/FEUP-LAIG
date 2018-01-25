# Project 3

On this first project we were suposed to:

1.Create more than one game scene, so we created two diferent scenes with the same board, as you can see in the pictures below:
![gameScene1]
![gameScene2]

2. Make the necessary pieces so the game could be played. So we did:
  * Player 1 piece
  
    ![player1PieceImage]
  
  * Player 2 piece
  
    ![player2PieceImage]
  
  * Dice
  
    ![DiceImage]

3. Everything had to be design in the game lsx file. To facilitate future game scene creations we created a camera node, witch contains all camera prespectives of the game. The game needs at least three cameras:
   * player1-view
   * player2-view
   * dice-view
   
  The camera node code has to follow the next structure:
  ```xml
  <CAMERA id="player1-view">
    <fov value="0.7"/>
    <near value="0.1"/>
    <far value="500"/>
    <position xx="0.0" yy="11.0" zz="20.0" />
    <target xx="0.0" yy="0.0" zz="0.0" />
   </CAMERA>
  ```

4. Apply a shader to the selectable node:
    - [x] Change object size according to time
    - [x] Change object color

5. Create a interface that:
    - [x] Selects one of the selectable nodes
    - [x] Applies one of the implemented nodes

# Result

![Demo](https://i.imgur.com/lWDtuVk.gif)


[gameScene1]: ./Media/Game_Scene_1.png
[gameScene2]: ./Media/Game_Scene_2.png
[player1PieceImage]: ./Media/Player_One_Piece.png
[player2PieceImage]: ./Media/Player_Two_Piece.png
[DiceImage]: ./Media/Dice.png

