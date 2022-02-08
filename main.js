// DOM SELECTORS - EVENT LISTENERS
const canvas = document.querySelector("#canvas")
document.addEventListener("keydown", movementHandler)
const scoreboard = document.querySelector("#scoreboard")
const countdown = document.querySelector('#countdown')
const newGameButton = document.querySelector('#new-game-button')
const playAgainButton = document.querySelector('#play-again-button')

// set up the renderer
const ctx = canvas.getContext("2d")
// set canvas size to be the same as window
// WHAT IS THIS -- after the window computes -- set canvas to be actual size of space it takes up
canvas.setAttribute("height", getComputedStyle(canvas)["height"])
canvas.setAttribute("width", getComputedStyle(canvas)["width"])

// variable state
let newGameClock = 5
  countdown.innerText = newGameClock
let score = 0;

let gameLoopInterval = setInterval(gameLoop, 60)


//start game function with new game button
newGameButton.addEventListener('click', startGame)

function startGame() {
  // hide display for home container
  document.querySelector('.home-container').style.display = 'none';
  //countdown starts
  let gameTimer = setInterval(function() {
    if (newGameClock == 0) {
      console.log('end game');
      //end game function when time = 0
      timeIsUp();
      // clear interval of game timer function--no longer counting
      clearInterval(gameTimer);
    } else {
    newGameClock -= 1;
    countdown.innerText = newGameClock;
    }
  }, 1000)
}

function timeIsUp() {
  // display postgame container
  document.querySelector('.postgame-container').style.display = 'block';
  // show score from previous round
  document.querySelector('#final-tally').innerText = score
  // new game button to start another game -- restart game loop function??
}

playAgainButton.addEventListener('click', restartGame)

function restartGame() {
  // clear postgame-container from screen
  document.querySelector('.postgame-container').style.display = 'none';
  // reset clock to full time and update the DOM for reload page
  newGameClock = 5;
  countdown.innerText = 5;
  // reset score to 0 and update the DOM for reload page
  score = 0;
  scoreboard.innerText = 0;
  // move mouse back to start point
  mouse.x = 10;
  mouse.y = 10;
  // re-render cheese
  cheese1.inPlay = true;
  cheese2.inPlay = true;
  cheese3.inPlay = true;
  // run startGame function
  startGame();
}

const mouse = {
    x: 10,
    y: 10,
    width: 20,
    height: 20,
    color: "hotpink",
    alive: true,
    render: () => {
        ctx.fillStyle = mouse.color
        ctx.fillRect(mouse.x, mouse.y, mouse.width, mouse.height)
    },
}

class Cheese {
    constructor(x, y, width, height, color, inPlay) {
        this.x = x
        this.y = y
        this.width = width
        this.height = height
        this.color = color
    }
    render() {
        ctx.fillStyle = this.color
        ctx.fillRect(this.x, this.y, this.width, this.height)
    }
}

// cheese object initiation with random location
const cheese1 = new Cheese(Math.floor(Math.random()* 300), Math.floor(Math.random()* 300), 20, 20, 'red')
const cheese2 = new Cheese(Math.floor(Math.random()* 300), Math.floor(Math.random()* 300), 20, 20, 'blue')
const cheese3 = new Cheese(Math.floor(Math.random()* 300), Math.floor(Math.random()* 300), 20, 20, 'green')

// collision detection - borders
function detectWall() {
    const leftWall = mouse.x <= 0
    const rightWall = mouse.x + mouse.width >= canvas.width
    const topWall = mouse.y <= 0
    const bottomWall = mouse.y + mouse.height >= canvas.height

    if (leftWall) {
        console.log("left wall found")
        mouse.x = 0
    }
    if (rightWall) {
        console.log("right wall found")
        mouse.x = canvas.width - mouse.width
    }
    if (topWall) {
        console.log("top wall found")
        mouse.y = 0
    }
    if (bottomWall) {
        console.log("bottom wall found")
        mouse.y = canvas.height - mouse.height
    }
}

//
//
// attempting random cheese find
function foundCheese1() {
  const cheese1Left = mouse.x + mouse.width >= cheese1.x
  const cheese1Right = mouse.x <= cheese1.x + cheese1.width
  const cheese1Top = mouse.y + mouse.height >= cheese1.y
  const cheese1Bottom = mouse.y <= cheese1.y + cheese1.height

  if (cheese1Left && cheese1Right && cheese1Top && cheese1Bottom) {
        console.log("found the first random cheese");
        score += 1;
        scoreboard.innerText = score;
        console.log(score);
        cheese1.x = Math.floor(Math.random()*200);
        cheese1.y = Math.floor(Math.random()*200);
      }
}

function foundCheese2() {
  const cheese2Left = mouse.x + mouse.width >= cheese2.x
  const cheese2Right = mouse.x <= cheese2.x + cheese2.width
  const cheese2Top = mouse.y + mouse.height >= cheese2.y
  const cheese2Bottom = mouse.y <= cheese2.y + cheese2.height

  if (cheese2Left && cheese2Right && cheese2Top && cheese2Bottom) {
        console.log("found the second random cheese");
        score += 1;
        scoreboard.innerText = score;
        console.log(score);
        cheese2.x = Math.floor(Math.random()*200);
        cheese2.y = Math.floor(Math.random()*200);
      }
}

function foundCheese3() {
  const cheese3Left = mouse.x + mouse.width >= cheese3.x
  const cheese3Right = mouse.x <= cheese3.x + cheese3.width
  const cheese3Top = mouse.y + mouse.height >= cheese3.y
  const cheese3Bottom = mouse.y <= cheese3.y + cheese3.height

  if (cheese3Left && cheese3Right && cheese3Top && cheese3Bottom) {
        console.log("found the third random cheese");
        score += 1;
        scoreboard.innerText = score;
        console.log(score);
        cheese3.x = Math.floor(Math.random()*200);
        cheese3.y = Math.floor(Math.random()*200);
      }
}

function movementHandler(e) {
    const speed = 20
    if (e.key === "ArrowLeft") mouse.x -= speed
    if (e.key === "ArrowRight") mouse.x += speed
    if (e.key === "ArrowDown") mouse.y += speed
    if (e.key === "ArrowUp") mouse.y -= speed
}

function gameLoop() {
    ctx.clearRect(0, 0, canvas.width, canvas.height)
    mouse.render()
    // if (cheese1.inPlay) cheese1.render()
    // if (cheese2.inPlay) cheese2.render()
    // if (cheese3.inPlay) cheese3.render()
    // random cheese render
    cheese1.render()
    cheese2.render()
    cheese3.render()
    detectWall()
    // foundCheese1()
    // foundCheese2()
    // foundCheese3()
    foundCheese1()
    foundCheese2()
    foundCheese3()
}



//clear home screen with start game button
