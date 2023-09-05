describe('Контрагенты', () => {
    beforeEach(() => {
        //Авторизация + создание сессии
        cy.session([], () => {
            cy.loginApi()
        })
        //Импортирую фикстуры
        cy.fixture('counterparts').then(function (testData) {
            this.testData = testData
        })
        //Смена компании на "Захарова Яна Николаевна"
        cy.changeCompanyApi('3448774')
        //Удаление всех контрагентов через API
        cy.deleteAllCounterparts()
        //Переход на главную страницу
        cy.visit("/")
    });
    //Выполняется после каждого блока it
    afterEach('Удаление всех контрагентов через API', () => {
        cy.deleteAllCounterparts()
    })
    context('Общие кейсы', () => {
        it('Переход в меню "Контрагенты" через меню бургер', function () {
            cy.visit("/")
            cy.openBurgerTab('Контрагенты')
            cy.url().should('eq', `${Cypress.config('baseUrl')}counterparts`)
        })
        it('Верстка', function () {
            //Перехожу в раздел "Контрагенты"
            cy.visit(`${Cypress.config('baseUrl')}counterparts`)
            //Жду пока пропадет лоадер со страницы
            cy.loaderNotExist('counterparts')
            //Проверяю заголовок
            cy.get('.page-path').should('contain', 'Контрагенты')
            //Проверяю описание
            cy.get('.page-title__text').should('contain', ' Справочник контрагентов ')
            //Проверяю кнопку
            cy.get('[data-qa="1657885995577"] > [data-qa="1658987981978"]')
                .as('btnAddCounterparts')
                .should('contain', ' Добавить контрагента')
                .and('have.css', 'background-image', Cypress.env('colorBlueGradient'));
            //Проверяю цвет кнопки "Рублевые"
            cy.get('[data-qa="16599638895420"]').should('have.css', 'background-image', Cypress.env('colorBlueGradient'));
        })
    })
    context('Контрагенты ЮЛ', () => {
        context('Меню контрагенты', () => {
            it('#1497. Создание контрагента + удаление через кебаб-меню', function () {
                // Перехожу в раздел "Контрагенты"
                cy.visit(`${Cypress.config('baseUrl')}counterparts`)
                //Нажимаю кнопку "Добавить контрагента"
                cy.get('[data-qa="1657885995577"] > [data-qa="1658987981978"]')
                    .click()
                cy.url()
                    .should('eq', `${Cypress.config('baseUrl')}counterparts/create`)
                //Проверяю что выбрана вкладка "Юридическое лицо"
                cy.get('.counterpart__types__item.active')
                    .should('contain', 'Юридическое лицо')
                    .should('have.css', 'border-bottom', `3px solid ${Cypress.env('colorBlueSolid')}`)
                //Заполняю форму тестовыми данными из фикстуры
                cy.typeForm(this.testData.UL.type)
                cy.get('.loader')
                    .should('not.exist')
                //Проверяю тестовые данные из фикстуры
                cy.checkFormСounterparts(this.testData.UL)
                //Нажимаю "Сохранить"
                cy.get('[data-qa="1657886705496"] > [data-qa="1658987981978"]').click()
                //Проверяю тост сообщение - зеленый фон и текст "Контрагент успешно сохранён!"
                cy.checkGreenToastInfo(this.testData.toastGreen);
                // Проверяю логотип и ранее введенную информацию на странице "Контрагенты"
                cy.contains('.counterpart-list__item', this.testData.UL.type.Наименование)
                    .within(() => {
                        cy.get('.counterpart-list__item__type')
                            .find('use')
                            .should('have.attr', 'href', this.testData.UL.check.image)
                        cy.get('.counterpart-list__item__info')
                            .within(() => {
                                cy.get('.title').should('contain', this.testData.UL.type["Наименование"])
                                cy.get('.description').should('contain', this.testData.UL.type["ИНН"])
                                cy.get('.description').should('contain', this.testData.UL.type["КПП"])
                            })
                    })
                    //Перехожу на страницу "Контрагенты/ Просмотр"
                    .click()
                //Проверяю наличие хлебных крошек
                cy.get('.breadcrumbs')
                    .should('contain', ' Контрагенты ')
                    .and('contain', ' Просмотр')
                //Проверяю логотип и ранее введенную информацию на странице "Контрагенты/ Просмотр"
                cy.contains('.counterpart-details__content', this.testData.UL.type.Наименование)
                    .within(() => {
                        cy.get('.counterpart-details__content__icon')
                            .find('use')
                            .should('have.attr', 'href', this.testData.UL.check.image)
                        cy.get('.counterpart-details__content__info')
                            .within(() => {
                                cy.get('.counterpart-details__content__info__fullname').should('contain', this.testData.UL.type["Наименование"])
                                cy.get('.counterpart-details__content__info__requisites').should('contain', this.testData.UL.type["ИНН"])
                                cy.get('.counterpart-details__content__info__requisites').should('contain', this.testData.UL.type["КПП"])
                            })
                    })
                //Проверяю номер счета, город и кнопку "Заплатить"
                cy.modificationAccNumberDot(this.testData.UL.type["Номер счета"])
                    .then((modifiedNumber) => {
                        cy.get('.number').should('contain', modifiedNumber);
                    });
                cy.get('.bank-place').should('contain', 'г.Москва')
                cy.get('.controls').should('contain', ' Заплатить ')
                //Перехожу по хлебным крошка в меню "Контрагенты"
                cy.get('[data-qa="1657886747803"]').click()
                cy.url().should('eq', `${Cypress.config('baseUrl')}counterparts`)
                // Удаляю контрагент через кебаб меню
                cy.contains('.counterpart-list__item', this.testData.UL.type.Наименование)
                    .within(() => {
                        cy.get('.actions').click()
                        cy.contains('.menu-select-item__title', 'Удалить').click()
                    })
                //Проверяю модальное окно
                cy.checkModalContainer(this.testData)
                //Нажимаю "Удалить"
                cy.get('[data-qa="1658988097817"] > [data-qa="1658987981978"]')
                    .click()
                //Проверяю тост сообщение - красный цвет и текст "Контрагент удален"
                cy.checkRedToastInfo(this.testData.toastRedSuccess);
                //Проверяю, что все контрагенты удалены
                cy.get('.counterparts-list__empty-text')
                    .should('contain', ' Контрагенты не найдены ')
            })
            it('#3629. Валидация на создание дубликата контрагента', function () {
                //Создаю контрагента через API 
                cy.createCounterpartsApi(
                    this.testData.UL.type["ИНН"],
                    this.testData.UL.type["КПП"],
                    this.testData.UL.type["Номер счета"],
                    this.testData.UL.type["БИК банка получателя"],
                    this.testData.UL.check["corrType"]
                )
                //Перехожу в раздел "Контрагенты"
                cy.visit(`${Cypress.config('baseUrl')}counterparts`)
                //Нажимаю кнопку "Добавить контрагента"
                cy.get('[data-qa="1657885995577"] > [data-qa="1658987981978"]')
                    .click()
                cy.url()
                    .should('eq', `${Cypress.config('baseUrl')}counterparts/create`)
                //Проверяю что выбрана вкладка "Юридическое лицо"
                cy.get('.counterpart__types__item.active')
                    .should('contain', 'Юридическое лицо')
                    .should('have.css', 'border-bottom', `3px solid ${Cypress.env('colorBlueSolid')}`)
                //Заполняю форму тестовыми данными из фикстуры
                cy.typeForm(this.testData.UL.type)
                cy.get('.loader')
                    .should('not.exist')
                //Проверяю тестовые данные из фикстуры
                cy.checkFormСounterparts(this.testData.UL)
                //Нажимаю "Сохранить"
                cy.get('[data-qa="1657886705496"] > [data-qa="1658987981978"]')
                    .click()
                //Проверяю тост сообщение - красный фон и текст "Такой контрагент уже существует"
                cy.checkRedToastInfo(this.testData.toastRedError);
            })
        })
        context('Меню шаблоны', () => {
            it('#_____. Создание контрагента + удаление через кебаб-меню', function () {
            })
            it('#_____. Валидация на создание дубликата контрагента', function () {
            })
        })
        context('Новый платеж', () => {
            it('#_____. Создание контрагента + удаление через кебаб-меню', function () {
            })
            it('#_____. Валидация на создание дубликата контрагента', function () {
            })
        })
    })
    context('Контрагенты ФЛ', () => {
        context('Меню контрагенты', () => {
            it('#_____. Создание контрагента + удаление через кебаб-меню', function () {
            })
            it('#_____. Валидация на создание дубликата контрагента', function () {
            })
        })
        context('Меню шаблоны', () => {
            it('#_____. Создание контрагента + удаление через кебаб-меню', function () {
            })
            it('#_____. Валидация на создание дубликата контрагента', function () {
            })
        })
        context('Новый платеж', () => {
            it('#_____. Создание контрагента + удаление через кебаб-меню', function () {
            })
            it('#_____. Валидация на создание дубликата контрагента', function () {
            })
        })
    })
});