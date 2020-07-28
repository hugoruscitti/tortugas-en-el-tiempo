import Comportamiento from "@/comportamientos/comportamiento.js";

class Avanzar extends Comportamiento {

  constructor(canvasDeFondo, entidad, pasos) {
    super();
    this.canvasDeFondo = canvasDeFondo;
    this.entidad = entidad;
    this.pasos = pasos;

    this.posicion_inicial = { x: this.entidad.x, y: this.entidad.y }
    this.posicion_anterior = { x: this.entidad.x, y: this.entidad.y }
  }

  actualizar() {
    this.entidad.x += Math.cos(this.rotacionEnRadianes);
    this.entidad.y += Math.sin(this.rotacionEnRadianes);
    this.pasos -= 1;

    this.dibujarLinea();

    this.posicion_anterior = { x: this.entidad.x, y: this.entidad.y }

    if (this.pasos <= 0) {
      return true;
    }
  }

  dibujarLinea() {
    let contexto = this.canvasDeFondo.getContext("2d");
    contexto.beginPath();
    contexto.moveTo(this.posicion_anterior.x, this.posicion_anterior.y);
    contexto.lineTo(this.entidad.x, this.entidad.y);
    contexto.lineWidth = 2;
    contexto.strokeStyle = '#000000';
    contexto.stroke();
  }

  get accion() {
    return "Avanzando";
  }

}

export default Avanzar;