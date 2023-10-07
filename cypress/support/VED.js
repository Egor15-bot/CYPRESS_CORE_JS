Cypress.Commands.add('openVedTab',(tabName)=>{
    cy.get('[data-qa="1657787078062"]').contains(tabName).click()
})
Cypress.Commands.add('setDatePickerTo',(period)=>{
    cy.get('span.title-item.clickable').click()
    cy.get('div.menu-select.open').contains(period).click()
})