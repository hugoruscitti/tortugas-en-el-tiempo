import imagenes from "@/imagen_de_tortuga.js";

export default class {

  async iniciar(canvas) {
    this.canvas = canvas;
    await this.crearTortuga();
    this.reiniciar();

    this.comportamientos = [];
    this.comportamientoActual = null;
  }

  reiniciar() {
    this.entidad = {
      x: 100,
      y: 100,
      rotacion: 0,
      accion: "demo"
    };

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

    //this.contexto.rect(10, 10, 20, 20);
    //this.contexto.fill();
    this.contexto.font = '14px verdana';
    this.contexto.fillText(this.entidad.accion, 10, 20);

    this.contexto.save();
    //this.contexto.rotate(this.entidad.rotacion);
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
    }, 1000 / 30)
  }

  detener() {
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
      this.entidad.accion = this.comportamientoActual.accion;
    } else {
      this.comportamientoActual = null;
      this.entidad.accion = "Reposando";
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

class Comportamiento {

  iniciar(entidad) {
    this.entidad = entidad;
  }

  actualizar() {}

  get rotacionEnRadianes() {
    return (this.entidad.rotacion * Math.PI) / 180 - Math.PI / 2;
  }

}


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

class Rotar extends Comportamiento {

  constructor(grados) {
    super();
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