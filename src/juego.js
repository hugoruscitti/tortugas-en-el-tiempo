import imagenes from "@/recursos/imagen_de_tortuga.js";
import Avanzar from "@/comportamientos/avanzar.js";
import Rotar from "@/comportamientos/rotar.js";

class Juego {

  constructor() {

  }

  async iniciar(canvas, vuexStore) {
    this.canvas = canvas;
    this.store = vuexStore;

    await this.crearTortuga();
    this.reiniciar();

    window.juego = this;
  }

  reiniciar() {
    this.entidad = {
      x: 150,
      y: 150,
      rotacion: 0,
    };

    this.comportamientos = [];
    this.comportamientoActual = null;

    this.dibujar();
  }

  async crearTortuga() {
    return new Promise((resolve) => {
      this.tortuga = new Image();
      this.tortuga.src = imagenes.IMAGEN_DE_TORTUGA;
      this.tortuga.onload = resolve
    })
  }

  get contexto() {
    return this.canvas.getContext("2d");
  }

  dibujar() {
    this.limpiar();

    this.contexto.save();
    this.contexto.translate(this.entidad.x, this.entidad.y);
    this.contexto.rotate((Math.PI / 180) * this.entidad.rotacion);
    this.contexto.translate(-16, -16);
    this.contexto.drawImage(this.tortuga, 0, 0)

    this.contexto.restore();
  }

  limpiar() {
    this.contexto.clearRect(0, 0, 300, 300);
  }

  ejecutar() {
    this.setIntervalID = setInterval(() => {
      this.actualizar();
      this.dibujar();
    }, 1000 / 60)

    this.store.commit("EJECUTAR");
  }

  detener() {
    this.store.commit("DETENER");
    clearInterval(this.setIntervalID);
    this.reiniciar();
  }

  actualizar() {
    if (this.comportamientoActual) {
      let termina = this.comportamientoActual.actualizar();

      if (termina) {
        this.adoptarSiguienteComportamiento();
      }
    } else {
      this.adoptarSiguienteComportamiento();
    }
  }

  adoptarSiguienteComportamiento() {
    if (this.comportamientos.length > 0) {
      this.comportamientoActual = this.comportamientos.shift();
      this.comportamientoActual.iniciar(this.entidad);
      this.store.commit("DEFINIR_ACCION_DE_LA_TORTUGA", this.comportamientoActual.accion);
    } else {
      this.comportamientoActual = null;
      this.store.commit("DEFINIR_ACCION_DE_LA_TORTUGA", "Reposando");
    }
  }

  /* Comportamientos */

  avanzar(cantidad) {
    this.comportamientos.push(new Avanzar(cantidad));
  }

  rotar(grados) {
    this.comportamientos.push(new Rotar(grados));
  }

}

export default new Juego();