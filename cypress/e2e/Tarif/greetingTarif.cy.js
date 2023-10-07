describe("", () => {
  beforeEach(() => {
    cy.loginApi('TOKEN');
    cy.changeCompanyApi("7977155");
    cy.visit("/tarif");
  });
  it("#3333 - Основные положения Приветственный", () => {
    cy.get(
      ".tariff-details-header__title-wrapper > app-arrow-toggle > .arrow-toggle-wrap > .arrow-toggle > .arrow-toggle__arrow"
    ).click();
    cy.get("article.tariff-details-header").within(() => {
      cy.get(".tariff-details-header__title").should(
        "contain",
        "Приветственный"
      );

      cy.get(
        '[data-qa="16577851384090"] > app-tariff-description-item > .card-content-item > .label'
      ).should("contain", "Переводы в другие банки на счета ЮЛ, ИП и ФЛ");
      cy.get(
        '[data-qa="16577851384090"] > app-tariff-description-item > .card-content-item > .value'
      ).should(
        "contain",
        "5 шт. бесплатно, далее 100 ₽ за платеж. В адрес ФЛ + доп.комиссия"
      );
      cy.get(
        '[data-qa="16577851384091"] > app-tariff-description-item > .card-content-item > .label'
      ).should("contain", "Переводы в адрес ФЛ");
      cy.get(
        '[data-qa="16577851384091"] > app-tariff-description-item > .card-content-item > .value'
      ).should("contain", "от 1,5% до 10% от суммы платежа");
      cy.get(
        '[data-qa="16577851384092"] > app-tariff-description-item > .card-content-item > .label'
      ).should("contain", "Снятие наличных с карты");
      cy.get(
        '[data-qa="16577851384092"] > app-tariff-description-item > .card-content-item > .value'
      ).should("contain", "до 500 000 ₽ (включительно) - 1,5 %");
      cy.get(
        '[data-qa="16577851384093"] > app-tariff-description-item > .card-content-item > .label'
      ).should("contain", "Начисление % на остаток");
      cy.get(
        '[data-qa="16577851384093"] > app-tariff-description-item > .card-content-item > .value'
      ).should(
        "have.text",
        "10 % - при остатке от 300 000 ₽ (включительно)  до 600 000 ₽, далее 12%"
      );

      cy.get('[data-qa="1657785266292"] > .card-content-item > .label').should(
        "contain",
        "Тариф действует с"
      );
      cy.get('[data-qa="1657785266292"] > .card-content-item > .value').should(
        "contain",
        "13.07.2022"
      );
      cy.get('[data-qa="1657785189071"] > .card-content-item > .label').should(
        "contain",
        "Плата за ведение расчётного счета"
      );
      cy.get('[data-qa="1657785189071"] > .card-content-item > .value').should(
        "contain",
        "Комиссия не взимается"
      );
      cy.get('[data-qa="1657787192111"]')
        .should("contain", " Описание тарифа ")
        .and(
          "have.attr",
          "href",
          "https://metib.online/docs/Единый%20Сборник%20Тарифов%20с%2005.07.2023г.pdf"
        );
      // cy.get('[data-qa="1663074395452"] > span i').should('contain','Сменить ')
    });
  });

  it("#3196 - Градусники Приветственный", () => {
    cy.get("section.tariff-details-container").first().within(() => {
        cy.get('h4').should('contain','Начисление % на остаток по счету')
        cy.get('h6').should('contain',' Счет: ')
          .find('span').should('contain','Расчетный счет 40702810100990003576')
        cy.get('span.tariff-details-item__option-description').should('contain','Среднемесячный остаток на текущий день')
        cy.get('p.tariff-details-item__header').should('contain','0%')
        cy.get('div.metib-progress-bar__background').should('have.css','background-color')
        cy.get('div.tariff-details-item__progress-wrapper span').should('contain','₽')
        cy.get('span.tariff-details-item__info').trigger('mouseenter')
    })

    cy.get("section.tariff-details-container").last().within(() => {
      cy.get('h4.tariff-details-container__header-title').should('contain','Переводы денежных средств')
      cy.get('article').first().within(()=>{
          cy.get('h6').should('contain',' Счет: ')
            .find('span').should('contain','Расчетный счет 40702810100990003576')
          cy.get('span.tariff-details-item__option-description').should('contain','Переводы в другие банки на счета юридических лиц, ИП и ФЛ')
          cy.get('p.tariff-details-item__header').should('contain','Бесплатно')
          cy.get('div.metib-progress-bar__background').should('have.css','background-color')
          cy.get('div.tariff-details-item__progress-wrapper span').should('be.visible')
          cy.get('span.tariff-details-item__info').trigger('mouseenter')
      })
      cy.get('article').last().within(()=>{
        cy.get('h6').should('contain',' Счет: ')
          .find('span').should('contain','Расчетный счет 40702810100990003576')
        cy.get('span.tariff-details-item__option-description').should('contain','Переводы на счета физических лиц')
        cy.get('p.tariff-details-item__header').should('contain','1.5%')
        cy.get('div.metib-progress-bar__background').should('have.css','background-color')
        cy.get('div.tariff-details-item__progress-wrapper span').should('contain','0.00 из 99 999,99 ₽')
        cy.get('span.tariff-details-item__info').trigger('mouseenter')
      })  
    });
  });
  
  it("#3218 - Тарифы / Описание Переходов", () => {
    cy.openTarifTab("Тарифы");
    cy.get(
      '[data-qa="16577864014650"] > [data-qa="1657784328292"] > [data-qa="1657787397864"] > .caption'
    ).should("contain", "Комплексный");
    cy.get(
      '[data-qa="16577864014650"] > [data-qa="1657784328292"] > [data-qa="1657787397864"] > [data-qa="16577841166640"] > .card-content-item > .label'
    ).should("contain", "Переводы в другие банки на счета ЮЛ, ИП и ФЛ");
    cy.get(
      '[data-qa="16577864014650"] > [data-qa="1657784328292"] > [data-qa="1657787397864"] > [data-qa="16577841166640"] > .card-content-item > .value'
    ).should("contain", "20 шт. бесплатно, далее 25 ₽ за платеж. В адрес ФЛ + доп.комиссия");
    cy.get(
      '[data-qa="16577864014650"] > [data-qa="1657784328292"] > [data-qa="1657787397864"] > [data-qa="16577841166641"] > .card-content-item > .label'
    ).should("contain", "Переводы в адрес ФЛ");
    cy.get(
      '[data-qa="16577864014650"] > [data-qa="1657784328292"] > [data-qa="1657787397864"] > [data-qa="16577841166641"] > .card-content-item > .value'
    ).should("contain", "от 0,5% до 6% от суммы платежа");
    cy.get(
      '[data-qa="16577864014650"] > [data-qa="1657784328292"] > [data-qa="1657787397864"] > [data-qa="16577841166642"] > .card-content-item > .label'
    ).should("contain", "Снятие наличных с карты");
    cy.get(
      '[data-qa="16577864014650"] > [data-qa="1657784328292"] > [data-qa="1657787397864"] > [data-qa="16577841166642"] > .card-content-item > .value'
    ).should("contain", "до 100 000 ₽ (включительно) - бесплатно. Далее - 1,5 %");
    cy.get(
      '[data-qa="16577864014650"] > [data-qa="1657784328292"] > [data-qa="1657787397864"] > [data-qa="16577841166643"] > .card-content-item > .label'
    ).should("contain", "Начисление % на остаток");
    cy.get(
      '[data-qa="16577864014650"] > [data-qa="1657784328292"] > [data-qa="1657787397864"] > [data-qa="16577841166643"] > .card-content-item > .value'
    ).should("contain", "не начисляется");

    cy.get('[data-qa="16577845753970"] > .card-content-item > .label').should(
      "contain",
      "Тариф начнет действовать с"
    );
    cy.get('[data-qa="16577845753970"] > .card-content-item > .value').should(
      "contain",
      "01.11.2023"
    );
    cy.get('[data-qa="16577845753971"] > .card-content-item > .label').should(
      "contain",
      "Плата за ведение расчётного счета"
    );
    cy.get('[data-qa="16577845753971"] > .card-content-item > .value').should(
      "contain",
      "4 900 ₽ ежемесячно"
    );
    cy.get('div.tariff-card').first().within(()=>{
      cy.get('[data-qa="1657784614268"]')
      .should("contain", "Описание тарифа")
      .and(
        "have.attr",
        "href",
        "https://metib.online/docs/Единый%20Сборник%20Тарифов%20с%2005.07.2023г.pdf"
      )
      .and("have.attr", "target", "_blank");
    cy.get(
      '[data-qa="1657784607021"] > [data-qa="1663074395452"] > span > i'
    ).should("contain", "Подключить");
    })
       
  });

  it("#3342 - Приветственный > Комплексный ", () => {
    cy.openTarifTab("Тарифы и пакеты");
    cy.changeTarifByName("Тариф Комплексный", "Подключить");
    cy.signTarifAndPackage(" Зюкина Кристина Виореловна ");
    cy.checkTarifCaption("Заявка отправлена в банк");
    cy.checkTarifText(" Тариф начнет действовать ");
    cy.checkTarifStatus("В обработке");
    cy.cancelTariff();
  });
  it("#3340 - Приветственный > Расчетный", () => {
    cy.openTarifTab("Тарифы и пакеты");
    cy.changeTarifByName("Тариф Расчетный", "Подключить");
    cy.signTarifAndPackage(" Зюкина Кристина Виореловна ");
    cy.checkTarifCaption("Заявка отправлена в банк");
    cy.checkTarifText(" Тариф начнет действовать ");
    cy.checkTarifStatus("В обработке");
    cy.cancelTariff();
  });
  it("#3341 - Приветственный > Активный ВЭД", () => {
    cy.openTarifTab("Тарифы и пакеты");
    cy.changeTarifByName("Тариф ‎Активный ВЭД‎", "Подключить");
    cy.signTarifAndPackage(" Зюкина Кристина Виореловна ");
    cy.checkTarifCaption("Заявка отправлена в банк");
    cy.checkTarifText(" Тариф начнет действовать ");
    cy.checkTarifStatus("В обработке");
    cy.cancelTariff();
  });
  it("#3133 - Дополнительные пакеты описание переходов", () => {
    cy.openTarifTab("Тарифы и пакеты");
    cy.openPackageTab();
    cy.get("div.package-card").should("not.exist");
  });
  it.skip("#3219 - Тарифы Доп пакеты/ Описание Переходов", () => {}); //Не проверяем - нет доп пакетов, просто пропускаем(блокируем)})
  it.skip("#3343 - Приветственный > Комплексный АВТО-КГП", () => {});
});
