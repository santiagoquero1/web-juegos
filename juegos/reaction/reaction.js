const area = document.getElementById("area")
const startBtn = document.getElementById("start")
const mensaje = document.getElementById("mensaje")

const timeDisplay = document.getElementById("time")
const recordDisplay = document.getElementById("record")

let startTime
let timeout
let canClick = false

let record = localStorage.getItem("reactionRecord") || 0
recordDisplay.innerHTML = record

startBtn.onclick = startGame

function setState(state, text){
area.className = ""   // 🔥 limpia clases anteriores
area.classList.add(state)
area.innerHTML = text
}

/* START */
function startGame(){

clearTimeout(timeout)
canClick = false

setState("waiting","...")
mensaje.innerHTML = "Espera el verde..."

let delay = Math.random()*3000 + 2000

timeout = setTimeout(()=>{

setState("ready","¡CLICK!")
mensaje.innerHTML = "¡Ahora!"

startTime = Date.now()
canClick = true

}, delay)

}

/* CLICK */
area.onclick = function(){

if(!canClick){

clearTimeout(timeout)

setState("tooSoon","Muy pronto 😅")
mensaje.innerHTML = "Te adelantaste"

return
}

let reaction = Date.now() - startTime

setState("result", reaction + " ms")
timeDisplay.innerHTML = reaction

mensaje.innerHTML = evaluar(reaction)

/* RECORD */
if(record == 0 || reaction < record){
record = reaction
localStorage.setItem("reactionRecord", record)
recordDisplay.innerHTML = record
}

canClick = false

}

/* MENSAJES */
function evaluar(ms){
if(ms < 200) return "⚡ Increíble"
if(ms < 300) return "🔥 Muy rápido"
if(ms < 400) return "👍 Bien"
return "🐢 Mejora eso"
}