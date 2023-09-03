import { should } from "chai"

describe('Страница авторизации', () => {
  beforeEach('Авторизация на стенде Препрод', () => {
    cy.visit('/')
  })
  context('Хедер страницы входа', () => {
    // it('#2238 - Страница входа. Лого Проверка редиректа на боевой сайт', () => {
    //   cy.getByDataQa('1657808668688').click()
    //   cy.url().should('eq', 'https://metib.online/')

    // })
    // it('#2239 - Страница входа. Номер контакт центра', () => {
    //   cy.getByClass('phone__value')
    //     .should('contain', '8 (800) 500-81-97')
    // })  
    it('#2240 - Страница входа. Новости хедер', () => {
      //FIXME:Дописать метод проверки новостей в хедере
      cy.get('.main-news__news').should('have.css', 'background-color', '#f2f1f1').within(() => {
        cy.get('.main-news__date').should('contain', ' 07.11.2022 ')
        cy.get('.main-news__content_title').should('contain', 'Для клиентов ДО Новосибирский')
        cy.get('.main-news__content_text').should('be.visible')
        cy.get('.main-news__content_link').should('contain', 'Читать полностью').click()
      })
      cy.get('#item-0').should('have.css', 'border-left', '4px solid #2f54eb');
      cy.get('#item-61').scrollIntoView().click().should('have.css', 'border-left', '4px solid #2f54eb')
      cy.getByClass('items__up-arrow ng-tns-c310-1').click()
      cy.get('#item-61').should('not.be.visible')
      cy.getByDataQa('1657809113674').should('exist')
      cy.getByDataQa('1657809117566').should('contain', 'Новости')
      cy.getByDataQa("1657809113674").should('be.visible')
      cy.get('.news__title_close').click()
      cy.getByClass("block-content ng-tns-c310-2").should('not.exist')
    })
  })
  context('Главный блок страницы входа', () => {
    it('#2241 - Страница входа. Заголовок ', () => {
      cy.getByClass('panel-title')
        .should('contain', 'Интернет-банк для бизнеса')
    })
    it('#4386 - Страница входа. Логин с невалидными данными', () => {
      cy.get('input[data-qa="1658988187497"][type="text"]').type("ValidLogin", { log: false })
      cy.get('input[data-qa="1658988187497"][type="password"]').type("InvalidPassword", { log: false })
      cy.get('div[data-qa="1658987981978"]').click()
      cy.get('[data-qa="1657808896581"]')
        .should('contain', 'Неверный логин или пароль')
    })
    it('#2847 - Страница входа. Логин с валидными данными', () => {
      cy.get('input[data-qa="1658988187497"][type="text"]').type("qa_eybondar_ul", { log: false })
      cy.get('input[data-qa="1658988187497"][type="password"]').type("Qq12345678", { log: false })
      cy.get('div[data-qa="1658987981978"]').click()
      cy.url().should('eq', `${Cypress.config('baseUrl')}desktop`)
    })
    it('', () => {
      //TODO: Добавитьпровекру отобрадения полей и двух кнопок в конце поля
    })
  })
  context('Футер страницы входа', () => {
    it.only('#2243 - Страница входа. Мобильное приложение', () => {
      cy.chooseItemFromFooter('Мобильное приложение')
      cy.getByClass("apps__close_header").should('contain', "Мобильное приложение")
      cy.getByClass("apps__content_text").should('contain', ' Отсканируйте QR-код и установите мобильное приложение на телефон или воспользуйтесь ссылкой ')
      cy.getByClass("apps__content_image").should('be.visible')
      //TODO: cy.getByDataQa('1657808691984').invoke('removeAttr', 'target').click()
      //TODO: Доработать проверку урл при переходе на другую страницу 
      // cy.url().should('include','https://apps.rustore.ru/app/com.isimplelab.ionic.standard.ul')

    })
    it('#2244 - Страница входа. Отделения и банкоматы', () => {
      cy.chooseItemFromFooter('Отделения и банкоматы')
      cy.url().should('eq', `${Cypress.config('baseUrl')}auth/places`)
      cy.getByClass("places__filtered ng-star-inserted").should('be.visible')
      // cy.get('').check().should('be.checked')
      //TODO: Добавить проверку на строку поиска одну на валидну филььтрацию и одну на пустой результат(поле ничего не найдено)
      //TODO: Вкладку на карте добавить проверку фильтрации
      //TODO: Типы отделений смена
      //TODO: Проверить что можно выбрать чекбоксы и отчистить потом( проверить разницу в поиске)
    })
    it('#2245 - Страница входа. Инструкция пользователя', () => {

      // cy.chooseItemFromFooter('Инструкция пользователя')
      //TODO: дописать метод проверки открывшегося пдф документа и проверять УРЛ
    })
    it('#2246 - Страница входа. Новости', () => {
      //TODO:Добавить проверку на девайдер его цвет и смену текста при выборе другой новости
      //TODO: Проверить кнопку скрола наверх 
      //TODO: Проверить     align-items: center;    justify-content: center; Плюс проверка ширинаы и длины блока с новостями
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
  })
})