describe("", () => {
  beforeEach(() => {
    cy.loginApi();
    cy.changeCompanyApi("8032211");
    cy.visit("/tarif");
  });
  it("#3285 - Комплексный > Расчетный ", () => {
    cy.openTarifTab("Тарифы и пакеты");
    cy.changeTarifByName("Тариф Расчетный", "Подключить");
    cy.signTarifAndPackage(" Зюкина Кристина Виореловна ");
    cy.checkTarifCaption("Заявка отправлена в банк");
    cy.checkTarifText(" Тариф начнет действовать ");
    cy.closeCurrentTab();
    cy.openTarifTab("Заявления");
    cy.checkPackageStatus("В обработке");
    // cy.cancelTariff();
  });
  it("#3284 - Комплексный > Активный ВЭД ", () => {
    cy.openTarifTab("Тарифы и пакеты");
    cy.changeTarifByName("Тариф ‎Активный ВЭД‎", "Подключить");
    cy.signTarifAndPackage(" Зюкина Кристина Виореловна ");
    cy.checkTarifCaption("Заявка отправлена в банк");
    cy.checkTarifText(" Тариф начнет действовать ");
    cy.closeCurrentTab();
    cy.openTarifTab("Заявления");
    // cy.checkPackageStatus("В обработке");
    // cy.cancelTariff();
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
  });
  it('#3292 - Пакет услуг "ВЭД"', () => {
    cy.openTarifTab("Тарифы и пакеты");
    cy.openPackageTab();
    cy.chooseAccType("Расчетный");
    cy.addPackageByName('Пакет услуг "платежи безлимитно"');
    cy.signTarifAndPackage(" Зюкина Кристина Виореловна ");
    cy.get("div.package-content-body__text").should(
      "have.text",
      " Заявка на подключение отправлена \nв банк "
    );
  });
  it('#3292 - Пакет услуг "переводы на ФЛ"', () => {
    cy.openTarifTab("Тарифы и пакеты");
    cy.openPackageTab();
    cy.chooseAccType("Расчетный");
    cy.addPackageByName('Пакет услуг "переводы на ФЛ"');
    cy.signTarifAndPackage(" Зюкина Кристина Виореловна ");
    cy.get("div.package-content-body__text").should(
      "have.text",
      " Заявка на подключение отправлена \nв банк "
    );
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
  });
  it('#3292 - Валютный - Пакет услуг "ВЭД"', () => {
    cy.openTarifTab("Тарифы и пакеты");
    cy.openPackageTab();
    cy.chooseAccType("Валютный");
    cy.addPackageByName('Пакет услуг "ВЭД"');
    cy.signTarifAndPackage(" Зюкина Кристина Виореловна ");
    cy.get("div.package-content-body__text").should(
      "have.text",
      " Заявка на подключение отправлена \nв банк "
    );
  });

  it("#3335 - Основные положения Комплексный", () => {
    cy.get(
      ".tariff-details-header__title-wrapper > app-arrow-toggle > .arrow-toggle-wrap > .arrow-toggle > .arrow-toggle__arrow"
    ).click();
    cy.get("article.tariff-details-header").within(() => {
      cy.get(".tariff-details-header__title").should(
        "contain",
        "Тариф Комплексный"
      );

      cy.get(
        '[data-qa="16577851384090"] > app-tariff-description-item > .card-content-item > .label'
      ).should("contain", "Переводы в другие банки на счета ЮЛ, ИП и ФЛ");
      cy.get(
        '[data-qa="16577851384090"] > app-tariff-description-item > .card-content-item > .value'
      ).should(
        "contain",
        "20 шт. бесплатно, далее 25 ₽ за платеж. В адрес ФЛ + доп.комиссия"
      );
      cy.get(
        '[data-qa="16577851384091"] > app-tariff-description-item > .card-content-item > .label'
      ).should("contain", "Переводы в адрес ФЛ");
      cy.get(
        '[data-qa="16577851384091"] > app-tariff-description-item > .card-content-item > .value'
      ).should("contain", "от 0,5% до 6% от суммы платежа");
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
      ).should("contain", "Начисление % на остаток");
      cy.get(
        '[data-qa="16577851384093"] > app-tariff-description-item > .card-content-item > .value'
      ).should("contain", "не начисляется");

      cy.get('[data-qa="1657785266292"] > .card-content-item > .label').should(
        "contain",
        "Тариф действует с"
      );
      cy.get('[data-qa="1657785266292"] > .card-content-item > .value').should(
        "contain",
        "26.12.2022"
      );
      cy.get('[data-qa="1657785189071"] > .card-content-item > .label').should(
        "contain",
        "Плата за ведение расчётного счета"
      );
      cy.get('[data-qa="1657785189071"] > .card-content-item > .value').should(
        "contain",
        "4 900 ₽ ежемесячно"
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

  it("#3507 - Градусники Комплексный", () => {
    cy.get("section.tariff-details-container").within(() => {
      cy.get("h4").should("contain","Переводы денежных средств");
      cy.get('article').first().within(()=>{
        cy.get('div.tariff-details-item__header-wrapper').first().within(()=>{
          cy.get('h6').should('contain',' Счет: ')
            .find('span').should('contain',' Расчетный счет 40702810800990006080 ')
        })
        cy.get('span.tariff-details-item__option-description').should('contain',' Переводы в другие банки на счета юридических лиц, ИП и ФЛ ')
        cy.get('p.tariff-details-item__header').should('be.visible')
        cy.get('div.metib-progress-bar__background').should('be.visible').and('have.css','background-color')
        cy.get('span.tariff-details-item__info').trigger('mouseenter')
        cy.get('div.tariff-details-item__progress-wrapper span').should('be.visible')
      })

      cy.get('article').last().within(()=>{
        cy.get('div.tariff-details-item__header-wrapper').first().within(()=>{
          cy.get('h6').should('contain',' Счет: ')
            .find('span').should('contain',' Расчетный счет 40702810800990006080 ')
        })
        cy.get('span.tariff-details-item__option-description').should('contain',' Переводы на счета физических лиц ')
        cy.get('p.tariff-details-item__header').should('contain','0.5%')
        cy.get('div.metib-progress-bar__background').should('be.visible').and('have.css','background-color')
        cy.get('span.tariff-details-item__info').trigger('mouseenter')
        cy.get('div.tariff-details-item__progress-wrapper span').should('contain',' 0.00 из 499 999,99 ₽ ')
      })
    })
  })
});
