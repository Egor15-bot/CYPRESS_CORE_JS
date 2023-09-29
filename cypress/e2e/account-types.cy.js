describe('Проверяю доступные экшны', () => {
    beforeEach(() => {
        //Импорт фиксруты
        cy.fixture('account-types').then(function (data) {
            this.testData = data;
        })
    })
    context('Для роли "Client"', () => {
        beforeEach('Авторизация и смена компании на ООО "ЛИДЕР"', () => {
            // Авторизация
            cy.loginApi('TOKEN_ALL_COMPANY')
            //Смена комнапии на ООО "ЛИДЕР" - нужно для того, чтобы не попасть на контору с блокировкой
            cy.changeCompanyApi('9386093')
            cy.visit('/');
        })
        it('#4418. Проверяю текст, иконкe, порядок отображения и количество пунктов меню', function () {
            Object.keys(this.testData.type).forEach((type) => {
                //Определяю длинну массива "data" из фикстуры, учивыются только значения = true
                let lengthtestData = Object.values(this.testData.type[type].data).filter(value => value === true).length

                //Проверяю количество экшнов в списке
                cy.getElementFromSidebar(this.testData.type[type])
                    .within(() => {
                        cy.get('div.menu-select__content-wrapper')
                            .find('div.product-item__sign')
                            .click({ force: true })
                        cy.get('[data-qa="1658842254864"]')
                            .scrollIntoView()
                            .should('be.visible')
                        cy.get('div.menu-select__content')
                            .children()
                            .should('have.length', lengthtestData)
                    })
                //Проверяю наличие иконок и текст экшнов
                cy.getElementFromSidebar(this.testData.type[type])
                    .within(() => {
                        cy.get('div.menu-select__content')
                            .within(() => {
                                const expectedOrder = Object.entries(this.testData.icon)
                                    .filter(([key]) => this.testData.type[type].data[key] === true)
                                    .map(([key]) => key);

                                //Проверяю порядок отображения пунктов меню
                                expectedOrder.forEach((key, index) => {
                                    cy.get('.menu-select-item__title')
                                        .eq((index))
                                        .should('contain', key)

                                    //Проверяю иконки
                                    if (["Новый платеж", "Выписка", "Копировать реквизиты", "Переименовать"].includes(key)) {
                                        cy.get('.mat-icon')
                                            .eq(index)
                                            .should('contain', this.testData.icon[key])
                                    }
                                    else if (["Экспорт реквизитов в PDF", "Получить справку", "SMS - информирование", "Перейти к тарифу"].includes(key)) {
                                        cy.get('.mat-icon')
                                            .eq(index)
                                            .find('path[d]')
                                            .should('have.attr', 'd', `${this.testData.icon[key]}`)
                                    }
                                })
                            })
                    })
            })
        })
    })
    context('Для роли "Bank"', () => {
        beforeEach('Авторизация и смена компании на АО "МОСКОМБАНК"', () => {
            // Авторизация
            cy.loginApi('TOKEN_UZ_TEST3')
            //Смена комнапии на АО "МОСКОМБАНК"
            cy.changeCompanyApi(8017217)
            cy.visit("/")
        })
        it('#4432. Проверяю текст, иконкe, порядок отображения и количество пунктов меню', function () {
            Object.keys(this.testData.bank).forEach((bank) => {
                //Определяю длинну массива "data" из фикстуры, учивыются только значения = true
                let lengthtestData = Object.values(this.testData.bank[bank].data).filter(value => value === true).length

                //Проверяю количество экшнов в списке
                cy.getElementFromSidebar(this.testData.bank[bank])
                    .within(() => {
                        cy.get('div.menu-select__content-wrapper')
                            .find('div.product-item__sign')
                            .click({ force: true })
                        cy.get('[data-qa="1658842254864"]')
                            .scrollIntoView()
                            .should('be.visible')
                        //Проверяю количество экшнов в списке
                        cy.get('div.menu-select__content')
                            .children()
                            .should('have.length', lengthtestData)
                    })
                //Проверяю наличие иконок и текст экшнов
                cy.getElementFromSidebar(this.testData.bank[bank])
                    .within(() => {
                        cy.get('div.menu-select__content')
                            .within(() => {
                                const expectedOrder = Object.entries(this.testData.icon)
                                    .filter(([key]) => this.testData.bank[bank].data[key] === true)
                                    .map(([key]) => key);

                                //Проверяю порядок отображения пунктов меню
                                expectedOrder.forEach((key, index) => {
                                    cy.get('.menu-select-item__title')
                                        .eq((index))
                                        .should('contain', key)

                                    //Проверяю иконки
                                    if (["Новый платеж", "Выписка", "Копировать реквизиты", "Переименовать"].includes(key)) {
                                        cy.get('.mat-icon')
                                            .eq(index)
                                            .should('contain', this.testData.icon[key])
                                    }
                                    else if (["Экспорт реквизитов в PDF", "Получить справку", "SMS - информирование", "Перейти к тарифу"].includes(key)) {
                                        cy.get('.mat-icon')
                                            .eq(index)
                                            .find('path[d]')
                                            .should('have.attr', 'd', `${this.testData.icon[key]}`)
                                    }
                                })
                            })
                    })
            })
        })
    })
    context('#4431. Проверка действия в кебаб меню', () => {
        beforeEach('Авторизация и смена компании на ООО "ЛИДЕР"', () => {
            // Авторизация
            cy.loginApi('TOKEN')
            //Смена комнапии на ООО "ЛИДЕР" - нужно для того, чтобы не попасть на контору с блокировкой
            cy.changeCompanyApi('9386093')
            cy.visit('/');
        })
        it('Переход в "Новый платеж" (Счет тип != 4)', function () {
            cy.getElementFromSidebar(this.testData.type[1])
                .within(() => {
                    cy.get('div.menu-select__content-wrapper')
                        .find('div.product-item__sign')
                        .click()
                    cy.get('div.menu-select-item__title')
                        .contains('Новый платеж')
                        .click({ force: true })
                        .url().should('contain', '/transfer-rur?accountId=')
                })
        });
        it('Переход в "Валютный платеж" (Счет тип 4)', function () {
            cy.getElementFromSidebar(this.testData.type[4])
                .within(() => {
                    cy.get('div.menu-select__content-wrapper')
                        .find('div.product-item__sign')
                        .click()
                    cy.get('div.menu-select-item__title')
                        .contains('Новый платеж')
                        .click({ force: true })
                        .url().should('contain', '/ved/transfer-curr?accountId=')
                })
        })
        it('Переход в "Выписка"', function () {
            cy.getElementFromSidebar(this.testData.type[1])
                .within(() => {
                    cy.get('div.menu-select__content-wrapper')
                        .find('div.product-item__sign')
                        .click()
                    cy.contains('.menu-select-item__title', 'Выписка')
                        .click({ force: true })
                })
            cy.get('#modal-container').should('be.visible')
            cy.get('.dynamic-form')
                .should('contain', this.testData.type[1].name)
        })
        it('Проверяю действие "Копировать реквизиты"', function () {
            cy.getElementFromSidebar(this.testData.type[1])
                .within(() => {
                    cy.get('div.menu-select__content-wrapper')
                        .find('div.product-item__sign')
                        .click()
                    cy.contains('.menu-select-item__title', 'Копировать реквизиты')
                        .click({ force: true })
                })
            //Проверяю буфер обмена
            cy.checkClipboard(this.testData.type[1].requisites)
        })
        it('Проверяю действие "Экспорт реквизитов в PDF"', function () {
            //Перехватываю запрос
            cy.intercept('GET', `${Cypress.config('baseUrl')}/rest/stateful/corp/metinv/print/requisites_pdf?acc_id=${this.testData.type[1].acc_id}`).as('exportRequest');
            //Нажимаю "Экспорт реквизитов в PDF" в кебаб-меню
            cy.getElementFromSidebar(this.testData.type[1])
                .within(() => {
                    cy.get('div.menu-select__content-wrapper')
                        .find('div.product-item__sign')
                        .click()
                    cy.contains('.menu-select-item__title', 'Экспорт реквизитов в PDF')
                        .click({ force: true })
                })
            //Проверяю статус rest запроса
            cy.wait('@exportRequest', { timeout: 60000 }).then((interception) => {
                expect(interception.response.statusCode).to.eq(200);
            });
        })
        it('Проверяю действие "Получить справку"', function () {
            //Нажимаю "Получить справку" в кебаб-меню
            cy.getElementFromSidebar(this.testData.type[1])
                .within(() => {
                    cy.get('div.menu-select__content-wrapper')
                        .find('div.product-item__sign')
                        .click()
                    cy.contains('.menu-select-item__title', 'Получить справку')
                        .click({ force: true })
                        .url().should('contain', '/references/1/10')
                })
        })
        it('Проверяю действие "Переименовать"', function () {
            //Нажимаю "Переименовать" в кебаб-меню
            cy.getElementFromSidebar(this.testData.type[1])
                .within(() => {
                    cy.get('div.menu-select__content-wrapper')
                        .find('div.product-item__sign')
                        .click()
                    cy.contains('.menu-select-item__title', 'Переименовать')
                        .click({ force: true })
                        .url().should('contain', `/product/${this.testData.type[1].acc_id}`)
                })
        })
        it('Проверяю действие "Перейти к тарифу"', function () {
            //Нажимаю "Перейти к тарифу" в кебаб-меню
            cy.getElementFromSidebar(this.testData.type[1])
                .within(() => {
                    cy.get('div.menu-select__content-wrapper')
                        .find('div.product-item__sign')
                        .click()
                    cy.contains('.menu-select-item__title', 'Перейти к тарифу')
                        .click({ force: true })
                        .url().should('contain', '/tarif')
                })
        })
        it('Проверяю действие "SMS - информирование"', function () {
            //Нажимаю "SMS - информирование" в кебаб-меню
            cy.getElementFromSidebar(this.testData.type[1])
                .within(() => {
                    cy.get('div.menu-select__content-wrapper')
                        .find('div.product-item__sign')
                        .click()
                    cy.contains('.menu-select-item__title', 'SMS - информирование')
                        .click({ force: true })
                        .url().should('contain', '/settings')
                })
        })
        it('Проверяю действие "Документы картотеки"', function () {
            //Нажимаю "Документы картотеки" в кебаб-меню
            cy.getElementFromSidebar(this.testData.type[1])
                .within(() => {
                    cy.get('div.menu-select__content-wrapper')
                        .find('div.product-item__sign')
                        .click()
                    cy.contains('.menu-select-item__title', 'Документы картотеки')
                        .click({ force: true })
                        .url().should('contain', `/product/${this.testData.type[1].acc_id}`)
                })
        })
    })
})