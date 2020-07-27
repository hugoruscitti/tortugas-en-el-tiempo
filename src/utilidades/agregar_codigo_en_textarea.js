export default function(el, codigo) {
  let start = el.selectionStart
  let end = el.selectionEnd
  const text = el.value
  const distanciaAlSaltoDeLinea = text.substring(end, text.length).indexOf("\n");

  // en caso de que se quiera insertar el texto en medio de otra sentencia
  // "mueve" el cursor hacia la derecha hasta el primer salto de linea e intenta
  // añadir el código desde ahí.
  if (distanciaAlSaltoDeLinea !== -1) {
    start += distanciaAlSaltoDeLinea;
    end += distanciaAlSaltoDeLinea;
  } else {
    // si está en la última linea del archivo se mueve al final.
    start += text.substring(end, text.length).length;
    end += text.substring(end, text.length).length;
  }

  const before = text.substring(0, start)
  const after = text.substring(end, text.length)

  // Agrega el código evitando colocarlo en la misma linea
  // que el código actual.
  if (before.endsWith("\n") || before == "") {
    el.value = (before + codigo + after)
  } else {
    el.value = (before + '\n' + codigo + after)
  }

  el.selectionStart = el.selectionEnd = start + codigo.length + 1;
  el.focus()

}