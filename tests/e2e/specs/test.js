// https://docs.cypress.io/api/introduction/api.html

describe('Acceso', () => {
  it('Puede abrir la aplicación', () => {
    cy.visit('/')
    cy.contains('Editor')
  });

  it('Puede visitar la sección Acerca de...', () => {
    cy.visit('/')
    cy.contains('Acerca de...').click();
    cy.contains('h1', 'Tortugas en el tiempo');
  });

})