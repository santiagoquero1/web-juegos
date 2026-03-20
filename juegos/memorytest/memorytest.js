let nivel = 1
let numero = ""
let tiempo = 2000
let modoExtremo = false

const display = document.getElementById("display")
const respuesta = document.getElementById("respuesta")
const mensaje = document.getElementById("mensaje")
const nivelTexto = document.getElementById("nivel")
const btn = document.getElementById("btn")
const teclado = document.getElementById("teclado")

/* RECORD */
let record = localStorage.getItem("recordMemoria") || 1

/* TIMER */
const timer = document.createElement("div")
timer.className = "timer"

const timerBar = document.createElement("div")
timerBar.className = "timer-bar"

timer.appendChild(timerBar)
display.parentNode.insertBefore(timer, display)

/* TECLADO NUMERICO */
const teclas = ["1","2","3","4","5","6","7","8","9","0","←","OK"]

teclas.forEach(t=>{
let key = document.createElement("div")
key.className="key"
key.textContent=t

key.onclick=()=>{
if(respuesta.disabled) return

if(t==="←"){
respuesta.value = respuesta.value.slice(0,-1)
}
else if(t==="OK"){
comprobar()
}
else{
respuesta.value += t
}
}

teclado.appendChild(key)
})

function animarBarra(duracion){
timerBar.style.transition="none"
timerBar.style.width="100%"

setTimeout(()=>{
timerBar.style.transition=`width ${duracion}ms linear`
timerBar.style.width="0%"
},50)
}

function generarNumero(){

numero=""

/* dificultad */
let largo = modoExtremo ? nivel+3 : nivel+2

for(let i=0;i<largo;i++){
numero += Math.floor(Math.random()*10)
}

display.innerHTML = numero
respuesta.value=""
mensaje.innerHTML=""
mensaje.className=""

respuesta.disabled=true
btn.disabled=true

animarBarra(tiempo)

setTimeout(()=>{

display.innerHTML="???"
respuesta.disabled=false
btn.disabled=false

},tiempo)

}

btn.onclick = comprobar

function comprobar(){

if(respuesta.value === numero){

mensaje.innerHTML="✅ Correcto"
mensaje.className="correcto"

nivel++
nivelTexto.innerHTML="Nivel "+nivel

/* RECORD */
if(nivel > record){
record = nivel
localStorage.setItem("recordMemoria", record)
}

/* dificultad */
if(modoExtremo){
tiempo -= 180
}else{
tiempo -= 120
}

if(tiempo < 500) tiempo = 500

setTimeout(generarNumero,800)

}else{

mensaje.innerHTML=`💀 Perdiste en nivel ${nivel} | Récord: ${record}`
mensaje.className="error"

display.innerHTML="Fin del juego"
timerBar.style.width="0%"

btn.innerHTML="Jugar otra vez"
btn.onclick = reiniciar

}

}

/* REINICIO */
function reiniciar(){

nivel=1
tiempo = modoExtremo ? 1500 : 2000

nivelTexto.innerHTML="Nivel 1"
btn.innerHTML="Comprobar"
btn.onclick = comprobar

generarNumero()

}

/* ACTIVAR MODO EXTREMO (doble click titulo) */
document.querySelector("h1").ondblclick=()=>{
modoExtremo = !modoExtremo

document.body.classList.toggle("extremo")

reiniciar()
}

generarNumero()