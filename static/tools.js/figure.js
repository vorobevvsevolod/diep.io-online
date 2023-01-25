let rectingleMass = [], triangleMass = [], poligonMass = [];
let cofFpsDel = 1, cofFpsMul = 1;
//Отрисовка фигур
function drawAllFigureInMap(){
  draw(rectingleMass);
  draw(triangleMass);
  draw(poligonMass);

  function draw(figure){
    for(let i in figure)
    if(figure[i].isInCamera()) {
      if(figure[i].renderPlayer != tank.idPlayer && figure[i].renderPlayer == "")
        figure[i].renderPlayer = tank.idPlayer;
           
      if(figure[i].renderPlayer == tank.idPlayer){
        //Столкновения со стенами
        if((figure[i].x < 100 && figure[i].isStaticIntersect(rectBackgroundMass[3].getStaticBox())) || (figure[i].x > 3900 && figure[i].isStaticIntersect(rectBackgroundMass[4].getStaticBox()))) {
          figure[i].moveX *= -1; 
          eventsChengedVector();
          figure[i].collisionWithAFigure.flag = true;}
        if((figure[i].y < 100 && figure[i].isStaticIntersect(rectBackgroundMass[1].getStaticBox())) || (figure[i].y > 3900 && figure[i].isStaticIntersect(rectBackgroundMass[2].getStaticBox()))) {
          figure[i].moveY *= -1; 
          eventsChengedVector();
          figure[i].collisionWithAFigure.flag = true;}

        figure[i].move(point(figure[i].speedMove * figure[i].moveX, figure[i].speedMove * figure[i].moveY));
        figure[i].turn(figure[i].speedRotate * figure[i].rotateAngle);
        
        //Если фигуры столкнулись друг с другом
        if(figure[i].collisionWithAFigure.flag){
          if(figure[i].collisionWithAFigure.countTime != 0){
              figure[i].move(point(((figure[i].speedMove * cofFpsDel) * figure[i].moveX) * (figure[i].collisionWithAFigure.countTime / 10), ((figure[i].speedMove * cofFpsDel) * figure[i].moveY) * (figure[i].collisionWithAFigure.countTime / 10)));
              figure[i].turn(((figure[i].speedRotate * cofFpsDel) * figure[i].rotateAngle) * (figure[i].collisionWithAFigure.countTime / 2));
              figure[i].collisionWithAFigure.countTime--;
          }else{
              figure[i].collisionWithAFigure.flag = false;
              figure[i].collisionWithAFigure.countTime = 100 * cofFpsMul;
          }
        }

        //Проверка на столкновение фигур между собой
        CollisionFigureSelf();
        socket.emit("movement figure", {
          x: figure[i].x,
          y: figure[i].y,
          angle: figure[i].angle,
          renderPlayer: tank.idPlayer
        }, i, figure[i].type, tank.idPlayer)
      }
      //Отрисовка фигур
      figure[i].draw();

      function eventsChengedVector(){
        socket.emit('figure chenged vector', {
          moveX: figure[i].moveX,
          moveY: figure[i].moveY,
          rotateAngle: figure[i].rotateAngle
      }, i, figure[i].type, tank.idPlayer)
      }
      function CollisionFigureSelf(){
        for(let x in rectingleMass){
            if(!(figure[i].type == "RoundRectObject" && x == i))    
            if(figure[i].isStaticIntersect(rectingleMass[x].getStaticBox())) 
            if(!figure[i].collisionWithAFigure.flag || !rectingleMass[x].collisionWithAFigure.flag){
                figure[i].moveX *= -1;
                figure[i].moveY *= -1;
                rectingleMass[x].moveX *= -1;
                rectingleMass[x].moveY *= -1;
                figure[i].collisionWithAFigure.flag = true;
                rectingleMass[x].collisionWithAFigure.flag = true;
                eventsChengedVector();
            }
        }

        for(let x in triangleMass){
            if(!(figure[i].type == 'TriangleObject' && x == i))    
            if(figure[i].isStaticIntersect(triangleMass[x].getStaticBox())) 
            if(!figure[i].collisionWithAFigure.flag || !triangleMass[x].collisionWithAFigure.flag){
                figure[i].moveX *= -1;
                figure[i].moveY *= -1;
                triangleMass[x].moveX *= -1;
                triangleMass[x].moveY *= -1;
                figure[i].collisionWithAFigure.flag = true;
                triangleMass[x].collisionWithAFigure.flag = true;
                eventsChengedVector();
            }
        }

        for(let x in poligonMass){
            if(!(figure[i].type == 'PolygonObject' && x == i)){
                if(figure[i].isStaticIntersect(poligonMass[x].getStaticBox(-30,-30,14,14))) 
                if(!figure[i].collisionWithAFigure.flag || !poligonMass[x].collisionWithAFigure.flag){
                    figure[i].moveX *= -1;
                    figure[i].moveY *= -1;
                    poligonMass[x].moveX *= -1;
                    poligonMass[x].moveY *= -1;
                    figure[i].collisionWithAFigure.flag = true;
                    poligonMass[x].collisionWithAFigure.flag = true;
                    eventsChengedVector();
                }
            }
            
        }
      }
    }else{
      if(figure[i].renderPlayer == tank.idPlayer){
          figure[i].renderPlayer = '';
          socket.emit("delete inRendering", i, figure[i].type, tank.idPlayer);
      }      
    }
  }
}

//Создание квадатов
function createRectaingle(mass, i){
    rectingleMass.push(
      game.newRoundRectObject({ 
          x : mass[i].cordX, 
          y : mass[i].cordY, 
          w : 45, 
          h : 45, 
          fillColor : mass[i].fillColor, 
          strokeColor: mass[i].strokeColor,
          strokeWidth: 4,
          radius : 3
      }));
      let _figureBar = game.newRoundRectObject({ 
        x : mass[i].cordX, 
        y : mass[i].cordY, 
        w : 60, 
        h : 7, 
        fillColor : "#555555", 
        strokeColor: '#707070',
        strokeWidth: 1,
        radius : 3
      })
    
      let _figureBarCountHealth = game.newRoundRectObject({ 
          x : mass[i].cordX + 1, 
          y : mass[i].cordY, 
          w : 58, 
          h : 5, 
          fillColor : "#85e37d", 
          radius : 3
      })
  
    rectingleMass[rectingleMass.length - 1].setUserData({
      idFigure: i,
      life: mass[i].life,
      rotateAngle: mass[i].rotateAngle,
      speedMove:  mass[i].speedMove * cofFpsDel,
      speedRotate: mass[i].speedRotate * cofFpsDel,
      moveX: mass[i].moveX,
      moveY: mass[i].moveY,
      renderPlayer: mass[i].renderPlayer,
      figureBar: _figureBar,
      figureBarCountHealth: _figureBarCountHealth,
      collisionWithABullet:{
        flag: false,
        countTime: 50 * cofFpsMul,
        x: 0,
        y:0
        },
      collisionWithAFigure:{
          flag: false,
          countTime: 100 * cofFpsMul,
        },
      death:{
          flag: false,
          dying: false,
          countTime: 15 * cofFpsMul
        }     
    })
}

function createTriangle(mass, i){
  triangleMass.push(
    game.newTriangleObject({ 
        x : mass[i].cordX, 
        y : mass[i].cordY, 
        w : 45, 
        h : 45, 
        fillColor : mass[i].fillColor, 
        strokeColor: mass[i].strokeColor,
        strokeWidth: 4,
    }));
    let _figureBar = game.newRoundRectObject({ 
      x : mass[i].cordX, 
      y : mass[i].cordY, 
      w : 60, 
      h : 7, 
      fillColor : "#555555", 
      strokeColor: '#707070',
      strokeWidth: 1,
      radius : 3
    })
  
    let _figureBarCountHealth = game.newRoundRectObject({ 
        x : mass[i].cordX + 1, 
        y : mass[i].cordY, 
        w : 58, 
        h : 5, 
        fillColor : "#85e37d", 
        radius : 3
    })
    triangleMass[i].setCenter(point(0,8))
    triangleMass[triangleMass.length - 1].setUserData({
        idFigure: i,
        life: mass[i].life,
        rotateAngle: mass[i].rotateAngle,
        speedMove:  mass[i].speedMove * cofFpsDel,
        speedRotate: mass[i].speedRotate * cofFpsDel,
        moveX: mass[i].moveX,
        moveY: mass[i].moveY,
        renderPlayer: mass[i].renderPlayer,
        figureBar: _figureBar,
          figureBarCountHealth: _figureBarCountHealth,
          collisionWithABullet:{
            flag: false,
            countTime: 40 * cofFpsMul,
            x: 0,
            y:0
            },
          collisionWithAFigure:{
              flag: false,
              countTime: 100 * cofFpsMul,
            },
          death:{
              flag: false,
              dying: false,
              countTime: 15 * cofFpsMul
            }
  })
}

function createPoligon(mass, i){
  poligonMass.push(
    game.newPolygonObject({ 
        x : mass[i].cordX, 
        y : mass[i].cordY, 
        points : [ point(-32, -10), point(-22, 32), point(22, 32), point(32, -10), point(0, -32)], 
        fillColor : mass[i].fillColor, 
        strokeColor: mass[i].strokeColor,
        strokeWidth: 4,
    }));
    let _figureBar = game.newRoundRectObject({ 
      x : mass[i].cordX, 
      y : mass[i].cordY, 
      w : 60, 
      h : 7, 
      fillColor : "#555555", 
      strokeColor: '#707070',
      strokeWidth: 1,
      radius : 3
    })
  
    let _figureBarCountHealth = game.newRoundRectObject({ 
        x : mass[i].cordX + 1, 
        y : mass[i].cordY, 
        w : 58, 
        h : 5, 
        fillColor : "#85e37d", 
        radius : 3
    })
    poligonMass[i].setCenter(point(-14,-12))
  poligonMass[poligonMass.length - 1].setUserData({
    idFigure: i,
    life: mass[i].life,
    rotateAngle: mass[i].rotateAngle,
    speedMove:  mass[i].speedMove * cofFpsDel,
    speedRotate: mass[i].speedRotate * cofFpsDel,
    moveX: mass[i].moveX,
    moveY: mass[i].moveY,
    renderPlayer: mass[i].renderPlayer,
    figureBar: _figureBar,
    figureBarCountHealth: _figureBarCountHealth,
    collisionWithABullet:{
        flag: false,
        countTime: 40 * cofFpsMul,
        x: 0,
        y:0
    },
    collisionWithAFigure:{
        flag: false,
        countTime: 100 * cofFpsMul,
    },
    death:{
        flag: false,
        dying: false,
        countTime: 15 * cofFpsMul
    }
    
  })
}

//Получение информации от сервара, когда другой пользователь отрисовывает фигуры на карте
socket.on("another players chenged figure", (object, position, name, id)=>{
  if(tank != {})
  if(id != tank.idPlayer )
    switch(name){
      case "RoundRectObject": {
          rectingleMass[position].x = object.x;
          rectingleMass[position].y = object.y;
          rectingleMass[position].angle = object.angle;
          rectingleMass[position].renderPlayer = id;
      }break;
      case 'TriangleObject': {
          triangleMass[position].x = object.x;
          triangleMass[position].y = object.y;
          triangleMass[position].angle = object.angle;
          triangleMass[position].renderPlayer = id;
      }break;
      case 'PolygonObject': {
          poligonMass[position].x = object.x;
          poligonMass[position].y = object.y;
          poligonMass[position].angle = object.angle;
          poligonMass[position].renderPlayer = id;
      }break;
  }
})

//Удаление человека с рендера фигуры если он вышел из их поля зрения
socket.on('another delete inRendering', (position, name, idPlayer)=>{
  if(tank != {} && idPlayer != tank.idPlayer)
  switch(name){
    case "RoundRectObject": {
        rectingleMass[position].renderPlayer = '';
      }break;
    case 'TriangleObject': {
        triangleMass[position].renderPlayer = '';
      }break;
    case 'PolygonObject': {
        poligonMass[position].renderPlayer = '';
      }break;
  }
})

//Другой человек изменил вектор направления фигуры
socket.on('another chenged vector figure', (object, position, name, idPlayer) =>{
  if(tank != {})
    if(idPlayer != tank.idPlayer){
      switch(name){
        case "RoundRectObject": {
          rectingleMass[position].moveX = object.x;
          rectingleMass[position].moveY = object.y;
          rectingleMass[position].rotateAngle = object.rotateAngle;
  
      }break;
      case 'TriangleObject': {
          triangleMass[position].moveX = object.x;
          triangleMass[position].moveY = object.y;
          triangleMass[position].rotateAngle = object.rotateAngle;
      }break;
      case 'PolygonObject': {
          poligonMass[position].moveX = object.x;
          poligonMass[position].moveY = object.y;
          poligonMass[position].rotateAngle = object.rotateAngle;
      }break;
      }
    }   
})