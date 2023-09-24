//Импорт файла с фикстурой
import testData from '../fixtures/account-types.json'
const clipboardy = require('clipboardy');


describe('Проверяю доступные экшны', () => {
    context('Для роли "Client"', () => {
        beforeEach(() => {
            // Авторизация + создание сессии
            cy.loginApi('TOKEN_ALL_COMPANY')
            //Смена комнапии на ООО "ЛИДЕР" - нужно для того, чтобы не попасть на контору с блокировкой
            cy.changeCompanyApi('9386093')
            cy.visit('/');
        })

        it('#4418. Проверяю текст, иконкe, порядок отображения и количество пунктов меню', function () {
            Object.keys(testData.type).forEach((type) => {
                //Определяю длинну массива "data" из фикстуры, учивыются только значения = true
                let lengthtestData = Object.values(testData.type[type].data).filter(value => value === true).length

                // //Нахожу все элементы в сайдбаре
                // cy.get('.product-item')
                //     //Фильтрую элементы по названию
                //     .filter(`:contains(${testData.type[type].name.trim()})`)
                //     //Фильтрую элементы по валюте
                //     .filter(`:contains(${testData.type[type].currency.trim()})`)



                cy.getElementFromSidebar(testData.type[type])
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
                        //Проверяю наличие иконок и текст экшнов
                        cy.get('div.menu-select__content')
                            .within(() => {
                                const expectedOrder = Object.entries(testData.data)
                                    .filter(([key]) => testData.type[type].data[key] === true)
                                    .map(([key]) => key);

                                expectedOrder.forEach((key, index) => {
                                    cy.get('.menu-select-item__title')
                                        .eq(index)
                                        .should('contain', key)

                                    cy.get('.mat-icon')
                                        .eq(index)
                                        .should('contain', testData.data[key])
                                })
                            })
                    })
            })
        })
    })
    context('Для роли "Bank"', () => {
        beforeEach('Создание сессии авторизации для роли "Bank"', () => {
            // Авторизация + создание сессии
            cy.loginApi('TOKEN_UZ_TEST3')
            //Смена комнапии на АО "МОСКОМБАНК"
            cy.changeCompanyApi(8017217)
            cy.visit("/")
        })
        it('#4432. Проверяю текст, иконкe, порядок отображения и количество пунктов меню', () => {
            Object.keys(testData.bank).forEach((type) => {
                //Определяю длинну массива "data" из фикстуры, учивыются только значения = true
                let lengthtestData = Object.values(testData.bank[type].data).filter(value => value === true).length

                //Нахожу все элементы в сайдбаре
                cy.getElementFromSidebar(testData.bank[type])
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
                        //Проверяю наличие иконок и текст экшнов
                        cy.get('div.menu-select__content')
                            .within(() => {
                                const expectedOrder = Object.entries(testData.data)
                                    .filter(([key]) => testData.bank[type].data[key] === true)
                                    .map(([key]) => key);

                                expectedOrder.forEach((key, index) => {
                                    cy.get('.menu-select-item__title')
                                        .eq(index)
                                        .should('contain', key)

                                    cy.get('.mat-icon')
                                        .eq(index)
                                        .should('contain', testData.data[key])
                                })
                            })
                    })
            })
        })

    })
    context('Проверка действия при нажатии на экшн', () => {

        beforeEach('Создание сессии авторизации для роли "Bank"', () => {
            // Авторизация + создание сессии
            // cy.loginApi('TOKEN_ALL_COMPANY')
            cy.loginApi('TOKEN')

            //Смена комнапии на ООО "ЛИДЕР" - нужно для того, чтобы не попасть на контору с блокировкой
            cy.changeCompanyApi('9386093')
            cy.visit('/');
        })
        it('Переход в "Новый платеж" (Счет тип != 4)', function () {
            //Нахожу все элементы в сайдбаре
            cy.getElementFromSidebar(testData.type[1])
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
            //Нахожу все элементы в сайдбаре
            cy.getElementFromSidebar(testData.type[4])
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
            //Нахожу все элементы в сайдбаре
            cy.getElementFromSidebar(testData.type[1])
                .within(() => {
                    cy.get('div.menu-select__content-wrapper')
                        .find('div.product-item__sign')
                        .click()
                    cy.contains('.menu-select-item__title', 'Выписка')
                        .click({ force: true })
                })
            cy.get('#modal-container').should('be.visible')
            cy.get('.dynamic-form')
                .should('contain', testData.type[1].name)
        })






        it.only('Переход в "Копировать реквизиты"', function () {




            //Нахожу все элементы в сайдбаре
            cy.getElementFromSidebar(testData.type[1])
                .within(() => {
                    cy.get('div.menu-select__content-wrapper')
                        .find('div.product-item__sign')
                        .click()
                    cy.contains('.menu-select-item__title', 'Копировать реквизиты')
                        .click({ force: true })
                })


            cy.task('getClipboard1')
                .should('eq', "textToCopy")



            // cy.get('[data-qa="1658988187497"]')
            //     .click()
            // .type('{ctrl}v')

            //     .invoke('val', "Helllllllll")

            // .should('contain', 'Банк получателя ПАО АКБ "МЕТАЛЛИНВЕСТБАНК" г.МоскваБИК 044525176Корр. счет банка 30101810300000000176Получатель ОБЩЕСТВО С ОГРАНИЧЕННОЙ ОТВЕТСТВЕННОСТЬЮ "ЛИДЕР"ИНН 7804684931КПП 780401001Счёт получателя 40702810900990004267')

        })

    })
})
