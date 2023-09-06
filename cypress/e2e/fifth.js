const { before } = require("lodash")

describe('first', () => {
  beforeEach('Авторизация на стенде Препрод', () => {
    cy.log("hello")
})
context('Первый блок тестов', () => {
  it('#2238 - Страница входа. Проверка редиректа на боевой сайт', function() {
    cy.loginStand()
  })
  it('#2238 - Страница входа. Проверка редиректа на боевой сайт', function() {
    cy.loginStand()
  })
  it('#2238 - Страница входа. Проверка редиректа на боевой сайт', function() {
    cy.loginStand()
  })
  it('#2238 - Страница входа. Проверка редиректа на боевой сайт', function() {
    cy.loginStand()
  })
  it('#2238 - Страница входа. Проверка редиректа на боевой сайт', function() {
    cy.loginStand()
  })
})
})