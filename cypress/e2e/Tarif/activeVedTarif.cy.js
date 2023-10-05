describe("", () => {
  beforeEach(() => {
    cy.loginApi();
    cy.changeCompanyApi("7978044");
    cy.visit("/tarif");
  });
  it("#3285 - Активный > Комплексный ", () => {
    cy.openTarifTab("Тарифы и пакеты");
    cy.changeTarifByName("Тариф Комплексный", "Подключить");
    cy.signTarifAndPackage(" Зюкина Кристина Виореловна ");
    cy.checkTarifCaption("Заявка отправлена в банк");
    cy.checkTarifText(" Тариф начнет действовать ");
    cy.checkTarifStatus("В обработке");
    cy.cancelTariff();
  });

  it("#3284 - Активный > Расчетный", () => {
    cy.openTarifTab("Тарифы и пакеты");
    cy.changeTarifByName("Тариф Расчетный", "Подключить");
    cy.signTarifAndPackage(" Зюкина Кристина Виореловна ");
    cy.checkTarifCaption("Заявка отправлена в банк");
    cy.checkTarifText(" Тариф начнет действовать ");
    cy.checkTarifStatus("В обработке");
    cy.cancelTariff();
  });

  it('#3288 - Пакет услуг "30 платежей"', () => {
    cy.openTarifTab("Тарифы и пакеты");
    cy.openPackageTab();
    cy.chooseAccType("Расчетный");
    cy.addPackageByName('Пакет услуг "30 платежей"');
    cy.signTarifAndPackage(" Зюкина Кристина Виореловна ");
    cy.get("div.package-content-body__text").should(
      "have.text",
      " Заявка на подключение отправлена \nв банк "
    );
    cy.closeCurrentTab();
    cy.openTarifTab("Заявления");
    cy.checkPackageStatus("В обработке");
  });

  it('#3289 - Пакет услуг "60 платежей"', () => {
    cy.openTarifTab("Тарифы и пакеты");
    cy.openPackageTab();
    cy.chooseAccType("Расчетный");
    cy.addPackageByName('Пакет услуг "60 платежей"');
    cy.signTarifAndPackage(" Зюкина Кристина Виореловна ");
    cy.get("div.package-content-body__text").should(
      "have.text",
      " Заявка на подключение отправлена \nв банк "
    );
    cy.closeCurrentTab();
    cy.openTarifTab("Заявления");
    cy.checkPackageStatus("В обработке");
  });

  it('#3290 - Пакет услуг "90 платежей"', () => {
    cy.openTarifTab("Тарифы и пакеты");
    cy.openPackageTab();
    cy.chooseAccType("Расчетный");
    cy.addPackageByName('Пакет услуг "90 платежей"');
    cy.signTarifAndPackage(" Зюкина Кристина Виореловна ");
    cy.get("div.package-content-body__text").should(
      "have.text",
      " Заявка на подключение отправлена \nв банк "
    );
    cy.closeCurrentTab();
    cy.openTarifTab("Заявления");
    cy.checkPackageStatus("В обработке");
  });

  it('#3292 - Пакет услуг "платежи безлимитно"', () => {
    cy.openTarifTab("Тарифы и пакеты");
    cy.openPackageTab();
    cy.chooseAccType("Расчетный");
    cy.addPackageByName('Пакет услуг "платежи безлимитно"');
    cy.signTarifAndPackage(" Зюкина Кристина Виореловна ");
    cy.get("div.package-content-body__text").should(
      "have.text",
      " Заявка на подключение отправлена \nв банк "
    );
    cy.closeCurrentTab();
    cy.openTarifTab("Заявления");
    cy.checkPackageStatus("В обработке");
  });

  it("#3335 - Основные положения Активный", () => {
    cy.get(
      ".tariff-details-header__title-wrapper > app-arrow-toggle > .arrow-toggle-wrap > .arrow-toggle > .arrow-toggle__arrow"
    ).click();
    cy.get("article.tariff-details-header").within(() => {
      cy.get("h3.tariff-details-header__title").should(
        "contain",
        "Тариф ‎Активный ВЭД‎"
      );
      cy.get(
        '[data-qa="16577851384090"] > app-tariff-description-item > .card-content-item > .label'
      ).should("contain", "Переводы в другие банки на счета ЮЛ, ИП и ФЛ");
      cy.get(
        '[data-qa="16577851384090"] > app-tariff-description-item > .card-content-item > .value'
      ).should("contain", "25 ₽ за платеж. В адрес ФЛ + доп.комиссия");
      cy.get(
        '[data-qa="16577851384091"] > app-tariff-description-item > .card-content-item > .label'
      ).should("contain", "Переводы в адрес ФЛ");
      cy.get(
        '[data-qa="16577851384091"] > app-tariff-description-item > .card-content-item > .value'
      ).should("contain", "от 0,2% до 6% от суммы платежа");
      cy.get(
        '[data-qa="16577851384092"] > app-tariff-description-item > .card-content-item > .label'
      ).should("contain", "Снятие наличных с карты");
      cy.get(
        '[data-qa="16577851384092"] > app-tariff-description-item > .card-content-item > .value'
      ).should(
        "contain",
        "до 100 000 ₽ (включительно) - бесплатно. Далее - 1,5 %"
      );
      cy.get(
        '[data-qa="16577851384093"] > app-tariff-description-item > .card-content-item > .label'
      ).should("contain", "Платежи в валюте");
      cy.get(
        '[data-qa="16577851384093"] > app-tariff-description-item > .card-content-item > .value'
      ).should("contain", "min 25 USD, max 70 USD и min 30 EUR, max 70 EUR");

      cy.get('[data-qa="1657785266292"] > .card-content-item > .label').should(
        "contain",
        "Тариф действует с"
      );
      cy.get('[data-qa="1657785266292"] > .card-content-item > .value').should(
        "contain",
        "09.08.2022"
      );
      cy.get('[data-qa="1657785189071"] > .card-content-item > .label').should(
        "contain",
        "Плата за ведение расчётного счета"
      );
      cy.get('[data-qa="1657785189071"] > .card-content-item > .value').should(
        "contain",
        "2 месяца бесплатно, далее 2 900 ₽"
      );
      cy.get('[data-qa="1657787192111"]')
        .should("contain", " Описание тарифа ")
        .and(
          "have.attr",
          "href",
          "https://metib.online/docs/Единый%20Сборник%20Тарифов%20с%2005.07.2023г.pdf"
        );
      cy.get('[data-qa="1663074395452"] > span i').should(
        "contain",
        "Сменить "
      );
    });
  });

  it("#3507 - Градусники Активный", () => {
    cy.get("app-tariff-details-data-container:nth-child(1) > section").within(
      () => {
        cy.get("h4").should("contain", "Операции по корпоративной карте");
        cy.get("h6")
          .should("contain", " Карта: ")
          .find("span")
          .should("contain", "  4187190000136180 ");
        cy.get("span.tariff-details-item__option-description").should(
          "contain",
          " Выдача наличных денежных средств с использованием карты "
        );
        cy.get(" p.tariff-details-item__header").should(
          "contain",
          "без комиссии"
        );
        cy.get("div.metib-progress-bar__background").should(
          "have.css",
          "background-color"
        );
        cy.get("div.tariff-details-item__progress-wrapper > span").should(
          "contain",
          " 0.00 ₽ "
        );
        cy.get(
          '[data-qa="16577853554320"] > .tariff-details-item > .tariff-details-item__info-wrapper > .tariff-details-item__info'
        ).trigger("mouseenter");
      }
    );

    cy.get("main.ng-star-inserted > :nth-child(2)").within(() => {
      cy.get("h4").should("contain", "Переводы денежных средств");
      cy.get("h6")
        .first()
        .should("contain", " Счет: ")
        .find("span")
        .should("contain", "  Расчетный счет 40702810300990004126 ");
      cy.get("span.tariff-details-item__option-description")
        .first()
        .should(
          "contain",
          " Переводы в другие банки на счета юридических лиц, ИП и ФЛ "
        );
      cy.get("p.tariff-details-item__header")
        .first()
        .should("contain", "25 ₽ за платеж");
      cy.get("div.metib-progress-bar__background")
        .first()
        .should("have.css", "background-color");
      cy.get(
        "section > app-tariff-details-data-item:nth-child(2) > article > div.tariff-details-item__progress-wrapper > span"
      ).should("contain", " 0 шт ");

      cy.get("h6")
        .last()
        .should("contain", " Счет: ")
        .find("span")
        .should("contain", "  Расчетный счет 40702810300990004126 ");
      cy.get("span.tariff-details-item__option-description")
        .last()
        .should("contain", " Переводы на счета физических лиц ");
      cy.get("p.tariff-details-item__header").last().should("contain", "0.2%");
      cy.get("div.metib-progress-bar__background")
        .last()
        .should("have.css", "background-color");
      cy.get(
        "section > app-tariff-details-data-item:nth-child(3) > article > div.tariff-details-item__progress-wrapper > span"
      ).should("contain", " 0.00 из 99 999,99 ₽ ");
      cy.get(
        '[data-qa="16577853554320"] > .tariff-details-item > .tariff-details-item__info-wrapper > .tariff-details-item__info'
      ).trigger("mouseenter");
      cy.get(
        '[data-qa="16577853554321"] > .tariff-details-item > .tariff-details-item__info-wrapper > .tariff-details-item__info'
      ).trigger("mouseenter");
    });
  });
});
