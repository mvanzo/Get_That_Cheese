// DOM SELECTORS - EVENT LISTENERS
const canvas = document.querySelector("#canvas")
document.addEventListener("keydown", movementHandler)
const scoreboard = document.querySelector("#scoreboard")

// set up the renderer
const ctx = canvas.getContext("2d")
// set canvas size to be the same as window
// WHAT IS THIS -- after the window computes -- set canvas to be actual size of space it takes up
canvas.setAttribute("height", getComputedStyle(canvas)["height"])
canvas.setAttribute("width", getComputedStyle(canvas)["width"])

let gameLoopInterval = setInterval(gameLoop, 60)

let score = 0;

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
        this.inPlay = inPlay
    }
    render() {
        ctx.fillStyle = this.color
        ctx.fillRect(this.x, this.y, this.width, this.height)
    }
}

const cheese1 = new Cheese(250, 250, 30, 30, "red", true)
const cheese2 = new Cheese(150, 50, 30, 30, "blue", true)
const cheese3 = new Cheese(50, 150, 30, 30, "green", true)

// collision detection - borders
function detectWall() {
    const leftWall = mouse.x <= 0
    const rightWall = mouse.x + mouse.width >= canvas.width
    const topWall = mouse.y <= 0
    const bottomWall = mouse.y + mouse.height >= canvas.height

    if (leftWall) {
        console.log("left wall found")
    }
    if (rightWall) {
        console.log("right wall found")
    }
    if (topWall) {
        console.log("top wall found")
    }
    if (bottomWall) {
        console.log("bottom wall found")
    }
}

function foundCheese1() {
    const cheese1Left = mouse.x + mouse.width >= cheese1.x
    const cheese1Right = mouse.x <= cheese1.x + cheese1.width
    const cheese1Top = mouse.y + mouse.height >= cheese1.y
    const cheese1Bottom = mouse.y <= cheese1.y + cheese1.height

    if (cheese1Left && cheese1Right && cheese1Top && cheese1Bottom) {
        if (cheese1.inPlay == true) {
          console.log("found the first cheese");
          score += 1;
          scoreboard.innerText = score
          console.log(score);
          cheese1.inPlay = false;
        }
      }
}

function foundCheese2() {
    const cheese2Left = mouse.x + mouse.width >= cheese2.x
    const cheese2Right = mouse.x <= cheese2.x + cheese2.width
    const cheese2Top = mouse.y + mouse.height >= cheese2.y
    const cheese2Bottom = mouse.y <= cheese2.y + cheese2.height

    if (cheese2Left && cheese2Right && cheese2Top && cheese2Bottom) {
        if (cheese2.inPlay == true) {
          console.log('found the second cheese');
          score +=1;
          scoreboard.innerText = score;
          console.log(score);
          cheese2.inPlay = false;
        }
    }
}

function foundCheese3() {
    const cheese3Left = mouse.x + mouse.width >= cheese3.x
    const cheese3Right = mouse.x <= cheese3.x + cheese3.width
    const cheese3Top = mouse.y + mouse.height >= cheese3.y
    const cheese3Bottom = mouse.y <= cheese3.y + cheese3.height

    if (cheese3Left && cheese3Right && cheese3Top && cheese3Bottom) {
        if (cheese3.inPlay == true) {
          console.log('found the third cheese');
          score +=1;
          scoreboard.innerText = score;
          console.log(score);
          cheese3.inPlay = false;
        }
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
    if (cheese1.inPlay) cheese1.render()
    if (cheese2.inPlay) cheese2.render()
    if (cheese3.inPlay) cheese3.render()
    detectWall()
    foundCheese1()
    foundCheese2()
    foundCheese3()
}