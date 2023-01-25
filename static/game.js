game.newLoop("myGame", () =>{
//Отрисовка фона
 drawBackGround();

//Отрисовка фигур
 drawAllFigureInMap();

//Отрисовка игроков
 drawAnotherPlayers();
 
//Отрисовка своего танка
  drawAndMoveTank(); 
})

//Настройки игры

pjs.camera.scaleC(point(scaleCamera, scaleCamera));
createGrid();
game.setLoop("myGame");
pjs.system.setSmoothing(true);

