// DOM SELECTORS - EVENT LISTENERS
const canvas = document.querySelector("#canvas");
document.addEventListener("keydown", movementHandler);
const scoreboard = document.querySelector("#scoreboard");
const countdown = document.querySelector('#countdown');
document.querySelector('#new-game-button').addEventListener('click', startGame);

// DIAGONAL MOVEMENT ACTING GLITCHY
// const pressedKeys = { }
// document.addEventListener('keydown', e => pressedKeys[e.key] = true)
// document.addEventListener('keyup', e => pressedKeys[e.key] = false)

// images to upload to the canvas
const mouseImg = new Image();
  mouseImg.src = '/img/mouse.png';
const cheeseImg = new Image();
  cheeseImg.src = '/img/cheese.png';
const mouseHoleImg = new Image();
  mouseHoleImg.src = '/img/mouse-hole.png';
const trapImg = new Image();
  trapImg.src = '/img/trap.png';

// set up the renderer
const ctx = canvas.getContext("2d")
// set canvas size to be the same as window
// WHAT IS THIS -- after the window computes -- set canvas to be actual size of space it takes up
canvas.setAttribute("height", getComputedStyle(canvas)["height"])
canvas.setAttribute("width", getComputedStyle(canvas)["width"])

// variable state
let newGameClock = 25
  countdown.innerText = newGameClock
let score = 0;
let stopTime = false;

let gameLoopInterval = setInterval(gameLoop, 60)

function startGame() {
  // hide display for home container
  document.querySelector('.home-container').style.display = 'none';
  //countdown starts
  let gameTimer = setInterval(function() {
    if (stopTime) {
      clearInterval(gameTimer);
    } else if (newGameClock == 0) {
      //end game function when time is out
      timeIsUp();
      // stoping counting
      clearInterval(gameTimer);
    } else {
    newGameClock -= 1;
    countdown.innerText = newGameClock;
    }
  }, 1000)
}


function timeIsUp() {
  // display time-out container
  document.querySelector('.time-out-container').style.display = 'block';
  // new game button to start another game -- restart game loop function??
  document.querySelector('#play-again-button-2').addEventListener('click', restartGame)
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
  mouse.x = 10;
  mouse.y = 10;
  // re-render cheese, and traps
  cheese1.x = Math.floor(Math.random()* (600-100) + 100);
  cheese1.y = Math.floor(Math.random()* (450-100) + 100);
  cheese2.x = Math.floor(Math.random()* (600-100) + 100);
  cheese2.y = Math.floor(Math.random()* (450-100) + 100);
  cheese3.x = Math.floor(Math.random()* (600-100) + 100);
  cheese3.y = Math.floor(Math.random()* (450-100) + 100);

  trap1.x = Math.floor(Math.random()* (600-100) + 100);
  trap1.y = Math.floor(Math.random()* (450-100) + 100);
  trap2.x = Math.floor(Math.random()* (600-100) + 100);
  trap2.y = Math.floor(Math.random()* (450-100) + 100);

  // stopTime set to false so game timer can run again
  stopTime = false;
  // run startGame function
  startGame();
}

const mouseHole = {
  x: 540,
  y: 410,
  width: 80,
  height: 80,
  render: () => {
    ctx.drawImage(mouseHoleImg, 0, 0, 578, 545, mouseHole.x, mouseHole.y, mouseHole.width, mouseHole.height);
  }
}

const mouse = {
    x: 10,
    y: 10,
    width: 87,
    height: 62,
    render: () => {
        ctx.drawImage(mouseImg, 0, 0, 800, 566, mouse.x, mouse.y, mouse.width, mouse.height);
    }
}

class trap {
  constructor(x, y, width, height) {
    this.x = x
    this.y = y
    this.width = width
    this.height = height
  }
  render() {
    ctx.drawImage(trapImg, 0, 0, 800, 387, this.x, this.y, this.width, this.height);
  }
}

// mouse trap object initiation OOP
const trap1 = new trap(Math.floor(Math.random()* (600-100) + 100), Math.floor(Math.random()* (450-100) + 100), 80, 40)
const trap2 = new trap(Math.floor(Math.random()* (600-100) + 100), Math.floor(Math.random()* (450-100) + 100), 80, 40)

class Cheese {
    constructor(x, y, width, height, inPlay) {
        this.x = x
        this.y = y
        this.width = width
        this.height = height
        this.inPlay = inPlay
    }
    render() {
        // ctx.fillStyle = this.color
        // ctx.fillRect(this.x, this.y, this.width, this.height)
        ctx.drawImage(cheeseImg, 0, 0, 524, 480, this.x, this.y, this.width, this.height, this.inPlay);
    }
}

// cheese object initiation with random location
const cheese1 = new Cheese(Math.floor(Math.random()* (600 - 100) + 100), Math.floor(Math.random()* (450-100) + 100), 33, 30, true);
const cheese2 = new Cheese(Math.floor(Math.random()* (600 - 100) + 100), Math.floor(Math.random()* (450-100) + 100), 43, 40, true);
const cheese3 = new Cheese(Math.floor(Math.random()* (600 - 100) + 100), Math.floor(Math.random()* (450-100) + 100), 28, 26, true);

// collision detection - borders
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

function foundHome() {
  //fine tuned meeting point by 30px
  const homeLeft = mouse.x + mouse.width >= mouseHole.x+30;
  const homeRight = mouse.x <= mouseHole.x + mouseHole.width-30;
  const homeTop = mouse.y + mouse.height >= mouseHole.y+30;
  const homeBottom = mouse.y <= mouseHole.y + mouseHole.height-30;

  if (homeLeft && homeRight && homeTop && homeBottom) {
    // stops the clock with this variable
    stopTime = true;
    // display winning container
    document.querySelector('.winning-container').style.display = 'block';
    // show score from previous round
    document.querySelector('#final-tally').innerText = score;
    // new game button to start another game
    document.querySelector('#play-again-button').addEventListener('click', restartGame)
  }
}

function foundCheese1() {
  const cheese1Left = mouse.x + mouse.width >= cheese1.x
  const cheese1Right = mouse.x <= cheese1.x + cheese1.width
  const cheese1Top = mouse.y + mouse.height >= cheese1.y
  const cheese1Bottom = mouse.y <= cheese1.y + cheese1.height

  if (cheese1Left && cheese1Right && cheese1Top && cheese1Bottom) {
        score += 1;
        scoreboard.innerText = score;
        cheese1.inPlay = false;
        // delayed re-rendering of cheese - made as arrow function to keep clean (one line)
        setTimeout(() => cheese1.inPlay = true, 1000);
        cheese1.x = Math.floor(Math.random()*490);
        cheese1.y = Math.floor(Math.random()*390);
      }
}

function foundCheese2() {
  const cheese2Left = mouse.x + mouse.width >= cheese2.x
  const cheese2Right = mouse.x <= cheese2.x + cheese2.width
  const cheese2Top = mouse.y + mouse.height >= cheese2.y
  const cheese2Bottom = mouse.y <= cheese2.y + cheese2.height

  if (cheese2Left && cheese2Right && cheese2Top && cheese2Bottom) {
        score += 1;
        scoreboard.innerText = score;
        cheese2.inPlay = false;
        // delayed re-rendering of cheese
        setTimeout(() => cheese2.inPlay = true, 1000);
        cheese2.x = Math.floor(Math.random()*490);
        cheese2.y = Math.floor(Math.random()*390);
      }
}

function foundCheese3() {
  const cheese3Left = mouse.x + mouse.width >= cheese3.x
  const cheese3Right = mouse.x <= cheese3.x + cheese3.width
  const cheese3Top = mouse.y + mouse.height >= cheese3.y
  const cheese3Bottom = mouse.y <= cheese3.y + cheese3.height

  if (cheese3Left && cheese3Right && cheese3Top && cheese3Bottom) {
        score += 1;
        scoreboard.innerText = score;
        cheese3.inPlay = false;
        // delayed re-rendering of cheese
        setTimeout(() => cheese3.inPlay = true, 1000);
        cheese3.x = Math.floor(Math.random()*490);
        cheese3.y = Math.floor(Math.random()*390);
      }
}

function caughtTrap1() {
  const trap1Left = mouse.x + mouse.width >= trap1.x + 15;
  const trap1Right = mouse.x <= trap1.x + trap1.width - 15;
  const trap1Top = mouse.y + mouse.height >= trap1.y + 20;
  const trap1Bottom = mouse.y <= trap1.y + trap1.height - 30;

  if (trap1Left && trap1Right && trap1Top && trap1Bottom) {
    // display lost game div
    document.querySelector('.losing-container').style.display = 'block';
    // stop timer
    stopTime = true;
    // new game button functionality
    document.querySelector('#play-again-button-3').addEventListener('click', restartGame)
  }
}

function caughtTrap2() {
  const trap2Left = mouse.x + mouse.width >= trap2.x + 15;
  const trap2Right = mouse.x <= trap2.x + trap2.width - 15;
  const trap2Top = mouse.y + mouse.height >= trap2.y + 20;
  const trap2Bottom = mouse.y <= trap2.y + trap2.height - 30;

  if (trap2Left && trap2Right && trap2Top && trap2Bottom) {
    // display lost game div
    document.querySelector('.losing-container').style.display = 'block';
    // stop timer
    stopTime = true;
    // new game button functionality
    document.querySelector('#play-again-button-3').addEventListener('click', restartGame)
  }
}

function movementHandler(e) {
    const speed = 20
    if (e.key === "ArrowLeft") mouse.x -= speed
    if (e.key === "ArrowRight") mouse.x += speed
    if (e.key === "ArrowDown") mouse.y += speed
    if (e.key === "ArrowUp") mouse.y -= speed
}

// DIAGONAL MOVEMENT HANDLER ACTING GLITCHY
// function movementHandler() {
//   const speed = 20
//   if (pressedKeys.ArrowLeft) {
//     mouse.x -= speed
//   }
//   if (pressedKeys.ArrowRight) {
//     mouse.x += speed
//   }
//   if (pressedKeys.ArrowDown) {
//     mouse.y += speed
//   }
//   if (pressedKeys.ArrowUp) {
//     mouse.y -= speed
//   }
// }

function gameLoop() {
    ctx.clearRect(0, 0, canvas.width, canvas.height)
    mouseHole.render()
    mouse.render()
    // random cheese render
    if (cheese1.inPlay) cheese1.render()
    if (cheese2.inPlay) cheese2.render()
    if (cheese3.inPlay) cheese3.render()
    trap1.render()
    trap2.render()
    foundHome()
    detectWall()
    caughtTrap1()
    caughtTrap2()
    foundCheese1()
    foundCheese2()
    foundCheese3()
}