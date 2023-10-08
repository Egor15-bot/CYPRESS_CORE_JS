describe("Снятие с учета Документы", () => {
  beforeEach("", () => {

    cy.loginApi('TOKEN_VED');
    cy.changeCompanyApi("3894372");
    cy.visit('/ved')
  });

  it("#1842 - Статусы по снятию с учета", () => {
    cy.openVedTab("Документы");
    cy.openVedSubTab("Прочие документы");
    cy.setDatePickerTo("Год");
    cy.setDocType("Снятие с учета");
    
  });
  it.only("# - Информация по Снятие с учета", () => {
    cy.openVedTab("Документы");
    cy.openVedSubTab("Прочие документы");
    cy.setDatePickerTo("Год");
    cy.setDocType("Снятие с учета");
    cy.get("div.doc-item__item")
      .first()
      .click()
      .within(() => {
        cy.contains('div.title-with-desc__title','Номер контракта/кредитного договора')
        cy.get('div.title-with-desc__desc')
        cy.contains('div.title-with-desc__title','Исполнитель')
        cy.contains('div.title-with-desc__title','Основание для снятия')
      });
  });
});
