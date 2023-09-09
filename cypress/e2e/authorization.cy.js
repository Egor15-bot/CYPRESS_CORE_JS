const jsQR = require('jsqr');

describe('Страница авторизации', () => {
  beforeEach('Переход на предпрод', () => {
    cy.visit('/')
  })
  context('Хедер страницы входа', () => {
    it('#2238 - Страница входа. Лого Проверка редиректа на боевой сайт', () => {
      cy.get('[data-qa="1657808668688"]').click()
      cy.url().should('eq', 'https://metib.online/')
    })
    it('#2239 - Страница входа. Номер контакт центра', () => {
      cy.get('.phone__value').should('contain', '8 (800) 500-81-97')
    })
    it('#2240 - Страница входа. Новости хедер', () => {
      cy.get('.main-news__news').should('have.css', 'background-color', 'rgb(241, 242, 242)').within(() => {
        cy.get('.main-news__date').should('contain', ' 07.11.2022 ')
        cy.get('.main-news__content_title').should('contain', 'Для клиентов ДО Новосибирский')
        cy.get('.main-news__content_text').should('be.visible')
        cy.get('.main-news__content_link').should('contain', 'Читать полностью').click()
      })
      cy.get('.news-block').should('have.css', 'align-items', 'center')
      .and('have.css', 'justify-content', 'center')
      cy.get('[data-qa="1657809109305"]')
      .should('have.css','width','1200px')
      .and('have.css','height','830px')
     
      cy.get('[data-qa="1657809117566"]').should('contain', 'Новости')
      cy.get('.content-desc > :nth-child(2)').invoke('text').then((actualText) => {
        const expectedText = ' С 07 ноября 2022 года осуществлена реорганизация Новосибирского филиала в Дополнительный офис Новосибирск.'
        expect(actualText.trim(), expectedText)
      })
      cy.get('[data-qa="1657809121331"] .ng-trigger-slideInOut').first().should('have.css', 'border-left', '4px solid rgb(47, 84, 235)');
      cy.get('[data-qa="1657809121331"] .ng-trigger-slideInOut').last().scrollIntoView().click().should('have.css', 'border-left', '4px solid rgb(47, 84, 235)')
      cy.get('.content-desc > :nth-child(2)').invoke('text').then((actualText) => {
        const expectedText = 'ПАО АКБ "Металлинвестбанк" уведомляет Вас о том, что в связи с празднованием Дня народного единства изменится режим работы отделений Банка. '
        expect(actualText.trim(), expectedText)
      })
      cy.get('.items__up-arrow').click()
      cy.get('[data-qa="1657809121331"] .ng-trigger-slideInOut').first().should('be.visible')
      cy.get('[data-qa="1657809121331"] .ng-trigger-slideInOut').last().should('not.be.visible')
      cy.get('.news__title_close').click()
      cy.get('[data-qa="1657809113674"').should('not.exist')
      cy.get(".block-content.ng-tns-c310-2").should('not.exist')
      cy.window().then((win) => {
        const localStorage = win.localStorage;
        expect(localStorage).to.have.property('newsread');
      });
    })
  })
  context('Главный блок страницы входа', () => {
    it('#2241 - Страница входа. Заголовок ', () => {
      cy.get('.panel-title').should('contain', 'Интернет-банк для бизнеса')
    })
    it('#4386 - Страница входа. Логин с невалидными данными', () => {
      //FIXME: написать дополнительный тест со значением .type("someText")
      cy.get('input[data-qa="1658988187497"][type="text"]').type("hello", { log: false })
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
    it('#2242 - Отображение полей логин и пароль', () => {
      cy.get('.panel-form__input.login div.panel-form__input__placeholder').first().should('contain', ' Логин ')
      cy.get('.panel-form__input.login div.panel-form__input__placeholder').last().should('contain', ' Пароль ')
      cy.get('[data-qa="1658988194022"] svg').first().click().then(() => {
        cy.get('.tooltip').should('have.text', ' Номер телефона в формате 71234567890 или логин ')
      })
      cy.get('[data-qa="1658988194022"] svg').last().click().then(() => {
        cy.get('[data-qa="1658988187497"]').last()
          .type('Some Text')
          .should('have.attr', 'type', 'text')
      })
    })
  })
  context('Футер страницы входа', () => {
    it('#2243 - Страница входа. Мобильное приложение', () => {
      cy.chooseItemFromFooter('Мобильное приложение')
      cy.get(".apps__close_header").should('contain', "Мобильное приложение")
      cy.get(".apps__content_text").should('contain', ' Отсканируйте QR-код и установите мобильное приложение на телефон или воспользуйтесь ссылкой ')
      cy.get(".apps__content_image").should('be.visible')
      //Проверка QR Кода и ссылки, по которой он переходит
      cy.get('img.apps__content_image').then((imgElement) => {
        const canvas = document.createElement('canvas')
        const context = canvas.getContext('2d')
        canvas.width = imgElement[0].width
        canvas.height = imgElement[0].height
        context.drawImage(imgElement[0], 0, 0, canvas.width, canvas.height)
        const imageData = context.getImageData(0, 0, canvas.width, canvas.height)
        const code = jsQR(imageData.data, imageData.width, imageData.height)
        const url = code.data;
        expect(url).to.equal('https://apps.rustore.ru/app/com.isimplelab.ionic.standard.ul');
      })
      cy.get('[data-qa="1657808691984"]')
        .should('have.attr', 'target', '_blank')
        .and('have.attr', 'href', 'https://apps.rustore.ru/app/com.isimplelab.ionic.standard.ul')
        .click()
    })
    it('#2244 - Страница входа. Отделения и банкоматы', () => {
      cy.chooseItemFromFooter('Отделения и банкоматы')
      cy.url().should('eq', `${Cypress.config('baseUrl')}auth/places`)
      cy.get('[data-qa="1657809360854"]').as('inputField')
        .should('have.attr', 'placeholder', 'Поиск по адресу или названию')

      cy.get('div.places__filtered div.my-atms-item').as('departments').then((elements) => {
        const noFilterAmount = elements.length
        cy.get('@inputField').type('Москва').should('have.value', 'Москва')
        cy.get('div.addr').each((el)=>{
            cy.get(el).should('contain','Москва')
        })
        cy.get('@departments').should('have.length.below', noFilterAmount)
      })
      cy.get('.dynamic-select').click()
      cy.contains('div.ng-scroll-content div.selection-options__item', 'г. Москва').click()
      cy.get('div.my-atms-item div.addr').each((el) => {
        cy.get(el).should('contain', 'г. Москва')
      })
      cy.get('span.radio__custom').first().click()
      cy.get('div.my-atms-item div.title').each((el) => {
        cy.get(el).should('contain', 'офис')
      })

      cy.get('span.radio__custom').last().click()
      cy.get('div.my-atms-item div.title').each((el) => {
        cy.get(el).should('have.text', 'Банкомат')
      })
      cy.get('app-select-group[data-qa="1657809334730"] div.item').each((el) => {
        cy.get(el).find('span.checkbox__custom').click().should('have.attr', 'class', 'checkbox__custom clicked')
        cy.get('span.checkbox__label').should('have.attr', 'class', 'checkbox__label checkbox__label_active')
      })
      cy.get('div[data-qa="1658987981978"]').click().then(() => {
        cy.get('app-select-group[data-qa="1657809334730"] div.item').find('span.checkbox__custom').should('not.have.attr', 'class', 'checkbox__custom clicked')
        cy.get('span.checkbox__label').should('not.have.attr', 'class', 'checkbox__label checkbox__label_active')
      })
      cy.get('[data-qa="1657787078062"]').last().click()
      cy.get('ymaps.ymaps-2-1-79-events-pane.ymaps-2-1-79-user-selection-none ').should('be.visible')
    })
    it('#2245 - Страница входа. Инструкция пользователя', () => {
      cy.window().then((win) => {
        cy.spy(win, 'open').as('open')
      })
      cy.chooseItemFromFooter('Инструкция пользователя')
      cy.get('@open').should('be.calledWith', '../../assets/clientmanual.pdf')
    })
    it('#2246 - Страница входа. Новости', () => {
      cy.chooseItemFromFooter('Новости')
      cy.get('[data-qa="1657809117566"').should('contain', 'Новости')
      cy.get('[data-qa="1657809113674"').should('be.visible')
      cy.get('.news__title_close').click()
      cy.get(".block-content.ng-tns-c310-2").should('not.exist')
    })
    it('#2247 - Страница входа. Генеральная лицензия', () => {
      cy.get('.copy')
        .should('contain', '© ПАО АКБ "Металлинвестбанк". Генеральная лицензия Банка России № 2440, от 21.11.2014 г.')
    })
  })
});
