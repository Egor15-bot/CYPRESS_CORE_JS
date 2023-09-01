const { before } = require("lodash")

describe('fourth', () => {
  beforeEach('Авторизация на стенде Препрод', () => {
    cy.fixture('example').as('name') 
    cy.visit('/') 
})
context('Первый блок тестов', () => {
  it('#2238 - Страница входа. Проверка редиректа на боевой сайт', function() {
    // authPage.clickLogoRedirect("https://metib.online/")
    cy.log(this.name)
    cy.getByDataQa('1657808668688').click()
    cy.url().should('eq', 'https://metib.online/')
  })
  it('#2239 - Страница входа. Проверка отображения номера телефона', function() {
    cy.log(this.name)
    cy.get('[class="phone__value"]')
      .should('be.visible')
      .should('contain', '8 (800) 500-81-97')
  })
  it('#2241 - Страница входа. Заголовок ', () => {
        cy.get('[class="panel-title"]')
            .should('be.visible')
            .should('contain', 'Интернет-банк для бизнеса')
  })
  it('#2238 - Страница входа. Проверка редиректа на боевой сайт', function() {
    // authPage.clickLogoRedirect("https://metib.online/")
    cy.log(this.name)
    cy.getByDataQa('1657808668688').click()
    cy.url().should('eq', 'https://metib.online/')
  })
  it('#2239 - Страница входа. Проверка отображения номера телефона', function() {
    cy.log(this.name)
    cy.get('[class="phone__value"]')
      .should('be.visible')
      .should('contain', '8 (800) 500-81-97')
  })
  it('#2241 - Страница входа. Заголовок ', () => {
        cy.get('[class="panel-title"]')
            .should('be.visible')
            .should('contain', 'Интернет-банк для бизнеса')
  })
  
})
context('Первый блок тестов', () => {
  it('#2238 - Страница входа. Проверка редиректа на боевой сайт', function() {
    // authPage.clickLogoRedirect("https://metib.online/")
    cy.log(this.name)
    cy.getByDataQa('1657808668688').click()
    cy.url().should('eq', 'https://metib.online/')
  })
  it('#2239 - Страница входа. Проверка отображения номера телефона', function() {
    cy.log(this.name)
    cy.get('[class="phone__value"]')
      .should('be.visible')
      .should('contain', '8 (800) 500-81-97')
  })
  it('#2241 - Страница входа. Заголовок ', () => {
        cy.get('[class="panel-title"]')
            .should('be.visible')
            .should('contain', 'Интернет-банк для бизнеса')
  })
  it('#2238 - Страница входа. Проверка редиректа на боевой сайт', function() {
    // authPage.clickLogoRedirect("https://metib.online/")
    cy.log(this.name)
    cy.getByDataQa('1657808668688').click()
    cy.url().should('eq', 'https://metib.online/')
  })
  it('#2239 - Страница входа. Проверка отображения номера телефона', function() {
    cy.log(this.name)
    cy.get('[class="phone__value"]')
      .should('be.visible')
      .should('contain', '8 (800) 500-81-97')
  })
  it('#2241 - Страница входа. Заголовок ', () => {
        cy.get('[class="panel-title"]')
            .should('be.visible')
            .should('contain', 'Интернет-банк для бизнеса')
  })
  
})
context('Первый блок тестов', () => {
  it('#2238 - Страница входа. Проверка редиректа на боевой сайт', function() {
    // authPage.clickLogoRedirect("https://metib.online/")
    cy.log(this.name)
    cy.getByDataQa('1657808668688').click()
    cy.url().should('eq', 'https://metib.online/')
  })
  it('#2239 - Страница входа. Проверка отображения номера телефона', function() {
    cy.log(this.name)
    cy.get('[class="phone__value"]')
      .should('be.visible')
      .should('contain', '8 (800) 500-81-97')
  })
  it('#2241 - Страница входа. Заголовок ', () => {
        cy.get('[class="panel-title"]')
            .should('be.visible')
            .should('contain', 'Интернет-банк для бизнеса')
  })
  it('#2238 - Страница входа. Проверка редиректа на боевой сайт', function() {
    // authPage.clickLogoRedirect("https://metib.online/")
    cy.log(this.name)
    cy.getByDataQa('1657808668688').click()
    cy.url().should('eq', 'https://metib.online/')
  })
  it('#2239 - Страница входа. Проверка отображения номера телефона', function() {
    cy.log(this.name)
    cy.get('[class="phone__value"]')
      .should('be.visible')
      .should('contain', '8 (800) 500-81-97')
  })
  it('#2241 - Страница входа. Заголовок ', () => {
        cy.get('[class="panel-title"]')
            .should('be.visible')
            .should('contain', 'Интернет-банк для бизнеса')
  })
  
})
context('Первый блок тестов', () => {
  it('#2238 - Страница входа. Проверка редиректа на боевой сайт', function() {
    // authPage.clickLogoRedirect("https://metib.online/")
    cy.log(this.name)
    cy.getByDataQa('1657808668688').click()
    cy.url().should('eq', 'https://metib.online/')
  })
  it('#2239 - Страница входа. Проверка отображения номера телефона', function() {
    cy.log(this.name)
    cy.get('[class="phone__value"]')
      .should('be.visible')
      .should('contain', '8 (800) 500-81-97')
  })
  it('#2241 - Страница входа. Заголовок ', () => {
        cy.get('[class="panel-title"]')
            .should('be.visible')
            .should('contain', 'Интернет-банк для бизнеса')
  })
  it('#2238 - Страница входа. Проверка редиректа на боевой сайт', function() {
    // authPage.clickLogoRedirect("https://metib.online/")
    cy.log(this.name)
    cy.getByDataQa('1657808668688').click()
    cy.url().should('eq', 'https://metib.online/')
  })
  it('#2239 - Страница входа. Проверка отображения номера телефона', function() {
    cy.log(this.name)
    cy.get('[class="phone__value"]')
      .should('be.visible')
      .should('contain', '8 (800) 500-81-97')
  })
  it('#2241 - Страница входа. Заголовок ', () => {
        cy.get('[class="panel-title"]')
            .should('be.visible')
            .should('contain', 'Интернет-банк для бизнеса')
  })
  
})
})