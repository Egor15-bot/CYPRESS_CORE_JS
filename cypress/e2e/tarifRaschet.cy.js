describe('', () => {
    beforeEach(() => {
        cy.loginStand()
        cy.changeCompanyApi('3448774')
        cy.visit('/')
        cy.openBurgerTab('Управление тарифами').url().should('contain', '/tarif')
    })
    it('Смена на ', () => {

    })
})