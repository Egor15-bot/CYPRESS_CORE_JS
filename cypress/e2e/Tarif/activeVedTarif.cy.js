describe('', () => {
    beforeEach(() => {
        cy.loginStand()
        cy.changeCompanyApi('7978104')
        cy.visit('/')
        cy.openBurgerTab('Управление тарифами').url().should('contain', '/tarif')
    })
    it.only('Смена на ', () => {
    cy.changeTarifByName('Тариф Комплексный','Белоусова_Подпись','Подключить')
    // cy.signToChangeTarif('Подписать',' Белоусова_Подпись ')//TODO:ПЕРЕДАЛТЬ МЕТОДЫ И ЛОГИКУ
    // cy.signToChangeTarif('Отменить',' Белоусова_Подпись ')
    //   cy.get('div.sign-result')
    //     .find('.caption').should('contain','Заявка отправлена в банк')
    //     .siblings('.text').should('contain',' Тариф начнет действовать с при отсутствии не оплаченной комиссии банку ')
    //     .siblings('[data-qa="1663074395452"]').should('contain','Отменить').and('be.visible')
    //   cy.get('div.right-block').within(() =>{
    //     cy.get('div.dynamic-select__fake[title="Cпособ подтверждения документа"]').click()
    //     cy.get('div.selection-options__item').contains(' Белоусова_Подпись ').click()
    //     cy.get('input.dynamic-input__input').type('00')
    //     cy.get('button[data-qa="1663074395452"]').contains('Подписать').click()
    //   })
        // cy.get('div[class="tariff-card"] div.caption').contains('Комплексный').click()//TODO: Добавить в Cypress commands js
        // //button[data-qa="1663074395452"] - Кнопка Подключить
        // cy.get('button[data-qa="1663074395452"]')

        // cy.get('tariff-card').each(() => {
        //     cy.contains('.caption','Комплексный').find('button[data-qa="1663074395452"]').contains('Подключить').click()
        // })
        // cy.get('div[class="dynamic-select__fake placeholder"]').contains('Способ подтверждения документа').click()
        // cy.get('div.selection-options__item').contains('Подпись').click()
        // cy.get('div.dynamic-select__fake').contains('Белоусова_Подпись')
        // cy.get('input[class="dynamic-input__input ng-pristine ng-valid ng-touched"]').type('00')
        // cy.get('button[data-qa="1663074395452"]').contains('Подключить').click()






        // cy.get('div[class="sign-result ng-star-inserted"]')
        // .filter('.caption').contains('Заявка отправлена в банк')
        // .filter('text').contains(' Тариф начнет действовать при отсутствии не оплаченной комиссии банку ')
  
    })

        
})