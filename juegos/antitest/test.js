const preguntas = [
"¿Has hablado con tu planta hoy?",
"¿Crees que las tostadoras tienen sentimientos?",
"¿Comerías pizza con helado?",
"¿Te has reído solo viendo memes?",
"¿Alguna vez saludaste a un perro desconocido?",
"¿Has revisado el refri sin tener hambre?",
"¿Te has quedado pensando en algo sin razón?",
"¿Hablas contigo mismo a veces?",
"¿Has fingido entender algo?",
"¿Te has quedado pegado mirando al vacío?",
"¿Te inventas historias en la cabeza?",
"¿Te ha dado risa algo sin sentido?",
"¿Has bailado sin música?",
"¿Te distraes fácilmente?",
"¿Has olvidado por qué entraste a una pieza?",
"¿Has abierto el refri sin tener hambre? 🧊",
"¿Has releído un mensaje mil veces antes de enviarlo? 📩",
"¿Has sentido que el tiempo pasa raro a veces? ⏳",
"¿Te has imaginado discusiones que nunca pasaron? 🗣️",
"¿Has saludado a alguien que no te estaba saludando? 👋",
"¿Te has quedado en pausa sin motivo? ⏸️",
"¿Has olvidado lo que ibas a decir justo al decirlo? 🤐",
"¿Has sentido que tu cerebro se quedó cargando? 💭",
"¿Te has reído solo recordando algo viejo? 😂",
"¿Has caminado en círculos sin darte cuenta? 🔄",
"¿Te has quedado mirando algo sin procesarlo? 👀",
"¿Has dicho 'qué' y entendido igual? 🤨",
"¿Te ha dado flojera pensar? 💤",
"¿Has respondido automático sin escuchar bien? 🤖",
"¿Te has sentido observado por absolutamente nadie? 👁️",
"¿Has tenido una idea brillante y la olvidaste? 💡",
"¿Te has confundido de palabra pero seguiste igual? 🫠",
]

const resultados = [
"Eres oficialmente un pingüino programador 🐧",
"Tu cerebro funciona con Wi-Fi intermitente 📶",
"Probablemente eres un NPC de videojuego 🎮",
"Eres sospechosamente creativo 😎",
"Eres una mezcla de genio y meme 🤯",
"Tu mente vive en otra dimensión 🌌",
"Eres un bug con patas pero funcional 🐛",
"Tu lógica es opcional pero efectiva 🤔",
"Eres un algoritmo con ansiedad 😵‍💫",
"Tu personalidad fue generada aleatoriamente 🎲",
"Eres básicamente un easter egg humano 🥚",
"Funcionas a base de café imaginario ☕",
"Tu cerebro compila… a veces 💻",
"Tienes habilidades desbloqueadas por accidente 🔓",
"Eres más misterio que solución 🕵️",
"Tu sentido común está en modo beta 🧪",
"Eres un meme que cobró vida 😂",
"Eres un experimento que salió raro… pero bien 🧬",
"Tu intuición funciona con delay ⏳",
"Eres creatividad sin manual de instrucciones 🧠",
"Tu nivel de rareza es legendario 🟣",
"Eres una actualización pendiente desde 2010 🔄",
"Eres mitad lógica, mitad improvisación 🎭",
"Tienes pensamientos premium en versión gratuita 💸",
"Eres un NPC… pero con conciencia 👀",
"Tu estilo es incomprensible pero icónico 😎",
]

let preguntasJuego = []
let index = 0
let jugando = false

const preguntaEl = document.getElementById("pregunta")
const resultadoEl = document.getElementById("resultado")
const botones = document.querySelectorAll("#opciones button")
const startBtn = document.getElementById("start")

// 🔀 MEZCLAR Y TOMAR 7
function obtenerPreguntasRandom(){
  let copia = [...preguntas]

  // Fisher-Yates shuffle
  for(let i = copia.length - 1; i > 0; i--){
    let j = Math.floor(Math.random() * (i + 1))
    ;[copia[i], copia[j]] = [copia[j], copia[i]]
  }

  return copia.slice(0,7)
}

function iniciar(){
  preguntasJuego = obtenerPreguntasRandom()
  index = 0
  jugando = true
  resultadoEl.innerHTML = ""
  startBtn.style.display = "none"
  mostrarPregunta()
}

function mostrarPregunta(){
  preguntaEl.innerHTML = preguntasJuego[index]
}

function responder(){
  if(!jugando) return

  index++

  if(index < preguntasJuego.length){
    mostrarPregunta()
  }else{
    terminar()
  }
}

function terminar(){
  jugando = false

  let r = resultados[Math.floor(Math.random()*resultados.length)]

  preguntaEl.innerHTML = "Resultado final"
  resultadoEl.innerHTML = r

  startBtn.innerHTML = "Jugar otra vez"
  startBtn.style.display = "inline-block"
}

botones.forEach(btn=>{
  btn.addEventListener("click", responder)
})

startBtn.addEventListener("click", iniciar)