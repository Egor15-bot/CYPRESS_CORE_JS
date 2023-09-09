describe('Контрагенты ФЛ с ИНН', () => {
    beforeEach(() => {
        //Авторизация + создание сессии
        cy.loginTestApi('TOKEN')
        cy.changeCompanyApi('3448774')
        cy.deleteAllCounterparts()

        cy.fixture('counterparts').then(function (fixtureCounterparts) {
            this.fixtureCounterparts = fixtureCounterparts
        })
        cy.fixture('counterparts').then(function (testData) {
            this.testData = testData.UL
        })
    });
    beforeEach('Импортирую фикстуры для ФЛ с ИНН', () => {
        cy.fixture('counterparts').then(function (testData) {
            this.testData = testData.FL_With_INN
        })
    })
    context('Меню контрагенты', () => {
        beforeEach('Перехожу в раздел "Контрагенты" / "Добавить контрагента"', () => {
            cy.visit('/counterparts/create')
                .url()
                .should('contain', '/counterparts/create')
        })
        it('#1905. Создание контрагента + удаление через кебаб-меню', function () {
            cy.contains('div.counterpart__types__item', this.testData.check.nameCounterpart).click()
            cy.get('div.counterpart__types__item.active')
                .should('contain', this.testData.check.nameCounterpart)
                .and('have.css', 'border-bottom', `3px solid ${Cypress.env('colorBlueSolid')}`)
            cy.typeForm(this.testData.type)
            cy.contains('label.dynamic-input', ' Название банка получателя ')
                .find('div.dynamic-input__overlay.ng-star-inserted')
                .children()
                .invoke('val')
                .should('not.be.empty')
            cy.wait(1000)
            cy.checkForm(this.testData)
            cy.get('app-button[data-qa="1657886705496"] > div[data-qa="1658987981978"]').click()
            cy.checkGreenToastInfo(this.fixtureCounterparts.toastGreen);
            cy.checkCounterpartList(this.testData).click()
            cy.get('div.breadcrumbs')
                .should('contain', ' Контрагенты ')
                .and('contain', ' Просмотр')
            cy.checkCounterpartDetails(this.testData)
            cy.modificationAccNumberDot(this.testData.type["Счет получателя"])
                .then((modifiedNumber) => {
                    cy.get('div.number').should('contain', modifiedNumber);
                });
            cy.get('div.bank-place').should('contain', this.testData.check.city)
            cy.get('div.controls').should('contain', ' Заплатить ')
            cy.get('div[data-qa="1657886747803"]')
                .click()
                .url()
                .should('contain', '/counterparts')
            cy.contains('div.counterpart-list__item', this.testData.type["Наименование получателя или ИНН"])
                .within(() => {
                    cy.get('app-menu-select.actions').click()
                    cy.contains('div.menu-select-item__title', 'Удалить').click()
                })
            cy.checkModalContainer(this.fixtureCounterparts)
            cy.get('app-button[data-qa="1658988097817"] > div[data-qa="1658987981978"]').click()
            cy.checkRedToastInfo(this.fixtureCounterparts.toastRedSuccess);
            cy.get('div.counterparts-list__empty-text').should('contain', ' Контрагенты не найдены ')
        })
        it('#3637. Валидация на создание дубликата контрагента', function () {
            cy.createCounterpartsApi(
                this.fixtureCounterparts["Контрагент для валидации"],
                this.testData.type["ИНН получателя"],
                this.testData.type["КПП получателя"],
                this.testData.type["Счет получателя"],
                this.testData.type["БИК банка получателя"],
                this.testData.check["corrType"]
            )
            cy.contains('div.counterpart__types__item', this.testData.check.nameCounterpart).click()
            cy.get('div.counterpart__types__item.active')
                .should('contain', this.testData.check.nameCounterpart)
                .and('have.css', 'border-bottom', `3px solid ${Cypress.env('colorBlueSolid')}`)
            cy.typeForm(this.testData.type)
            cy.contains('label.dynamic-input', ' Название банка получателя ')
                .find('div.dynamic-input__overlay.ng-star-inserted')
                .children()
                .invoke('val')
                .should('not.be.empty')
            cy.checkForm(this.testData)
            cy.get('app-button[data-qa="1657886705496"] > div[data-qa="1658987981978"]').click()
            cy.checkRedToastInfo(this.fixtureCounterparts.toastRedError);
            cy.visit('/counterparts')
                .url()
                .should('contain', '/counterparts')
            cy.get('div.counterpart-list__item').should('have.length', 1)
        })
    })
    context('Меню шаблоны', () => {
        beforeEach('Перехожу в раздел "Шаблоны" / "Создать шаблон"', () => {
            cy.visit('/template?new=true')
                .url()
                .should('contain', '/template?new=true')
        })
        it('#1685. Создание контрагента + удаление через меню "Контрагенты / Просмотр"', function () {
            cy.contains('div.panel-form__input__placeholder', ' Название шаблона ')
                .click()
                .type(`Шаблон - ${this.testData.type["Наименование получателя или ИНН"]}`)
            cy.contains('div[data-qa="1657803432416"]', 'Получатель').within(() => {
                cy.get(this.fixtureCounterparts.arroyDown).click()
            })
            cy.typeForm(this.testData.type)
            cy.contains('label.dynamic-input', ' Название банка получателя ')
                .find('div.dynamic-input__overlay.ng-star-inserted')
                .children()
                .invoke('val')
                .should('not.be.empty')
            cy.wait(1000)
            cy.checkForm(this.testData)
            cy.get('button[data-qa="1663140882365"]').click()
            cy.checkGreenToastInfo(this.fixtureCounterparts.toastGreen);
            cy.get('button[data-qa="1663140882365"]').click()
            cy.checkRedToastInfo(this.fixtureCounterparts.toastRedError);
            cy.visit('/counterparts')
                .url()
                .should('contain', '/counterparts')
            cy.checkCounterpartList(this.testData).click()
            cy.checkCounterpartDetails(this.testData)
            cy.modificationAccNumberDot(this.testData.type["Счет получателя"])
                .then((modifiedNumber) => {
                    cy.get('div.number').should('contain', modifiedNumber);
                });
            cy.get('div.bank-place').should('contain', this.testData.check.city)
            cy.get('div.controls').should('contain', ' Заплатить ')
            cy.get('div.counterpart-details').within(() => {
                cy.get('app-menu-select.actions').click()
                cy.contains('div.menu-select-item__title', 'Удалить').click()
            })
            cy.checkModalContainer(this.fixtureCounterparts)
            cy.get('app-button[data-qa="1658988097817"] > div[data-qa="1658987981978"]').click()
            cy.checkRedToastInfo(this.fixtureCounterparts.toastRedSuccess);
            cy.get('div.counterparts-list__empty-text').should('contain', ' Контрагенты не найдены ')
        })
        it('#3640. Валидация на создание дубликата контрагента', function () {
            //Создаю контрагента через API 
            cy.createCounterpartsApi(
                this.fixtureCounterparts["Контрагент для валидации"],
                this.testData.type["ИНН получателя"],
                this.testData.type["КПП получателя"],
                this.testData.type["Счет получателя"],
                this.testData.type["БИК банка получателя"],
                this.testData.check["corrType"]
            )
            //Заполняю поле "Название шаблона"
            cy.contains('div.panel-form__input__placeholder', ' Название шаблона ')
                .click()
                .type(`Шаблон - ${this.testData.type["Наименование получателя или ИНН"]}`)
            //Нажимаю на стрелку пожле "Получатель"
            cy.contains('div[data-qa="1657803432416"]', 'Получатель').within(() => {
                cy.get(this.fixtureCounterparts.arroyDown).click()
            })
            //Заполняю форму тестовыми данными из фикстуры
            cy.typeForm(this.testData.type)
            //Жду пока заполниться поле "Название банка получателя"
            cy.contains('label.dynamic-input', ' Название банка получателя ')
                .find('div.dynamic-input__overlay.ng-star-inserted')
                .children()
                .invoke('val')
                .should('not.be.empty')
            cy.wait(1000)
            //Сохранить контрагента
            cy.get('button[data-qa="1663140882365"]').click()
            //Красный тост - "Такой контрагент уже существует"
            cy.checkRedToastInfo(this.fixtureCounterparts.toastRedError);
            //Перехожу в раздел "Контрагенты"
            cy.visit('/counterparts')
                .url()
                .should('contain', '/counterparts')
            //Количество контрагентов = 1
            cy.get('div.counterpart-list__item').should('have.length', 1)
        })
    })
    context('Новый платеж', () => {
        beforeEach('Перехожу в раздел "Новый платеж"', () => {
            cy.visit('/transfer-rur')
                .url()
                .should('contain', '/transfer-rur')
        })
        it('#1318. Создание контрагента + удаление через кебаб-меню', function () {
            //Нажимаю на стрелку пожле "Получатель"
            cy.contains('div[data-qa="1657803432416"]', 'Получатель').within(() => {
                cy.get(this.fixtureCounterparts.arroyDown).click()
            })
            //Заполняю форму тестовыми данными из фикстуры
            cy.typeForm(this.testData.type)
            //Жду пока заполниться поле "Название банка получателя"
            cy.contains('label.dynamic-input', ' Название банка получателя ')
                .find('div.dynamic-input__overlay.ng-star-inserted')
                .children()
                .invoke('val')
                .should('not.be.empty')
            cy.wait(1000)
            //Проверяю тестовые данные из фикстуры
            cy.checkForm(this.testData)
            //Сохранить контрагента
            cy.get('button[data-qa="1663140882365"]').click()
            //Зеленый тост "Контрагент успешно сохранён!"
            cy.checkGreenToastInfo(this.fixtureCounterparts.toastGreen);
            //Сохранить контрагента еще раз
            cy.get('button[data-qa="1663140882365"]').click()
            //Красный тост - "Такой контрагент уже существует"
            cy.checkRedToastInfo(this.fixtureCounterparts.toastRedError);
            //Перехожу в раздел "Контрагенты"
            cy.visit('/counterparts')
                .url()
                .should('contain', '/counterparts')
            //Проверяю логотип и ранее введенную информацию на странице "Контрагенты"
            //Перехожу на страницу "Контрагенты / Просмотр"
            cy.checkCounterpartList(this.testData).click()
            //Проверяю логотип и ранее введенную информацию на странице "Контрагенты / Просмотр"
            cy.checkCounterpartDetails(this.testData)
            //Проверяю номер счета, город и кнопку "Заплатить"
            cy.modificationAccNumberDot(this.testData.type["Счет получателя"])
                .then((modifiedNumber) => {
                    cy.get('div.number').should('contain', modifiedNumber);
                });
            cy.get('div.bank-place').should('contain', this.testData.check.city)
            cy.get('div.controls').should('contain', ' Заплатить ')
            //Нажимаю кебаб-меню / Удалить
            cy.get('div.counterpart-details').within(() => {
                cy.get('app-menu-select.actions').click()
                cy.contains('div.menu-select-item__title', 'Удалить').click()
            })
            //Проверяю модальное окно
            cy.checkModalContainer(this.fixtureCounterparts)
            //Нажимаю "Удалить"
            cy.get('app-button[data-qa="1658988097817"] > div[data-qa="1658987981978"]').click()
            //Красный тост - "Контрагент удален"
            cy.checkRedToastInfo(this.fixtureCounterparts.toastRedSuccess);
            //Проверяю, что все контрагенты удалены
            cy.get('div.counterparts-list__empty-text').should('contain', ' Контрагенты не найдены ')
        })
        it('#3641. Валидация на создание дубликата контрагента', function () {
            //Создаю контрагента через API 
            cy.createCounterpartsApi(
                this.fixtureCounterparts["Контрагент для валидации"],
                this.testData.type["ИНН получателя"],
                this.testData.type["КПП получателя"],
                this.testData.type["Счет получателя"],
                this.testData.type["БИК банка получателя"],
                this.testData.check["corrType"]
            )
            //Нажимаю на стрелку пожле "Получатель"
            cy.contains('div[data-qa="1657803432416"]', 'Получатель').within(() => {
                cy.get(this.fixtureCounterparts.arroyDown).click()
            })
            //Заполняю форму тестовыми данными из фикстуры
            cy.typeForm(this.testData.type)
            //Жду пока заполниться поле "Название банка получателя"
            cy.contains('label.dynamic-input', ' Название банка получателя ')
                .find('div.dynamic-input__overlay.ng-star-inserted')
                .children()
                .invoke('val')
                .should('not.be.empty')
            cy.wait(1000)
            //Сохранить контрагента
            cy.get('button[data-qa="1663140882365"]').click()
            //Красный тост - "Такой контрагент уже существует"
            cy.checkRedToastInfo(this.fixtureCounterparts.toastRedError);
            //Перехожу в раздел "Контрагенты"
            cy.visit('/counterparts')
                .url()
                .should('contain', '/counterparts')
            //Количество контрагентов = 1
            cy.get('div.counterpart-list__item').should('have.length', 1)
        })
    })
    context('Оплата', () => {
        beforeEach('Создаю контрагента через API', function () {
            cy.createCounterpartsApi(
                this.testData.type["Наименование получателя или ИНН"],
                this.testData.type["ИНН получателя"],
                this.testData.type["КПП получателя"],
                this.testData.type["Счет получателя"],
                this.testData.type["БИК банка получателя"],
                this.testData.check["corrType"]
            )
        })
        it('#3725. Оплата через иконку карты', function () {
            //Перехожу в раздел "Контрагенты"
            cy.visit('/counterparts')
                .url()
                .should('contain', '/counterparts')
            //Нажимаю на иконку "Карта", выбираю счет
            cy.contains('div.counterpart-list__item', this.testData.type["Наименование получателя или ИНН"])
                .within(() => {
                    cy.get('svg.controls__item').click()
                })
            //Проверяю выпадающий список, перехожу в новый платеж
            cy.get('div[class="menu-select__overlay menu-select__overlay--open"]').within(() => {
                cy.get('div.menu-select-item__title.menu-select-item__title--default').should('contain', ' Выберите счет для оплаты ')
                cy.modificationAccNumberDot(this.testData.type["Счет получателя"])
                    .then((modifiedNumber) => {
                        cy.get('div[data-qa="1658988309509"]')
                            .find('div.menu-select-item__title')
                            .should('contain', modifiedNumber)
                            .click()
                            .url()
                            .should('contain', '/transfer-rur')
                    });
            })
            //Проверяю автивную вкладку
            cy.get('div.counterpart__types__item.active')
                .should('contain', this.testData.check.nameTransferRur)
            //Жду пока заполниться поле "Название банка получателя"
            cy.contains('label.dynamic-input', ' Название банка получателя ')
                .find('div.dynamic-input__overlay.ng-star-inserted')
                .children()
                .invoke('val')
                .should('not.be.empty')
            cy.wait(1000)
            //Проверяю тестовые данные из фикстуры
            cy.checkForm(this.testData)
        })
        it('#3726. Оплата через окно просмотра', function () {
            cy.visit('/counterparts')
                .url()
                .should('contain', '/counterparts')
            //Проверяю логотип и ранее введенную информацию на странице "Контрагенты"
            //Перехожу на страницу "Контрагенты / Просмотр"
            cy.checkCounterpartList(this.testData).click()
            //Нажимаю "Заплатить"
            cy.get('div.controls')
                .should('contain', ' Заплатить ')
                .click()
            //Жду пока заполниться поле "Название банка получателя"
            cy.contains('label.dynamic-input', ' Название банка получателя ')
                .find('div.dynamic-input__overlay.ng-star-inserted')
                .children()
                .invoke('val')
                .should('not.be.empty')
            cy.wait(1000)
            //Проверяю тестовые данные из фикстуры
            cy.checkForm(this.testData)
        })
        it('#3727. Оплата через "Новый платеж"', function () {
            //Перехожу в "Новый платеж"
            cy.visit('/transfer-rur')
                .url()
                .should('contain', '/transfer-rur')
            //Проверяю активную вкладку
            cy.get('div.counterpart__types__item.active')
                .should('contain', this.testData.check.nameTransferRur)
                .and('have.css', 'border-bottom', `3px solid ${Cypress.env('colorBlueSolid')}`)
            //Ввожу в строку поиска название ранее созданного контрагента
            cy.get('[data-qa="1657971851284"] > .custom-select > [data-qa="1658989013306"] > .panel-form__input > .panel-form__input-wrap > [data-qa="1658988187497"]')
                .click()
                .type(this.testData.type["Наименование получателя или ИНН"])
            cy.contains('.dadata-list__item', this.testData.type["Наименование получателя или ИНН"]).click()
            //Жду пока заполниться поле "Название банка получателя"
            cy.contains('label.dynamic-input', ' Название банка получателя ')
                .find('div.dynamic-input__overlay.ng-star-inserted')
                .children()
                .invoke('val')
                .should('not.be.empty')
            cy.wait(1000)
            //Проверяю тестовые данные из фикстуры
            cy.checkForm(this.testData)
        })
    })


});