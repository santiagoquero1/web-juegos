const canvas = document.getElementById("gameCanvas")
const ctx = canvas.getContext("2d")

const percentText = document.getElementById("percent")
const shapeText = document.getElementById("shapeText")
const resultOverlay = document.getElementById("resultOverlay")
const resultText = document.getElementById("resultText")
const message = document.getElementById("message")

let drawing = false
let points = []
let hue = 0
let score = 0

let shapes = ["CUADRADO","CIRCULO","TRIANGULO","ESTRELLA"]
let currentChallenge = 0
let passed = false

resizeCanvas()
window.addEventListener("resize", resizeCanvas)

function resizeCanvas(){
  canvas.width = canvas.offsetWidth
  canvas.height = canvas.offsetHeight
  drawTarget(shapes[currentChallenge])
}

setShape()

function setShape(){
  shapeText.innerText = "Dibuja un " + shapes[currentChallenge]
  percentText.innerText = "0%"
  message.textContent = ""
  drawTarget(shapes[currentChallenge])
}

/* 🔥 DIBUJO FIGURA */
function drawTarget(shape){
  ctx.clearRect(0,0,canvas.width,canvas.height)

  let size = 160
  let cx = canvas.width/2
  let cy = canvas.height/2

  ctx.strokeStyle = "rgba(0,0,0,0.3)"
  ctx.lineWidth = 3
  ctx.setLineDash([10,10])

  if(shape==="CUADRADO"){
    ctx.beginPath()
    ctx.rect(cx-size/2,cy-size/2,size,size)
    ctx.stroke()
  }

  if(shape==="CIRCULO"){
    ctx.beginPath()
    ctx.arc(cx,cy,size/2,0,Math.PI*2)
    ctx.stroke()
  }

  if(shape==="TRIANGULO"){
    ctx.beginPath()
    ctx.moveTo(cx,cy-size/2)
    ctx.lineTo(cx-size/2,cy+size/2)
    ctx.lineTo(cx+size/2,cy+size/2)
    ctx.closePath()
    ctx.stroke()
  }

  if(shape==="ESTRELLA"){
    drawStar(cx, cy, 5, size/2, size/4)
  }

  ctx.setLineDash([])
}

/* ⭐ ESTRELLA CORREGIDA */
function drawStar(cx, cy, spikes, outer, inner){
  let rot = Math.PI / 2 * 3
  let step = Math.PI / spikes

  ctx.beginPath()

  // 🔥 CLAVE: punto inicial correcto
  ctx.moveTo(cx, cy - outer)

  for(let i = 0; i < spikes; i++){
    let x = cx + Math.cos(rot) * outer
    let y = cy + Math.sin(rot) * outer
    ctx.lineTo(x, y)
    rot += step

    x = cx + Math.cos(rot) * inner
    y = cy + Math.sin(rot) * inner
    ctx.lineTo(x, y)
    rot += step
  }

  ctx.closePath()
  ctx.stroke()
}

/* EVENTOS */
function getPos(e){
  const rect = canvas.getBoundingClientRect()

  if(e.touches){
    return {
      x: e.touches[0].clientX - rect.left,
      y: e.touches[0].clientY - rect.top
    }
  }

  return {
    x: e.clientX - rect.left,
    y: e.clientY - rect.top
  }
}

function start(e){
  drawing = true
  points = []

  const pos = getPos(e)
  ctx.beginPath()
  ctx.moveTo(pos.x,pos.y)
  points.push(pos)
}

function draw(e){
  if(!drawing) return
  if(e.touches) e.preventDefault()

  const pos = getPos(e)

  ctx.strokeStyle = `hsl(${hue},100%,50%)`
  ctx.lineWidth = 4
  ctx.lineCap = "round"

  ctx.lineTo(pos.x,pos.y)
  ctx.stroke()

  hue += 2
  points.push(pos)

  updatePercent()
}

function stop(){
  if(!drawing) return
  drawing = false
  ctx.closePath()
  finalize()
}

/* 📊 TIEMPO REAL */
function updatePercent(){
  if(points.length < 5) return

  let xs = points.map(p=>p.x)
  let ys = points.map(p=>p.y)

  let w = Math.max(...xs)-Math.min(...xs)
  let h = Math.max(...ys)-Math.min(...ys)

  let percent = Math.max(0,100 - Math.abs(w-h)*100/Math.max(w,h))
  percent = Math.floor(percent)

  percentText.innerText = percent + "%"
}

/* 🎯 FINAL */
function finalize (){
  if(points.length < 15){
    percentText.innerText = "0%"
    return
  }

  let xs = points.map(p=>p.x)
  let ys = points.map(p=>p.y)

  let minX = Math.min(...xs)
  let maxX = Math.max(...xs)
  let minY = Math.min(...ys)
  let maxY = Math.max(...ys)

  let w = maxX - minX
  let h = maxY - minY

  /* ===== 1. FORMA BASE ===== */
  let base = 100 - Math.abs(w-h)*100/Math.max(w,h)

  /* ===== 2. CIERRE (MENOS CASTIGO) ===== */
  let start = points[0]
  let end = points[points.length-1]

  let dist = Math.hypot(start.x - end.x, start.y - end.y)

  let cierrePenalty = Math.min(20, dist * 0.5) // 🔥 más suave

  /* ===== 3. IRREGULARIDAD (REDUCIDA) ===== */
  let error = 0

  for(let i=1;i<points.length;i++){
    let dx = points[i].x - points[i-1].x
    let dy = points[i].y - points[i-1].y

    let angle = Math.abs(Math.atan2(dy,dx))
    error += angle
  }

  let irregularidad = Math.min(15, error / points.length * 5)

  /* ===== FINAL ===== */
  let percent = base - cierrePenalty - irregularidad

  percent = Math.max(0, Math.floor(percent))

  percentText.innerText = percent + "%"

  /* 🎯 dificultad balanceada */
  passed = percent >= 90

  if(passed){
    message.textContent = "✅ Bien hecho, puedes avanzar"
    message.className = "ok"
  } else {
    message.textContent = "❌ Intenta hacerlo más preciso"
    message.className = "error"
  }

  score += percent
  document.getElementById("score").innerText = score

  showResult(percent)

  setTimeout(()=>{
    drawTarget(shapes[currentChallenge])
  },200)
}

/* 🎉 OVERLAY */
function showResult(percent){
  resultText.innerText = percent + "%"
  resultOverlay.classList.add("showResult")

  setTimeout(()=>{
    resultOverlay.classList.remove("showResult")
  },1000)
}

/* ➜ SIGUIENTE */
document.getElementById("nextLevel").onclick = function(){
  if(!passed){
    message.textContent = "❌ Debes completar el nivel antes de avanzar"
    message.className = "error"
    return
  }

  currentChallenge++

  if(currentChallenge >= shapes.length){
    message.textContent = "🎉 Juego completado!"
    return
  }

  setShape()
}

/* LISTENERS */
canvas.addEventListener("mousedown",start)
canvas.addEventListener("mousemove",draw)
canvas.addEventListener("mouseup",stop)

canvas.addEventListener("touchstart",start)
canvas.addEventListener("touchmove",draw)
canvas.addEventListener("touchend",stop)