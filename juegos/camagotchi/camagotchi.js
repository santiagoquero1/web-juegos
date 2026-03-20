let hambre=100, felicidad=100, higiene=100, monedas=0;
let durmiendo=false;

const pet=document.getElementById("pet");
const petArea=document.getElementById("pet-area");

/* 🔊 SONIDO */
const sonidoComer = new Audio("sonidos/comer.mp3");

/* 🎁 BONUS MINIJUEGO */
let fBonus = localStorage.getItem("felicidadBonus");
let mBonus = localStorage.getItem("monedasBonus");

if(fBonus){
felicidad += parseInt(fBonus);
if(felicidad>100) felicidad=100;
localStorage.removeItem("felicidadBonus");
}

if(mBonus){
monedas += parseInt(mBonus);
localStorage.removeItem("monedasBonus");
}

/* UPDATE */
function update(){
document.getElementById("coins").innerText=monedas;
setBar("hambre",hambre);
setBar("felicidad",felicidad);
setBar("higiene",higiene);
}

function setBar(id,val){
val=Math.max(0,Math.min(100,val));
let el=document.getElementById(id);
el.style.width=val+"%";
el.classList.remove("warn","danger");

if(val<25) el.classList.add("danger");
else if(val<50) el.classList.add("warn");
}

/* 🎬 ANIMACION COMER */
function animComer(){
let img = document.getElementById("petImg");
img.style.transform="scale(1.25) rotate(5deg)";
setTimeout(()=>{
img.style.transform="scale(1) rotate(0deg)";
},150);
}

/* DRAG */
let drag=null;

function startDrag(icon,type,e){
e.preventDefault();

if(drag) drag.remove();

drag=document.createElement("div");
drag.className="dragging";
drag.innerText=icon;
drag.dataset.type=type;

document.body.appendChild(drag);
moveDrag(e);
}

function moveDrag(e){
if(!drag)return;

let x=e.touches?e.touches[0].clientX:e.clientX;
let y=e.touches?e.touches[0].clientY:e.clientY;

drag.style.left=x+"px";
drag.style.top=y+"px";

let rect=petArea.getBoundingClientRect();

if(x>rect.left && x<rect.right && y>rect.top && y<rect.bottom){

if(drag.dataset.type==="food"){
hambre+=1;
felicidad+=0.5;
monedas+=1;

sonidoComer.currentTime=0;
sonidoComer.play();

animComer();
}

if(drag.dataset.type==="soap"){
higiene+=0.8;
crearEspuma(x,y);
}

if(drag.dataset.type==="water"){
higiene+=1;
crearGota(x,y);
}

update();
}
}

function endDrag(){
if(drag){
drag.remove();
drag=null;
}
}

/* BIND */
function bindDrag(el,type){
el.addEventListener("mousedown",(e)=>startDrag(el.innerText,type,e));
el.addEventListener("touchstart",(e)=>startDrag(el.innerText,type,e));
}

document.querySelectorAll(".food").forEach(f=>bindDrag(f,"food"));
bindDrag(document.getElementById("soap"),"soap");
bindDrag(document.getElementById("shower"),"water");

/* EVENTOS */
document.addEventListener("mousemove",moveDrag);
document.addEventListener("touchmove",moveDrag,{passive:false});

document.addEventListener("mouseup",endDrag);
document.addEventListener("touchend",endDrag);

/* EFECTOS */
function crearEspuma(x,y){
let b=document.createElement("div");
b.style.position="fixed";
b.style.left=x+"px";
b.style.top=y+"px";
b.style.width="10px";
b.style.height="10px";
b.style.background="white";
b.style.borderRadius="50%";
document.body.appendChild(b);
setTimeout(()=>b.remove(),400);
}

function crearGota(x,y){
let g=document.createElement("div");
g.style.position="fixed";
g.style.left=x+"px";
g.style.top=y+"px";
g.style.width="4px";
g.style.height="10px";
g.style.background="#4fc3f7";
g.style.borderRadius="3px";
document.body.appendChild(g);

let fall=0;
let interval=setInterval(()=>{
fall+=5;
g.style.top=(y+fall)+"px";
if(fall>40){
clearInterval(interval);
g.remove();
}
},16);
}

/* DORMIR */
document.getElementById("sleep").onclick=()=>{
durmiendo=!durmiendo;
};

/* LOOP */
setInterval(()=>{
if(!durmiendo){
hambre-=1;
felicidad-=1;
higiene-=1;
}else{
felicidad+=0.5;
}
update();
},3000);

/* TIENDA */
document.getElementById("shopBtn").onclick=()=>{
document.getElementById("shop").style.display="block";
};

function cerrarTienda(){
document.getElementById("shop").style.display="none";
}

/* MINIJUEGO */
document.getElementById("play").onclick=()=>{
window.location.href="juego-camagotchi.html";
};

/* INIT */
update();