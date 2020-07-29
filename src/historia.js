class Historia {

  constructor(juego) {
    this.juego = juego;
    this.pasos = [];
  }

  reiniciar() {
    this.pasos = [];
  }

  registrarMovimientoDibujando(posicion_inicial, entidad) {
    this.pasos.push({
      tipo: "movimiento-de-dibujado",
      posicion_inicial: JSON.parse(JSON.stringify(posicion_inicial)),
      entidad: JSON.parse(JSON.stringify(entidad)),
    });
  }

  registrarCambio(entidad) {
    this.pasos.push({
      tipo: "cambio",
      entidad: JSON.parse(JSON.stringify(entidad))
    });
  }

  obtenerCantidadDePasos() {
    return this.pasos.length;
  }

  obtenerPaso(numero) {
    return this.pasos[numero];
  }

  obtenerPasosHasta(numeroDePaso) {
    return this.pasos.slice(0, numeroDePaso);
  }

}

export default Historia;