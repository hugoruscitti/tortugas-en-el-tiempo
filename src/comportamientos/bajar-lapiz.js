import Comportamiento from "@/comportamientos/comportamiento.js";

class BajarLapiz extends Comportamiento {

  constructor(entidad) {
    super();
    this.entidad = entidad;
    this.entidad.color = "black";
  }

  actualizar() {
    return true;
  }

  get accion() {
    return "Bajando lapiz";
  }

}

export default BajarLapiz;