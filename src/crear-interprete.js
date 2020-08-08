function crearIntérprete(código, instanciaDeJuego) {

  function inicializar(_in, contexto) {

    var avanzar = function(cantidad, cuandoTermina) {
      return instanciaDeJuego.avanzar(cantidad, cuandoTermina);
    };

    var girarDerecha = function(grados, cuandoTermina) {
      return instanciaDeJuego.girarDerecha(grados, cuandoTermina);
    }

    var girarIzquierda = function(grados, cuandoTermina) {
      return instanciaDeJuego.girarIzquierda(grados, cuandoTermina);
    }

    var subirLapiz = function(cuandoTermina) {
      return instanciaDeJuego.subirLapiz(cuandoTermina);
    }

    var bajarLapiz = function(cuandoTermina) {
      return instanciaDeJuego.bajarLapiz(cuandoTermina);
    }

    _in.setProperty(contexto, 'avanzar', _in.createAsyncFunction(avanzar));
    _in.setProperty(contexto, 'girarDerecha', _in.createAsyncFunction(girarDerecha));
    _in.setProperty(contexto, 'girarIzquierda', _in.createAsyncFunction(girarIzquierda));
    _in.setProperty(contexto, 'subirLapiz', _in.createAsyncFunction(subirLapiz));
    _in.setProperty(contexto, 'bajarLapiz', _in.createAsyncFunction(bajarLapiz));
  }

  return new Interpreter(código, inicializar);
}

export default crearIntérprete;