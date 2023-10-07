describe("", () => {
  beforeEach(() => {
    cy.loginApi('TOKEN');
    cy.changeCompanyApi("4392440");
    cy.visit("/tarif");
  });
  it("#3307 - Корпоративный > Оптимальный ", () => {
    cy.openTarifTab("Тарифы");
    cy.changeTarifByName("Оптимальный", "Подключить");
    cy.signTarifAndPackage(" Зюкина Кристина Виореловна ");
    cy.checkTarifCaption("Заявка отправлена в банк");
    cy.checkTarifText(" Тариф начнет действовать ");
    cy.checkTarifStatus("В обработке");
    cy.cancelTariff();
  });

  it("#3306 - Корпоративный > Стартовый", () => {
    cy.openTarifTab("Тарифы");
    cy.changeTarifByName("Стартовый", "Подключить");
    cy.signTarifAndPackage(" Зюкина Кристина Виореловна ");
    cy.checkTarifCaption("Заявка отправлена в банк");
    cy.checkTarifText(" Тариф начнет действовать ");
    cy.checkTarifStatus("В обработке");
    cy.cancelTariff();
  });

  it("#3331 - Основные положения Корпоративный", () => {
    cy.get(
      ".tariff-details-header__title-wrapper > app-arrow-toggle > .arrow-toggle-wrap > .arrow-toggle > .arrow-toggle__arrow"
    ).click();
    cy.get("article.tariff-details-header").within(() => {
      cy.get("h3.tariff-details-header__title").should(
        "contain",
        "Корпоративный"
      );
      cy.get(
        '[data-qa="16577851384090"] .label'
      ).should("contain", "Переводы в другие банки на счета ЮЛ, ИП и ФЛ");
      cy.get(
        '[data-qa="16577851384090"] .value'
      ).should("contain", "бесплатно");
      cy.get(
        '[data-qa="16577851384091"] .label'
      ).should("contain", "Переводы в адрес ФЛ");
      cy.get(
        '[data-qa="16577851384091"] .value'
      ).should("contain", "от 1% до 15% от суммы платежа");
      cy.get(
        '[data-qa="16577851384092"] .label'
      ).should("contain", "Снятие наличных с карты");
      cy.get(
        '[data-qa="16577851384092"] .value'
      ).should(
        "contain",
        "до 100 000 ₽ (включительно) - бесплатно. Далее - 1 %"
      );
      cy.get(
        '[data-qa="16577851384093"] > app-tariff-description-item > .card-content-item > .label'
      ).should("contain", "Начисление % на остаток");
      cy.get(
        '[data-qa="16577851384093"] > app-tariff-description-item > .card-content-item > .value'
      ).should("contain", "2.5 % - при остатке от 300 000 ₽ и более");

      cy.get('[data-qa="1657785266292"] > .card-content-item > .label').should(
        "contain",
        "Тариф действует с"
      );
      cy.get('[data-qa="1657785266292"] > .card-content-item > .value').should(
        "contain",
        "01.01.2021"
      );
      cy.get('[data-qa="1657785189071"] > .card-content-item > .label').should(
        "contain",
        "Плата за ведение расчётного счета"
      );
      cy.get('[data-qa="1657785189071"] > .card-content-item > .value').should(
        "contain",
        "3 000 ₽ в месяц"
      );
      cy.get('[data-qa="1657787192111"]')
        .should("contain", " Описание тарифа ")
        .and(
          "have.attr",
          "href",
          "https://metib.online/docs/Тарифы%20METIB%20Business%20Online%20с%2005.07.2023г..pdf"
        );
    });
    cy.get("app-empty-stub div.empty-stub p").should(
      "contain",
      "Расходы по тарифу не доступны"
    );
  });

  it("#3211 - Описание Переходов", () => {
    cy.openTarifTab("Тарифы");
    cy.get("div.tab").contains("Дополнительные пакеты").should("not.exist");
  });
});
