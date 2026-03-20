const board = document.getElementById("board")
const scoreDisplay = document.getElementById("score")
const recordDisplay = document.getElementById("record")

let tiles = []
let score = 0

let record = localStorage.getItem("record2048") || 0
recordDisplay.innerHTML = record

function createBoard(){
  board.innerHTML=""
  tiles=[]

  for(let i=0;i<16;i++){
    let tile = document.createElement("div")
    tile.classList.add("tile")
    board.appendChild(tile)
    tiles.push(tile)
  }

  addNumber()
  addNumber()
  updateColors()
}

function addNumber(){
  let empty = tiles.filter(t=>t.innerHTML=="")
  if(empty.length==0) return

  let randomTile = empty[Math.floor(Math.random()*empty.length)]
  randomTile.innerHTML = Math.random()<0.9 ? "2":"4"
}

function updateColors(){
  tiles.forEach(t=>{
    let val = t.innerHTML
    t.setAttribute("data-value", val)
  })
}

function getRow(r){
  return tiles.slice(r*4,r*4+4).map(t=>Number(t.innerHTML)||0)
}

function setRow(r,row){
  for(let i=0;i<4;i++){
    tiles[r*4+i].innerHTML = row[i]===0 ? "" : row[i]
  }
}

function combine(row){
  row = row.filter(n=>n)

  for(let i=0;i<row.length-1;i++){
    if(row[i]==row[i+1]){
      row[i]*=2
      score+=row[i]
      scoreDisplay.innerHTML=score

      if(score > record){
        record = score
        localStorage.setItem("record2048", record)
        recordDisplay.innerHTML = record
      }

      row[i+1]=0
    }
  }

  row=row.filter(n=>n)

  while(row.length<4) row.push(0)

  return row
}

function slideLeft(){
  for(let r=0;r<4;r++){
    let row = getRow(r)
    row = combine(row)
    setRow(r,row)
  }
}

function slideRight(){
  for(let r=0;r<4;r++){
    let row = getRow(r).reverse()
    row = combine(row)
    row = row.reverse()
    setRow(r,row)
  }
}

function slideUp(){
  for(let c=0;c<4;c++){
    let col=[]

    for(let r=0;r<4;r++){
      col.push(Number(tiles[r*4+c].innerHTML)||0)
    }

    col = combine(col)

    for(let r=0;r<4;r++){
      tiles[r*4+c].innerHTML = col[r]===0 ? "" : col[r]
    }
  }
}

function slideDown(){
  for(let c=0;c<4;c++){
    let col=[]

    for(let r=0;r<4;r++){
      col.push(Number(tiles[r*4+c].innerHTML)||0)
    }

    col = col.reverse()
    col = combine(col)
    col = col.reverse()

    for(let r=0;r<4;r++){
      tiles[r*4+c].innerHTML = col[r]===0 ? "" : col[r]
    }
  }
}

function move(dir){
  let before = tiles.map(t => t.innerHTML)

  if(dir==="left") slideLeft()
  if(dir==="right") slideRight()
  if(dir==="up") slideUp()
  if(dir==="down") slideDown()

  let after = tiles.map(t => t.innerHTML)

  if(JSON.stringify(before) !== JSON.stringify(after)){
    addNumber()
  }

  updateColors()
}

/* TECLADO */
document.addEventListener("keydown",e=>{
  if(e.key==="ArrowLeft") move("left")
  if(e.key==="ArrowRight") move("right")
  if(e.key==="ArrowUp") move("up")
  if(e.key==="ArrowDown") move("down")
})

/* 📱 SWIPE REAL (CLAVE) */

let startX, startY

board.addEventListener("touchstart",(e)=>{
  startX = e.touches[0].clientX
  startY = e.touches[0].clientY
})

board.addEventListener("touchend",(e)=>{
  let dx = e.changedTouches[0].clientX - startX
  let dy = e.changedTouches[0].clientY - startY

  if(Math.abs(dx) > Math.abs(dy)){
    if(dx > 30) move("right")
    else if(dx < -30) move("left")
  }else{
    if(dy > 30) move("down")
    else if(dy < -30) move("up")
  }
})

/* BOTON */
document.getElementById("restart").onclick=()=>{
  score=0
  scoreDisplay.innerHTML=0
  createBoard()
}

createBoard()