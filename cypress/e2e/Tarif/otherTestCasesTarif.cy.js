describe("", () => {
  beforeEach(() => {
    cy.loginApi();
    cy.changeCompanyApi("298642");
    cy.visit("/tarif");
  });
  it("#3201 - Основные положения", () => {});
  it("#3238 - Тариф подпись", () => {
    cy.openTarifTab("Тарифы и пакеты");
    cy.changeTarifByName("Тариф Расчетный", "Подключить");
    cy.signTarifAndPackage(" Зюкина Кристина Виореловна ");
    cy.checkTarifCaption("Заявка отправлена в банк");
    cy.checkTarifText(" Тариф начнет действовать ");
    cy.checkTarifStatus("В обработке");
  });
  it("#3239 - Тариф подпись частичная", () => {
    cy.openTarifTab("Тарифы и пакеты");
    cy.changeTarifByName("Тариф Расчетный", "Подключить");
    cy.signTarifAndPackage(" Зюкина Кристина Виореловна1 ");
    cy.checkTarifCaption("Заявка частично подписана");
    cy.checkTarifText("Необходимо поставить вторую подпись");
    cy.changeTarifByName("Тариф Расчетный", "Подписать");
    cy.signTarifAndPackage(" Зюкина Кристина Виореловна2 ");
    cy.checkTarifCaption("Заявка отправлена в банк");
    cy.checkTarifStatus("В обработке");
  });
  it("#3351 - Отмена заявки на тариф", () => {
    cy.openTarifTab("Тарифы и пакеты");
    cy.changeTarifByName("Тариф Расчетный", "Подключить");
    cy.signTarifAndPackage(" Зюкина Кристина Виореловна ");
    cy.checkTarifCaption("Заявка отправлена в банк");
    cy.checkTarifText(" Тариф начнет действовать ");
    cy.checkTarifStatus("В обработке");
    cy.openTarifTab("Тарифы и пакеты");
    cy.changeTarifByName("Тариф Расчетный", "Отменить");
    cy.signTarifAndPackage(" Зюкина Кристина Виореловна ");
    cy.checkTarifText("Заявка на отзыв отправлена в банк");
    cy.checkTarifStatus("Отозван");
  });
  it("#3202 - Отображение активных тарифов", () => {
    cy.openTarifTab("Тарифы и пакеты");
    cy.get("div.tariff-card ").should("have.length", "2").and("be.visible");
  });
  it("#3203 - Проверка заявления на тариф", () => {
    cy.openTarifTab("Тарифы и пакеты");
    cy.changeTarifByName("Тариф Расчетный", "Подключить");
    cy.signTarifAndPackage(" Зюкина Кристина Виореловна ");
    cy.checkTarifCaption("Заявка отправлена в банк");
    cy.checkTarifText(" Тариф начнет действовать ");
    cy.checkTarifStatus("В обработке");
  });
  it("#3115 - Отсутствует тариф", () => {
    cy.get("app-empty-stub div.empty-stub p").should(
      "contain",
      "Нет информации для отображения."
    );
  });
  it('#3128 - Смена тарифа, кнопка "Сменить', () => {
    cy.openTarifTab("Тарифы и пакеты");
    cy.get(
      ".tariff-details-header__title-wrapper .arrow-toggle__arrow"
    ).click();
    cy.get('[data-qa="1663074395452"] > span i')
      .should("contain", "Сменить ")
      .click();
    cy.get("div.page-title__text").should("contain", "Тарифы и пакеты");
    cy.get("div.tariff-card").should("have.length", "2");
    cy.get("div.tariff-card .caption").contains("Комплексный");
    cy.get("div.tariff-card .caption").contains("Тариф ‎Активный ВЭД‎");
  });
  it.skip("#3205 - Подпись. Токен", () => {});
  it.skip("#3503 - Подпись частичная Токен", () => {});
  it("#3522 Смена тарифа при активной заявке", () => {
    cy.openTarifTab("Тарифы и пакеты");
    cy.changeTarifByName("Тариф Расчетный", "Подключить");
    cy.signTarifAndPackage(" Зюкина Кристина Виореловна ");
    cy.checkTarifCaption("Заявка отправлена в банк");
    cy.checkTarifText(" Тариф начнет действовать ");
    cy.changeTarifByName("Тариф ‎Активный ВЭД‎", "Подключить");
    cy.checkRedToastInfo(
      'У вас уже есть заявка на подключение тарифа "Тариф Расчетный". Для перехода на другой тариф, отмените текущую заявку'
    );
  });
  it.skip("#3523 Смена тарифа при активной частичной заявке", () => {});
  it("#3135 Пакеты подпись", () => {
    cy.openTarifTab("Тарифы и пакеты");
    cy.openPackageTab();
    cy.chooseAccType("Расчетный");
    cy.addPackageByName('Пакет услуг "30 платежей"');
    cy.signTarifAndPackage(" Зюкина Кристина Виореловна ");
    cy.get("div.package-content-body__text").should(
      "have.text",
      " Заявка на подключение отправлена \nв банк "
    );
    cy.checkTarifStatus("В обработке");
    cy.get('[data-qa="1657805226006"]').click();
    cy.get(".page-title > .page-title__text").should(
      "contain",
      "Обслуживание по тарифу"
    );
    cy.get("div.tab").should("have.length", "3");
  });
  it("#3525 Пакеты подпись частичная", () => {});
  it.skip("#3526 Пакеты подпись токен", () => {});
  it.skip("#3527 Пакеты подпись токен частичная", () => {});
  it("#3124 - Пакеты Отсутствует подключение", () => {});

  it.only("#3132 Выбор счета", () => {
    cy.openTarifTab("Тарифы и пакеты");
    cy.intercept({
      method: "GET",
      url: "getAvailablePackageAccounts",
    }).as("getResponse");

    cy.openPackageTab();
    cy.wait("@getResponse").then((interception) => {
      const responseBody = interception.response.body.debitAccounts;
      expect(responseBody).to.have.length(4);
      console.log(responseBody);
    });
    cy.get("div.active")
      .should("have.text", " Дополнительные пакеты ")
      .and("have.css", "border-bottom");

    cy.chooseAccType("Расчетный");
    cy.get("div.custom-select__fake").should("contain", "Расчетный");
    cy.get("div.package-card").should("have.length", 6);
    cy.chooseAccType("Валютный");
    cy.get("div.custom-select__fake").should("contain", "Валютный");
    cy.get("div.package-card").should("have.length", 1);
  });

  it("#3204 Заявления Сортировка по дате", () => {
    cy.openTarifTab("Заявления");
    cy.checkDocsOrder();
  });

  it("#3121 Статусы тариф", () => {});
  it("#3529 Статусы пакет", () => {});
});
