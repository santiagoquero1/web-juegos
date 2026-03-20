function cargarJuego(juego){

  const frame = document.getElementById("gameFrame")

  if(juego==="pacman"){
    frame.src = "https://archive.org/embed/msdos_Pac-Man_1983"
  }

  if(juego==="prince"){
    frame.src = "https://archive.org/embed/msdos_Prince_of_Persia_1990"
  }

  if(juego==="wolf"){
    frame.src = "https://archive.org/embed/msdos_Wolfenstein_3D_1992"
  }

  if(juego==="sf2"){
    frame.src = "https://archive.org/embed/arcade_sf2"
  }

  if(juego==="dk"){
    frame.src = "https://archive.org/embed/arcade_dkong"
  }

}

/* controles celular */
function enviarTecla(key){
  const iframe = document.getElementById("gameFrame")
  iframe.contentWindow.postMessage({type:"keydown", key:key},"*")
}