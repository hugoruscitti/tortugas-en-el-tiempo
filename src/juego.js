import imagenes from "@/recursos/imagen_de_tortuga.js";
import Avanzar from "@/comportamientos/avanzar.js";
import Girar from "@/comportamientos/girar.js";
import SubirLapiz from "@/comportamientos/subir-lapiz.js";
import BajarLapiz from "@/comportamientos/bajar-lapiz.js";

class Juego {

  constructor() {

  }

  async iniciar(canvas, canvasDeFondo, vuexStore) {
    this.canvas = canvas;
    this.canvasDeFondo = canvasDeFondo;
    this.store = vuexStore;

    await this.crearTortuga();
    this.reiniciar();
  }

  reiniciar() {
    this.entidad = {
      x: 150,
      y: 150,
      rotacion: 0,
      color: null,
    };

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

  hacer(comportamiento, cuandoTermina) {
    this.store.commit("DEFINIR_ACCION_DE_LA_TORTUGA", comportamiento.accion);
    this.cuandoTermina = cuandoTermina;

    if (this.comportamientoActual) {
      throw new Error("Ya hay un comportamiento en ejecución.");
    }

    this.comportamientoActual = comportamiento;
  }

  actualizar() {
    if (this.comportamientoActual) {
      let termina = this.comportamientoActual.actualizar();

      if (termina) {
        this.cuandoTermina();
        this.comportamientoActual = null;
        this.cuandoTermina = null;

        //this.store.commit("DEFINIR_ACCION_DE_LA_TORTUGA", "Reposando");
      }
    }
  }

  /* Comportamientos */

  avanzar(cantidad, cuandoTermina) {
    let comportamiento = new Avanzar(this.canvasDeFondo, this.entidad, cantidad);
    this.hacer(comportamiento, cuandoTermina);
  }

  girarDerecha(grados, cuandoTermina) {
    let comportamiento = new Girar(this.entidad, grados);
    this.hacer(comportamiento, cuandoTermina);
  }

  subirLapiz(cuandoTermina) {
    let comportamiento = new SubirLapiz(this.entidad);
    this.hacer(comportamiento, cuandoTermina);
  }

  bajarLapiz(cuandoTermina) {
    let comportamiento = new BajarLapiz(this.entidad);
    this.hacer(comportamiento, cuandoTermina);
  }

}

export default new Juego();