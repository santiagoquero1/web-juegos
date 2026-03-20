const isMobile = window.innerWidth <= 768
const board = document.getElementById("sudokuBoard")
const message = document.getElementById("message")
const sizeSelect = document.getElementById("size")
const difficultySelect = document.getElementById("difficulty")
const timerDisplay = document.getElementById("timer")
const hintsDisplay = document.getElementById("hintsLeft")
const mobilePad = document.getElementById("mobilePad")

let currentSolution=[]
let currentSize=9
let hintsLeft=3

let timer=0
let timerInterval

let selectedCell=null

/* =============================
PUZZLES
============================= */

const puzzles={

4:{
easy:[
{
puzzle:[
[1,0,0,4],
[0,0,2,0],
[0,1,0,0],
[3,0,0,2]
],
solution:[
[1,2,3,4],
[4,3,2,1],
[2,1,4,3],
[3,4,1,2]
]
}
],
medium:[
{
puzzle:[
[0,0,3,0],
[0,3,0,1],
[1,0,0,0],
[0,2,0,0]
],
solution:[
[2,1,3,4],
[4,3,2,1],
[1,4,3,2],
[3,2,1,4]
]
}
],
hard:[
{
puzzle:[
[0,0,0,0],
[0,0,2,0],
[0,1,0,0],
[3,0,0,0]
],
solution:[
[1,2,3,4],
[4,3,2,1],
[2,1,4,3],
[3,4,1,2]
]
}
]
},

9:{
easy:[
{
puzzle:[
[5,3,0,0,7,0,0,0,0],
[6,0,0,1,9,5,0,0,0],
[0,9,8,0,0,0,0,6,0],
[8,0,0,0,6,0,0,0,3],
[4,0,0,8,0,3,0,0,1],
[7,0,0,0,2,0,0,0,6],
[0,6,0,0,0,0,2,8,0],
[0,0,0,4,1,9,0,0,5],
[0,0,0,0,8,0,0,7,9]
],
solution:[
[5,3,4,6,7,8,9,1,2],
[6,7,2,1,9,5,3,4,8],
[1,9,8,3,4,2,5,6,7],
[8,5,9,7,6,1,4,2,3],
[4,2,6,8,5,3,7,9,1],
[7,1,3,9,2,4,8,5,6],
[9,6,1,5,3,7,2,8,4],
[2,8,7,4,1,9,6,3,5],
[3,4,5,2,8,6,1,7,9]
]
}
],
medium:[
{
puzzle:[
[0,0,0,6,7,0,0,0,0],
[6,0,0,1,0,5,0,0,0],
[0,9,0,0,0,0,0,6,0],
[8,0,0,0,6,0,0,0,3],
[4,0,0,8,0,3,0,0,1],
[7,0,0,0,2,0,0,0,6],
[0,6,0,0,0,0,2,8,0],
[0,0,0,4,1,0,0,0,5],
[0,0,0,0,8,0,0,7,9]
],
solution:[
[5,3,4,6,7,8,9,1,2],
[6,7,2,1,9,5,3,4,8],
[1,9,8,3,4,2,5,6,7],
[8,5,9,7,6,1,4,2,3],
[4,2,6,8,5,3,7,9,1],
[7,1,3,9,2,4,8,5,6],
[9,6,1,5,3,7,2,8,4],
[2,8,7,4,1,9,6,3,5],
[3,4,5,2,8,6,1,7,9]
]
}
],

hard:[
{
puzzle:[
[0,0,0,0,0,0,0,1,2],
[0,0,0,0,0,0,0,0,0],
[0,0,1,0,0,0,0,0,0],
[0,0,0,5,0,7,0,0,0],
[0,0,4,0,0,0,7,0,0],
[0,0,0,1,0,9,0,0,0],
[0,0,0,0,0,0,5,0,0],
[0,0,0,0,0,0,0,0,0],
[3,4,0,0,0,0,0,0,0]
],
solution:[
[9,8,7,4,5,3,6,1,2],
[4,5,3,2,1,6,8,7,9],
[6,2,1,7,9,8,4,5,3],
[1,9,8,5,4,7,3,2,6],
[5,3,4,6,8,2,7,9,1],
[2,7,6,1,3,9,8,4,5],
[8,1,9,3,7,4,5,6,2],
[7,6,5,9,2,1,9,3,4],
[3,4,2,8,6,5,1,9,7]
]
}
]
},

}

/* =============================
UTILIDADES
============================= */

function getBlock(size){
if(size===4) return {r:2,c:2}
if(size===9) return {r:3,c:3}
}

/* =============================
TABLERO
============================= */

function createBoard(puzzle){

board.innerHTML=""
currentSize=puzzle.length

board.style.gridTemplateColumns=`repeat(${currentSize},40px)`

let block=getBlock(currentSize)

for(let r=0;r<currentSize;r++){
for(let c=0;c<currentSize;c++){

let input=document.createElement("input")

input.className="cell"
input.dataset.row=r
input.dataset.col=c

/* 🔥 FIX MOBILE */
if(isMobile){
    input.setAttribute("readonly", true)
    input.setAttribute("inputmode", "none")
}

input.maxLength=1

if(puzzle[r][c]!==0){
input.value=puzzle[r][c]
input.disabled=true
input.classList.add("prefilled")
}

if((c+1)%block.c===0 && c!==currentSize-1)
input.classList.add("block-right")

if((r+1)%block.r===0 && r!==currentSize-1)
input.classList.add("block-bottom")

/* SELECCION (MODIFICADO) */
if(isMobile){

    input.addEventListener("click",(e)=>{
        e.preventDefault()
        selectCell(input)
    })

    input.addEventListener("focus",(e)=>{
        e.target.blur()
    })

}else{

    input.addEventListener("focus",()=>{
        selectCell(input)
    })

}

/* ESCRITURA (SE MANTIENE) */
input.addEventListener("input",()=>{

let r=input.dataset.row
let c=input.dataset.col

let val=parseInt(input.value)

if(val!==currentSolution[r][c]){
input.classList.add("error")
}else{
input.classList.remove("error")
}

})

board.appendChild(input)

}
}

}

/* =============================
SELECCION
============================= */

function selectCell(cell){

selectedCell=cell

document.querySelectorAll(".cell").forEach(c=>{
c.classList.remove("active","highlight")
})

let r=cell.dataset.row
let c=cell.dataset.col

let cells=document.querySelectorAll(".cell")

cells.forEach((el,i)=>{

let row=Math.floor(i/currentSize)
let col=i%currentSize

if(row==r || col==c){
el.classList.add("highlight")
}

})

cell.classList.add("active")

}

/* =============================
NUEVO JUEGO
============================= */

function newGame(){

let size = parseInt(sizeSelect.value)
let diff = difficultySelect.value

if(!puzzles[size]){
console.error("No existen puzzles para este tamaño")
return
}

if(!puzzles[size][diff]){
console.warn("No existen puzzles para esta dificultad, usando fácil")
diff="easy"
}

let list = puzzles[size][diff]
let random = list[Math.floor(Math.random()*list.length)]

currentSolution = random.solution

createBoard(random.puzzle)

resetHints()
startTimer()
createMobilePad()

message.textContent=""

}

/* =============================
CRONOMETRO
============================= */

function startTimer(){

clearInterval(timerInterval)
timer=0

timerInterval=setInterval(()=>{

timer++

let m=Math.floor(timer/60)
let s=timer%60

timerDisplay.textContent=`⏱ ${m}:${s.toString().padStart(2,"0")}`

},1000)

}

/* =============================
PISTAS
============================= */

function resetHints(){
hintsLeft=3
hintsDisplay.textContent=hintsLeft
}

function giveHint(){

if(hintsLeft<=0){
message.textContent="❌ No quedan pistas"
return
}

let cells=document.querySelectorAll(".cell")

for(let i=0;i<cells.length;i++){

if(!cells[i].value){

let r=Math.floor(i/currentSize)
let c=i%currentSize

cells[i].value=currentSolution[r][c]

hintsLeft--
hintsDisplay.textContent=hintsLeft

return

}

}

}

/* =============================
TECLADO MOVIL
============================= */

function createMobilePad(){

if(window.innerWidth>768){
mobilePad.style.display="none"
return
}

mobilePad.style.display="block"
mobilePad.innerHTML=""

for(let i=1;i<=currentSize;i++){

let btn=document.createElement("button")

btn.textContent=i

btn.onclick=()=>{

if(selectedCell && !selectedCell.disabled){

selectedCell.value=i

let r=selectedCell.dataset.row
let c=selectedCell.dataset.col

if(i!=currentSolution[r][c]){
selectedCell.classList.add("error")
}else{
selectedCell.classList.remove("error")
}

/* 🔥 evita focus */
selectedCell.blur()

}

}

mobilePad.appendChild(btn)

}

}

/* =============================
VALIDACION
============================= */

function checkSolution(){

let cells=document.querySelectorAll(".cell")

for(let i=0;i<cells.length;i++){

let r=Math.floor(i/currentSize)
let c=i%currentSize

if(parseInt(cells[i].value)!==currentSolution[r][c]){
message.textContent="❌ Hay errores"
return
}

}

message.textContent="🎉 ¡Sudoku correcto!"
celebrate()

}

/* =============================
CONFETTI
============================= */

function celebrate(){

for(let i=0;i<40;i++){

let confetti=document.createElement("div")

confetti.className="confetti"

confetti.style.left=Math.random()*100+"vw"
confetti.style.animationDuration=(Math.random()*2+2)+"s"

document.body.appendChild(confetti)

setTimeout(()=>confetti.remove(),3000)

}

}

/* =============================
EVENTOS
============================= */

document.getElementById("newGame").onclick=newGame
document.getElementById("checkBtn").onclick=checkSolution
document.getElementById("hintBtn").onclick=giveHint

sizeSelect.addEventListener("change", () => newGame())
difficultySelect.addEventListener("change", () => newGame())

window.addEventListener("resize",createMobilePad)

newGame()