const gameArea = document.getElementById("gameArea");

gameArea.innerHTML = `
<div id="flappyGame">

<div id="bird"></div>

<div id="startScreen">
<h2>Toca para jugar</h2>
</div>

<div id="gameOverScreen">
<h2>Game Over</h2>
<p id="finalScore"></p>
<button onclick="location.reload()">Reintentar</button>
</div>

<div id="shop">
<h2>Tienda</h2>
<div id="shopItems"></div>
<button onclick="closeShop()">Cerrar</button>
</div>

</div>

<div id="hud">
<span id="time">⏱ 0</span>
<span id="coinsText">🪙 0</span>
</div>

<button id="shopBtn">🛒</button>
`;

const game = document.getElementById("flappyGame");
const bird = document.getElementById("bird");

/* ESTADO */
let birdY = 200;
let velocity = 0;

const gravity = 0.5;
const jumpForce = -8;

let started = false;
let gameOver = false;
let safeTime = 0;

let time = 0;
let coins = 0;

/* 💾 DATOS */
let savedCoins = localStorage.getItem("flappyCoins") || 0;
let ownedSkins = JSON.parse(localStorage.getItem("flappySkins")) || ["yellow"];
let selectedSkin = localStorage.getItem("flappySelected") || "yellow";

coins = parseInt(savedCoins);

const timeText = document.getElementById("time");
const coinsText = document.getElementById("coinsText");

coinsText.innerText = "🪙 " + coins;

/* 🎨 SKINS */
const skins = [
{color:"yellow", price:0},
{color:"red", price:50},
{color:"blue", price:100},
{color:"green", price:150},
{color:"purple", price:200}
];

function applySkin(){
bird.style.background = selectedSkin;
}
applySkin();

/* START */
function startGame(){
if(started) return;

started = true;
document.getElementById("startScreen").style.display="none";

setInterval(gameLoop,20);

setTimeout(()=>{
setInterval(createPipe,2500);
},2000);
}

/* SALTO */
function jump(){
if(!started){startGame();return;}
if(gameOver)return;
velocity = jumpForce;
}

/* ✅ INPUT CORREGIDO */
document.addEventListener("click", (e)=>{
if(e.target.closest("button")) return;
jump();
});

document.addEventListener("touchstart", (e)=>{
if(e.target.closest("button")) return;
if(e.target.closest("#shop")) return;
jump();
}, {passive:true});

document.addEventListener("keydown", e=>{
if(e.code==="Space"){e.preventDefault();jump();}
});

/* LOOP */
function gameLoop(){

if(gameOver)return;

safeTime++;

velocity += gravity;
birdY += velocity;

const h = game.clientHeight;

if(birdY < 0) birdY = 0;

if(birdY > h-42){
endGame();
}

bird.style.top = birdY + "px";

timeText.innerText = "⏱ " + Math.floor(time/50);
time++;
}

/* PIPES */
function createPipe(){

if(gameOver)return;

const h = game.clientHeight;

const gapSize = 200;
const minGap = 80;
const maxGap = h - gapSize - 80;

const gap = Math.random() * (maxGap - minGap) + minGap;

const pipe = document.createElement("div");
pipe.className="pipe";

let pos = game.clientWidth;
pipe.style.left = pos + "px";

const top = document.createElement("div");
top.className="pipeTop";
top.style.height = gap + "px";

let bottomHeight = h - gap - gapSize;
if(bottomHeight < 60) bottomHeight = 60;

const bottom = document.createElement("div");
bottom.className="pipeBottom";
bottom.style.height = bottomHeight + "px";

pipe.appendChild(top);
pipe.appendChild(bottom);
game.appendChild(pipe);

createCoin(game.clientWidth + 200, gap + gapSize/2 - 10);

const move = setInterval(()=>{

if(gameOver){
clearInterval(move);
return;
}

pos -= 2;
pipe.style.left = pos + "px";

if(pos < game.clientWidth && pos + 70 > 0){

if(safeTime > 100){

const birdLeft = 80;
const birdRight = birdLeft + 42;

if(birdRight > pos && birdLeft < pos + 70){

const margin = 10;

const birdTop = birdY + margin;
const birdBottom = birdY + 42 - margin;

if(birdTop < gap || birdBottom > gap + gapSize){
endGame();
}
}
}
}

if(pos < -70){
pipe.remove();
clearInterval(move);
}

},20);
}

/* MONEDAS */
function createCoin(x,y){

const coin = document.createElement("div");
coin.className="coin";

coin.style.left=x+"px";
coin.style.top=y+"px";

game.appendChild(coin);

let pos = x;

const move = setInterval(()=>{

if(gameOver){
clearInterval(move);
return;
}

pos -= 2;
coin.style.left = pos+"px";

const birdLeft = 80;
const birdRight = birdLeft + 42;

if(
birdRight > pos &&
birdLeft < pos+20 &&
birdY+42 > y &&
birdY < y+20
){
coins++;
coinsText.innerText = "🪙 " + coins;
coin.remove();
clearInterval(move);
}

if(pos < -30){
coin.remove();
clearInterval(move);
}

},20);
}

/* GAME OVER */
function endGame(){
if(gameOver)return;

gameOver = true;

localStorage.setItem("flappyCoins", coins);

document.getElementById("finalScore").innerText =
`Tiempo: ${Math.floor(time/50)} | 🪙 ${coins}`;

document.getElementById("gameOverScreen").style.display="flex";
}

/* TIENDA */
const shopContainer = document.getElementById("shopItems");

function renderShop(){

shopContainer.innerHTML="";

skins.forEach(skin=>{

const item = document.createElement("div");
item.style.display="flex";
item.style.alignItems="center";
item.style.gap="10px";

const colorBox = document.createElement("div");
colorBox.style.width="30px";
colorBox.style.height="30px";
colorBox.style.borderRadius="50%";
colorBox.style.background=skin.color;

const btn = document.createElement("button");

if(ownedSkins.includes(skin.color)){
btn.innerText = skin.color === selectedSkin ? "Usando" : "Usar";

btn.onclick = ()=>{
selectedSkin = skin.color;
localStorage.setItem("flappySelected", selectedSkin);
applySkin();
renderShop();
};
}else{
btn.innerText = "Comprar ("+skin.price+")";

btn.onclick = ()=>{
if(coins >= skin.price){
coins -= skin.price;
ownedSkins.push(skin.color);

localStorage.setItem("flappyCoins", coins);
localStorage.setItem("flappySkins", JSON.stringify(ownedSkins));

coinsText.innerText = "🪙 " + coins;

renderShop();
}else{
alert("No tienes monedas");
}
};
}

item.appendChild(colorBox);
item.appendChild(btn);
shopContainer.appendChild(item);

});

}

renderShop();

/* SHOP */
document.getElementById("shopBtn").onclick = ()=>{
document.getElementById("shop").style.display="flex";
};

function closeShop(){
document.getElementById("shop").style.display="none";
}