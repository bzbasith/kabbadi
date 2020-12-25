var player1, database;
var position,position2;
var player2;
var p1animation,p2animation;
var gameState;
var player1Score;
var player2Score;

function preload(){
    p1animation =loadAnimation("player1a.png","player1b.png","player1a.png");
    p2animation =loadAnimation("player2a.png","player2b.png","player2a.png");
    bk = loadImage("ground.png")
}

function setup(){
  database = firebase.database();
 
  createCanvas(800,800);

  player1 = createSprite(100,250,10,10);
  player1.shapeColor = "RED";
  player1.addAnimation("walking",p1animation);
  p1animation.frameDelay = 200
  player1.scale = 0.5
  player1.setCollider("circle", 0,0,60)
  player1.debug = true;
  
  var player1Position = database.ref('player1/position');
  player1Position.on("value", readPosition); 

  player2 = createSprite(700,250,10,10);
  player2.shapeColor = "green";
  player2.addAnimation("walkin2",p2animation);
  p2animation.frameDelay = 200
  player2.scale = -0.5
  player2.setCollider("circle", 0,0,60)
  player2.debug = true;

  var player2Position = database.ref('player2/position');
  player2Position.on("value", readPosition2);


  gameState = database.ref('gameState/');
  gameState.on("value", readGS);

  player1Score = database.ref('player1Score/');
  player1Score.on("value", readScore1);

  player2Score = database.ref('player2Score/');
  player2Score.on("value", readScore2);
}

function draw(){
  background(bk);

  if(gameState === 0){
    textSize(40);
    fill("black")
    text("Press space to start the toss",100,200);


    if(keyDown("space")){
      rand = Math.round(random(1,2))
      if(rand === 1){
        database.ref('/').update({
          'gameState': 1  
        })
        alert("RED RIDE")
      }
      if(rand === 2){
        database.ref('/').update({
          'gameState': 2  
        })
        alert("YELLOW RIDE")
      }
      database.ref('player1/position').update({
        'x': 150,
        'y': 400  
      })

      database.ref('player2/position').update({
        'x': 650,
        'y': 400  
      })

    }
    
  }





  if (gameState === 1){

    if(keyDown(LEFT_ARROW)){
      writePosition(-5,0);
    }
    else if(keyDown(RIGHT_ARROW)){
      writePosition(5,0);
    }
    else if(keyDown(UP_ARROW)){
      writePosition(0,-5);
    }
    else if(keyDown(DOWN_ARROW)){
      writePosition(0,+5);
    }
    else if(keyDown("w")){
        writePosition2(0,-5);
      }
      else if(keyDown("d")){
        writePosition2(0,+5);
      }
 

    if(player1.x > 700){
      database.ref('/').update({
        'player1Score': player1Score - 5 ,
        'player2Score': player2Score + 5 ,
        'gameState': 0  

      })
    
      
    }

    if(player1.isTouching(player2)){
      database.ref('/').update({
        'gameState': 0  ,
        'player1Score': player1Score + 5 ,
        'player2Score': player2Score - 5 
      })
      
      alert("RED LOST")
    }

    
  }

  if(gameState === 2){
  
    
 
    if(keyDown("a")){
      writePosition2(-5,0);
    }
    else if(keyDown("s")){
      writePosition2(5,0);
    }
    else if(keyDown("w")){
      writePosition2(0,-5);
    }
    else if(keyDown("d")){
      writePosition2(0,+5);
    }
    else if(keyDown(UP_ARROW)){
        writePosition(0,-5);
      }
      else if(keyDown(DOWN_ARROW)){
        writePosition(0,+5);
      }
 

    if(player2.x < 100){
      database.ref('/').update({
        'player1Score': player1Score + 5, 
        'gameState': 0,
        'player2Score': player2Score - 5   
      })
    
    }

    if(player1.isTouching(player2)){
      database.ref('/').update({
        'gameState': 0  ,
        'player1Score': player1Score - 5,
        'player2Score': player2Score + 5  
      })
      
      alert("YELLOW LOST")
    }
    
    
  }
  push();
    fill("balck")
    textSize(15)
    text("RED: "+player1Score,550,15);
    text("YELLOW: "+player2Score,150,15);
    pop();

    draw1();
    draw2();
    draw3();
    console.log(gameState)

    drawSprites();
  
}

function writePosition(x,y){
  database.ref('player1/position').set({
    'x': position.x + x ,
    'y': position.y + y
  })
}

function writePosition2(x,y){
  database.ref('player2/position').set({
    'x': position2.x + x ,
    'y': position2.y + y
  })
}

function readPosition(data){
  position = data.val();
  //console.log(position.x);
  player1.x = position.x;
  player1.y = position.y;
}

function readPosition2(data){
  position2 = data.val();
  //console.log(position2.x);
  player2.x = position2.x;
  player2.y = position2.y;
}

function readGS(data){
  gameState = data.val();
}

function readScore1(data1){
  player1Score = data1.val();
}

function readScore2(data2){
  player2Score = data2.val();
}



function draw1(){
  for(var num = 0; num<800; num=num+20){
    line (400,num,400,num+10)
  }
}

function draw2(){
  for(var i = 0; i< 800; i=i+20){
    stroke("yellow");
    strokeWeight(4)
    line (100,i,100,i+10)
  }
}

function draw3(){
  for(var i = 0; i< 800; i=i+20){
    stroke("red");
    strokeWeight(4);
    line (700,i,700,i+10)
  }
}
