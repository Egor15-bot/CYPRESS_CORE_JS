Cypress.Commands.add('openVedTab',(tabName)=>{
    cy.get('[data-qa="1657787078062"]').contains(tabName).click()
})
Cypress.Commands.add('setDatePickerTo',(period)=>{
    cy.get('span.title-item.clickable').click()
    cy.get('div.menu-select.open').contains(period).click()
})

Cypress.Commands.add('openVedSubTab',(tabName)=>{
    cy.get('div.ved-tabs .tab').contains(tabName).click()
})

Cypress.Commands.add('setDocType',(docType) =>{
    cy.get('div.multi-select__title').contains('Все типы').click()
    cy.get('[data-qa="16589845151673"] div.multi-select__menu > div > app-checkbox').contains('Все типы').uncheck()
    cy.get('[data-qa="16589845151673"] div.multi-select__menu > div > app-checkbox').contains(docType).check()
})

Cypress.Commands.add('setDocStatus',(docStatus) =>{
    cy.get('div.multi-select__title').contains('Все статусы документов').click()
})