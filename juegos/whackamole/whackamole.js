const grid = document.getElementById("grid")
const scoreEl = document.getElementById("score")
const timeEl = document.getElementById("time")
const startBtn = document.getElementById("start")
const hammer = document.getElementById("hammer")

let score = 0
let time = 30
let gameInterval = null
let moleInterval = null
let gameActive = false

let moles = []

/* GRID */
function createGrid(){
  grid.innerHTML = ""
  moles = []

  for(let i=0;i<9;i++){
    let hole = document.createElement("div")
    hole.className = "hole"

    let mole = document.createElement("div")
mole.className = "mole"
mole.textContent = "🐹"  // aquí ponemos el topo emoji

    hole.appendChild(mole)
    grid.appendChild(hole)

    moles.push(mole)

    const hit = () => {
      if(!gameActive) return

      if(mole.classList.contains("show")){
        score++
        scoreEl.textContent = score

        mole.classList.add("hit")
        setTimeout(()=>mole.classList.remove("hit"),150)

        mole.classList.remove("show")

        // vibración móvil
        if(navigator.vibrate) navigator.vibrate(30)
      }
    }

    hole.addEventListener("click", hit)
    hole.addEventListener("touchstart", hit)
  }
}

createGrid()

/* START */
startBtn.addEventListener("click", startGame)

function startGame(){
  score = 0
  time = 30
  gameActive = true

  scoreEl.textContent = score
  timeEl.textContent = time

  clearInterval(gameInterval)
  clearInterval(moleInterval)

  gameInterval = setInterval(()=>{
    time--
    timeEl.textContent = time
    if(time <= 0) endGame()
  },1000)

  moleInterval = setInterval(()=>{
    moles.forEach(m=>m.classList.remove("show"))
    let random = Math.floor(Math.random()*moles.length)
    moles[random].classList.add("show")
  },600)
}

/* END */
function endGame(){
  gameActive = false

  clearInterval(gameInterval)
  clearInterval(moleInterval)

  moles.forEach(m=>m.classList.remove("show"))

  alert("⏱ Tiempo terminado\nPuntaje: " + score)
}

/* 🔨 SEGUIR CURSOR / DEDO */
function moveHammer(x,y){
  hammer.style.left = x + "px"
  hammer.style.top = y + "px"
}

document.addEventListener("mousemove", e=>{
  moveHammer(e.clientX, e.clientY)
})

document.addEventListener("touchmove", e=>{
  moveHammer(e.touches[0].clientX, e.touches[0].clientY)
})

/* ANIMACIÓN GOLPE */
function hammerHit(){
  hammer.classList.add("hit")
  setTimeout(()=>hammer.classList.remove("hit"),100)
}

document.addEventListener("click", hammerHit)
document.addEventListener("touchstart", hammerHit)