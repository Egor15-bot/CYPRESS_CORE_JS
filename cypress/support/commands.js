import '@testing-library/cypress/add-commands'
import { sign } from 'crypto';
import 'cypress-real-events/support';
const registerCypressGrep = require('@cypress/grep')
registerCypressGrep()
//Ошибки, которые сайпрес должен игнорировать при работе
Cypress.on('uncaught:exception', (err) => !err.message.includes('ResizeObserver loop limit exceeded'))
Cypress.on('uncaught:exception', (err) => !err.message.includes('ResizeObserver loop completed with undelivered notifications'))

//Авторизация с сохранением сессии
Cypress.Commands.add('loginStand', (login, password) => {
    cy.session('Создание сессии авторизации', () => {
        cy.visit("/")
        cy.get('input[data-qa="1658988187497"][type="text"]').type(Cypress.env(login), { log: false })
        cy.get('input[data-qa="1658988187497"][type="password"]').type(Cypress.env(password), { log: false })
        cy.get('div[data-qa="1658987981978"]').click()
        cy.url().should('contain', 'desktop')
    })
})
//Ожидание появления элемента на странице 
Cypress.Commands.add('waitUntil', (element) => {
    cy.get(element).should('be.visible')
})

//Метод поиска ключа в localStorage
Cypress.Commands.add('getLocalStorageValue', (key) => {
    cy.window().then((win) => {
        const value = win.localStorage.getItem(key);
        return value.should('exist')
    });
})
//Метод для выбора любого элемента из хедера на главном меню
Cypress.Commands.add('openHeaderTab', () => {
    cy.contains('div[class="main-menu__content-wrapper"] *', tabName).click()
})
//Переход в раздел через бургер меню
Cypress.Commands.add('openBurgerTab', (tabName) => {
    cy.get('.hamburger-menu__icon.closed use').click()
    cy.contains('div[data-qa="1658842269986"].main-menu__content div ', tabName).click()
})
//Метод для работы с зеленым тостом 
Cypress.Commands.add('checkGreenToastInfo', (text) => {
    cy.get('div.toast-wrapper-text')
        .should('have.text', text);
    cy.get('.toast')
        .should('have.css', 'background-image', 'linear-gradient(270deg, rgb(0, 168, 67) 0%, rgb(31, 208, 113) 100%)');
    cy.get('.toast-svg > svg > use').click()
})
//Метод для работы с красным тостом 
Cypress.Commands.add('checkRedToastInfo', (text) => {
    cy.get('div.toast-wrapper-text')
        .should('have.text', text);
    cy.get('.toast')
        .should('have.css', 'background-image', 'linear-gradient(270deg, rgb(243, 144, 52) 0%, rgb(255, 39, 39) 100%)');
    cy.get('.toast-svg > svg > use').click()
})
//Заполнение формы тестовыми данными
Cypress.Commands.add('fillForm', (fixture) => {
    cy.url().then((url) => {
        Object.entries(fixture).forEach(([key, value]) => {
            //Эти условия менют key для страницы "Контрагенты"
            if (key === 'Наименование получателя или ИНН') {
                if (url.includes(`${Cypress.config('baseUrl')}counterparts/create`)) {
                    key = 'Наименование'; // Здесь вы можете изменить ключ
                }
            }
            if (key === 'ИНН получателя') {
                if (url.includes(`${Cypress.config('baseUrl')}counterparts/create`)) {
                    key = 'ИНН'; // Здесь вы можете изменить ключ
                }
            }
            if (key === 'КПП получателя') {
                if (url.includes(`${Cypress.config('baseUrl')}counterparts/create`)) {
                    key = 'КПП'; // Здесь вы можете изменить ключ
                }
            }
            if (key === 'Счет получателя') {
                if (url.includes(`${Cypress.config('baseUrl')}counterparts/create`)) {
                    key = 'Номер счета'; // Здесь вы можете изменить ключ
                }
            }
            cy.contains('label.dynamic-input', `${key}`)
                .find('div.dynamic-input__placeholder')
                // .click()
                .type(`${value}`);
        });
    });
});
//Проверка заполненых полей в форме в разделе "Контрагенты"
Cypress.Commands.add('checkFormInput', (fixture) => {
    cy.url().then((url) => {
        Object.entries(fixture.type).forEach(([key, value]) => {
            //Эти условия менют key для страницы "Контрагенты"
            if (key === 'Наименование получателя или ИНН') {
                if (url.includes(`${Cypress.config('baseUrl')}counterparts/create`)) {
                    key = 'Наименование'; // Здесь вы можете изменить ключ
                }
            }
            if (key === 'ИНН получателя') {
                if (url.includes(`${Cypress.config('baseUrl')}counterparts/create`)) {
                    key = 'ИНН'; // Здесь вы можете изменить ключ
                }
            }
            if (key === 'КПП получателя') {
                if (url.includes(`${Cypress.config('baseUrl')}counterparts/create`)) {
                    key = 'КПП'; // Здесь вы можете изменить ключ
                }
            }
            if (key === 'Счет получателя') {
                if (url.includes(`${Cypress.config('baseUrl')}counterparts/create`)) {
                    key = 'Номер счета'; // Здесь вы можете изменить ключ
                    // Если ключ равен "Номер счета", примените функцию modificationAccNumberSpace
                    value = modificationAccNumberSpace(value); //Это функция, работает через импорт
                }
            }
            if (key === 'Счет получателя') {
                //Данное условие касается раздела "Новый платеж"
                if (url.includes(`${Cypress.config('baseUrl')}transfer-rur`)) {
                    // Если ключ равен "Номер счета", примените функцию modificationAccNumberSpace
                    value = modificationAccNumberSpace(value); //Это функция, работает через импорт
                }
                //Данное условие касается раздела "Шаблоны"
                if (url.includes(`${Cypress.config('baseUrl')}template?new=true`)) {
                    // Если ключ равен "Номер счета", примените функцию modificationAccNumberSpace
                    value = modificationAccNumberSpace(value); //Это функция, работает через импорт
                }
            }
            cy.contains('label.dynamic-input', `${key}`)
                .find('div.dynamic-input__overlay.ng-star-inserted')
                .children()
                .invoke('val')
                .should('not.be.empty')
                .then(sometext => expect(sometext).to.equal(`${value}`));
        });
        //Проверка поля "Название банка получателя"
        cy.contains('label.dynamic-input', 'Название банка получателя')
            .find('div.dynamic-input__overlay.ng-star-inserted')
            .children()
            .invoke('val')
            .then(sometext => expect(sometext).to.equal(fixture.check.bankName));
    });
})
//
//ЛОАДЕР
//Лоадер not.be.visible
Cypress.Commands.add('loaderNotBeVisible', (endpoint) => {
    cy.wait(1000)
    cy.url().should('eq', `${Cypress.config('baseUrl')}${endpoint}`)
    cy.get('div.loader')
        .should('not.be.visible')
})
//Лоадер not.exist (Используется в контрагентах)
Cypress.Commands.add('loaderNotExist', (endpoint) => {
    cy.wait(1000)
    cy.url().should('eq', `${Cypress.config('baseUrl')}${endpoint}`)
    cy.get('div.loader')
        .should('not.exist')
})
Cypress.Commands.add('chooseItemFromFooter', (footerItemName) => {
    cy.get('div[data-qa="1657808685688"')
        .find('div.add-menu__item')
        .contains(footerItemName)
        .click()
})
//Делаю номер счета accNumber в формате "00000 000 0 00000000000"
function modificationAccNumberSpace(accNumber) {
    const str = accNumber;
    let newAccNumber = '';
    str.split('').forEach((letter, index) => {
        if (index === 5 || index === 8 || index === 9) {
            newAccNumber += ' ' + letter
        } else {
            newAccNumber += letter
        }
    })
    return newAccNumber
}

//Делаю номер счета accNumber в формате "00000 000 0 00000000000"
Cypress.Commands.add('modificationAccNumberSpace', (accNumber) => {
    const str = accNumber;
    let newAccNumber = '';
    str.split('').forEach((letter, index) => {
        if (index === 5 || index === 8 || index === 9) {
            newAccNumber += ' ' + letter
        } else {
            newAccNumber += letter
        }
    })
    return newAccNumber
})
// Делаю номер счета accNumber в формате "00000.000.0.00000000000"
Cypress.Commands.add('modificationAccNumberDot', (accNumber) => {
    const str = accNumber;
    let newAccNumber = '';
    str.split('').forEach((letter, index) => {
        if (index === 5 || index === 8 || index === 9) {
            newAccNumber += '.' + letter
        } else {
            newAccNumber += letter
        }
    })
    return newAccNumber
})

//Проверяю буфер обмена (РАБОТАЕТ ТОЛЬКО НА CHROME и ELECTRON)
Cypress.Commands.add('checkClipboard', text => {
    cy.window().its('navigator.clipboard')
        .then((clip) => clip.readText())
        .should('equal', text)
})
