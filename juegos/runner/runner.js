const gameArea = document.getElementById("gameArea");

gameArea.innerHTML = `
<div id="runnerGame">

<div class="background"></div>

<div id="player"></div>
<div id="obstacle"></div>

<div id="startScreen">
<h2>RUNNER</h2>
<p>Presiona ESPACIO o CLICK para empezar</p>
</div>

</div>

<div id="hud">
<span id="time">Tiempo: 0</span>
<span id="record">Record: 0</span>
</div>
`;

const player = document.getElementById("player");
const obstacle = document.getElementById("obstacle");
const startScreen = document.getElementById("startScreen");

const timeText = document.getElementById("time");
const recordText = document.getElementById("record");

let jumping = false;
let gameStarted = false;

let playerY = 0;
let velocity = 0;
let gravity = 0.6;

let obstacleX = 800;

let time = 0;
let speed = 6;

let record = localStorage.getItem("runnerRecord") || 0;

recordText.innerText = "Record: " + record;

function startGame(){

if(gameStarted) return;

gameStarted = true;

startScreen.style.display="none";

setInterval(()=>{
time++
timeText.innerText = "Tiempo: " + time

speed = 6 + time * 0.3

if(time > record){

record = time
recordText.innerText = "Record: " + record
localStorage.setItem("runnerRecord",record)

}

},1000)

gameLoop()

}

function jump(){

if(playerY === 0){

velocity = 12
jumping = true

}

}

function randomObstacle(){

let height = Math.random()*40 + 30
obstacle.style.height = height+"px"

}

randomObstacle()

function gameLoop(){

if(!gameStarted) return

velocity -= gravity
playerY += velocity

if(playerY < 0){

playerY = 0
velocity = 0
jumping = false

}

player.style.bottom = playerY + "px"

obstacleX -= speed
obstacle.style.left = obstacleX+"px"

let playerHeight = playerY
let obstacleHeight = obstacle.offsetHeight

if(obstacleX < 120 && obstacleX > 60 && playerHeight < obstacleHeight){

gameOver()
return

}

if(obstacleX < -40){

obstacleX = 800
randomObstacle()

}

requestAnimationFrame(gameLoop)

}

function gameOver(){

alert("Game Over\nTiempo: "+time)

location.reload()

}

document.addEventListener("keydown", e=>{

if(e.code==="Space"){

e.preventDefault()

if(!gameStarted){
startGame()
}else{
jump()
}

}

})

document.addEventListener("click", ()=>{

if(!gameStarted){
startGame()
}else{
jump()
}

})
