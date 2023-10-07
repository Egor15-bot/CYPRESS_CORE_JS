Cypress.Commands.add("changeTarifByName", (tarifSwitchName, action) => {
  cy.get(".left-block .caption")
    .contains(tarifSwitchName)
    .closest(".tariff-card")
    .find(".right-block button")
    .contains(action)
    .click();
});
Cypress.Commands.add('closeCurrentTab',()=>{
  cy.get('.page-title__svg > svg > use').click()
})
Cypress.Commands.add("signTarifAndPackage", (signType) => {
  cy.get(
    'div.dynamic-select__fake[title="Cпособ подтверждения документа"]'
  ).click();
  cy.get("div.selection-options__item").contains(signType).click();
  cy.get("input.dynamic-input__input").type("00");
  cy.get('.document-sign__wrapper [data-qa="1663074395452"]')
    .should("contain", "Подписать")
    .click();
  cy.contains("div.selection-options__item", signType);
});
Cypress.Commands.add('checkPackageStatus',(status) =>{
  cy.get('div[data-qa="1657787078062"] div').contains("Заявления").click();
  cy.get("div.tariff-requests__list-item:first-of-type")
    .find("span.tariff-requests__list-text-dark")
    .closest("div.tariff-requests__list-right-col")
    .find("span:last-child")
    .should("have.text", status);
})
Cypress.Commands.add("checkTarifStatus", (status) => {
  cy.visit("/tarif");
  cy.get('div[data-qa="1657787078062"] div').contains("Заявления").click();
  cy.get("div.tariff-requests__list-item:first-of-type")
    .find("span.tariff-requests__list-text-dark")
    .closest("div.tariff-requests__list-right-col")
    .find("span:last-child")
    .should("have.text", status);
});
Cypress.Commands.add("openTarifTab", (tabName) => {
  cy.get('div[data-qa="1657787078062"] div').contains(tabName).click();
});

Cypress.Commands.add("checkTarifCaption", (expectedCaption) => {
  cy.get(".right-block div.caption").should("contain", expectedCaption);
});
Cypress.Commands.add("checkTarifText", (textToCheck) => {
  cy.get(".right-block div.text").should("contain", textToCheck);
});

Cypress.Commands.add("openPackageTab", () => {
  cy.get("div.tabs div").contains("Дополнительные пакеты").click();
  cy.get("h3.tariff-packages-tab__title")
    .should(
      "contain",
      " Подключить пакет можно в рабочий день Банка. Действие пакета начинается со следующего рабочего дня."
    )
    .and(
      "contain",
      ' Пакеты "30/60/90 платежей" и "платежи безлимитно" не могут действовать одновременно. '
    );
});

Cypress.Commands.add("addPackageByName", (packageName) => {
  cy.get("div.package-card .caption")
    .contains(packageName)
    .closest(".package-card")
    .find("div.bottom-block button")
    .contains("Подключить")
    .click();
});

Cypress.Commands.add("chooseAccType", (accType) => {
  cy.wait(2000);
  cy.get(".arrow-down > use").click();
  cy.get("div.custom-select__container__item").contains(accType).click();
});

Cypress.Commands.add("cancelTariff", () => {
  //Получение одного письма по фильтру который находится в статусе В обработке
  cy.request({
    method: "POST",
    url: "https://pred-ul.metib.online/rest/stateful/corp/document/list",
    headers: {
      "Content-Type": "application/json",
    },
    body: {
      docModule: "ibankul",
      docType: "change_tariff_ul_req",
      filter: "(status='send' or status='for_send')",
    },
  }).then((response) => {
    const currentId = response.body.changeTariffUlReqDocument.id;
    cy.wrap(currentId).as("currentId");
  });
  // Передача id документа на удаление
  cy.get("@currentId").then((currentId) => {
    cy.request({
      method: "POST",
      url: "https://pred-ul.metib.online/rest/stateful/corp/request/process/ul_request_cancel",
      body: {
        cancelDocId: currentId,
        cause: "Отзыв по инициативе клиента",
      },
      headers: {
        "Content-Type": "application/json",
      },
    }).then((response) => {
      const cancelId = response.body.id;
      cy.wrap(cancelId).as("cancelId");
    });
  });
  //Рест сертификата
  cy.request({
    method: "GET",
    url: "https://pred-ul.metib.online/rest/stateful/corp/crypto/certificate",
  });
  //Выбор типа подписи через certId
  cy.get("@cancelId").then((cancelId) => {
    cy.request({
      method: "POST",
      url: "https://pred-ul.metib.online/rest/stateful/corp/document/sign/v2",
      headers: {
        "Content-Type": "application/json",
      },
      body: {
        certId: "3621127  ",
        docModule: "ibankul",
        docType: "request_cancel",
        docIds: [cancelId],
      },
    });
  });
  //Подпись документа с 00
  cy.get("@cancelId").then((cancelId) => {
    cy.request({
      method: "POST",
      url: "https://pred-ul.metib.online/rest/stateful/corp/document/sign/v2",
      headers: {
        "Content-Type": "application/json",
      },
      body: {
        certId: "3621127",
        libId: "90342",
        inputCode: "00",
        docModule: "ibankul",
        docType: "request_cancel",
        docIds: [cancelId],
      },
    });
  });
  // Запрос для получения документа по текущему статусу
  cy.get("@cancelId").then((cancelId) => {
    cy.request({
      method: "GET",
      url: `https://pred-ul.metib.online/rest/stateful/corp/document/visual/byid?doc_module=ibankul&doc_type=request_cancel&doc_ids=${cancelId}`,
      headers: {
        "Accept": "application/json, text/plain, */*",
      },
    });
  });
  // Обновление статуса документа 
  cy.get("@cancelId").then((cancelId) => {
    cy.request({
      method: "PUT",
      url: `https://pred-ul.metib.online/rest/stateful/corp/document/send?doc_module=ibankul&doc_type=request_cancel&doc_ids=${cancelId}`,
      headers: {
        "Accept": "application/json, text/plain, */*",
      },
    });
  });
});
Cypress.Commands.add('checkDocsOrder', () => {
  cy.get("div.tariff-requests__list-item ")
    .find("div.tariff-requests__list-left-col .tariff-requests__list-text-dark")
    .filter(':contains("Заявление на смену тарифного плана")')
    .closest("div.tariff-requests__list-item")
    .find("div.tariff-requests__list-right-col span.tariff-requests__list-text-dark")
    .then((elements) => {
      const dates = [];
      cy.wrap(elements).each((element) =>{
          cy.wrap(element).invoke('text').then((text)=>{
          const parts = text.split(' ');
          const date = parts[parts.length - 1];
          dates.push(date)
        })      
      })
      .then(()=>{
        for (let i = 0; i < dates.length - 1; i++) {
          const currentDate = new Date(dates[i].split('.').reverse().join('-'));
          const nextDate = new Date(dates[i + 1].split('.').reverse().join('-'));
          expect(currentDate).to.be.at.most(nextDate);
        }
      })
    });
});

