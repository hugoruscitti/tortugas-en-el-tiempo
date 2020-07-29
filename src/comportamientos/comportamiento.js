class Comportamiento {

  actualizar() {}

  get rotacionEnRadianes() {
    return (this.entidad.rotacion * Math.PI) / 180 - Math.PI / 2;
  }

  guardarEstado(historia) {
    throw Error("Este método se tiene que implementar Comportamiento#guardarEstado");
  }

}


export default Comportamiento;