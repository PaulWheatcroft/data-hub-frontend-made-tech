describe('Inline', () => {
  it('should render the inline component correctly', () => {
    cy.visit('/iframe.html?id=buttonlink--inline')
    cy.get('#storybook-root')
      .should('be.visible')
      .compareSnapshot('buttonlink-inline')
  })
})
