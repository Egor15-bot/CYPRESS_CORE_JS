const { before } = require("lodash")
//TODO:Поменять метод findFoote на findEl перенести логику и после чегоп ереписать тесты 
describe('fourth', () => {
  beforeEach('Авторизация на стенде Препрод', () => {
    cy.visit('/')
  })
  context('Первый блок тестов', () => {
    it('#2238 - Страница входа. Проверка редиректа на боевой сайт', function () {
      cy.getByDataQa('1657808668688').click()
      cy.url().should('eq', 'https://metib.online/')
    })
    it('#2239 - Страница входа. Проверка отображения номера телефона', function () {
      cy.getByClass('phone__value')
        .should('be.visible')
        .should('contain', '8 (800) 500-81-97')
    })
    it('#2241 - Страница входа. Заголовок ', () => {
      cy.getByClass('panel-title')
        .should('be.visible')
        .should('contain', 'Интернет-банк для бизнеса')
    })  
  })
  it('#2243 - Страница входа. Мобильное приложение', () => {
    cy.chooseItemFromFooter('Мобильное приложение')
    cy.getByClass("apps__close_header").should('contain', "Мобильное приложение")
    cy.getByClass("apps__content_text").should('contain', ' Отсканируйте QR-код и установите мобильное приложение на телефон или воспользуйтесь ссылкой ')
    cy.getByClass("apps__content_image").should('be.visible')
    cy.getByDataQa('1657808691984').invoke('removeAttr','target').click()
    // cy.url().should('include','https://apps.rustore.ru/app/com.isimplelab.ionic.standard.ul')
  
  })
  it.only('#2244 - Страница входа. Отделения и банкоматы', () => {
    cy.chooseItemFromFooter('Отделения и банкоматы')
    cy.url().should('eq', "https://pred-ul.metib.online/auth/places")
  })
  it('#2246 - Страница входа. Новость', () => {
    cy.chooseItemFromFooter('Новости')
    cy.getByDataQa('1657809117566').should('contain', 'Новости')
    cy.getByDataQa("1657809113674").should('be.visible')
    cy.getByClass('news__title_close').click()
    cy.getByClass("block-content.ng-tns-c310-2").should('not.exist')
  })
  it('#2247 - Страница входа. Генеральная лицензия', () => {
    cy.get('.copy').should('contain', '© ПАО АКБ "Металлинвестбанк". Генеральная лицензия Банка России № 2440, от 21.11.2014 г.')
  })
  it('Страница входа. Логин с валидными данными', () => {
    cy.chooseItemFromFooter('Мобильное приложение')
  })
  it('Страница входа. Логин с невалидными данными', () => {
    authPage.loginWithInvalidPass()
  })
})