import Comportamiento from "@/comportamientos/comportamiento.js";

class Girar extends Comportamiento {

  constructor(entidad, grados) {
    super();
    this.entidad = entidad;
    this.grados = grados;
    this.gradosRecorridos = 0;

    if (grados > 0) {
      this.delta = 1;
    } else {
      this.delta = -1;
    }
  }

  actualizar() {
    this.entidad.rotacion += this.delta;
    this.gradosRecorridos += this.delta;

    if (this.grados > 0) {
      if (this.gradosRecorridos >= this.grados) {
        return true;
      }
    } else {
      if (this.gradosRecorridos <= this.grados) {
        return true;
      }
    }
  }

  get accion() {
    return "Girando";
  }

}

export default Girar;