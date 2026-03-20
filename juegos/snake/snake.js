const canvas = document.getElementById("gameCanvas");
const ctx = canvas.getContext("2d");

const scoreEl = document.getElementById("score");
const recordEl = document.getElementById("record");

const settingsBtn = document.getElementById("settingsBtn");
const settingsPanel = document.getElementById("settingsPanel");
const startScreen = document.getElementById("startScreen");
const soundBtn = document.getElementById("soundBtn");

const colorPicker = document.getElementById("colorPicker");
const obstaculosCheck = document.getElementById("obstaculos");
const teleportCheck = document.getElementById("teleport");
const speedControl = document.getElementById("speedControl");

/* 🔥 CONTROL REAL DEL MODO JUEGO */

/* SONIDOS */
const eatSound = new Audio("sonidos/comida.wav");
const startSound = new Audio("sonidos/inicio.wav");
const moveSound = new Audio("sonidos/movimiento.wav");
const loseSound = new Audio("sonidos/perdiste.wav");

moveSound.volume = 0.3;

let soundEnabled = true;

function playSound(s){
if(!soundEnabled) return;
s.currentTime = 0;
s.play();
}

soundBtn.onclick = () => {
soundEnabled = !soundEnabled;
soundBtn.textContent = soundEnabled ? "🔊" : "🔇";
};

const grid = 25;
const size = 400;

let snake, dx, dy, food, obstacles;
let score = 0;
let speed = 6;
let lastTime = 0;
let gameStarted = false;

let record = localStorage.getItem("snakeRecord") || 0;
recordEl.textContent = record;

/* PANEL */
settingsBtn.onclick = () => {
settingsPanel.style.display =
settingsPanel.style.display === "block" ? "none" : "block";
};

/* INIT */
function init(){
snake = [{x:200,y:200}];
dx = grid;
dy = 0;
score = 0;
speed = speedControl.value;
scoreEl.textContent = score;

spawnFood();
obstacles = [];

if(obstaculosCheck.checked){
for(let i=0;i<5;i++){
obstacles.push({
x: Math.floor(Math.random()*16)*grid,
y: Math.floor(Math.random()*16)*grid
});
}
}
}

/* FOOD */
function spawnFood(){
food = {
x: Math.floor(Math.random()*16)*grid,
y: Math.floor(Math.random()*16)*grid
};
}

/* LOOP */
function loop(time){
requestAnimationFrame(loop);
draw();

if(!gameStarted) return;

if(time - lastTime > 1000/speed){
update();
lastTime = time;
}
}

/* UPDATE */
function update(){

let head = {x: snake[0].x + dx, y: snake[0].y + dy};

/* TELEPORT */
if(teleportCheck.checked){
if(head.x < 0) head.x = size-grid;
if(head.x >= size) head.x = 0;
if(head.y < 0) head.y = size-grid;
if(head.y >= size) head.y = 0;
}else{
if(head.x < 0 || head.x >= size || head.y < 0 || head.y >= size){
return reset();
}
}

snake.unshift(head);

/* COMER */
if(head.x === food.x && head.y === food.y){
score++;
scoreEl.textContent = score;
playSound(eatSound);

if(score > record){
record = score;
recordEl.textContent = record;
localStorage.setItem("snakeRecord", record);
}

spawnFood();
}else{
snake.pop();
}

/* COLISION */
if(snake.slice(1).some(p=>p.x===head.x && p.y===head.y)) reset();
if(obstacles.some(o=>o.x===head.x && o.y===head.y)) reset();

}

/* DRAW */
function draw(){

ctx.clearRect(0,0,size,size);

/* fondo */
for(let x=0;x<size;x+=grid){
for(let y=0;y<size;y+=grid){
ctx.fillStyle = (x+y)/grid % 2 === 0 ? "#a9d86e" : "#9fd25f";
ctx.fillRect(x,y,grid,grid);
}
}

/* snake */
snake.forEach((p,i)=>{
ctx.fillStyle = colorPicker.value;

ctx.beginPath();
ctx.roundRect(p.x,p.y,grid,grid,8);
ctx.fill();

if(i === 0){
ctx.fillStyle="white";
ctx.beginPath();
ctx.arc(p.x+8,p.y+10,2,0,Math.PI*2);
ctx.arc(p.x+16,p.y+10,2,0,Math.PI*2);
ctx.fill();
}
});

/* comida */
let pulse = Math.sin(Date.now() * 0.01) * 2;
let floatY = Math.sin(Date.now() * 0.005) * 2;

ctx.fillStyle="#ff3b30";
ctx.beginPath();
ctx.arc(food.x+12, food.y+12 + floatY, 8 + pulse, 0, Math.PI*2);
ctx.fill();

ctx.fillStyle="rgba(255,255,255,0.4)";
ctx.beginPath();
ctx.arc(food.x+9, food.y+9 + floatY, 3, 0, Math.PI*2);
ctx.fill();

ctx.strokeStyle="#5a3e1b";
ctx.lineWidth = 2;
ctx.beginPath();
ctx.moveTo(food.x+12, food.y+4 + floatY);
ctx.lineTo(food.x+12, food.y-4 + floatY);
ctx.stroke();

/* obstáculos */
ctx.fillStyle="#555";
obstacles.forEach(o=>{
ctx.fillRect(o.x,o.y,grid,grid);
});
}

/* START */
function start(){
if(gameStarted) return;
gameStarted = true;
startScreen.style.display="none";
playSound(startSound);
init();
}

/* RESET */
function reset(){
playSound(loseSound);
gameStarted = false;
startScreen.style.display="block";
}

/* CONTROLES */
document.addEventListener("keydown", e=>{

// evita scroll con espacio
if(e.code === "Space") e.preventDefault();

// solo funciona si el juego está visible
const juegoVisible = document.getElementById("modo-juego").style.display === "flex";
if(!juegoVisible) return;

if(e.code==="Space") start();

if(e.key==="ArrowUp" && dy===0){
dx=0;dy=-grid;
playSound(moveSound);
}
if(e.key==="ArrowDown" && dy===0){
dx=0;dy=grid;
playSound(moveSound);
}
if(e.key==="ArrowLeft" && dx===0){
dx=-grid;dy=0;
playSound(moveSound);
}
if(e.key==="ArrowRight" && dx===0){
dx=grid;dy=0;
playSound(moveSound);
}

});

/* MOBILE */
let sx, sy;

canvas.addEventListener("touchstart", e=>{
e.preventDefault();

if(!gameStarted) start();

sx = e.touches[0].clientX;
sy = e.touches[0].clientY;

}, { passive:false });

canvas.addEventListener("touchend", e=>{
let dxT = e.changedTouches[0].clientX - sx;
let dyT = e.changedTouches[0].clientY - sy;

if(Math.abs(dxT) > Math.abs(dyT)){
if(dxT>0 && dx===0){
dx=grid;dy=0;
playSound(moveSound);
}
else if(dxT<0 && dx===0){
dx=-grid;dy=0;
playSound(moveSound);
}
}else{
if(dyT>0 && dy===0){
dx=0;dy=grid;
playSound(moveSound);
}
else if(dyT<0 && dy===0){
dx=0;dy=-grid;
playSound(moveSound);
}
}
});

/* CLICK START */
canvas.addEventListener("click", start);

/* LOOP */
requestAnimationFrame(loop);

/* ✅ MODO INMERSIVO CORRECTO */
window.activarModoJuego = function(){
  document.body.style.overflow = "hidden";
  gameStarted = false;
  startScreen.style.display = "block";
};

const salirBtn = document.getElementById("salirBtn");

salirBtn.onclick = () => {

  // cerrar modo juego
  document.getElementById("modo-juego").style.display = "none";

  // volver a scroll normal
  document.body.style.overflow = "auto";

  // reiniciar estado
  gameStarted = false;
  startScreen.style.display = "block";
};