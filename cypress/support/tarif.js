Cypress.Commands.add('changeTarifByName',(tarifSwitchName, action) =>{
    cy.get('.left-block .caption').contains(tarifSwitchName)
        .closest('.tariff-card')
        .find('.right-block button')
        .contains(action).click()
})
Cypress.Commands.add('signTarifAndPackage',(signType)=>{
    cy.get('div.dynamic-select__fake[title="Cпособ подтверждения документа"]').click()
    cy.get('div.selection-options__item').contains(signType).click()
    cy.get('input.dynamic-input__input').type('00')
    cy.get('.document-sign__wrapper [data-qa="1663074395452"]').should('contain','Подписать').click()
    cy.contains('div.selection-options__item',signType)
})
Cypress.Commands.add('checkTarifStatus',(status) =>{
    cy.get('[data-qa="1657805226006"] > svg > use').click()
    cy.get('div[data-qa="1657787078062"] div').contains('Заявления').click()
    cy.get('div.tariff-requests__list-item:first-of-type')
        .find('span.tariff-requests__list-text-dark')
        .closest('div.tariff-requests__list-right-col')
        .find('span:last-child').should('have.text',status)
})
Cypress.Commands.add('openTarifTab',(tabName) =>{
    cy.get('div[data-qa="1657787078062"] div').contains(tabName).click()
})

Cypress.Commands.add('checkTarifCaption',(expectedCaption) => {
    cy.get('.right-block div.caption').should('contain',expectedCaption)
})
Cypress.Commands.add('checkTarifText',(textToCheck) => {
    cy.get('.right-block div.text').should('contain',textToCheck)
})

Cypress.Commands.add('openPackageTab',() =>{
    cy.get('div.tabs div').contains('Дополнительные пакеты').click()
    cy.get('h3.tariff-packages-tab__title')
    .should('contain',' Подключить пакет можно в рабочий день Банка. Действие пакета начинается со следующего рабочего дня.')
    .and('contain',' Пакеты "30/60/90 платежей" и "платежи безлимитно" не могут действовать одновременно. ')
})

Cypress.Commands.add('addPackageByName',(packageName)=>{
cy.get('div.package-card .caption').contains(packageName)
.closest('.package-card')
.find('div.bottom-block button').contains('Подключить').click()
})

Cypress.Commands.add('chooseAccType',(accType) =>{
    cy.get('.arrow-down > use').click()
    cy.get('div.custom-select__container__item').contains(accType).click()
})