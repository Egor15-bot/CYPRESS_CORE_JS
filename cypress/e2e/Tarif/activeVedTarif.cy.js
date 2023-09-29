describe('', () => {
    beforeEach(() => {
        cy.loginStand()
        cy.changeCompanyApi('7978104')
        cy.visit('/tarif')
    })
    it('Активный > Комплексный ', () => {
    cy.openTarifTab('Тарифы и пакеты')
    cy.changeTarifByName('Тариф Комплексный','Подключить',' Белоусова_Подпись ')
    cy.checkTarifCaption('Заявка отправлена в банк')
    cy.checkTarifSuccessSignText()
    cy.checkTarifStatus('В обработке')

    cy.openTarifTab('Тарифы и пакеты')
    cy.changeTarifByName('Тариф Комплексный','Отменить',' Белоусова_Подпись ')
    cy.cehckTarifCaption('Заявка на отзыв отправлена в банк')
    cy.checkTarifStatus('Отозван')
    })

    it('Активный > Расчетный', () => {
        cy.openTarifTab('Тарифы и пакеты')
        cy.changeTarifByName('Тариф Расчетный','Подключить',' Белоусова_Подпись ')
        cy.checkTarifCaption('Заявка отправлена в банк')
        cy.checkTarifSuccessSignText()
        cy.checkTarifStatus('В обработке')
    
        cy.openTarifTab('Тарифы и пакеты')
        cy.changeTarifByName('Тариф Расчетный','Отменить',' Белоусова_Подпись ')
        cy.cehckTarifCaption('Заявка на отзыв отправлена в банк')
        cy.checkTarifStatus('Отозван')
        })

        
})
