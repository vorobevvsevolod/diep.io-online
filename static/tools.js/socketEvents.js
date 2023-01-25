socket.emit("new player connected", tokenAutorization, (players, id, rectingle, triangle, poligon)=>{
    game.start();
    //Создание других игроков
    for(let i = 0; i <= players.length - 1; i++){
        if(players[i].id == id) tank = createNewUsers(players, i);
        else playersMass.push(createNewUsers(players, i));
        PlayerMassForRating.push({
            name: players[i].id,
            points: players[i].score
        })
    }
    //Создание квадратов
    for(let i in rectingle) createRectaingle(rectingle, i);
    for(let i in triangle) createTriangle(triangle, i);
    for(let i in poligon) createPoligon(poligon, i);   
    createListPlayers();
})
   
socket.on('players disconnected', (id, massRectingle, massTrianagle, massPoligon)=>{
    for(let i in playersMass) 
      if(playersMass[i].idPlayer == id){
        playersMass.splice(i,1)
        console.log(`Игрок ${id} отсоединился`)        
    } 
    for(let x in PlayerMassForRating)
        if(PlayerMassForRating[x].name == id){
            PlayerMassForRating.splice(x,1);
        }
    createListPlayers();

    for(let i in rectingleMass)
        rectingleMass[i].renderPlayer = massRectingle[i].renderPlayer;
    for(let i in triangleMass)
        triangleMass[i].renderPlayer = massTrianagle[i].renderPlayer;
    for(let i in poligonMass)
        poligonMass[i].renderPlayer = massPoligon[i].renderPlayer;
})

socket.on('added new players', (players, id)=>{
    if(id != tank.idPlayer){
      playersMass.push(createNewUsers( players, players.length - 1));
      console.log(`Игрок ${players[players.length - 1].id} присоединился`);
      PlayerMassForRating.push({
        name: players[players.length - 1].id,
        points: players[players.length - 1].score
    })
    createListPlayers();
    }   
})