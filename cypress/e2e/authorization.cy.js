describe('Страница авторизации', () => {
  beforeEach('Авторизация на стенде Препрод', () => {
    cy.visit('/')
  })
  context('Блок тестов авторизации', () => {
    it('#2238 - Страница входа. Лого Проверка редиректа на боевой сайт', function () {
      cy.getByDataQa('1657808668688')
      .click()
      cy.url().should('eq', 'https://metib.online/')
    })
    it('#2239 - Страница входа. Номер контакт центра', () => {
      cy.getByClass('phone__value')
        .should('contain', '8 (800) 500-81-97')
    })
    it('#2240 - Страница входа. Новости хедер', () =>{
      //FIXME:Дописать метод проверки новостей в хедере
      cy.get('.main-news').should('be.visible')
      cy.get('.main-news__info').within(() => {
        cy.get('main-news__date').should('contain',' 07.11.2022 ')
        cy.get('main-news__content_title').should('contain','Для клиентов ДО Новосибирский')
        cy.get('main-news__content_text').should('be.visible')
      })
      cy.get('.main-news__content_link').click()
      cy.getByDataQa('1657809113674').should('exist')
      cy.getByDataQa('1657809117566').should('contain', 'Новости')
      cy.getByDataQa("1657809113674").should('be.visible')
      cy.get('.news__title_close').click()
      cy.getByClass("block-content ng-tns-c310-2").should('not.exist')
    })
    it('#2241 - Страница входа. Заголовок ', () => {
      cy.getByClass('panel-title')
        .should('contain', 'Интернет-банк для бизнеса')
    })  
    it('#2242 - Страница входа. Лолин с валидными данными',()=>{
      cy.loginStand()
    })
    it('#2243 - Страница входа. Мобильное приложение', () => {
      cy.chooseItemFromFooter('Мобильное приложение')
      cy.getByClass("apps__close_header").should('contain', "Мобильное приложение")
      cy.getByClass("apps__content_text").should('contain', ' Отсканируйте QR-код и установите мобильное приложение на телефон или воспользуйтесь ссылкой ')
      cy.getByClass("apps__content_image").should('be.visible')
      cy.getByDataQa('1657808691984').invoke('removeAttr','target').click()
      // cy.url().should('include','https://apps.rustore.ru/app/com.isimplelab.ionic.standard.ul')
    
    })
    it('#2244 - Страница входа. Отделения и банкоматы', () => {
      cy.chooseItemFromFooter('Отделения и банкоматы')
      cy.url().should('eq', "https://pred-ul.metib.online/auth/places")
      cy.getByClass("places__filtered ng-star-inserted").should('be.visible')
    })
    it('#2244 - Страница входа. Инструкция пользователя', () => {
      cy.chooseItemFromFooter('Инструкция пользователя')
      //TODO: дописать метод проверки открывшегося пдф документа и проверять УРЛ
    })
    it('#2246 - Страница входа. Новости', () => {
      cy.chooseItemFromFooter('Новости')
      cy.getByDataQa('1657809117566').should('contain', 'Новости')
      cy.getByDataQa("1657809113674").should('be.visible')
      cy.get('.news__title_close').click()
      cy.getByClass("block-content ng-tns-c310-2").should('not.exist')
    })
    it('#2247 - Страница входа. Генеральная лицензия', () => {
      cy.get('.copy')
        .should('contain', '© ПАО АКБ "Металлинвестбанк". Генеральная лицензия Банка России № 2440, от 21.11.2014 г.')
    })
    it('Страница входа. Логин с невалидными данными', () => {
      cy.get('input[data-qa="1658988187497"][type="text"]').type("ValidLogin", { log: false })
      cy.get('input[data-qa="1658988187497"][type="password"]').type("InvalidPassword", { log: false })
      cy.get('div[data-qa="1658987981978"]').click()
      cy.get('[data-qa="1657808896581"]')
      .should('contain','Неверный логин или пароль')
    })
  })
  it.only('#2244 - Страница входа. Инструкция пользователя', () => {
    cy.get('.add-menu')
    .find('.add-menu__item').first()
    .should('not.have.attr','tabindex')
    

    //TODO: дописать метод проверки открывшегося пдф документа и проверять УРЛ
  })
 
})