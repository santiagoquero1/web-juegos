const board = document.getElementById("board")
const piecesContainer = document.getElementById("pieces")

const size = 10

let grid=[]
let score=0
let record=localStorage.getItem("puzzleRecord")||0

const scoreEl=document.getElementById("score")
const recordEl=document.getElementById("record")

recordEl.textContent=record

const isTouchDevice = window.matchMedia("(pointer: coarse)").matches

/* CREAR TABLERO */

for(let y=0;y<size;y++){
  grid[y]=[]

  for(let x=0;x<size;x++){
    const cell=document.createElement("div")
    cell.className="cell"
    board.appendChild(cell)
    grid[y][x]=0
  }
}

/* FORMAS */

const shapes=[
[[1,1],[1,1]],
[[1,1,1]],
[[1],[1],[1]],
[[1,1,1],[0,1,0]],
[[1,0],[1,1]]
]

/* CREAR PIEZA */

function createPiece(){

  const shape=shapes[Math.floor(Math.random()*shapes.length)]

  const piece=document.createElement("div")
  piece.className="piece"

  shape.forEach((row,y)=>{
    row.forEach((v,x)=>{
      if(v){
        const block=document.createElement("div")
        block.className="block"

        block.style.left = x * 30 + "px"
        block.style.top = y * 30 + "px"

        piece.appendChild(block)
      }
    })
  })

  piece.dataset.shape=JSON.stringify(shape)
  piece.draggable=!isTouchDevice

  piece.addEventListener("dragstart",dragStart)

  piecesContainer.appendChild(piece)
}

/* SPAWN PIEZAS */

function spawnPieces(){

  piecesContainer.innerHTML=""

  for(let i=0;i<3;i++) createPiece()

  if(isTouchDevice){
    initTouchDrag()
  }
}

spawnPieces()

/* DRAG PC */

let currentShape=null

function dragStart(e){
  currentShape=JSON.parse(e.target.dataset.shape)
}

/* PREVIEW */

board.addEventListener("dragover",e=>{
  e.preventDefault()

  const rect=board.getBoundingClientRect()

  const x=Math.floor((e.clientX-rect.left)/(rect.width/size))
  const y=Math.floor((e.clientY-rect.top)/(rect.height/size))

  clearPreview()
  drawPreview(x,y)
})

function drawPreview(x,y){

  let valid = true

  currentShape.forEach((row,sy)=>{
    row.forEach((v,sx)=>{
      if(v){
        let gx=x+sx
        let gy=y+sy

        if(gx>=size || gy>=size || grid[gy][gx]){
          valid=false
        }
      }
    })
  })

  currentShape.forEach((row,sy)=>{
    row.forEach((v,sx)=>{
      if(v){
        let gx=x+sx
        let gy=y+sy

        if(gx<size && gy<size){
          let index=gy*size+gx
          board.children[index].classList.add("preview")
          board.children[index].classList.add(valid ? "valid" : "invalid")
        }
      }
    })
  })
}

function clearPreview(){
  for(let c of board.children){
    c.classList.remove("preview","valid","invalid")
  }
}

/* SOLTAR PC */

board.addEventListener("drop",e=>{
  const rect=board.getBoundingClientRect()

  const x=Math.floor((e.clientX-rect.left)/(rect.width/size))
  const y=Math.floor((e.clientY-rect.top)/(rect.height/size))

  placeShape(x,y)
  clearPreview()
})

/* TOUCH DRAG PRO (FIX COMPLETO) */

let touchShape = null
let draggingPiece = null

function initTouchDrag(){

  document.querySelectorAll(".piece").forEach(piece=>{

    piece.addEventListener("pointerdown", e=>{

      e.preventDefault()

      touchShape = JSON.parse(piece.dataset.shape)
      currentShape = touchShape

      const originalPiece = piece

      draggingPiece = piece.cloneNode(true)
      draggingPiece.style.position = "fixed"
      draggingPiece.style.pointerEvents = "none"
      draggingPiece.style.zIndex = "1000"
      draggingPiece.style.transform = "scale(1.2)"
      draggingPiece.style.opacity = "0.9"

      document.body.appendChild(draggingPiece)

      moveAt(e.clientX, e.clientY)

      function moveAt(x,y){
        draggingPiece.style.left = x - 45 + "px"
        draggingPiece.style.top = y - 45 + "px"
      }

      function onMove(e){
        e.preventDefault()

        moveAt(e.clientX, e.clientY)

        const rect=board.getBoundingClientRect()

        const x=Math.floor((e.clientX-rect.left)/(rect.width/size))
        const y=Math.floor((e.clientY-rect.top)/(rect.height/size))

        clearPreview()
        drawPreview(x,y)
      }

      function onUp(e){

        const rect=board.getBoundingClientRect()

        const x=Math.floor((e.clientX-rect.left)/(rect.width/size))
        const y=Math.floor((e.clientY-rect.top)/(rect.height/size))

        const placed = tryPlaceShape(x,y)

        clearPreview()

        draggingPiece.remove()
        draggingPiece=null
        touchShape=null

        if(placed){
          originalPiece.remove()
        }

        document.removeEventListener("pointermove", onMove)
        document.removeEventListener("pointerup", onUp)
      }

      document.addEventListener("pointermove", onMove, { passive:false })
      document.addEventListener("pointerup", onUp)

    })

  })
}

/* VALIDAR + COLOCAR */

function tryPlaceShape(x,y){

  for(let sy=0;sy<currentShape.length;sy++){
    for(let sx=0;sx<currentShape[sy].length;sx++){
      if(currentShape[sy][sx]){
        let gx=x+sx
        let gy=y+sy

        if(gx>=size||gy>=size||grid[gy][gx]){
          board.classList.add("shake")
          setTimeout(()=>board.classList.remove("shake"),300)
          return false
        }
      }
    }
  }

  placeShape(x,y)
  return true
}

/* COLOCAR */

function placeShape(x,y){

  currentShape.forEach((row,sy)=>{
    row.forEach((v,sx)=>{
      if(v){
        let gx=x+sx
        let gy=y+sy

        grid[gy][gx]=1

        let index=gy*size+gx
        board.children[index].classList.add("filled","snap")
      }
    })
  })

  score+=10
  scoreEl.textContent=score

  if(score>record){
    record=score
    localStorage.setItem("puzzleRecord",record)
    recordEl.textContent=record
  }

  checkLines()
  spawnPieces()

  setTimeout(checkGameOver,200)
}

/* PARTICULAS */

function createParticles(x,y){

  for(let i=0;i<8;i++){

    const p=document.createElement("div")
    p.className="particle"

    p.style.left = x + "px"
    p.style.top = y + "px"

    p.style.setProperty("--x",(Math.random()*80-40)+"px")
    p.style.setProperty("--y",(Math.random()*80-40)+"px")

    document.body.appendChild(p)

    setTimeout(()=>p.remove(),600)
  }
}

/* LIMPIAR LINEAS */

function checkLines(){

  for(let y=0;y<size;y++){
    let full=true

    for(let x=0;x<size;x++){
      if(!grid[y][x]) full=false
    }

    if(full){
      for(let x=0;x<size;x++){
        let index=y*size+x

        let rect = board.children[index].getBoundingClientRect()
        createParticles(rect.left, rect.top)

        board.children[index].style.background="#fff3bf"

        grid[y][x]=0

        board.children[index].classList.add("clear")

        setTimeout(()=>{
          board.children[index].classList.remove("filled","clear")
          board.children[index].style.background=""
        },300)
      }
      score+=100
    }
  }

  for(let x=0;x<size;x++){
    let full=true

    for(let y=0;y<size;y++){
      if(!grid[y][x]) full=false
    }

    if(full){
      for(let y=0;y<size;y++){
        let index=y*size+x

        let rect = board.children[index].getBoundingClientRect()
        createParticles(rect.left, rect.top)

        board.children[index].style.background="#fff3bf"

        grid[y][x]=0

        board.children[index].classList.add("clear")

        setTimeout(()=>{
          board.children[index].classList.remove("filled","clear")
          board.children[index].style.background=""
        },300)
      }
      score+=100
    }
  }

  scoreEl.textContent=score
}

/* GAME OVER */

function checkGameOver(){

  const pieces=document.querySelectorAll(".piece")

  for(let piece of pieces){
    let shape=JSON.parse(piece.dataset.shape)

    for(let y=0;y<size;y++){
      for(let x=0;x<size;x++){
        if(canPlace(shape,x,y)) return
      }
    }
  }

  document.getElementById("gameOver").style.display="flex"
}

function canPlace(shape,x,y){

  for(let sy=0;sy<shape.length;sy++){
    for(let sx=0;sx<shape[sy].length;sx++){
      if(shape[sy][sx]){
        let gx=x+sx
        let gy=y+sy

        if(gx>=size||gy>=size) return false
        if(grid[gy][gx]) return false
      }
    }
  }

  return true
}