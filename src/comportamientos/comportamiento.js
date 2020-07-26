class Comportamiento {

  iniciar(entidad) {
    this.entidad = entidad;
  }

  actualizar() {}

  get rotacionEnRadianes() {
    return (this.entidad.rotacion * Math.PI) / 180 - Math.PI / 2;
  }

}


export default Comportamiento;