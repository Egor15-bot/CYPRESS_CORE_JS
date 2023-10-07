describe("", () => {
  beforeEach(() => {
    cy.loginApi('TOKEN');
    cy.changeCompanyApi("7978044");
    cy.visit("/tarif");
  });
  it("#3201 - Основные положения", () => {
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
  it("#3238 - Тариф подпись", () => {
    cy.openTarifTab("Тарифы и пакеты");
    cy.changeTarifByName("Тариф Расчетный", "Подключить");
    cy.signTarifAndPackage(" Зюкина Кристина Виореловна ");
    cy.checkTarifCaption("Заявка отправлена в банк");
    cy.checkTarifText(" Тариф начнет действовать ");
    cy.checkTarifStatus("В обработке");
    cy.cancelTariff()
  });
  it("#3239 - Пакеты подпись частичная", () => {
    cy.openTarifTab("Тарифы и пакеты");
    cy.openPackageTab();
    cy.wait(2000)
    cy.chooseAccType("Расчетный");
    cy.addPackageByName('"60 платежей"');
    cy.signTarifAndPackage(" Зюкина_Подпись1 ");
    cy.get('div.package-content-body').should(
      "have.text",
      " Необходимо поставить вторую подпись \nдля отправки заявки в банк "
    );
    cy.closeCurrentTab()
    cy.openTarifTab('Заявления')
    cy.checkPackageStatus("Частично подписан");
    //Дописать после фикса
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
    cy.get('[data-qa="16577864014650"] > [data-qa="1657784328292"] > [data-qa="1657787397864"] > .caption').should('contain','Тариф Комплексный')
    cy.get('[data-qa="16577864014651"] > [data-qa="1657784328292"] > [data-qa="1657787397864"] > .caption').should('contain','Тариф Расчетный')
  });
  it("#3203 - Проверка заявления на тариф", () => {
    cy.openTarifTab("Тарифы и пакеты");
    cy.changeTarifByName("Тариф Расчетный", "Подключить");
    cy.signTarifAndPackage(" Зюкина Кристина Виореловна ");
    cy.checkTarifCaption("Заявка отправлена в банк");
    cy.checkTarifText(" Тариф начнет действовать ");
    cy.checkTarifStatus("В обработке");
    cy.cancelTariff()
  });
  it("#3115 - Отсутствует тариф", () => {
    cy.changeCompanyApi("6948459")
    cy.visit('/tarif')
    cy.get('.page-title__text').should('contain','Обслуживание по тарифу')
    cy.get("app-empty-stub div.empty-stub p").should(
      "contain",
      "Нет информации для отображения."
    );
  });

  it('#3128 - Смена тарифа, кнопка "Сменить', () => {
    cy.get(
      ".tariff-details-header__title-wrapper .arrow-toggle__arrow"
    ).click();
    cy.get('[data-qa="1663074395452"] > span i')
      .should("contain", "Сменить ")
      .click();
    cy.get("div.page-title__text").should("contain", "Тарифы и пакеты");
    cy.get("div.tariff-card").should("have.length", "2");
    cy.get("div.tariff-card .caption").contains("Комплексный");
    cy.get("div.tariff-card .caption").contains("Тариф Расчетный");
  });
  it.skip("#3205 - Подпись. Токен", () => {});
  it.skip("#3503 - Подпись частичная Токен", () => {})

  it("#3522 Смена тарифа при активной заявке", () => {
    cy.openTarifTab("Тарифы и пакеты");
    cy.changeTarifByName("Тариф Комплексный", "Подключить");
    cy.signTarifAndPackage(" Зюкина Кристина Виореловна ");
    cy.checkTarifCaption("Заявка отправлена в банк");
    cy.checkTarifText(" Тариф начнет действовать ");
    cy.changeTarifByName("Тариф Расчетный", "Подключить");
    cy.checkRedToastInfo(
      'У вас уже есть заявка на подключение тарифа "Тариф Комплексный". Для перехода на другой тариф, отмените текущую заявку'
    );
    cy.cancelTariff()
  });
  it.skip("#3523 Смена тарифа при активной частичной заявке", () => {});

  it("#3135 Пакеты подпись", () => {
    cy.openTarifTab("Тарифы и пакеты");
    cy.openPackageTab();
    cy.chooseAccType("Расчетный");
    cy.addPackageByName('Пакет услуг "60 платежей"');
    cy.signTarifAndPackage(" Зюкина Кристина Виореловна ");
    cy.get("div.package-content-body__text").should(
      "have.text",
      " Заявка на подключение отправлена \nв банк "
    );
    cy.closeCurrentTab()
    cy.openTarifTab('Заявления')
    cy.checkPackageStatus("В обработке");
    cy.get('[data-qa="1657805226006"]').click();
    cy.get(".page-title > .page-title__text").should(
      "contain",
      "Обслуживание по тарифу"
    );
    cy.get("div.tab").should("have.length", "3");
  });
  
  it("#3525 Тариф подпись частичная", () => {
    cy.openTarifTab("Тарифы и пакеты");
    cy.changeTarifByName("Тариф Расчетный", "Подключить");
    cy.signTarifAndPackage(" Зюкина_Подпись1 ");
    cy.checkTarifCaption("Заявка частично подписана");
    cy.checkTarifText("Необходимо поставить вторую подпись");
    cy.changeTarifByName("Тариф Расчетный", "Подписать");
    cy.signTarifAndPackage(" Зюкина_Подпись2 ");
    cy.checkTarifCaption("Заявка отправлена в банк");
    cy.checkTarifStatus("В обработке");
  });
  it.skip("#3526 Пакеты подпись токен", () => {});
  it.skip("#3527 Пакеты подпись токен частичная", () => {});
  
  it("#3124 - Пакеты Отсутствует подключение", () => {
    cy.changeCompanyApi('7977155')
    cy.openTarifTab('Тарифы и пакеты')
    cy.openPackageTab()
    cy.chooseAccType("Расчетный");
    cy.get('app-package-card').should('have.length','0')
    cy.chooseAccType("Валютный");
    cy.get('app-package-card').should('have.length','0')

  })

  it("#3132 Выбор счета", () => {
    cy.openTarifTab("Тарифы и пакеты");
    cy.intercept({
      method: "GET",
      url: "getAvailablePackageAccounts",
    }).as("getResponse");

    cy.openPackageTab();
    cy.wait("@getResponse").then((interception) => {
      const responseBody = interception.response.body.debitAccounts;
      expect(responseBody).to.have.length(2);
    });
    cy.get("div.active")
      .should("have.text", " Дополнительные пакеты ")
      .and("have.css", "border-bottom");

    cy.chooseAccType("Расчетный");
    cy.get("div.custom-select__fake").should("contain", "Расчетный");
    cy.get("div.package-card").should("have.length", 4);
    cy.chooseAccType("Валютный");
    cy.get("div.custom-select__fake").should("contain", "Валютный");
    cy.get("div.package-card").should("have.length", 0);
  });

  it("#3204 Заявления Сортировка по дате", () => {
    cy.openTarifTab("Заявления");
    cy.checkDocsOrder();
  });

  it("#3121 Статусы тариф", () => {});

  it("#3529 Статусы пакет", () => {});
});
