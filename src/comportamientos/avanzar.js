import Comportamiento from "@/comportamientos/comportamiento.js";

class Avanzar extends Comportamiento {

  constructor(pasos) {
    super();
    this.pasos = pasos;
  }

  actualizar() {
    this.entidad.x += Math.cos(this.rotacionEnRadianes);
    this.entidad.y += Math.sin(this.rotacionEnRadianes);
    this.pasos -= 1;

    if (this.pasos <= 0) {
      return true;
    }
  }

  get accion() {
    return "Avanzando";
  }

}

export default Avanzar;