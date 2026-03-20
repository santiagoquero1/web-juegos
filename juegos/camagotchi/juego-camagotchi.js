const game=document.getElementById("game");
const player=document.getElementById("player");
const scoreEl=document.getElementById("score");
const exitBtn=document.getElementById("exitBtn");

let score=0;
let gameOver=false;

/* ---------- MOVIMIENTO ---------- */
function move(x){
let rect=game.getBoundingClientRect();
let pos=x-rect.left;

/* límites */
if(pos<30) pos=30;
if(pos>rect.width-30) pos=rect.width-30;

player.style.left=pos+"px";
}

/* MOUSE */
document.addEventListener("mousemove",e=>{
move(e.clientX);
});

/* TOUCH (FIX PRO) */
document.addEventListener("touchmove",e=>{
e.preventDefault();
move(e.touches[0].clientX);
},{passive:false});

/* ---------- COMIDA ---------- */
const foods=["🍔","🍕","🍟","🍩","🍣"];

function spawnFood(){

if(gameOver)return;

let f=document.createElement("div");
f.className="food";
f.innerText=foods[Math.floor(Math.random()*foods.length)];

let x=Math.random()*90;
f.style.left=x+"%";
f.style.top="0px";

game.appendChild(f);

let top=0;
let speed=2+Math.random()*3;

let fall=setInterval(()=>{

top+=speed;
f.style.top=top+"px";

/* COLISION MEJORADA */
let fr=f.getBoundingClientRect();
let pr=player.getBoundingClientRect();

if(
fr.bottom>=pr.top &&
fr.left<pr.right &&
fr.right>pr.left
){
score++;
scoreEl.innerText=score;

player.style.transform="translateX(-50%) scale(1.2)";
setTimeout(()=>{
player.style.transform="translateX(-50%) scale(1)";
},100);

f.remove();
clearInterval(fall);
}

/* eliminar si sale */
if(top>game.clientHeight){
f.remove();
clearInterval(fall);
}

},16);
}

/* LOOP SPAWN */
let spawnLoop=setInterval(spawnFood,800);

/* ---------- TERMINAR ---------- */
function terminarJuego(){

gameOver=true;
clearInterval(spawnLoop);

/* RECOMPENSA */
let felicidad = score * 2;
let monedas = score;

/* GUARDAR */
localStorage.setItem("felicidadBonus", felicidad);
localStorage.setItem("monedasBonus", monedas);

/* MENSAJE */
setTimeout(()=>{
alert(`Ganaste +${felicidad} 😊 y +${monedas} 🪙`);
window.location.href="camagotchi.html";
},200);
}

/* BOTÓN SALIR (FUNCIONA EN CELULAR) */
exitBtn.addEventListener("click",terminarJuego);

/* AUTO FIN (30s) */
setTimeout(()=>{
terminarJuego();
},30000);