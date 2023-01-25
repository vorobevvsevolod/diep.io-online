let playersMass = [], PlayerMassForRating = [];
let tank = {};
let moveTankflag = false; 


let velocity = { x: 0, y: 0 };
let acceleration = { x: 0, y: 0 };
let deceleration = { x: 0.05, y: 0.05 };

function drawAnotherPlayers(){
    for(let i in playersMass) if(playersMass[i].isInCamera()){ 
      playersMass[i].name.setPositionC(point(playersMass[i].x + playersMass[i].radius + 2, playersMass[i].y - 25))
      playersMass[i].score.setPositionC(point(playersMass[i].x + playersMass[i].radius + 2, playersMass[i].y - 10))

      for(let x in playersMass[i].bullet) if(playersMass[i].bullet[x].isInCamera()) playersMass[i].bullet[x].draw();
      playersMass[i].pushka.draw(); 
      playersMass[i].draw();
      playersMass[i].name.draw();
      playersMass[i].score.draw();

      //Отрисовка бара здоровья
      if(playersMass[i].health < playersMass[i].maxHealth){
          playersMass[i].barOBJ.bar.setPosition(point(playersMass[i].x + 3, playersMass[i].y + 70))
          playersMass[i].barOBJ.CountHealth.setPosition(point( playersMass[i].x + 4, playersMass[i].y + 71))
          let a = playersMass[i].maxHealth / 100;
          let b = 58 / 100;
          if(playersMass[i].health != 0) playersMass[i].barOBJ.CountHealth.w = (b * (playersMass[i].health / a)); 
          playersMass[i].barOBJ.bar.draw();
          playersMass[i].barOBJ.CountHealth.draw(); 
      }
    };
}

function drawAndMoveTank(){
    if(tank){
        moveTank();
        if(pjs.mouseControl.isMove() || moveTankflag) socket.emit("player movement", tank.idPlayer, tank.pushka.x, tank.pushka.y, tank.pushka.angle, tank.x, tank.y);
        //Создание пуль
        createBulletTank();

        //Статус бар здоровья
        tank.pushka.draw();
        tank.draw();   
        if(tank.health < Player.maxHealth){
          tank.barOBJ.bar.setPosition(point(tank.x + 3, tank.y + 70))
          tank.barOBJ.CountHealth.setPosition(point( tank.x + 4, tank.y + 71))
          let a = 1000 / 100;
          let b = 58 / 100;
          if(tank.health < 0) {tank.health = 0; tank.barOBJ.CountHealth.w = 0;}
          if(tank.health != 0) tank.barOBJ.CountHealth.w = (b * (tank.health / a)); 
          tank.barOBJ.bar.draw();
          tank.barOBJ.CountHealth.draw(); 
          tank.health += Player.healtRegen;

          //Обновление здоровья 
          socket.emit('updating health', tank.idPlayer, tank.health);

          //Другой изменяет свое здоровье
          socket.on('another updating health', (id, health) =>{
            if(id != tank.idPlayer && tank != {}){
              for(let i in playersMass)
                if(playersMass[i].idPlayer == id) playersMass[i].health = health;
            }
          }) 
        }           
    }  
}
//Движение танка
function moveTank(){ 
    if (key.isDown("W")) {
      acceleration.y -= 0.005;
      moveTankflag = true;
    } else if (key.isDown("S")) {
      moveTankflag = true;
      acceleration.y += 0.005;
    } else if (key.isDown("A")) {
      moveTankflag = true;
      acceleration.x -= 0.005;
    } else if (key.isDown("D")) {
      moveTankflag = true;
      acceleration.x += 0.005;
    }
  
    if (key.isUp("W") || key.isUp("S")) {
      acceleration.y = 0;
    } else if (key.isUp("A") || key.isUp("D")) {
      acceleration.x = 0;
    }
   
      if(moveTankflag){
        velocity.x = Math.min(Math.max(velocity.x + acceleration.x, -Player.movementSpeed), Player.movementSpeed);
        velocity.y = Math.min(Math.max(velocity.y + acceleration.y, -Player.movementSpeed), Player.movementSpeed);
      
        if (acceleration.x == 0) {
          velocity.x -= deceleration.x * Math.sign(velocity.x);
        }
        if (acceleration.y == 0) {
          velocity.y -= deceleration.y * Math.sign(velocity.y);
        }
      
        const threshold = 0.01;
        if (Math.abs(velocity.x) < threshold) velocity.x = 0; 
        if (Math.abs(velocity.y) < threshold) velocity.y = 0; 
        if((Math.abs(velocity.x) < threshold) && (Math.abs(velocity.y) < threshold)) moveTankflag = false;
    
      tank.move(point(velocity.x, velocity.y)); 
      }
      pjs.camera.setPositionC(tank.getPosition(1));
      
      tank.pushka.setPositionC(point((tank.x + tank.w / 2) + 2, tank.y + 33))
      tank.pushka.rotateForPoint(mouse.getPosition(), 20);
      //Отрисовка танка
      
      
      
      
}
//Создание других игроков 
function createNewUsers(mass1, i){
    let mass = game.newCircleObject({ 
        x: mass1[i].cordX, 
        y: mass1[i].cordY, 
        radius : 30, 
        fillColor : "#00b2e1", 
        strokeColor : "#0085a8", 
        strokeWidth : 4
    })
    
    let nameOBJ = game.newTextObject({ 
        x : 20, 
        y : 20, 
        text : mass1[i].id, 
        size : 20, 
        color : "#ffffff", 
        font: 'Rubik',
        style: 'bold'
    });
   
    mass.setUserData({
        idPlayer: mass1[i].id,      
        pushka: game.newRoundRectObject({ 
         x : mass1[i].cordX + 30, 
         y : mass1[i].cordY + 17, 
         w : 60, 
         h : 30, 
         fillColor : "#CDCDCD", 
         strokeColor: '#727272',
         strokeWidth: 4,
         radius : 2,        
        }),
        health: mass1[i].health,
        maxHealth: mass1[i].maxHealth,
        name: game.newTextObject({ 
        x : 20, 
        y : 20, 
        text : mass1[i].id, 
        size : 20, 
        color : "#ffffff", 
        font: 'Rubik',
        style: 'bold'
        }),
        score: game.newTextObject({ 
          x : 20, 
          y : 20, 
          text : '10.4k', 
          size : 14, 
          color : "#2a2a2a", 
          font: 'Rubik',
          style: 'bold'
        }),
        barOBJ:{
          bar: game.newRoundRectObject({ 
            x : mass1[i].cordX, 
            y : mass1[i].cordY, 
            w : 60, 
            h : 7, 
            fillColor : "#555555", 
            strokeColor: '#707070',
            strokeWidth: 1,
            radius : 3
        }),
        CountHealth: game.newRoundRectObject({ 
          x : mass1[i].cordX, 
          y : mass1[i].cordY, 
          w : 58, 
          h : 5, 
          fillColor : "#85e37d", 
          radius : 3
      })},
        bullet: []
    });
  
      mass.pushka.setCenter(point(-mass.pushka.w / 2 -1, 0) );
      return mass;
}

//Получение данных от сервера, когда другой игрок перемещается по карте
socket.on('athother player movement', (id, pushkaX, pushkaY, angle, cordX, cordY)=>{
    for(let i in playersMass)
        if(playersMass[i].idPlayer == id) {
          playersMass[i].x = cordX;
          playersMass[i].y = cordY;
          playersMass[i].pushka.x = pushkaX;
          playersMass[i].pushka.y = pushkaY;
          playersMass[i].pushka.angle = angle;
        } 
})

//Создание пулек танка
function createBulletTank(){
  if(Player.bullet.speedShooting != 0) Player.bullet.speedShooting--; else Player.bullet.speedShooting = 0;

  if(mouse.isDown('LEFT') && Player.bullet.speedShooting == 0){
    drawBullet();
    Player.bullet.speedShooting = Player.bullet.reload;
    let bulletMass = [];
      for(let i in tank.bullet){
        bulletMass.push({
          x: tank.bullet[i].x,
          y: tank.bullet[i].y,
          life: tank.bullet[i].life,
          size: Player.bullet.size
        })
      }
        
      console.log(bulletMass, tank.bullet)

    socket.emit('creating bullet',bulletMass, tank.idPlayer);
    
  }
  socket.on('another creating bullet', (bulletMass, id)=>{     
    if(tank != {} && tank.idPlayer != id)
    for(let x in playersMass)
      if(playersMass[x].idPlayer == id){
          
        playersMass[x].bullet = [];
        console.log(playersMass[x].bullet)
        for(let i in bulletMass){
          playersMass[x].bullet.push(game.newCircleObject({ 
            x : bulletMass[i].x, 
            y : bulletMass[i].y, 
            radius : bulletMass[i].size, 
            fillColor : "#F14E54", 
            strokeColor : "#B43A3F", 
            strokeWidth : 3, 
            angle : 0, 
            alpha : 1, 
            visible : true 
          }));

          playersMass[x].bullet[playersMass[x].bullet.length - 1].setUserData({
            life: bulletMass[i].life});                   
        } 
      }     
  })

  function drawBullet(){
    tank.bullet.push(
        game.newCircleObject({ 
            x : tank.pushka.getPosition(2).x - Player.bullet.size, 
            y : tank.pushka.getPosition(2).y - Player.bullet.size, 
            radius : Player.bullet.size , 
            fillColor : "#00b2e1", 
            strokeColor : "#0085a8", 
            strokeWidth : 3, 
            angle : 0, 
            alpha : 1, 
            visible : true 
        }));

        tank.bullet[tank.bullet.length - 1].setUserData({
        cordX: Math.cos(C(Ha(point(WH.w2 / scaleCamera - 7,WH.h2 / scaleCamera - 7), mouse.getPositionS()))) * Player.bullet.speed ,
        cordY: Math.sin(C(Ha(point(WH.w2 / scaleCamera - 7,WH.h2 / scaleCamera - 7), mouse.getPositionS()))) * Player.bullet.speed ,
        life: Player.bullet.damage,
        timeLive: Player.bullet.timeLife,
        death:{
            flag: false,
            dying: false,
            countTimeDying: 10,
        }
    })  

  }
  //пули
  if(tank.bullet.length)chengedPositionBulletTank();
  function chengedPositionBulletTank(){
    for(let i in tank.bullet){
        //Движение пули
        tank.bullet[i].move(point(tank.bullet[i].cordX * cofFpsDel, tank.bullet[i].cordY * cofFpsDel));
        tank.bullet[i].timeLive -= 1;
  
        //Проверка на смерть пули
        if((tank.bullet[i].life <= 0) || 
        (tank.bullet[i].timeLive <= 0) ||
        (tank.bullet[i].isStaticIntersect(rectBackgroundMass[1].getStaticBox())) || 
        (tank.bullet[i].isStaticIntersect(rectBackgroundMass[2].getStaticBox())) || 
        (tank.bullet[i].isStaticIntersect(rectBackgroundMass[3].getStaticBox())) ||
        (tank.bullet[i].isStaticIntersect(rectBackgroundMass[4].getStaticBox())))
            tank.bullet[i].death.dying = true;
  
        //Анимация умирания пули
        if(tank.bullet[i].death.dying)
        if(tank.bullet[i].death.countTimeDying >= 0){
            tank.bullet[i].scaleC(1.01);
            tank.bullet[i].alpha -=0.09;
            tank.bullet[i].cordX -= tank.bullet[i].cordX / 7;
            tank.bullet[i].cordY -= tank.bullet[i].cordY / 7;
            tank.bullet[i].death.countTimeDying--;
        }else {tank.bullet[i].death.flag = true; tank.bullet[i].death.death = false;}
  
        if(tank.bullet[i].isInCamera()) tank.bullet[i].draw();
    }
    
      
    for(let i in tank.bullet)
      if(tank.bullet[i].death.flag) {
        tank.bullet.splice(i, 1);
        socket.emit('delete bullet', i, tank.idPlayer);
      }
      let bulletMass = [];
      for(let i in tank.bullet){
        bulletMass.push({
          x: tank.bullet[i].x,
          y: tank.bullet[i].y,
          life: tank.bullet[i].life
        })
      } 
      
       
    socket.emit('chenged position bullet', bulletMass, tank.idPlayer);

   
  }
}
socket.on('another chenged position bullet', (bulletMass, id) =>{
  if(tank != {} && tank.idPlayer != id)
  for(let i in playersMass)
    if(playersMass[i].idPlayer == id){
      for(let x in bulletMass){
        playersMass[i].bullet[x].x = bulletMass[x].x;
        playersMass[i].bullet[x].y = bulletMass[x].y;
        playersMass[i].bullet[x].life = bulletMass[x].life;
      }
    }     
})
socket.on('another delete bullet', (position, id)=>{
  if(tank != {} && tank.idPlayer != id){
    for(let i in playersMass)
      if(playersMass[i].idPlayer == id){
        playersMass[i].bullet.splice(position,1);
      }
  }
})





//Рейтинг
let maxScore = 10000;

const playerList = document.getElementById("player-list");
createListPlayers();

function createListPlayers(){
  playerList.innerHTML = '';
  PlayerMassForRating.sort((a, b) => b.points - a.points);
  PlayerMassForRating.forEach((player, i) => {
    playerList.innerHTML += `
      <div class="player-rating">
      <div class="players_info">
        <div class="player-name">${player.name + ' - '}</div>
        <div class="player-points"> ${shortFormatNumber(player.points)}</div>
      </div>
        <div class="rating-bar">          
          <div class="rating-fill" style="width: ${(player.points/maxScore)*100}%"></div>     
        </div>      
      </div>
    `;
  });
}

function shortFormatNumber(num) {
  if (num >= maxScore / 10) {
      return (num / 1000).toFixed(1) + 'k';
  }
  return num;
}

socket.on('update rating', (player) =>{
  for(let i in player){
    if(PlayerMassForRating[i].name == player[i].id){
      PlayerMassForRating[i].points = player[i].score;
    }
  }
  createListPlayers();
})



/////////////////////////////////////////
function Ha(a,b){ return 180/Math.PI*Math.atan2(b.y-a.y, b.x-a.x)}
function C(a){return Math.PI/180*a}
  