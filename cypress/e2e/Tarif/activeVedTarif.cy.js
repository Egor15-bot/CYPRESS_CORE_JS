describe('', () => {
    beforeEach(() => {
        cy.loginStand()
        cy.changeCompanyApi('7978104')
        cy.visit('/tarif')
        // cy.openBurgerTab('Управление тарифами').url().should('contain', '/tarif')
    })
    it.only('Смена на ', () => {
    cy.changeTarifByName('Тариф Комплексный','Подключить',' Белоусова_Подпись ')

    cy.visit('/tarif')
    cy.get('div[data-qa="1657787078062"] div').contains('Заявления').click()
    cy.get('div.tariff-requests__list-item:first-of-type').as('parent-block')
        .find('.tariff-requests__list-right-col')
        .find('span:last-child').should('contain','Отказан')//TODO:Пересмотреть через FILTER
        .closest('@parent-block')
        .find('div.tariff-requests__list-left-col .tariff-requests__list-text-err span')
        .should('contain','#1: Уже принята заявка на изменение тарифа, сначала отмените ранее созданную заявку.')

        // cy.get('div[class="sign-result ng-star-inserted"]')
        // .filter('.caption').contains('Заявка отправлена в банк')
        // .filter('text').contains(' Тариф начнет действовать при отсутствии не оплаченной комиссии банку ')
  
    })

        
})