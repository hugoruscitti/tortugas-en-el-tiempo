import Comportamiento from "@/comportamientos/comportamiento.js";

class SubirLapiz extends Comportamiento {

  constructor(entidad) {
    super();
    this.entidad = entidad;
    this.entidad.color = null;
  }

  actualizar() {
    return true;
  }

  get accion() {
    return "Subiendo lapiz";
  }

}

export default SubirLapiz;