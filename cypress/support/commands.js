import '@testing-library/cypress/add-commands'
import { sign } from 'crypto';
import 'cypress-real-events/support';
const registerCypressGrep = require('@cypress/grep')
registerCypressGrep()
//Ошибки, которые сайпрес должен игнорировать при работе
Cypress.on('uncaught:exception', (err) => !err.message.includes('ResizeObserver loop limit exceeded'))
Cypress.on('uncaught:exception', (err) => !err.message.includes('ResizeObserver loop completed with undelivered notifications'))

//Метод поиска по data-qa
Cypress.Commands.add('getByDataQa', (selector) => {
    cy.get(`[data-qa="${selector}"]`)
})
//Метод поиска по классу 
Cypress.Commands.add('getByClass', (className) => {
    cy.get(`[class="${className}"]`)
})
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
//Авторизация с сохранением сессии
Cypress.Commands.add('loginStand', () => {
    cy.session([], () => {
        cy.visit("/")
        cy.get('input[data-qa="1658988187497"][type="text"]').type("qa_eybondar_ul", { log: false })
        cy.get('input[data-qa="1658988187497"][type="password"]').type("Qq12345", { log: false })
        cy.get('div[data-qa="1658987981978"]').click()
        cy.url().should('contain', 'desktop')
    })
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
    cy.get('#toast-container')
        .invoke('text')
        .should('eq', text);
    cy.get('.toast')
        .should('have.css', 'background-image', 'linear-gradient(270deg, rgb(0, 168, 67) 0%, rgb(31, 208, 113) 100%)');
    cy.get('.toast-svg').click()
})
//Метод для работы с красным тостом 
Cypress.Commands.add('checkRedToastInfo', (text) => {
    cy.get('#toast-container')
        .invoke('text')
        .should('eq', text);
    cy.get('.toast')
        .should('have.css', 'background-image', 'linear-gradient(270deg, rgb(243, 144, 52) 0%, rgb(255, 39, 39) 100%)');
    cy.get('.toast-svg').click()
})
//
//РАБОТА С ФОРМАМИ
//Заполнение формы тестовыми данными
Cypress.Commands.add('typeForm', (fixture) => {
    Object.entries(fixture).forEach(([key, value]) => {
        cy.contains('.dynamic-input', `${key}`)
            .find('.dynamic-input__placeholder')
            .click()
            .type(`${value}`)
    });
})
Cypress.Commands.add('tearUp', () => {
    cy.session('session', () => {
        cy.visit('/')
    })
})
//Проверка заполненых полей в форме в разделе "Контрагенты"
Cypress.Commands.add('checkFormСounterparts', (fixture) => {
    cy.contains('.dynamic-input', 'Название банка получателя')
    Object.entries(fixture.type).forEach(([key, value]) => {
        if (key === 'Номер счета') {
            // Если ключ равен "Номер счета", примените функцию modificationAccNumberSpace
            value = modificationAccNumberSpace(value); //Это функция, работает через импорт
        }
        cy.contains('.dynamic-input', `${key}`)
            .find('.dynamic-input__overlay.ng-star-inserted')
            .children()
            .invoke('val')
            .should('not.be.empty')
            .then(sometext => expect(sometext).to.equal(`${value}`));
    });
    //Проверка поля "Название банка получателя"
    cy.contains('.dynamic-input', 'Название банка получателя')
        .find('.dynamic-input__overlay.ng-star-inserted')
        .children()
        .invoke('val')
        .then(sometext => expect(sometext).to.equal(fixture.check.bankName));
})
//
//ЛОАДЕР
//Лоадер not.be.visible
Cypress.Commands.add('loaderNotBeVisible', (endpoint) => {
    cy.wait(2500)
    cy.url().should('eq', `${Cypress.config('baseUrl')}${endpoint}`)
    cy.get('.loader')
        .should('not.be.visible')
})
//Лоадер not.exist (Используется в контрагентах)
Cypress.Commands.add('loaderNotExist', (endpoint) => {
    cy.wait(2500)
    cy.url().should('eq', `${Cypress.config('baseUrl')}${endpoint}`)
    cy.get('.loader')
        .should('not.exist')
})
Cypress.Commands.add('chooseItemFromFooter', (footerItemName) => {
    cy.get('div[data-qa="1657808685688"')
        .find('.add-menu__item')
        .contains(footerItemName)
        .click()
})

//
//ИЗМЕНЕНИЕ ФОРМАТА СЧЕТА - это функции!!!
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

