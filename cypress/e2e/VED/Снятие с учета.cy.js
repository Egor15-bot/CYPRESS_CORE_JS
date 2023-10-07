describe('Снятие с учета',()=>{
    beforeEach('', () => {
        cy.loginApi('TOKEN_VED');
        cy.changeCompanyApi("3894372");
        cy.visit("/ved");
      })

      it.only('#1842 - Статусы по снятию с учета',()=>{
        cy.openVedTab('Документы')
        cy.setDatePickerTo('Год') 
      })
})