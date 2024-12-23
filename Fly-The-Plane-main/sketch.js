const Engine = Matter.Engine;
const World = Matter.World;
const Bodies = Matter.Bodies;
const Body = Matter.Body;

var airplane;
var airplaneImg;
var ground;
var gasLevel = 100;
var gasLevelX = 150;

var star;
var stars = [];
var starImg;
var starsCollected = 0;

var gas;
var gasImg;

var miles;

var obstaclePlane;
var obstaclePlanes = [];
var obstaclePlaneImg;

var backgroundImg;

var planeFlying = false;

var startButton;
var startImg;
var leftArrow;
var rightArrow;

var planeNumber = 1;
var choosePlane;
var plane1Img;
var plane2Img;
var plane3Img;
var plane4Img;
var plane5Img;

var airport;
var airportImg;

var gameStarted = false;
var gameBegin = false;
var gameOver = false;

function preload() {
  backgroundImg = loadImage("assets/background.jpeg");
  starImg = loadImage("assets/star.png");
  startImg = loadImage("assets/start.png");
  obstaclePlaneImg = loadImage("assets/obstaclePlane.png");
  gasImg = loadImage("assets/gas.png");
  plane1Img = loadImage("assets/plane1.png");
  plane2Img = loadImage("assets/plane2.png");
  plane3Img = loadImage("assets/plane3.png");
  plane4Img = loadImage("assets/plane4.png");
  plane5Img = loadImage("assets/plane5.png");
  airportImg = loadImage("assets/airport.png");``
}

function setup() {
  createCanvas(windowWidth, windowHeight - 5);

  engine = Engine.create();
  world = engine.world;

  miles = 50;

  startButton = createImg("assets/start.png")
  startButton.position(width * 0.42,height * 0.70);
  startButton.size(width/6,height/6);
  startButton.mouseClicked(start);
  
  leftArrow = createImg("assets/leftarrow.jpg");
  leftArrow.position(width/3,height * 0.37)
  leftArrow.size(height/11,height/11)
  leftArrow.mouseClicked(left);
  
  rightArrow = createImg("assets/rightarrow.jpg");
  rightArrow.position(width * 0.63,height * 0.37)
  rightArrow.size(height/11,height/11)
  rightArrow.mouseClicked(right);
  
  choosePlane = createSprite(width * 0.50, height * 0.40);
  choosePlane.addImage(plane1Img);
  choosePlane.scale = 0.6;
    
  var options2 = {
    isStatic: true,
  };

  ground = Bodies.rectangle(width / 2, height, width, height * 0.30, options2);
  World.add(world, ground);

  rectMode(CENTER);
  ellipseMode(CENTER);
  imageMode(CENTER);
}

function draw() {
  background(201);
  Engine.update(engine);
  
  if(gameBegin === false){
    fill(255,255,255)
    rect(width/2,height/2 - height/10,height/2,height/2)
    
    if(planeNumber === 1){
      choosePlane.addImage(plane1Img)
      airplaneImg = plane1Img;
    }else if(planeNumber === 2){
      choosePlane.addImage(plane2Img)
      airplaneImg = plane2Img;
    }else if(planeNumber === 3){
      choosePlane.addImage(plane3Img)
      airplaneImg = plane3Img;
    }else if(planeNumber === 4){
      choosePlane.addImage(plane4Img)
      airplaneImg = plane4Img;
    }else if(planeNumber === 5){
      choosePlane.addImage(plane5Img)
      airplaneImg = plane5Img;
    }
    
  }
  
  
  
  if(gameStarted === true){
  image(backgroundImg, width / 2, height / 2, width, height);
  image(airplaneImg, airplane.position.x, airplane.position.y, height * 0.45, height * 0.45);
  fill(255,255,255);
  rect(150,height/10,217,43);
  fill(38, 136, 230);
  rect(150, height/10,200, 30);
  fill(255,0,0);
  rect(gasLevelX, height/10, gasLevel * 2, 30);
  startButton.size(height/1000,height/1000);
  leftArrow.size(height/1000,height/1000);
  rightArrow.size(height/1000,height/1000);
  choosePlane.x = width * 2;
  }
  
  if(gameBegin === true && gameStarted === false){
    swal(
    {
      title: `Lets Start!`,
      text: "Using your spacebar, fly the plane until you reach the airport, Good Luck!",
      imageUrl: "https://raw.githubusercontent.com/pranoov/Pyshics-Game/main/assets/airport.png",
      imageSize: "300x300",
      confirmButtonText: "Play Game",
    },
    function (isConfirm) {
      if (isConfirm) {
        gameStarted = true;
          var options = {
            denstiy: 0.5,
          };
        airplane = Bodies.rectangle(width / 2 - 50,0, 150, 75, options);
        World.add(world, airplane);
        
      }
    }
  );
  }
  
  if (frameCount % 100 == 0 && gameStarted === true && gameOver === false) {
    star = createSprite(width, random(100, height * 0.80), 50, 50);
    star.addImage(starImg);
    star.scale = 0.1;
    star.lifetime = width / 3;
    stars.push(star);
  }

  if (frameCount % 200 === 0 && gameStarted === true && gameOver === false) {
    createObstacle();
  }
  if (frameCount % 500 === 0 && gameStarted === true && gameOver === false) {
    gas = createSprite(width, random(100, height * 0.80), 50, 50);
    gas.addImage(gasImg);
    gas.scale = 0.3;
  }
  
  if (gas != null && gameStarted === true && gameOver === false) {
    if (collide(airplane, gas, 100) === true) {
      gasLevelX += 100 - gasLevel;
      gas.x = -100;
      gasLevel = 100;
    }
    gas.x -= 5;
  }

  if (frameCount % 50 == 0 && gameStarted === true && miles > 0 && gameEnd != true) {
    miles -= 1;
  }

  if(gameOver === false){
  for (var i = 0; i < stars.length; i++) {
    stars[i].x -= 5;
    if (collide(airplane, stars[i], 100) === true) {
      stars[i].lifetime = 0;
      stars.splice(i, 1);
      starsCollected++;
    }
  }
  }

  if(gameOver === false){
  for (var i = 0; i < obstaclePlanes.length; i++) {
    obstaclePlanes[i].x -= 6;
    if (collide(airplane, obstaclePlanes[i], 100) === true) {
      gameOver = true;
      gameEnd("You crashed with another plane!")
    }
  }
  }
  console.log(gameOver)

  if(miles < 5){
  if(collide(airplane,airport,150) === true && gameOver === false){
    gameOver = true;
    gameWon();
  }
  }

  if(miles < 5 && airport.x - airplane.position.x < -150 && gameOver === false){
    gameOver = true;
    gameEnd("You flew past the airport!")
  }
  
  if(gameStarted === true){
  if (airplane.position.x > (width * 3) / 4) {
    wind();
  }

  if (planeFlying === true && gasLevel > 0.5) {
    planeFly();
  }
    
  if(miles === 5){
    airport = createSprite(width + 150,height * 0.77,height/15,height/15);
    airport.addImage(airportImg);
    airport.scale = 1.3
    console.log("Hello")
  }
  if(miles <= 5 && gameOver === false){
    airport.x -= 3;
  }

  if(airplane.position.y < -20 && gameStarted === true && gameOver === false){
    gameOver = true;
    gameEnd("You flew too high!");
  }

  if(gasLevel === 0 && gameOver === false){
    gameOver = true;
    gameEnd("You ran out of gas!")
  }

  if (airplane.position.y > height * 0.76 && gameStarted === true && miles > 2 && gameOver === false){
    gameOver = true;
    gameEnd("You hit the ground!");
  }
  }

  drawSprites();

  fill(0, 0, 0);
  textSize(30);
  if(gameStarted === true){
  text("Stars: " + starsCollected, (width * 3) / 4, height / 10);
  textSize(50);
  text(miles / 10, width / 5, height / 10);
  textSize(25);
  text("miles", width / 5, height / 8);
  text("Gas", 135, 45)
  }
  if(gameStarted === false){
    textSize(35);
    text("Choose Your Plane", width * 0.40, height * 0.07);
    textSize(32)
    text(planeNumber + "/5",width * 0.48,height * 0.13);
  }
}

function planeFly() {
  Matter.Body.applyForce(airplane, { x: 0, y: 0 }, { x: 0, y: -0.04 });
  gasLevel -= 0.5;
  gasLevelX -= 0.5;
}

function wind() {
  Matter.Body.applyForce(airplane, { x: 0, y: 0 }, { x: -0.1, y: 0 });
}

function collide(body, sprite, x) {
  if (body != null) {
    var d = dist(
      body.position.x,
      body.position.y,
      sprite.position.x,
      sprite.position.y
    );
    if (d <= x) {
      return true;
    } else {
      return false;
    }
  }
}

function createObstacle() {
  obstaclePlane = createSprite(width, random(100, height *  0.80), 150, 75);
  obstaclePlane.addImage(obstaclePlaneImg);
  obstaclePlane.scale = 0.5;
  obstaclePlanes.push(obstaclePlane);
}

function gameEnd(text) {
  swal(
    {
      title: text,
      imageUrl:
        "https://pngimg.com/uploads/game_over/game_over_PNG46.png",
      imageSize: "300x300",
      confirmButtonText: "Play Again",
    },
    function (isConfirm) {
      if (isConfirm) {
        location.reload();
      }
    }
  );
}
function gameWon(){
    swal(
    {
      title: "Congrats you reached the airport!",
      imageUrl: "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcR7ojSaFzligZzxh_web5R1_N0kPeqZcm-tT9kN6eqxHuk2cemiIVkpPvQDCkb-Ud8C1XE&usqp=CAU",
      imageSize: "300x300",
      confirmButtonText: "Play Again",
    },
    function (isConfirm) {
      if (isConfirm) {
        location.reload();
      }
    }
  );
}

function left(){
  if(planeNumber > 1){
    planeNumber -= 1;
  }
}

function right(){
  if(planeNumber < 5){
    planeNumber += 1;
  }
}

function start(){
  gameBegin = true;
}

function windowResized() {
  resizeCanvas(windowWidth, windowHeight);
}

function keyPressed() {
  if (keyCode === 32) {
    planeFlying = true;
  }
}
function keyReleased() {
  if (keyCode === 32) {
    planeFlying = false;
  }
}
