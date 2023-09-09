describe('Контрагенты НАЛОГ', () => {
    beforeEach(() => {
        cy.loginApi('TOKEN')
        cy.changeCompanyApi('3448774')
        cy.deleteAllCounterparts()

        cy.fixture('counterparts').then(function (data) {
            this.fixtureCounterparts = data;
            this.testData = data.NALOG;
        })
    })
    context('Меню контрагенты', () => {
        beforeEach('Перехожу в раздел "Контрагенты" / "Добавить контрагента"', () => {
            cy.visit('/counterparts/create')
                .url()
                .should('contain', '/counterparts/create')
        })
        it('#1429. Создание контрагента + удаление через кебаб-меню', function () {
            //Нажимаю на вкладку "Налоговый/Бюджетный"
            cy.contains('div.counterpart__types__item', this.testData.check.nameCounterpart).click()
            cy.get('div.counterpart__types__item.active')
                .should('contain', this.testData.check.nameCounterpart)
                .and('have.css', 'border-bottom', `3px solid ${Cypress.env('colorBlueSolid')}`)

            cy.fillForm(this.testData.type)
            cy.contains('label.dynamic-input', ' Название банка получателя ')
                .find('div.dynamic-input__overlay.ng-star-inserted')
                .children()
                .invoke('val')
                .should('not.be.empty')
            cy.wait(1000)

            cy.checkFormInput(this.testData)
            cy.get('app-button[data-qa="1657886705496"] > div[data-qa="1658987981978"]').click()
            cy.checkGreenToastInfo(this.fixtureCounterparts.toastGreen);
            cy.checkCounterpartList(this.testData).click()

            cy.get('div.breadcrumbs')
                .should('contain', ' Контрагенты ')
                .and('contain', ' Просмотр')

            cy.checkCounterpartDetails(this.testData)
            cy.modificationAccNumberDot(this.testData.type["Счет получателя"])
                .then((modifiedNumber) => {
                    cy.get('div.number').should('contain', modifiedNumber);
                });
            cy.get('div.bank-place').should('contain', this.testData.check.city)
            cy.get('div.controls').should('contain', ' Заплатить ')

            cy.get('div[data-qa="1657886747803"]')
                .click()
                .url()
                .should('contain', '/counterparts')

            cy.contains('div.counterpart-list__item', this.testData.type["Наименование получателя или ИНН"])
                .within(() => {
                    cy.get('app-menu-select.actions').click()
                    cy.contains('div.menu-select-item__title', 'Удалить').click()
                })
            //Проверяю модальное окно
            cy.checkModalContainer(this.fixtureCounterparts)
            cy.get('app-button[data-qa="1658988097817"] > div[data-qa="1658987981978"]').click()
            cy.checkRedToastInfo(this.fixtureCounterparts.toastRedSuccess);
            cy.get('div.counterparts-list__empty-text').should('contain', ' Контрагенты не найдены ')
        })
        it('#3757. Валидация на создание дубликата контрагента', function () {
            cy.createCounterpartsApi(
                this.fixtureCounterparts["Контрагент для валидации"],
                this.testData.type["ИНН получателя"],
                this.testData.type["КПП получателя"],
                this.testData.type["Счет получателя"],
                this.testData.type["БИК банка получателя"],
                this.testData.check["corrType"]
            )
            cy.contains('div.counterpart__types__item', this.testData.check.nameCounterpart).click()
            cy.get('div.counterpart__types__item.active')
                .should('contain', this.testData.check.nameCounterpart)
                .and('have.css', 'border-bottom', `3px solid ${Cypress.env('colorBlueSolid')}`)

            cy.fillForm(this.testData.type)
            cy.contains('label.dynamic-input', ' Название банка получателя ')
                .find('div.dynamic-input__overlay.ng-star-inserted')
                .children()
                .invoke('val')
                .should('not.be.empty')

            cy.checkFormInput(this.testData)
            cy.get('app-button[data-qa="1657886705496"] > div[data-qa="1658987981978"]').click()
            cy.checkRedToastInfo(this.fixtureCounterparts.toastRedError);

            cy.visit('/counterparts')
                .url()
                .should('contain', '/counterparts')
            cy.get('div.counterpart-list__item').should('have.length', 1)
        })
    })
    context('Меню шаблоны', () => {
        /*
            Контрагент создается с неправильным типом!
            Данные кейсы решили не править, так как это слишком трудозатратно.
            Решение было принято в задаче Redmine 6599
        */
    })
    context('Новый платеж', () => {
        /*
            Контрагент создается с неправильным типом!
            Данные кейсы решили не править, так как это слишком трудозатратно.
            Решение было принято в задаче Redmine 6599
        */
    })
    context('Оплата', () => {
        beforeEach('Создаю контрагента через API', function () {
            cy.createCounterpartsApi(
                this.testData.type["Наименование получателя или ИНН"],
                this.testData.type["ИНН получателя"],
                this.testData.type["КПП получателя"],
                this.testData.type["Счет получателя"],
                this.testData.type["БИК банка получателя"],
                this.testData.check["corrType"]
            )
        })
        it('#3775. Оплата через иконку карты', function () {
            cy.visit('/counterparts')
                .url()
                .should('contain', '/counterparts')
            //Нажимаю на иконку "Карта", выбираю счет
            cy.contains('div.counterpart-list__item', this.testData.type["Наименование получателя или ИНН"])
                .within(() => {
                    cy.get('svg.controls__item').click()
                })
            //Проверяю выпадающий список, перехожу в новый платеж
            cy.get('div[class="menu-select__overlay menu-select__overlay--open"]').within(() => {
                cy.get('div.menu-select-item__title.menu-select-item__title--default').should('contain', ' Выберите счет для оплаты ')
                cy.modificationAccNumberDot(this.testData.type["Счет получателя"])
                    .then((modifiedNumber) => {
                        cy.get('div[data-qa="1658988309509"]')
                            .find('div.menu-select-item__title')
                            .should('contain', modifiedNumber)
                            .click()
                            .url()
                            .should('contain', '/transfer-rur')
                    });
            })

            cy.get('div.transfer-rur__types__item.active')
                .should('contain', this.testData.check.nameTransferRur)
                .and('have.css', 'border-bottom', `3px solid ${Cypress.env('colorBlueSolid')}`)

            //Жду пока заполниться поле "Название банка получателя"
            cy.contains('label.dynamic-input', ' Название банка получателя ')
                .find('div.dynamic-input__overlay.ng-star-inserted')
                .children()
                .invoke('val')
                .should('not.be.empty')
            cy.wait(1000)

            cy.checkFormInput(this.testData)
        })
        it('#3776. Оплата через окно просмотра', function () {
            cy.visit('/counterparts')
                .url()
                .should('contain', '/counterparts')

            cy.checkCounterpartList(this.testData).click()

            cy.get('div.controls')
                .should('contain', ' Заплатить ')
                .click()

            cy.get('div.transfer-rur__types__item.active')
                .should('contain', this.testData.check.nameTransferRur)
                .and('have.css', 'border-bottom', `3px solid ${Cypress.env('colorBlueSolid')}`)

            //Жду пока заполниться поле "Название банка получателя"
            cy.contains('label.dynamic-input', ' Название банка получателя ')
                .find('div.dynamic-input__overlay.ng-star-inserted')
                .children()
                .invoke('val')
                .should('not.be.empty')
            cy.wait(1000)

            cy.checkFormInput(this.testData)
        })
        it('#3777. Оплата через "Новый платеж"', function () {
            cy.visit('/transfer-rur')
                .url()
                .should('contain', '/transfer-rur')

            cy.get('div.transfer-rur__types__item.active')
                .should('contain', this.testData.check.nameTransferRur)
                .and('have.css', 'border-bottom', `3px solid ${Cypress.env('colorBlueSolid')}`)

            cy.get('[data-qa="1657971851284"] > .custom-select > [data-qa="1658989013306"] > .panel-form__input > .panel-form__input-wrap > [data-qa="1658988187497"]')
                .click()
                .type(this.testData.type["Наименование получателя или ИНН"])
            cy.contains('.dadata-list__item', this.testData.type["Наименование получателя или ИНН"]).click()
            cy.contains('label.dynamic-input', ' Название банка получателя ')
                .find('div.dynamic-input__overlay.ng-star-inserted')
                .children()
                .invoke('val')
                .should('not.be.empty')
            cy.wait(1000)

            cy.checkFormInput(this.testData)
        })
    })
});