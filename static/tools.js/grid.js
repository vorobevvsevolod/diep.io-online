const backgroundMass = [], rectBackgroundMass = [];

function drawBackGround(){
    for(let i in rectBackgroundMass) if(rectBackgroundMass[i].isInCamera()) rectBackgroundMass[i].draw();
    for(let i in backgroundMass) if(backgroundMass[i].isInCamera()) backgroundMass[i].draw();
  }

function createGrid(){
    let width = 2000, heigth = 1000;
    const colorGrid = "#474A51";
  
    for(let x = 0; x < 2; x++)
        for(let y = 0; y < 4; y++){
            backgroundMass.push(game.newImageObject({ 
                file : "../static/image/back.png", 
                x : x * width, 
                y : y * heigth,
                w : width, 
                h : heigth, 
            }))
    }
  
    rectBackgroundMass.push(game.newRectObject({ 
      x : 0, 
      y : 0, 
      w : 2000 * 2, 
      h : 1000 * 4, 
      fillColor : "#bbbbbb", 
      }));
    rectBackgroundMass.push(
      game.newRectObject({ 
          x : 0, 
          y : -5, 
          w : 2000 * 2, 
          h : 5, 
          fillColor : colorGrid, 
      })) ; 
    rectBackgroundMass.push(
      game.newRectObject({ 
          x : 0, 
          y : 4000, 
          w : 2000 * 2, 
          h : 5, 
          fillColor : colorGrid, 
      }));
    rectBackgroundMass.push(
    game.newRectObject({ 
        x : -5, 
        y : -5, 
        w : 5, 
        h : 4010, 
        fillColor : colorGrid, 
      }));
    rectBackgroundMass.push(
    game.newRectObject({ 
        x : 4000, 
        y : -5, 
        w : 5, 
        h : 4010, 
        fillColor : colorGrid, 
     }));  
  
  }
  