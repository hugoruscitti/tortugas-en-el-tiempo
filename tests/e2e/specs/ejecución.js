describe('Ejecución', () => {
  it('Puede ejecutar el programa', () => {
    cy.visit('/')
    cy.contains('Editor')

    cy.contains("Ejecutar").click();
    cy.contains("Detener");
    cy.contains("Pausar e inspeccionar");

    // Espera a que aparezca el texto de la tortuga finalizando
    // la ejecución.
    cy.contains("La tortuga está: esperando");
    cy.contains("Detener").click();
  });

  it('Puede inspeccionar en el modo pausa', () => {
    cy.visit('/')
    cy.contains("Ejecutar").click();

    // Espera a que aparezca el texto de la tortuga finalizando
    // la ejecución.
    cy.contains("La tortuga está: esperando");
    cy.contains("Pausar e inspeccionar").click();

    cy.get("input[type='range']").should("have.value", "3");

    cy.get("input[type='range']")
      .invoke('val', "0")
      .trigger('change');

    cy.contains("Detener").click();
  });

})