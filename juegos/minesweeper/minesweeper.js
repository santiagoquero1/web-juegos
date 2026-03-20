const board = document.getElementById("board")
const difficultySelect = document.getElementById("difficulty")
const timeDisplay = document.getElementById("time")
const recordDisplay = document.getElementById("record")

let rows,cols,mines
let grid=[]
let timer=0
let interval

function startGame(){

clearInterval(interval)

timer=0
timeDisplay.innerText=0

document.getElementById("gameOver").style.display="none"

let difficulty=difficultySelect.value

if(difficulty==="easy"){
rows=9; cols=9; mines=10;
}

if(difficulty==="medium"){
rows=16; cols=16; mines=40;
}

if(difficulty==="hard"){
rows=16; cols=30; mines=99;
}

loadRecord()
createBoard()

interval=setInterval(()=>{
timer++
timeDisplay.innerText=timer
},1000)

}

function createBoard(){

board.innerHTML=""
board.style.gridTemplateColumns=`repeat(${cols}, min(9vw, 36px))`

grid=[]

for(let r=0;r<rows;r++){
grid[r]=[]

for(let c=0;c<cols;c++){

let cell=document.createElement("div")
cell.classList.add("cell")

cell.dataset.row=r
cell.dataset.col=c

cell.onclick=revealCell
cell.oncontextmenu=flagCell

board.appendChild(cell)

grid[r][c]={mine:false,revealed:false,flag:false,element:cell}

}
}

placeMines()
}

function placeMines(){

let placed=0

while(placed<mines){
let r=Math.floor(Math.random()*rows)
let c=Math.floor(Math.random()*cols)

if(!grid[r][c].mine){
grid[r][c].mine=true
placed++
}
}
}

function revealCell(e){

let r=parseInt(e.target.dataset.row)
let c=parseInt(e.target.dataset.col)
let cell=grid[r][c]

if(cell.revealed||cell.flag)return

cell.revealed=true
cell.element.classList.add("revealed")

if(cell.mine){
cell.element.textContent="💣"
cell.element.classList.add("mine")
showAllMines()
gameOver(false)
return
}

let count=countMines(r,c)

if(count>0){
cell.element.textContent=count
cell.element.classList.add("n"+count)
}else{
revealNeighbors(r,c)
}

checkWin()
}

function countMines(r,c){

let total=0

for(let i=-1;i<=1;i++){
for(let j=-1;j<=1;j++){

let nr=r+i
let nc=c+j

if(nr>=0&&nr<rows&&nc>=0&&nc<cols){
if(grid[nr][nc].mine) total++
}
}
}

return total
}

function revealNeighbors(r,c){

for(let i=-1;i<=1;i++){
for(let j=-1;j<=1;j++){

let nr=r+i
let nc=c+j

if(nr>=0&&nr<rows&&nc>=0&&nc<cols){
if(!grid[nr][nc].revealed){
grid[nr][nc].element.click()
}
}
}
}
}

function flagCell(e){

e.preventDefault()

let r=parseInt(e.target.dataset.row)
let c=parseInt(e.target.dataset.col)
let cell=grid[r][c]

if(cell.revealed)return

cell.flag=!cell.flag
cell.element.textContent=cell.flag?"🚩":""
}

function showAllMines(){

grid.forEach((row,i)=>{
row.forEach((cell,j)=>{
if(cell.mine){
setTimeout(()=>{
cell.element.textContent="💣"
},(i+j)*20)
}
})
})
}

function gameOver(win){

clearInterval(interval)

let overlay=document.getElementById("gameOver")
overlay.style.display="flex"

overlay.classList.remove("win")

document.getElementById("result").innerText=win?"🎉 Ganaste":"💀 Perdiste"

if(win){
overlay.classList.add("win")
saveRecord()
}
}

function checkWin(){

let safeCells=rows*cols-mines
let revealed=0

grid.forEach(row=>{
row.forEach(cell=>{
if(cell.revealed&&!cell.mine) revealed++
})
})

if(revealed===safeCells){
gameOver(true)
}
}

function saveRecord(){

let key="minesweeper-"+difficultySelect.value
let record=localStorage.getItem(key)

if(!record||timer<record){
localStorage.setItem(key,timer)
}

loadRecord()
}

function loadRecord(){

let key="minesweeper-"+difficultySelect.value
let record=localStorage.getItem(key)

recordDisplay.innerText=record?record+"s":"--"
}

startGame()