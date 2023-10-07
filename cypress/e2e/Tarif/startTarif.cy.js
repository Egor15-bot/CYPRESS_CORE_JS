describe("", () => {
  beforeEach(() => {
    cy.loginApi('TOKEN');
    cy.changeCompanyApi("7978049");
    cy.visit("/tarif");
  });
  it("#3533 - Cтартовый > Корпоративный ", () => {
    cy.openTarifTab("Тарифы");
    cy.changeTarifByName("Корпоративный", "Подключить");
    cy.signTarifAndPackage(" Зюкина Кристина Виореловна ");
    cy.checkTarifCaption("Заявка отправлена в банк");
    cy.checkTarifText(" Тариф начнет действовать ");
    cy.checkTarifStatus("В обработке");
    cy.cancelTariff();
  });

  it("#3294 - Cтартовый > Оптимальный", () => {
    cy.openTarifTab("Тарифы");
    cy.changeTarifByName("Оптимальный", "Подключить");
    cy.signTarifAndPackage(" Зюкина Кристина Виореловна ");
    cy.checkTarifCaption("Заявка отправлена в банк");
    cy.checkTarifText(" Тариф начнет действовать ");
    cy.checkTarifStatus("В обработке");
    cy.cancelTariff();
  });

  it("#3114 - Основные положения Расчетный", () => {
    cy.get(
      ".tariff-details-header__title-wrapper > app-arrow-toggle > .arrow-toggle-wrap > .arrow-toggle > .arrow-toggle__arrow"
    ).click();
    cy.get("article.tariff-details-header").within(() => {
      cy.get(".tariff-details-header__title").should("contain", "Стартовый");
      cy.get(
        '[data-qa="16577851384090"] > app-tariff-description-item > .card-content-item > .label'
      ).should("contain", "Переводы в другие банки на счета ЮЛ, ИП и ФЛ");
      cy.get(
        '[data-qa="16577851384090"] > app-tariff-description-item > .card-content-item > .value'
      ).should("contain", "90 ₽ за платеж. В адрес ФЛ + доп.комиссия");
      cy.get(
        '[data-qa="16577851384091"] > app-tariff-description-item > .card-content-item > .label'
      ).should("contain", "Переводы в адрес ФЛ");
      cy.get(
        '[data-qa="16577851384091"] > app-tariff-description-item > .card-content-item > .value'
      ).should("contain", "от 1,5% до 15% от суммы платежа");
      cy.get(
        '[data-qa="16577851384092"] > app-tariff-description-item > .card-content-item > .label'
      ).should("contain", "Снятие наличных с карты");
      cy.get(
        '[data-qa="16577851384092"] > app-tariff-description-item > .card-content-item > .value'
      ).should("contain", "до 500 000 руб. (включительно)  - 1,5 %");
      cy.get(
        '[data-qa="16577851384093"] > app-tariff-description-item > .card-content-item > .label'
      ).should("contain", "Начисление % на остаток");
      cy.get(
        '[data-qa="16577851384093"] > app-tariff-description-item > .card-content-item > .value'
      ).should("contain", "0%");

      cy.get('[data-qa="1657785266292"] > .card-content-item > .label').should(
        "contain",
        "Тариф действует с"
      );
      cy.get('[data-qa="1657785266292"] > .card-content-item > .value').should(
        "contain",
        "25.03.2022"
      );
      cy.get('[data-qa="1657785189071"] > .card-content-item > .label').should(
        "contain",
        "Плата за ведение расчётного счета"
      );
      cy.get('[data-qa="1657785189071"] > .card-content-item > .value').should(
        "contain",
        "490 ₽ в месяц"
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

  it("#3114 - Описание Переходов", () => {
    cy.openTarifTab("Тарифы");
    cy.get("div.tab").contains("Дополнительные пакеты").should("not.exist");
    cy.get(
      '[data-qa="16577864014650"] > [data-qa="1657784328292"] > [data-qa="1657787397864"] > .caption'
    ).should("contain", "Корпоративный");
    cy.get(
      '[data-qa="16577864014650"] > [data-qa="1657784328292"] > [data-qa="1657787397864"] > [data-qa="16577841166640"] > .card-content-item > .label'
    ).should("contain", "Переводы в другие банки на счета ЮЛ, ИП и ФЛ");
    cy.get(
      '[data-qa="16577864014650"] > [data-qa="1657784328292"] > [data-qa="1657787397864"] > [data-qa="16577841166640"] > .card-content-item > .value'
    ).should("contain", "бесплатно");
    cy.get(
      '[data-qa="16577864014650"] > [data-qa="1657784328292"] > [data-qa="1657787397864"] > [data-qa="16577841166641"] > .card-content-item > .label'
    ).should("contain", "Переводы в адрес ФЛ");
    cy.get(
      '[data-qa="16577864014650"] > [data-qa="1657784328292"] > [data-qa="1657787397864"] > [data-qa="16577841166641"] > .card-content-item > .value'
    ).should("contain", "от 1% до 15% от суммы платежа");
    cy.get(
      '[data-qa="16577864014650"] > [data-qa="1657784328292"] > [data-qa="1657787397864"] > [data-qa="16577841166642"] > .card-content-item > .label'
    ).should("contain", "Снятие наличных с карты");
    cy.get(
      '[data-qa="16577864014650"] > [data-qa="1657784328292"] > [data-qa="1657787397864"] > [data-qa="16577841166642"] > .card-content-item > .value'
    ).should("contain", "до 100 000 ₽ (включительно) - бесплатно. Далее - 1 %");
    cy.get(
      '[data-qa="16577864014650"] > [data-qa="1657784328292"] > [data-qa="1657787397864"] > [data-qa="16577841166643"] > .card-content-item > .label'
    ).should("contain", "Начисление % на остаток");
    cy.get(
      '[data-qa="16577864014650"] > [data-qa="1657784328292"] > [data-qa="1657787397864"] > [data-qa="16577841166643"] > .card-content-item > .value'
    ).should("contain", "2.5 % - при остатке от 300 000 ₽ и более");

    cy.get('[data-qa="16577845753970"] > .card-content-item > .label').should(
      "contain",
      "Тариф начнет действовать с"
    );
    cy.get('[data-qa="16577845753970"] > .card-content-item > .value').should(
      "be.visible"
    );
    cy.get('[data-qa="16577845753971"] > .card-content-item > .label').should(
      "contain",
      "Плата за ведение расчётного счета"
    );
    cy.get('[data-qa="16577845753971"] > .card-content-item > .value').should(
      "contain",
      "3 000 ₽ в месяц"
    );
    cy.get('[data-qa="1657784614268"]')
      .should("contain", "Описание тарифа")
      .and(
        "have.attr",
        "href",
        "https://metib.online/docs/Тарифы%20METIB%20Business%20Online%20с%2005.07.2023г..pdf"
      )
      .and("have.attr", "target", "_blank");
    cy.get(
      '[data-qa="1657784607021"] > [data-qa="1663074395452"] > span > i'
    ).should("contain", "Подключить");
  });
});
