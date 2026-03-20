const board = document.getElementById("gameBoard")

const movesText = document.getElementById("moves")
const levelText = document.getElementById("level")

const newGameBtn = document.getElementById("newGame")
const nextLevelBtn = document.getElementById("nextLevel")

const difficultySelect = document.getElementById("difficulty")

const icons = [
"🍎","🐶","🚗","⚽","🎮","🎧","🍕","🌙",
"⭐","🚀","🎲","🐱","🍩","🧩","🎹","📚",
"🍔","🦊","🏀","🎬","🚴","🐼","🎯","🍉",
"🥑","🌈","🔥","🎁","🍓","🎻","🦄","⚡"
]

let level = 1
let size = 4

let first=null
let second=null
let lock=false

let moves=0
let pairs=0

function getSize(){

const diff=difficultySelect.value

if(diff==="easy") return 4
if(diff==="medium") return 6
if(diff==="hard") return 8

}

function startGame(){

board.innerHTML=""

moves=0
pairs=0

movesText.textContent=moves
levelText.textContent=level

size=getSize()

/* 🔥 GRID RESPONSIVE */
board.style.gridTemplateColumns=`repeat(${size}, 1fr)`

let totalCards=size*size
let totalPairs=totalCards/2

let selected=icons.slice(0,totalPairs)

let deck=[...selected,...selected]

deck.sort(()=>Math.random()-0.5)

deck.forEach(icon=>{

const card=document.createElement("div")

card.className="card"

card.innerHTML=`
<div class="card-face card-back"></div>
<div class="card-face card-front">${icon}</div>
`

card.dataset.icon=icon

card.onclick=()=>flip(card)

board.appendChild(card)

})

nextLevelBtn.style.display="none"

}

function flip(card){

if(lock) return
if(card.classList.contains("flip")) return

card.classList.add("flip")

if(!first){
first=card
return
}

second=card

moves++
movesText.textContent=moves

check()

}

function check(){

lock=true

if(first.dataset.icon===second.dataset.icon){

pairs++

/* 🔥 EFECTO MATCH */
first.classList.add("match")
second.classList.add("match")

setTimeout(()=>{
first.classList.remove("match")
second.classList.remove("match")
},500)

reset()

if(pairs===((size*size)/2)){
nextLevelBtn.style.display="inline-block"
}

}else{

setTimeout(()=>{
first.classList.remove("flip")
second.classList.remove("flip")
reset()
},800)

}

}

function reset(){
[first,second,lock]=[null,null,false]
}

/* BOTONES */

newGameBtn.onclick=()=>{
level=1
startGame()
}

nextLevelBtn.onclick=()=>{
level++
startGame()
}

difficultySelect.onchange=()=>{
level=1
startGame()
}

startGame()