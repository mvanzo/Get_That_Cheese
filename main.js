// DOM SELECTORS - EVENT LISTENERS
const canvas = document.querySelector("#canvas");
const scoreboard = document.querySelector("#scoreboard");
const countdown = document.querySelector('#countdown');
document.querySelector('#new-game-button').addEventListener('click', startGame);

canvas.setAttribute("height", getComputedStyle(canvas)["height"])
canvas.setAttribute("width", getComputedStyle(canvas)["width"])

// variable state
const ctx = canvas.getContext("2d")
const pressedKeys = {}
let newGameClock = 25;
countdown.innerText = newGameClock;
let score = 0;
let highScore = 0;
let stopTime = false;
let gameLoopInterval = setInterval(gameLoop, 30);

const mouse = {
    x: 10,
    y: 10,
    width: 87,
    height: 62,
    inPlay: false,
    render: () => {
        const mouseImg = new Image();
        mouseImg.src = './img/mouse.png';
        mouseImg.alt = 'mouse image';
        ctx.drawImage(mouseImg, 0, 0, 800, 566, mouse.x, mouse.y, mouse.width, mouse.height);
    }
}

class Cat {
  constructor(x, y, width, height, speed) {
    this.x = x;
    this.y = y;
    this.width = width;
    this.height = height;
    this.speed = speed;

    this.dx = 1 * this.speed;
    this.dy = 1 * this.speed;
  }
  render() {
    const catImg = new Image();
    catImg.src = './img/mean-cat.png';
    ctx.drawImage(catImg, 0, 0, 887, 572, this.x, this.y, this.width, this.height);
  }
  // moving cats
  move() {
    this.render();
    this.x += this.dx;
    this.y += this.dy;
    // collision detection for walls
    if (this.x <=0) this.dx = -this.dx;
    if (this.x + this.width >= canvas.width) this.dx = -this.dx;
    if (this.y <=0) this.dy = -this.dy;
    if (this.y + this.height >= canvas.height) this.dy = -this.dy;
  }
  // collision detection
  caught() {
    const catLeft = mouse.x + mouse.width >= this.x + 40;
    const catRight = mouse.x <= this.x + this.width - 45;
    const catTop = mouse.y + mouse.height >= this.y + 40;
    const catBottom = mouse.y <= this.y + this.height - 40;
  
    if (catLeft && catRight && catTop && catBottom) {
      // display lost game div
      document.querySelector('.losing-container').style.display = 'block';
      // stop timer
      stopTime = true;
      // new game button functionality
      document.querySelector('#play-again-button-3').addEventListener('click', restartGame)
      // mouse not in play --> cats stop moving
      mouse.inPlay = false;
      // document high score
      document.querySelector('#high-score-lost').innerText = highScore;
    }
  }
}

const cat1 = new Cat(Math.floor(Math.random()* (450-150) + 150), Math.floor(Math.random()* (300-150) + 150), 150, 96, 4.5);
const cat2 = new Cat(Math.floor(Math.random()* (450-150) + 150), Math.floor(Math.random()* (300-150) + 150), 150, 96, -3.5);

class Cheese {
    constructor(x, y, width, height, inPlay) {
        this.x = x
        this.y = y
        this.width = width
        this.height = height
        this.inPlay = inPlay
    }
    render() {
        const cheeseImg = new Image();
        cheeseImg.src = './img/cheese.png';
        ctx.drawImage(cheeseImg, 0, 0, 524, 480, this.x, this.y, this.width, this.height, this.inPlay);
    }
    foundCheese() {
      const cheeseLeft = mouse.x + mouse.width >= this.x + 20;
      const cheeseRight = mouse.x <= this.x + this.width -20;
      const cheeseTop = mouse.y + mouse.height >= this.y + 20;
      const cheeseBottom = mouse.y <= this.y + this.height -20;
    
      if (cheeseLeft && cheeseRight && cheeseTop && cheeseBottom) {
            score += 1;
            scoreboard.innerText = score;
            this.inPlay = false;
            // delayed re-rendering of cheese - made as arrow function to keep clean (one line)
            setTimeout(() => this.inPlay = true, 1000);
            this.x = Math.floor(Math.random()*490);
            this.y = Math.floor(Math.random()*390);
          }
    }

}

// cheese object initiation with random location
const cheese1 = new Cheese(Math.floor(Math.random()* (600 - 100) + 100), Math.floor(Math.random()* (450-100) + 100), 33, 30, true);
const cheese2 = new Cheese(Math.floor(Math.random()* (600 - 100) + 100), Math.floor(Math.random()* (450-100) + 100), 43, 40, true);
const cheese3 = new Cheese(Math.floor(Math.random()* (600 - 100) + 100), Math.floor(Math.random()* (450-100) + 100), 28, 26, true);

const mouseHole = {
  x: 540,
  y: 410,
  width: 80,
  height: 80,
  render: () => {
    const mouseHoleImg = new Image();
    mouseHoleImg.src = './img/mouse-hole.png';
    ctx.drawImage(mouseHoleImg, 0, 0, 578, 545, mouseHole.x, mouseHole.y, mouseHole.width, mouseHole.height);
  }
}

// GAME FUNCTIONALITY
function moveMouse() {
  document.addEventListener('keydown', e => pressedKeys[e.key] = true);
  document.addEventListener('keyup', e => pressedKeys[e.key] = false);
  const speed = 4
  if (pressedKeys.ArrowLeft) {
    mouse.x -= speed
  }
  if (pressedKeys.ArrowRight) {
    mouse.x += speed
  }
  if (pressedKeys.ArrowDown) {
    mouse.y += speed
  }
  if (pressedKeys.ArrowUp) {
    mouse.y -= speed
  }
}

function detectWall() {
  const leftWall = mouse.x <= 0
  const rightWall = mouse.x + mouse.width >= canvas.width
  const topWall = mouse.y <= 0
  const bottomWall = mouse.y + mouse.height >= canvas.height

  if (leftWall) mouse.x = 0;
  if (rightWall) mouse.x = canvas.width - mouse.width;
  if (topWall) mouse.y = 0;
  if (bottomWall) mouse.y = canvas.height - mouse.height;
}

function startGame() {
  // hide display for home container
  document.querySelector('.home-container').style.display = 'none';
  // mouse inPlay-->cats start moving after 1 second
  setTimeout(() => mouse.inPlay = true, 1000);
  //countdown starts
  let gameTimer = setInterval(function() {
    if (stopTime) {
      clearInterval(gameTimer);
    } else if (newGameClock == 0) {
      //end game function when time is out
      timeIsUp();
      // stop time counting
      clearInterval(gameTimer);
    } else {
    newGameClock -= 1;
    countdown.innerText = newGameClock;
    }
  }, 1000)
}

function restartGame() {
  // clear winning-container from screen
  document.querySelector('.winning-container').style.display = 'none';
  document.querySelector('.time-out-container').style.display = 'none';
  document.querySelector('.losing-container').style.display = 'none';
  // reset clock to full time and update the DOM for reload page
  newGameClock = 25;
  countdown.innerText = 25;
  // reset score to 0 and update the DOM for reload page
  score = 0;
  scoreboard.innerText = 0;
  // move mouse back to start point
  setTimeout(() => mouse.inPlay = true, 800);
  mouse.x = 10;
  mouse.y = 10;
  // re-render cheese, and cats
  cheese1.x = Math.floor(Math.random()* (600-100) + 100);
  cheese1.y = Math.floor(Math.random()* (450-100) + 100);
  cheese2.x = Math.floor(Math.random()* (600-100) + 100);
  cheese2.y = Math.floor(Math.random()* (450-100) + 100);
  cheese3.x = Math.floor(Math.random()* (600-100) + 100);
  cheese3.y = Math.floor(Math.random()* (450-100) + 100);

  cat1.x = Math.floor(Math.random()* (450-100) + 100);
  cat1.y = Math.floor(Math.random()* (300-100) + 100);
  cat2.x = Math.floor(Math.random()* (450-100) + 100);
  cat2.y = Math.floor(Math.random()* (300-100) + 100);

  // stopTime set to false so game timer can run again
  stopTime = false;
  // run startGame function
  startGame();
}

function timeIsUp() {
  mouse.inPlay = false;
  // display time-out container
  document.querySelector('.time-out-container').style.display = 'block';
  // new game button to start another game -- restart game loop function??
  document.querySelector('#play-again-button-2').addEventListener('click', restartGame);
  // high score maintained
  document.querySelector('#high-score-time').innerText = highScore;
}

function foundHome() {
  //fine tuned meeting point by 30px
  const homeLeft = mouse.x + mouse.width >= mouseHole.x+30;
  const homeRight = mouse.x <= mouseHole.x + mouseHole.width-30;
  const homeTop = mouse.y + mouse.height >= mouseHole.y+30;
  const homeBottom = mouse.y <= mouseHole.y + mouseHole.height-30;

  if (homeLeft && homeRight && homeTop && homeBottom) {
    // stops the clock with this variable
    stopTime = true;
    mouse.inPlay = false;
    // display winning container
    document.querySelector('.winning-container').style.display = 'block';
    // show score from previous round
    document.querySelector('#final-tally').innerText = score;
    // high score
    document.querySelector('#high-score-won').innerText = highScore;
    if (score >= highScore) highScore = score;
    // new game button to start another game
    document.querySelector('#play-again-button').addEventListener('click', restartGame);
  }
}

function gameLoop() {
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    mouseHole.render();
    mouse.render();
    if (cheese1.inPlay) cheese1.render();
    if (cheese2.inPlay) cheese2.render();
    if (cheese3.inPlay) cheese3.render();
    cat1.render();
    cat2.render();
    if (mouse.inPlay) cat1.move();
    if (mouse.inPlay) cat2.move();
    cat1.caught();
    cat2.caught();
    foundHome();
    detectWall();
    cheese1.foundCheese();
    cheese2.foundCheese();
    cheese3.foundCheese();
    moveMouse();
}