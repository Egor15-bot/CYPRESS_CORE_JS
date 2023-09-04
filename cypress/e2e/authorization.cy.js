const { kMaxLength } = require("buffer")
const exp = require("constants")

describe('Страница авторизации', () => {
  beforeEach('Переход на предпрод', () => {
    cy.visit('/')
  })
  context('Хедер страницы входа', () => {
    // it('#2238 - Страница входа. Лого Проверка редиректа на боевой сайт', () => {
    //   cy.getByDataQa('1657808668688').click()
    //   cy.url().should('eq', 'https://metib.online/')
    // })
    // it('#2239 - Страница входа. Номер контакт центра', () => {
    //   cy.get('.phone__value').should('contain', '8 (800) 500-81-97')
    // })
    // it('#2240 - Страница входа. Новости хедер', () => {
    //   cy.get('.main-news__news').should('have.css', 'background-color', 'rgb(241, 242, 242)').within(() => {
    //     cy.get('.main-news__date').should('contain', ' 07.11.2022 ')
    //     cy.get('.main-news__content_title').should('contain', 'Для клиентов ДО Новосибирский')
    //     cy.get('.main-news__content_text').should('be.visible')
    //     cy.get('.main-news__content_link').should('contain', 'Читать полностью').click()
    //   })
    //   cy.getByDataQa('1657809109305')
    //     .should('have.css', 'width', '1200px')
    //     .and('have.css', 'height', '830px')
    //   cy.getByDataQa('1657809117566').should('contain', 'Новости')
    //   cy.get('.content-desc > :nth-child(2)').invoke('text').then((actualText) => {
    //     const expectedText = ' С 07 ноября 2022 года осуществлена реорганизация Новосибирского филиала в Дополнительный офис Новосибирск.'
    //     expect(actualText.trim(), expectedText.trim())
    //   })
    //   cy.get('#item-0').should('have.css', 'border-left', '3.86667px solid rgb(47, 84, 235)');
    //   cy.get('#item-61').scrollIntoView().click().should('have.css', 'border-left', '3.86667px solid rgb(47, 84, 235)')
    //   cy.get('.content-desc > :nth-child(2)').invoke('text').then((actualText) => {
    //     const expectedText = 'ПАО АКБ "Металлинвестбанк" уведомляет Вас о том, что в связи с празднованием Дня народного единства изменится режим работы отделений Банка. '
    //     expect(actualText.trim(), expectedText)
    //   })
    //   cy.get('.items__up-arrow').click()
    //   cy.get('#item-0').should('be.visible')
    //   cy.get('#item-61').should('not.be.visible')
    //   cy.get('.news__title_close').click()
    //   cy.getByDataQa('1657809113674').should('not.exist')
    //   cy.getByClass("block-content ng-tns-c310-2").should('not.exist')
    //   cy.window().then((win) => {
    //     const localStorage = win.localStorage;
    //     expect(localStorage).to.have.property('newsread');
    //   });
    // })
  })
  context('Главный блок страницы входа', () => {
    it('#2241 - Страница входа. Заголовок ', () => {
      cy.getByClass('panel-title').should('contain', 'Интернет-банк для бизнеса')
    })
    it('#4386 - Страница входа. Логин с невалидными данными', () => {
      cy.get('input[data-qa="1658988187497"][type="text"]').type("ValidLogin", { log: false })
      cy.get('input[data-qa="1658988187497"][type="password"]').type("InvalidPassword", { log: false })
      cy.get('div[data-qa="1658987981978"]').click()
      cy.get('[data-qa="1657808896581"]').should('contain', 'Неверный логин или пароль')
    })
    it('#2847 - Страница входа. Логин с валидными данными', () => {
      cy.get('input[data-qa="1658988187497"][type="text"]').type("qa_eybondar_ul", { log: false })
      cy.get('input[data-qa="1658988187497"][type="password"]').type("Qq12345678", { log: false })
      cy.get('div[data-qa="1658987981978"]').click()
      cy.url().should('eq', `${Cypress.config('baseUrl')}desktop`)
    })
    it('Отображение полей логин и пароль', () => {
      cy.get('.panel-form__input.login div.panel-form__input__placeholder').first().should('contain',' Логин ')
      cy.get('.panel-form__input.login div.panel-form__input__placeholder').last().should('contain',' Пароль ')
      cy.get('[data-qa="1658988194022"] svg').first().click().then(() => {
        cy.get('.tooltip').should('have.text', ' Номер телефона в формате 71234567890 или логин ')
      })
      cy.get('[data-qa="1658988194022"] svg').last().click().then(() => {
        cy.get('[data-qa="1658988187497"]').last()
        .type('Some Text')
        .should('have.attr','type','text')
      })
    })
  })
  context('Футер страницы входа', () => {
    // it.only('#2243 - Страница входа. Мобильное приложение', () => {
    //     cy.chooseItemFromFooter('Мобильное приложение')
    //     cy.getByClass("apps__close_header").should('contain', "Мобильное приложение")
    //     cy.getByClass("apps__content_text").should('contain', ' Отсканируйте QR-код и установите мобильное приложение на телефон или воспользуйтесь ссылкой ')
    //     cy.getByClass("apps__content_image").should('be.visible')
    //     cy.getByDataQa('1657808691984')
    //     .invoke('removeAttr', 'target')
    //     .click()
    //     .wait(5000)
    //     .url()
    //     .should('include','https://apps.rustore.ru/app/com.isimplelab.ionic.standard.ul')
        
    //   })
      it.only('#2244 - Страница входа. Отделения и банкоматы', () => {
        cy.chooseItemFromFooter('Отделения и банкоматы')
        cy.url().should('eq', `${Cypress.config('baseUrl')}auth/places`)
        cy.get('[data-qa="1657809360854"]').as('inputField')
        .should('have.attr','placeholder','Поиск по адресу или названию')
        
        cy.get('div.places__filtered div.my-atms-item').as('departments').then((elements) =>{
          const noFilterAmount = elements.length
          cy.get('@inputField').type('Москва').should('have.value','Москва')
          cy.get('@departments').should('have.length.below',noFilterAmount)
        })
          cy.get('.dynamic-select').click()
          cy.contains('div.ng-scroll-content div.selection-options__item','г. Москва').click()
          cy.get('div.my-atms-item div.addr').each((el) => {
            cy.get(el).should('contain','г. Москва')
          })
          cy.get('span.radio__custom').first().click()
          cy.get('div.my-atms-item div.title').each((el) =>{
            cy.get(el).should('contain','офис')
          })

          cy.get('span.radio__custom').last().click()
          cy.get('div.my-atms-item div.title').each((el) =>{
            cy.get(el).should('have.text','Банкомат')
          })

          cy.get('app-select-group[data-qa="1657809334730"] div.item').each((el) => {
            cy.get(el).find('span.checkbox__custom').click().should('have.attr','class','checkbox__custom clicked')
            cy.get('span.checkbox__label').should('have.attr','class','checkbox__label checkbox__label_active')
          })
          cy.get('div[data-qa="1658987981978"]').click().then(() =>{
            cy.get('app-select-group[data-qa="1657809334730"] div.item').find('span.checkbox__custom').should('not.have.attr','class','checkbox__custom clicked')
            cy.get('span.checkbox__label').should('not.have.attr','class','checkbox__label checkbox__label_active')
          })
        // cy.get('').check().should('be.checked')
        //TODO: Добавить проверку на строку поиска одну на валидну филььтрацию и одну на пустой результат(поле ничего не найдено)
        //TODO: Вкладку на карте добавить проверку фильтрации
        //TODO: Типы отделений смена
        //TODO: Проверить что можно выбрать чекбоксы и отчистить потом( проверить разницу в поиске)
      })
      it('#2245 - Страница входа. Инструкция пользователя', () => {

        // cy.chooseItemFromFooter('Инструкция пользователя')
        //TODO: дописать метод проверки открывшегося пдф документа и проверять УРЛ
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
      // it('#2247 - Страница входа. Генеральная лицензия', () => {
      //   cy.get('.copy')
      //     .should('contain', '© ПАО АКБ "Металлинвестбанк". Генеральная лицензия Банка России № 2440, от 21.11.2014 г.')
      // })
    })
  })