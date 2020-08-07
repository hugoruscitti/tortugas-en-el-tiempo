describe('Código', () => {
  it('Puede añadir código en el editor', () => {
    cy.visit('/')
    cy.contains('Editor')

    // Hay solo 3 lineas de código.
    cy.get(".view-line").should("have.length", 3)

    // Si pulsa los botones de la derecha, puede crear más lineas.
    cy.contains("Avanzar").click();
    cy.contains("Girar Hacia La Derecha").click();

    cy.get(".view-line").should("have.length", 5)

    // Ejecuta y espera a que finalice
    cy.contains("Ejecutar").click();
    cy.contains("La tortuga está: esperando");
    cy.contains("Detener").click();
  });
})