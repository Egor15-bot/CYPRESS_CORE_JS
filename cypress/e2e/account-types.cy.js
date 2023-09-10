describe('Проверяю доступные экшны', () => {
    beforeEach('', () => {
        // Авторизация + создание сессии
        cy.loginTestApi('TOKEN')
        // Смена компании на АО "Калина"
        cy.changeCompanyApi('1302137');
        cy.visit('/');
        // Импорт фикстуры
        cy.fixture('account-types').then(function (testData111) {
            this.testData111 = testData111;
        });
    });

    const testData = {
        "data": {
            "Новый платеж": "add",
            "Выписка": "format_list_bulleted",
            "Документы картотеки": "",
            "Копировать реквизиты": "content_copy"
        },
        "type": {
            "1": {
                "name": "Расчетный счет **0261",
                "data": {
                    "Новый платеж": true,
                    "Выписка": true,
                    "Документы картотеки": true,
                    "Копировать реквизиты": true
                }
            },
            "2": {
                "name": "Карточный счет **1269",
                "data": {
                    "Новый платеж": true,
                    "Выписка": false,
                }
            }
        },
    };

    Object.keys(testData.type).forEach((type) => {
        const typeData = testData.type[type].data;

        context(`Тип счета ${type}`, () => {
            beforeEach('Поиск нужного счета и открытие кебаб меню', function () {
                cy.get('div.accordion__content')
                    .contains('div.product-item', testData.type[type].name)
                    .find('div.menu-select__content-wrapper')
                    .find('div.product-item__sign')
                    .click();
            });

            it('Проверяю что присутствует текст, иконка и пункт меню отображается в правильном порядке', function () {
                cy.contains('div.product-item', testData.type[type].name)
                    .find('div.menu-select__content')
                    .within(() => {
                        const expectedOrder = Object.entries(testData.data)
                            .filter(([key]) => typeData[key] === true)
                            .map(([key]) => key);

                        expectedOrder.forEach((key, index) => {
                            cy.get('.menu-select-item__title')
                                .eq(index)
                                .should('contain', key);

                            cy.get('.mat-icon')
                                .eq(index)
                                .should('contain', testData.data[key]);
                        });
                    });
            });

            if (typeData['Новый платеж']) {
                it('Переход в "Новый платеж"', function () {
                    cy.contains('.menu-select-item__title', 'Новый платеж')
                        .click({ force: true })
                        .url()
                        .should('contain', '/transfer-rur');
                });
            }

            if (typeData['Выписка']) {
                it('Переход в "Выписка"', function () {
                    cy.contains('.menu-select-item__title', 'Выписка')
                        .click({ force: true });
                    cy.get('#modal-container').should('be.visible');
                });
            }
        });
    });
});
