import imagenes from "@/recursos/imagen_de_tortuga.js";
import Avanzar from "@/comportamientos/avanzar.js";
import Girar from "@/comportamientos/girar.js";
import SubirLapiz from "@/comportamientos/subir-lapiz.js";
import BajarLapiz from "@/comportamientos/bajar-lapiz.js";
import Historia from "@/historia.js";

class Juego {

  constructor() {
    this.historia = new Historia(this);
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
      color: "black",
    };

    this.comportamientoActual = null;

    this.dibujar();
    this.limpiarFondo();
  }

  async crearTortuga() {
    return new Promise((resolve) => {
      this.tortuga = new Image();
      this.tortuga.src = imagenes.IMAGEN_DE_TORTUGA;
      this.tortuga.onload = resolve
    })
  }

  dibujar() {
    this.limpiar();
    this.dibujarTortuga();
  }

  dibujarTortuga() {
    let contexto = this.canvas.getContext("2d");

    contexto.save();
    contexto.translate(this.entidad.x, this.entidad.y);
    contexto.rotate((Math.PI / 180) * this.entidad.rotacion);
    contexto.translate(-16, -16);
    contexto.drawImage(this.tortuga, 0, 0)

    contexto.restore();
  }

  redibujarPasoDesdeHistoria(numeroDePaso) {
    this.limpiarFondo();
    let pasos = this.historia.obtenerPasosHasta(numeroDePaso);

    // Vuelve a dibujar las lineas desde el paso 0 hasta el
    // paso actual.
    pasos.map(estado => {
      if (estado.tipo === "movimiento-de-dibujado") {
        this.dibujarLineaDesdeHistoria(estado.posicion_inicial, estado.entidad, "black");
      }
    })

    // Dibuja solamente la tortuga del último paso.
    let pasoFinal = this.historia.obtenerPaso(numeroDePaso);
    this.entidad = pasoFinal.entidad;
    this.limpiar();
    this.dibujarTortuga();

    // Si el paso actual justo termina de dibujar una linea la dibuja
    // pero en color azúl.
    if (pasoFinal.tipo === "movimiento-de-dibujado") {
      this.dibujarLineaDesdeHistoria(pasoFinal.posicion_inicial, pasoFinal.entidad, "#05d305");
    }
  }

  dibujarLineaDesdeHistoria(puntoOrigen, puntoDestino, color) {
    let contexto = this.canvasDeFondo.getContext("2d");
    contexto.beginPath();
    contexto.moveTo(puntoOrigen.x, puntoOrigen.y);
    contexto.lineTo(puntoDestino.x, puntoDestino.y);
    contexto.lineWidth = 2;
    contexto.strokeStyle = color;
    contexto.stroke();
  }

  limpiar() {
    let contexto = this.canvas.getContext("2d");
    contexto.clearRect(0, 0, 300, 300);
  }

  limpiarFondo() {
    let contexto = this.canvasDeFondo.getContext("2d");
    contexto.clearRect(0, 0, 300, 300);
  }

  ejecutar() {
    this.setIntervalID = setInterval(() => {
      this.actualizar();
      this.dibujar();
    }, 1000 / 60)

    this.store.commit("EJECUTAR");
    this.historia.reiniciar();

    // cuando comienza la ejecución siempre registrar
    // el punto inicial, así en modo pausa puede retroceder hasta
    // el cuadro 0.
    //
    // el resto de los cuadros se registran por el mismo comportamiento
    // cuando finaliza la ejecución del comportamiento.
    this.historia.registrarCambio(this.entidad);

  }

  detener() {
    this.store.commit("DETENER");
    clearInterval(this.setIntervalID);
    this.reiniciar();
  }

  pausar() {
    this.store.commit("PAUSAR");
    clearInterval(this.setIntervalID);
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
        this.comportamientoActual.guardarEstado(this.historia);
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