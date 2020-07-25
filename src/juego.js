import imagenes from "@/imagen_de_tortuga.js";


export default class {

  async iniciar(canvas) {
    this.canvas = canvas;
    await this.crearTortuga();
    this.reiniciar();
  }

  reiniciar() {
    this.x = 80;
    this.y = 80;
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
    this.contexto.drawImage(this.tortuga, this.x - 16, this.y - 16);
  }

  limpiar() {
    this.contexto.clearRect(0, 0, 300, 300);
  }

  ejecutar() {
    this.setIntervalID = setInterval(() => {
      this.actualizar();
      this.dibujar();
    }, 1000 / 20)
  }

  detener() {
    clearInterval(this.setIntervalID);
    this.reiniciar();
  }

  actualizar() {
    this.x += 1;
    this.y += 1;
  }

}