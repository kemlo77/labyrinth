describe('template spec', () => {

  beforeEach(() => {
    cy.visit('/');
  });

  it('clicking button reverses text', () => {
    cy.get('button').first().click();
    cy.get('input').should('have.value', 'triangular');
  });

});