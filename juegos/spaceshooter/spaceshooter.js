const canvas = document.getElementById("gameArea")
const ctx = canvas.getContext("2d")

let score = 0
let gameOver = false
let time = 0

canvas.width = 400
canvas.height = 600

/* ===== IMÁGENES ===== */

const shipImg = new Image()
shipImg.src = "imagenes/nave.png"

const bulletImg1 = new Image()
bulletImg1.src = "imagenes/misil-inicial.png"

const bulletImg2 = new Image()
bulletImg2.src = "imagenes/misil-final.png"

/* ===== SONIDOS ===== */

const shootSound = new Audio("sonidos/laser.wav")
const explosionSound = new Audio("sonidos/explosion.wav")
const music = new Audio("sonidos/musica.wav")

music.loop = true
music.volume = 0.6   // 🔥 MÁS FUERTE

shootSound.volume = 0.5
explosionSound.volume = 0.7

let isMuted = false

/* ===== ACTIVAR MÚSICA ===== */

function startMusic(){
music.play().catch(()=>{})
}

document.addEventListener("click", startMusic, { once:true })
document.addEventListener("touchstart", startMusic, { once:true })
document.addEventListener("keydown", startMusic, { once:true })

/* ===== BOTÓN MUTE ===== */

const muteBtn = document.createElement("button")
muteBtn.innerText = "🔊"
muteBtn.style.position = "absolute"
muteBtn.style.top = "20px"
muteBtn.style.right = "20px"
muteBtn.style.padding = "10px"
muteBtn.style.borderRadius = "10px"
muteBtn.style.border = "none"
muteBtn.style.cursor = "pointer"

document.body.appendChild(muteBtn)

muteBtn.addEventListener("click", ()=>{
isMuted = !isMuted

if(isMuted){
music.volume = 0
shootSound.volume = 0
explosionSound.volume = 0
muteBtn.innerText = "🔇"
}else{
music.volume = 0.6
shootSound.volume = 0.5
explosionSound.volume = 0.7
muteBtn.innerText = "🔊"
}
})

/* ===== SLIDER VOLUMEN ===== */

const volumeSlider = document.createElement("input")
volumeSlider.type = "range"
volumeSlider.min = 0
volumeSlider.max = 1
volumeSlider.step = 0.01
volumeSlider.value = 0.6

volumeSlider.style.position = "absolute"
volumeSlider.style.top = "60px"
volumeSlider.style.right = "20px"

document.body.appendChild(volumeSlider)

volumeSlider.addEventListener("input", ()=>{
let v = volumeSlider.value
music.volume = v
shootSound.volume = v
explosionSound.volume = v
})

/* ===== PLAYER ===== */

const player = {
x: canvas.width / 2 - 30,
y: canvas.height - 90,
width:60,
height:80,
speed:6
}

let bullets = []
let enemies = []
let explosions = []

/* ===== ESTRELLAS ===== */

let stars = []

for(let i=0;i<50;i++){
stars.push({
x:Math.random()*canvas.width,
y:Math.random()*canvas.height,
size:Math.random()*2
})
}

/* ===== EVITAR SCROLL ===== */

document.body.addEventListener("touchmove", e=>{
e.preventDefault()
}, { passive:false })

/* ===== CONTROLES ===== */

let keys = {}

document.addEventListener("keydown", e=>{
keys[e.key]=true

if(e.key===" " && !gameOver){
shoot()
}
})

document.addEventListener("keyup", e=>{
keys[e.key]=false
})

let touchX = null

canvas.addEventListener("touchstart", e=>{
let rect = canvas.getBoundingClientRect()
let touch = e.touches[0

]
touchX = (touch.clientX - rect.left) * (canvas.width / rect.width)
shoot()
})

canvas.addEventListener("touchmove", e=>{
let rect = canvas.getBoundingClientRect()
let touch = e.touches[0]

touchX = (touch.clientX - rect.left) * (canvas.width / rect.width)
})

canvas.addEventListener("touchend", ()=>{
touchX = null
})

/* ===== DISPARO ===== */

function shoot(){
if(!gameOver){

shootSound.currentTime = 0
shootSound.play()

bullets.push({
x:player.x + player.width/2 - 8,
y:player.y,
frame:0
})
}
}

/* ===== ENEMIGOS ===== */

function spawnEnemy(){

if(gameOver) return

let x=Math.random()*(canvas.width-30)

enemies.push({
x:x,
y:0,
width:30,
height:20,
speed:2
})

}

setInterval(spawnEnemy,1000)

/* ===== LOOP ===== */

function update(){

if(gameOver) return

time += 0.002

let day = (Math.sin(time) + 1) / 2

let r = Math.floor(20 + day * 100)
let g = Math.floor(30 + day * 150)
let b = Math.floor(80 + day * 120)

ctx.fillStyle = `rgb(${r},${g},${b})`
ctx.fillRect(0,0,canvas.width,canvas.height)

drawStars()

if(keys["ArrowLeft"] && player.x>0){
player.x-=player.speed
}

if(keys["ArrowRight"] && player.x<canvas.width-player.width){
player.x+=player.speed
}

if(touchX !== null){
player.x += (touchX - player.x - player.width/2) * 0.2
}

drawPlayer()
drawBullets()
drawEnemies()
drawExplosions()

requestAnimationFrame(update)

}

/* ===== ESTRELLAS ===== */

function drawStars(){
ctx.fillStyle = "white"

stars.forEach(s=>{
ctx.fillRect(s.x,s.y,s.size,s.size)
s.y += 0.5

if(s.y > canvas.height){
s.y = 0
s.x = Math.random()*canvas.width
}
})
}

/* ===== PLAYER ===== */

function drawPlayer(){
ctx.drawImage(shipImg, player.x, player.y, player.width, player.height)
}

/* ===== BALAS ===== */

function drawBullets(){

for(let i=0;i<bullets.length;i++){

let b = bullets[i]

b.y -= 8
b.frame++

let img = (b.frame % 10 < 5) ? bulletImg1 : bulletImg2

ctx.drawImage(img, b.x, b.y, 16, 30)

}

}

/* ===== ENEMIGOS ===== */

function drawEnemies(){

for(let i=0;i<enemies.length;i++){

let e = enemies[i]

e.y += e.speed

ctx.fillStyle = "red"
ctx.fillRect(e.x,e.y,e.width,e.height)

for(let j=0;j<bullets.length;j++){

let b = bullets[j]

if(
b.x < e.x + e.width &&
b.x + 16 > e.x &&
b.y < e.y + e.height &&
b.y + 30 > e.y
){

explosionSound.currentTime = 0
explosionSound.play()

explosions.push({
x:e.x + e.width/2,
y:e.y + e.height/2,
size:10,
life:10
})

enemies.splice(i,1)
bullets.splice(j,1)

score++
document.getElementById("score").textContent = score

break
}

}

if(
player.x < e.x + e.width &&
player.x + player.width > e.x &&
player.y < e.y + e.height &&
player.y + player.height > e.y
){
endGame("💥 Te chocó un enemigo")
}

if(e.y > canvas.height){
endGame("Un enemigo pasó")
}

}

}

/* ===== EXPLOSIONES ===== */

function drawExplosions(){

for(let i=0;i<explosions.length;i++){

let ex = explosions[i]

ctx.fillStyle = "orange"
ctx.beginPath()
ctx.arc(ex.x, ex.y, ex.size, 0, Math.PI*2)
ctx.fill()

ex.size += 2
ex.life--

if(ex.life <= 0){
explosions.splice(i,1)
}

}

}

/* ===== GAME OVER ===== */

function endGame(message){

gameOver = true

setTimeout(()=>{
alert(message + "\nPuntuación: " + score)
location.reload()
},100)

}

update()