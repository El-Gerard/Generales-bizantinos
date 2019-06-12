var canvas = document.getElementById('canvas');
var ctx = document.getElementById("canvas").getContext("2d");
var posicionesX = [];
var posicionesY = [];
var puntos = [];
var cont_linea = 0;
var bkcup_p1 = 0;
var bkcup_p2 = 0;
var bandera = 1;
var activador = 0;
var gen;
var banderapunto = 0;

function initialise() {
  canvas.addEventListener("mousedown", doMouseDown, false);
}

function doMouseDown(event) {
  if (activador == 0) {

    canvas_x = event.pageX;
    canvas_y = event.pageY;

    posicionesX.push(canvas_x);
    posicionesY.push(canvas_y);
    //Guarda las coordenadas por punto

    puntos.push([banderapunto,canvas_x, canvas_y, generar_traidores()]);
    drawCoordinates(canvas_x, canvas_y);
  }
}

function drawCoordinates(x, y) {
  var pointSize = 5; // Cambia el tamaño del punto
  ctx.fillStyle = "#4559D7"; // Color azul
  ctx.beginPath(); // Iniciar trazo
  ctx.arc(x, y, pointSize, 0, Math.PI * 2, true); // Dibujar un punto usando la funcion arc
  ctx.fill(); // Terminar trazo
  ctx.font = "bold 15px sans-serif";
  ctx.fillText(banderapunto,x-3,y-5);
  banderapunto++;
  if (bandera == 1) {
    bandera++;
  } else {
    dibujarLineas(x, y);
  }
  ctx.closePath();
}

function dibujarLineas(x, y) {
  if (bandera > 2) {
    for (var i = 0; i < bandera - 1; i++) {
      var random = Math.random();
      ctx.moveTo(x, y);
      ctx.lineTo(posicionesX[i], posicionesY[i]);
      ctx.strokeStyle = 'rgba(0, 153, 0, 0.4)';
    }
    ctx.stroke();
  } else {
    ctx.moveTo(posicionesX[0], posicionesY[0]);
    ctx.lineTo(x, y);
    ctx.strokeStyle = 'rgba(0, 153, 0, 0.4)';
    ctx.stroke();
  }
  bandera++;
}

function generar_traidores() {
  var random = Math.random();
  if (random < 0.3) {
    return "traidor";
  } else {
    return "leal";
  }

}

//Escoger general
document.getElementById("button_eg").addEventListener("click", function() {
  activador = 2;
});
document.getElementById("msn").addEventListener("click", function() {
  enviarMSN();
});

window.addEventListener("click", function(e) {
  if (activador == 2) {
    var rect = canvas.getBoundingClientRect();
    var x = e.clientX - rect.left;
    var y = e.clientY - rect.top;
    if (encontrar_punto(x, y) == true) {
      marcar_general();
      puntos[bkcup_p1][3] = "general";
      gen = bkcup_p1;
      activador = 0;
      document.getElementById('b_eg').style.display = "none";
    }
  }
}, false);

function encontrar_punto(x, y) {
  for (var i = 0; i < puntos.length; i++) {
    if ((puntos[i][1] + 5) > x && (puntos[i][1] - 5) < x) {
      if ((puntos[i][2] + 5) > y && (puntos[i][2] - 5) < y) {
        bkcup_p1 = i;
        i = puntos.length;
        return true;
      }
    }
  }
}

function marcar_general() {
  var pointSize = 7;
  ctx.fillStyle = "#2B831E"; // azul
  ctx.beginPath();
  ctx.arc(puntos[bkcup_p1][1], puntos[bkcup_p1][2], pointSize, 0, Math.PI * 2, true);
  ctx.fill();

  //
  /*var pointSize = 5;
  ctx.fillStyle = "#FFFFFF"; // blanco
  ctx.beginPath();
  ctx.arc(puntos[bkcup_p1][1], puntos[bkcup_p1][2], pointSize, 0, Math.PI * 2, true);
  ctx.fill();*/
}

function enviarMSN(){
  for (var i = 0; i < puntos.length; i++) {
    if(i!=gen){
      puntos[i].push(true);
      trazar_linea(gen,i);
    }
  }

  var msn = true;
  var msn1 = msn;
  for (var i = 0; i < puntos.length; i++) {
    if(puntos[i][3]=="traidor"){
        msn1 = !msn1;
    }
    for (var j = 0; j < puntos.length; j++) {
      if(puntos[j][3] != "general" && i!=j){
        puntos[j].push(msn1);
        trazar_linea_mitad(i,j,msn1);
      }
    }
    msn1 = msn;
  }
  concenso();
}

var con = [];

function concenso(){
  var cont = 0;
  for (var i = 0; i < puntos.length; i++) {
    if(i!=gen){
      cont=0;
      for (var j = 4; j < puntos[i].length; j++) {
        if(puntos[i][j] == false){
          cont++;
        }
      }
      con.push([i,cont]);
    }
  }
  var izq = 0;
  var der = con.length-1;
  ordenar_quick_sort(izq,der);
  document.getElementById("resp").innerHTML = "La cantidad de traidores es:<br>";
  var a = 0; 
  var str = "";
  for (var i = 0; i < puntos.length; i++) {
    if(puntos[i][3] == "traidor"){
      a++;
      str += i+",";
    }
  }
  document.getElementById("resp").innerHTML += a+"<br><br> Los nodos son:<br>"+str;
  document.getElementById("msn").style.display = "none";

}
function trazar_linea(p1,p2) {
  ctx.lineWidth = 2;
  ctx.strokeStyle = 'rgba(69, 89, 215, 0.5)';
  ctx.beginPath();
  ctx.moveTo(puntos[p1][1], puntos[p1][2]);
  ctx.lineTo(puntos[p2][1], puntos[p2][2]);
  ctx.stroke();
}

function trazar_linea_mitad(p1,p2,msg) {
  //primera linea
  ctx.lineWidth = 2;
  if(msg == false){
    ctx.strokeStyle = 'rgba(255, 38, 38, 0.5)';
    marcar_punto(p1);
  } else {
    ctx.strokeStyle = 'rgba(69, 89, 215, 0.5)';
  }
  
  ctx.beginPath();
  ctx.moveTo(puntos[p1][1], puntos[p1][2]);
  ctx.lineTo(((puntos[p1][1] + puntos[p2][1]) / 2), ((puntos[p1][2] + puntos[p2][2]) / 2));
  ctx.stroke();
}

function marcar_punto(p1) {
  ctx.fillStyle = "#ff2626"; // azul
  ctx.beginPath();
  ctx.arc(puntos[p1][1], puntos[p1][2], 5, 0, Math.PI * 2, true);
  ctx.fill();
}

function ordenar_quick_sort(izq, der){
  var pivote = con[izq][1];
  var piv_res = con[izq];
  var i = izq;
  var j = der;
  var aux;

  while (i < j) {
    while (con[i][1] <= pivote && i < j) {
      i++;
    }
    while (con[j][1] > pivote) {
      j--;
    }
    if (i < j) {
      aux = con[i];
      con[i] = con[j];
      con[j] = aux;
    }
  }

  con[izq] = con[j];
  con[j] = piv_res;
  if (izq < j - 1) {
    ordenar_quick_sort(izq,j-1);
  }
  if(j+1 < der){
    ordenar_quick_sort(j+1, der);
  }
}

/*

window.addEventListener("click", function(e) {
  if (activador == 0) {
    var rect = canvas.getBoundingClientRect();
    var x = e.clientX - rect.left;
    var y = e.clientY - rect.top;
    puntos.push([x, y, generarColor()]);
    drawCoordinates(x, y);
  } else {
    var rect = canvas.getBoundingClientRect();
    var x = e.clientX - rect.left;
    var y = e.clientY - rect.top;

    if (encontrar_punto(x, y) == true) {
      if (cont_linea == 0) {
        marcar_punto();
        cont_linea++;
      } else {
        trazar_linea();
        resetColor();
        cont_linea = 0;
      }
    }
  }

}, false);

function encontrar_punto(x, y) {
  for (var i = 0; i < puntos.length; i++) {
    if ((puntos[i][0] + 5) > x && (puntos[i][0] - 5) < x) {
      if ((puntos[i][1] + 5) > y && (puntos[i][1] - 5) < y) {
        console.log("c linea: " + cont_linea);
        if (cont_linea == 0) {
          bkcup_p1 = i;
          console.log("bk1: " + bkcup_p1);
        } else {
          bkcup_p2 = i;
          console.log("bk2: " + bkcup_p2);
        }
        i = puntos.length;
        return true;
      }
    }
  }
}

function marcar_punto() {
  ctx.fillStyle = "#4559D7"; // azul
  ctx.beginPath();
  ctx.arc(puntos[bkcup_p1][0], puntos[bkcup_p1][1], pointSize, 0, Math.PI * 2, true);
  ctx.fill();
}

function trazar_linea_mitad() {
  //primera linea
  ctx.lineWidth = 2;
  ctx.strokeStyle = puntos[bkcup_p1][2];
  ctx.beginPath();
  ctx.moveTo(puntos[bkcup_p1][0], puntos[bkcup_p1][1]);
  ctx.lineTo(((puntos[bkcup_p1][0] + puntos[bkcup_p2][0]) / 2), ((puntos[bkcup_p1][1] + puntos[bkcup_p2][1]) / 2));
  ctx.stroke();
  //segunda linea
  ctx.lineWidth = 2;
  ctx.strokeStyle = puntos[bkcup_p2][2];
  ctx.beginPath();
  ctx.moveTo(((puntos[bkcup_p1][0] + puntos[bkcup_p2][0]) / 2), ((puntos[bkcup_p1][1] + puntos[bkcup_p2][1]) / 2));
  ctx.lineTo(puntos[bkcup_p2][0], puntos[bkcup_p2][1]);
  ctx.stroke();
}

const generarColor = () => "#000000".replace(/0/g, () => (~~(Math.random() * 16)).toString(16))

function resetColor() {
  ctx.fillStyle = puntos[bkcup_p1][2]; // azul
  ctx.beginPath();
  ctx.arc(puntos[bkcup_p1][0], puntos[bkcup_p1][1], pointSize, 0, Math.PI * 2, true);
  ctx.fill();
}

function drawCoordinates(x, y) {
  ctx.fillStyle = puntos[puntos.length - 1][2]; // Red color
  ctx.beginPath();
  ctx.arc(x, y, pointSize, 0, Math.PI * 2, true);
  ctx.fill();
}

document.getElementById("button").addEventListener("click", function() {
  activador = 1;
});
*/
