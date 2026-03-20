const simbolos = ["★","◆","▲","●","♣","♥","♦","♠","☀","☂","✿","☯"]

const tabla = document.getElementById("tabla")
const btnLeer = document.getElementById("btnLeer")
const scan = document.getElementById("scan")
const nueva = document.getElementById("nuevaRonda")

const cardReveal = document.getElementById("cardReveal")
const card = document.querySelector(".card")
const cardSymbol = document.getElementById("cardSymbol")

let simboloSecreto=""

function crearTabla(){

tabla.innerHTML=""

simboloSecreto=simbolos[Math.floor(Math.random()*simbolos.length)]

for(let i=1;i<=99;i++){

let simbolo=simbolos[Math.floor(Math.random()*simbolos.length)]

if(i%9===0){
simbolo=simboloSecreto
}

const celda=document.createElement("div")
celda.className="celda"

/* MÁS LENTO */
celda.style.animationDelay = (i * 0.03) + "s"

celda.innerHTML=i+"<br>"+simbolo

tabla.appendChild(celda)

}

scan.style.display="none"
cardReveal.style.display="none"
card.classList.remove("flip")

}

/* 🔮 REVELAR (AHORA SÍ GIRA) */
function revelarCarta(){

cardSymbol.textContent = simboloSecreto
cardReveal.style.display = "flex"

const container = document.querySelector(".card-container")

container.classList.add("pop")

setTimeout(()=>{
container.classList.remove("pop")
card.classList.add("flip")

if(navigator.vibrate){
navigator.vibrate(100)
}

},200)

}

btnLeer.onclick=function(){

scan.style.display="block"

setTimeout(()=>{
scan.style.display="none"
revelarCarta()
},2000)

}

nueva.onclick=crearTabla

cardReveal.addEventListener("click",()=>{
cardReveal.style.display="none"
card.classList.remove("flip")
})

crearTabla()