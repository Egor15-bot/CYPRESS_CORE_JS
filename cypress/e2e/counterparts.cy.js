describe('Контрагенты', () => {
    beforeEach(() => {
        //Авторизация + создание сессии
        cy.loginApi('TOKEN')
        //Смена компании на "Захарова Яна Николаевна"
        cy.changeCompanyApi('3448774')
        //Удаление всех контрагентов через API
        cy.deleteAllCounterparts()
        //Импортирую обние настройки по фикстурам
        cy.fixture('counterparts').then(function (fixtureCounterparts) {
            this.fixtureCounterparts = fixtureCounterparts
        })
    });
    context('Общие кейсы', () => {
        it('Переход в меню "Контрагенты" через меню бургер', function () {
            cy.visit('/')
            cy.openBurgerTab('Контрагенты')
                .url()
                .should('contain', '/counterparts')
        })
        it('Верстка', function () {
            //Перехожу в раздел "Контрагенты"
            cy.visit('/counterparts')
                .url()
                .should('contain', '/counterparts')
            //Жду пока пропадет лоадер со страницы
            cy.get('.loader').should('not.exist')
            //Проверяю заголовок
            cy.get('div.page-path').should('contain', 'Контрагенты')
            //Проверяю описание
            cy.get('div.page-title__text').should('contain', ' Справочник контрагентов ')
            //Проверяю кнопку
            cy.get('app-button[data-qa="1657885995577"] > div[data-qa="1658987981978"]')
                .should('contain', ' Добавить контрагента')
                .and('have.css', 'background-image', Cypress.env('colorBlueGradient'));
            //Проверяю цвет кнопки "Рублевые"
            cy.get('div[data-qa="16599638895420"]').should('have.css', 'background-image', Cypress.env('colorBlueGradient'));
        })
        it('#1366. Фильтрация. Рублевые. Строка поиска', function () {
        })
        it('#1873. Фильтрация. Рублевые. Фильтрация по типам', function () { })
        it('#3602. Услуга "Светофор" включена - АО "ВМЗ"', function () { })
        it('#3796. Услуга "Светофор" выключена - ООО "БРАИР"', function () { })
        it('#1359. Проверка пагинации', function () { })
        it('#1372. Проверка скорости загрузки страницы "Контрагенты"', function () { })
        context('Меню действий "Изменить" - раздел "Контрагенты"', function () {
            it('#1971. Контрагент ЮЛ', function () { })
            it('#3797. Контрагент ФЛ с ИНН', function () { })
            it('#3798. Контрагент ФЛ без ИНН', function () { })
            it('#3799. Контрагент ИП', function () { })
            it('#3800. Контрагент НАЛОГ', function () { })
            it('#3801. Контрагент ТАМОЖ', function () { })
        })
        context('Меню действий "Изменить" - раздел "Контрагенты / Просмотр"', () => {
            it('#3810. Контрагент ЮЛ', function () { })
            it('#3811. Контрагент ФЛ с ИНН', function () { })
            it('#3812. Контрагент ФЛ без ИНН', function () { })
            it('#3813. Контрагент ИП', function () { })
            it('#3814. Контрагент НАЛОГ', function () { })
            it('#3815. Контрагент ТАМОЖ', function () { })
        })
    })
    context('Контрагенты ЮЛ', () => {
        beforeEach('Импортирую фикстуры для ЮЛ', () => {
            cy.fixture('counterparts').then(function (testData) {
                this.testData = testData.UL
            })
        })
        context('Меню контрагенты', () => {
            beforeEach('Перехожу в раздел "Контрагенты" / "Добавить контрагента"', () => {
                cy.visit('/counterparts/create')
                    .url()
                    .should('contain', '/counterparts/create')
            })
            it('#1497. Создание контрагента + удаление через кебаб-меню', function () {
                //Проверяю автивную вкладку в разделе "Контрагенты"
                cy.get('div.counterpart__types__item.active')
                    .should('contain', this.testData.check.nameCounterpart)
                    .and('have.css', 'border-bottom', `3px solid ${Cypress.env('colorBlueSolid')}`)
                //Заполняю форму тестовыми данными из фикстуры
                cy.fillForm(this.testData.type)
                //Жду пока заполниться поле "Название банка получателя"
                cy.contains('label.dynamic-input', ' Название банка получателя ')
                    .find('div.dynamic-input__overlay.ng-star-inserted')
                    .children()
                    .invoke('val')
                    .should('not.be.empty')
                cy.wait(1000)
                //Проверяю тестовые данные из фикстуры
                cy.checkFormInput(this.testData)
                //Нажимаю "Сохранить"
                cy.get('app-button[data-qa="1657886705496"] > div[data-qa="1658987981978"]').click()
                //Зеленый тост "Контрагент успешно сохранён!"
                cy.checkGreenToastInfo(this.fixtureCounterparts.toastGreen);
                //Проверяю логотип и ранее введенную информацию на странице "Контрагенты"
                //Перехожу на страницу "Контрагенты / Просмотр"
                cy.checkCounterpartList(this.testData).click()
                //Проверяю наличие хлебных крошек
                cy.get('div.breadcrumbs')
                    .should('contain', ' Контрагенты ')
                    .and('contain', ' Просмотр')
                //Проверяю логотип и ранее введенную информацию на странице "Контрагенты / Просмотр"
                cy.checkCounterpartDetails(this.testData)
                //Проверяю номер счета, город и кнопку "Заплатить"
                cy.modificationAccNumberDot(this.testData.type["Счет получателя"])
                    .then((modifiedNumber) => {
                        cy.get('div.number').should('contain', modifiedNumber);
                    });
                cy.get('div.bank-place').should('contain', this.testData.check.city)
                cy.get('div.controls').should('contain', ' Заплатить ')
                //Перехожу по хлебным крошка в меню "Контрагенты"
                cy.get('div[data-qa="1657886747803"]')
                    .click()
                    .url()
                    .should('contain', '/counterparts')
                //Удаляю контрагент через кебаб меню
                cy.contains('div.counterpart-list__item', this.testData.type["Наименование получателя или ИНН"])
                    .within(() => {
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
            it('#3629. Валидация на создание дубликата контрагента', function () {
                //Создаю контрагента через API 
                cy.createCounterpartsApi(
                    this.fixtureCounterparts["Контрагент для валидации"],
                    this.testData.type["ИНН получателя"],
                    this.testData.type["КПП получателя"],
                    this.testData.type["Счет получателя"],
                    this.testData.type["БИК банка получателя"],
                    this.testData.check["corrType"]
                )
                //Проверяю автивную вкладку в разделе "Контрагенты"
                cy.get('div.counterpart__types__item.active')
                    .should('contain', this.testData.check.nameCounterpart)
                    .and('have.css', 'border-bottom', `3px solid ${Cypress.env('colorBlueSolid')}`)
                //Заполняю форму тестовыми данными из фикстуры
                cy.fillForm(this.testData.type)
                //Жду пока заполниться поле "Название банка получателя"
                cy.contains('label.dynamic-input', ' Название банка получателя ')
                    .find('div.dynamic-input__overlay.ng-star-inserted')
                    .children()
                    .invoke('val')
                    .should('not.be.empty')
                //Проверяю тестовые данные из фикстуры
                cy.checkFormInput(this.testData)
                //Нажимаю "Сохранить"
                cy.get('app-button[data-qa="1657886705496"] > div[data-qa="1658987981978"]').click()
                //Проверяю тост сообщение - красный фон и текст "Такой контрагент уже существует"
                cy.checkRedToastInfo(this.fixtureCounterparts.toastRedError);
                //Перехожу в раздел "Контрагенты"
                cy.visit('/counterparts')
                    .url()
                    .should('contain', '/counterparts')
                //Количество контрагентов = 1
                cy.get('div.counterpart-list__item').should('have.length', 1)
            })
        })
        context('Меню шаблоны', () => {
            beforeEach('Перехожу в раздел "Шаблоны" / "Создать шаблон"', () => {
                cy.visit('/template?new=true')
                    .url()
                    .should('contain', '/template?new=true')
            })
            it('#1660. Создание контрагента + удаление через меню "Контрагенты / Просмотр"', function () {
                //Заполняю поле "Название шаблона"
                cy.contains('div.panel-form__input__placeholder', ' Название шаблона ')
                    .click()
                    .type(`Шаблон - ${this.testData.type["Наименование получателя или ИНН"]}`)
                //Нажимаю на стрелку пожле "Получатель"
                cy.contains('div[data-qa="1657803432416"]', 'Получатель').within(() => {
                    cy.get(this.fixtureCounterparts.arroyDown).click()
                })
                //Заполняю форму тестовыми данными из фикстуры
                cy.fillForm(this.testData.type)
                //Жду пока заполниться поле "Название банка получателя"
                cy.contains('label.dynamic-input', ' Название банка получателя ')
                    .find('div.dynamic-input__overlay.ng-star-inserted')
                    .children()
                    .invoke('val')
                    .should('not.be.empty')
                cy.wait(1000)
                //Проверяю тестовые данные из фикстуры
                cy.checkFormInput(this.testData)
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
            it('#3633. Валидация на создание дубликата контрагента', function () {
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
                cy.fillForm(this.testData.type)
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
            it('#1496. Создание контрагента + удаление через кебаб-меню', function () {
                //Нажимаю на стрелку пожле "Получатель"
                cy.contains('div[data-qa="1657803432416"]', 'Получатель').within(() => {
                    cy.get(this.fixtureCounterparts.arroyDown).click()
                })
                //Заполняю форму тестовыми данными из фикстуры
                cy.fillForm(this.testData.type)
                //Жду пока заполниться поле "Название банка получателя"
                cy.contains('label.dynamic-input', ' Название банка получателя ')
                    .find('div.dynamic-input__overlay.ng-star-inserted')
                    .children()
                    .invoke('val')
                    .should('not.be.empty')
                cy.wait(1000)
                //Проверяю тестовые данные из фикстуры
                cy.checkFormInput(this.testData)
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
            it('#3635. Валидация на создание дубликата контрагента', function () {
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
                cy.fillForm(this.testData.type)
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
        context('Рублевый платеж с СВО', () => {
            beforeEach('Смена компании, переход в раздел "Рублевый платеж с СВО"', () => {
                //Смена компании на ООО "Радиатор"
                cy.changeCompanyApi('7970250')
                cy.visit('/transfer-rur-cti')
                    .url()
                    .should('contain', '/transfer-rur-cti')
                //Импортирую фикстуры для создания контрагента СВО
                cy.fixture('counterparts').then(function (testData) {
                    this.testData = testData.SVO
                })
            })
            it('#4425. Создание контрагента + удаление через кебаб-меню', function () {
                //Нажимаю на стрелку пожле "Получатель"
                cy.contains('div[data-qa="1657803432416"]', 'Получатель').within(() => {
                    cy.get(this.fixtureCounterparts.arroyDown).click()
                })
                //Заполняю форму тестовыми данными из фикстуры
                cy.fillForm(this.testData.type)
                //Жду пока заполниться поле "Название банка получателя"
                cy.contains('label.dynamic-input', ' Название банка получателя ')
                    .find('div.dynamic-input__overlay.ng-star-inserted')
                    .children()
                    .invoke('val')
                    .should('not.be.empty')
                cy.wait(1000)
                //Проверяю тестовые данные из фикстуры
                cy.checkFormInput(this.testData)
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
            it('#1650. Оплата через иконку карты', function () {
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
                //Проверяю автивную вкладку в разделе "Новый платеж"
                cy.get('div.transfer-rur__types__item.active')
                    .should('contain', this.testData.check.nameTransferRur)
                    .and('have.css', 'border-bottom', `3px solid ${Cypress.env('colorBlueSolid')}`)
                //Жду пока заполниться поле "Название банка получателя"
                cy.contains('label.dynamic-input', ' Название банка получателя ')
                    .find('div.dynamic-input__overlay.ng-star-inserted')
                    .children()
                    .invoke('val')
                    .should('not.be.empty')
                cy.wait(1000)
                //Проверяю тестовые данные из фикстуры
                cy.checkFormInput(this.testData)
            })
            it('#2019. Оплата через окно просмотра', function () {
                //Перехожу на страницу "Контрагенты"
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
                //Проверяю автивную вкладку в разделе "Новый платеж"
                cy.get('div.transfer-rur__types__item.active')
                    .should('contain', this.testData.check.nameTransferRur)
                    .and('have.css', 'border-bottom', `3px solid ${Cypress.env('colorBlueSolid')}`)
                //Жду пока заполниться поле "Название банка получателя"
                cy.contains('label.dynamic-input', ' Название банка получателя ')
                    .find('div.dynamic-input__overlay.ng-star-inserted')
                    .children()
                    .invoke('val')
                    .should('not.be.empty')
                cy.wait(1000)
                //Проверяю тестовые данные из фикстуры
                cy.checkFormInput(this.testData)
            })
            it('#2038. Оплата через "Новый платеж"', function () {
                //Перехожу в "Новый платеж"
                cy.visit('/transfer-rur')
                    .url()
                    .should('contain', '/transfer-rur')
                //Проверяю автивную вкладку в разделе "Новый платеж"
                cy.get('div.transfer-rur__types__item.active')
                    .should('contain', this.testData.check.nameTransferRur)
                    .and('have.css', 'border-bottom', `3px solid ${Cypress.env('colorBlueSolid')}`)
                //Ввожу в страку поиска название ранее созданного контрагента
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
                cy.checkFormInput(this.testData)
            })
        })
    })
    context('Контрагенты ФЛ с ИНН', () => {
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
                //Проверяю автивную вкладку в разделе "Контрагенты"
                cy.contains('div.counterpart__types__item', this.testData.check.nameCounterpart).click()
                cy.get('div.counterpart__types__item.active')
                    .should('contain', this.testData.check.nameCounterpart)
                    .and('have.css', 'border-bottom', `3px solid ${Cypress.env('colorBlueSolid')}`)
                //Заполняю форму тестовыми данными из фикстуры
                cy.fillForm(this.testData.type)
                //Жду пока заполниться поле "Название банка получателя"
                cy.contains('label.dynamic-input', ' Название банка получателя ')
                    .find('div.dynamic-input__overlay.ng-star-inserted')
                    .children()
                    .invoke('val')
                    .should('not.be.empty')
                cy.wait(1000)
                //Проверяю тестовые данные из фикстуры
                cy.checkFormInput(this.testData)
                //Нажимаю "Сохранить"
                cy.get('app-button[data-qa="1657886705496"] > div[data-qa="1658987981978"]').click()
                //Зеленый тост "Контрагент успешно сохранён!"
                cy.checkGreenToastInfo(this.fixtureCounterparts.toastGreen);
                //Проверяю логотип и ранее введенную информацию на странице "Контрагенты"
                //Перехожу на страницу "Контрагенты / Просмотр"
                cy.checkCounterpartList(this.testData).click()
                //Проверяю наличие хлебных крошек
                cy.get('div.breadcrumbs')
                    .should('contain', ' Контрагенты ')
                    .and('contain', ' Просмотр')
                //Проверяю логотип и ранее введенную информацию на странице "Контрагенты / Просмотр"
                cy.checkCounterpartDetails(this.testData)
                //Проверяю номер счета, город и кнопку "Заплатить"
                cy.modificationAccNumberDot(this.testData.type["Счет получателя"])
                    .then((modifiedNumber) => {
                        cy.get('div.number').should('contain', modifiedNumber);
                    });
                cy.get('div.bank-place').should('contain', this.testData.check.city)
                cy.get('div.controls').should('contain', ' Заплатить ')
                //Перехожу по хлебным крошка в меню "Контрагенты"
                cy.get('div[data-qa="1657886747803"]')
                    .click()
                    .url()
                    .should('contain', '/counterparts')
                //Удаляю контрагент через кебаб меню
                cy.contains('div.counterpart-list__item', this.testData.type["Наименование получателя или ИНН"])
                    .within(() => {
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
            it('#3637. Валидация на создание дубликата контрагента', function () {
                //Создаю контрагента через API 
                cy.createCounterpartsApi(
                    this.fixtureCounterparts["Контрагент для валидации"],
                    this.testData.type["ИНН получателя"],
                    this.testData.type["КПП получателя"],
                    this.testData.type["Счет получателя"],
                    this.testData.type["БИК банка получателя"],
                    this.testData.check["corrType"]
                )
                //Проверяю автивную вкладку в разделе "Контрагенты"
                cy.contains('div.counterpart__types__item', this.testData.check.nameCounterpart).click()
                cy.get('div.counterpart__types__item.active')
                    .should('contain', this.testData.check.nameCounterpart)
                    .and('have.css', 'border-bottom', `3px solid ${Cypress.env('colorBlueSolid')}`)
                //Заполняю форму тестовыми данными из фикстуры
                cy.fillForm(this.testData.type)
                //Жду пока заполниться поле "Название банка получателя"
                cy.contains('label.dynamic-input', ' Название банка получателя ')
                    .find('div.dynamic-input__overlay.ng-star-inserted')
                    .children()
                    .invoke('val')
                    .should('not.be.empty')
                //Проверяю тестовые данные из фикстуры
                cy.checkFormInput(this.testData)
                //Нажимаю "Сохранить"
                cy.get('app-button[data-qa="1657886705496"] > div[data-qa="1658987981978"]').click()
                //Проверяю тост сообщение - красный фон и текст "Такой контрагент уже существует"
                cy.checkRedToastInfo(this.fixtureCounterparts.toastRedError);
                //Перехожу в раздел "Контрагенты"
                cy.visit('/counterparts')
                    .url()
                    .should('contain', '/counterparts')
                //Количество контрагентов = 1
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
                //Заполняю поле "Название шаблона"
                cy.contains('div.panel-form__input__placeholder', ' Название шаблона ')
                    .click()
                    .type(`Шаблон - ${this.testData.type["Наименование получателя или ИНН"]}`)
                //Нажимаю на стрелку пожле "Получатель"
                cy.contains('div[data-qa="1657803432416"]', 'Получатель').within(() => {
                    cy.get(this.fixtureCounterparts.arroyDown).click()
                })
                //Заполняю форму тестовыми данными из фикстуры
                cy.fillForm(this.testData.type)
                //Жду пока заполниться поле "Название банка получателя"
                cy.contains('label.dynamic-input', ' Название банка получателя ')
                    .find('div.dynamic-input__overlay.ng-star-inserted')
                    .children()
                    .invoke('val')
                    .should('not.be.empty')
                cy.wait(1000)
                //Проверяю тестовые данные из фикстуры
                cy.checkFormInput(this.testData)
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
                cy.fillForm(this.testData.type)
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
                cy.fillForm(this.testData.type)
                //Жду пока заполниться поле "Название банка получателя"
                cy.contains('label.dynamic-input', ' Название банка получателя ')
                    .find('div.dynamic-input__overlay.ng-star-inserted')
                    .children()
                    .invoke('val')
                    .should('not.be.empty')
                cy.wait(1000)
                //Проверяю тестовые данные из фикстуры
                cy.checkFormInput(this.testData)
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
                cy.fillForm(this.testData.type)
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
                //Проверяю автивную вкладку в разделе "Новый платеж"
                cy.get('div.transfer-rur__types__item.active')
                    .should('contain', this.testData.check.nameTransferRur)
                    .and('have.css', 'border-bottom', `3px solid ${Cypress.env('colorBlueSolid')}`)
                //Жду пока заполниться поле "Название банка получателя"
                cy.contains('label.dynamic-input', ' Название банка получателя ')
                    .find('div.dynamic-input__overlay.ng-star-inserted')
                    .children()
                    .invoke('val')
                    .should('not.be.empty')
                cy.wait(1000)
                //Проверяю тестовые данные из фикстуры
                cy.checkFormInput(this.testData)
            })
            it('#3726. Оплата через окно просмотра', function () {
                //Перехожу на страницу "Контрагенты"
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
                cy.checkFormInput(this.testData)
            })
            it('#3727. Оплата через "Новый платеж"', function () {
                //Перехожу в "Новый платеж"
                cy.visit('/transfer-rur')
                    .url()
                    .should('contain', '/transfer-rur')
                //Проверяю автивную вкладку в разделе "Новый платеж"
                cy.get('div.transfer-rur__types__item.active')
                    .should('contain', this.testData.check.nameTransferRur)
                    .and('have.css', 'border-bottom', `3px solid ${Cypress.env('colorBlueSolid')}`)
                //Ввожу в страку поиска название ранее созданного контрагента
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
                cy.checkFormInput(this.testData)
            })
        })
    })
    context('Контрагенты ФЛ без ИНН', () => {
        beforeEach('Импортирую фикстуры для ФЛ без ИНН', () => {
            cy.fixture('counterparts').then(function (testData) {
                this.testData = testData.FL_Without_INN
            })
        })
        context('Меню контрагенты', () => {
            beforeEach('Перехожу в раздел "Контрагенты" / "Добавить контрагента"', () => {
                cy.visit('/counterparts/create')
                    .url()
                    .should('contain', '/counterparts/create')
            })
            it('#2849. Создание контрагента + удаление через кебаб-меню', function () {
                //Проверяю автивную вкладку в разделе "Контрагенты"
                cy.contains('div.counterpart__types__item', this.testData.check.nameCounterpart).click()
                cy.get('div.counterpart__types__item.active')
                    .should('contain', this.testData.check.nameCounterpart)
                    .and('have.css', 'border-bottom', `3px solid ${Cypress.env('colorBlueSolid')}`)
                //Заполняю форму тестовыми данными из фикстуры
                cy.fillForm(this.testData.type)
                //Жду пока заполниться поле "Название банка получателя"
                cy.contains('label.dynamic-input', ' Название банка получателя ')
                    .find('div.dynamic-input__overlay.ng-star-inserted')
                    .children()
                    .invoke('val')
                    .should('not.be.empty')
                cy.wait(1000)
                //Проверяю тестовые данные из фикстуры
                cy.checkFormInput(this.testData)
                //Нажимаю "Сохранить"
                cy.get('app-button[data-qa="1657886705496"] > div[data-qa="1658987981978"]').click()
                //Зеленый тост "Контрагент успешно сохранён!"
                cy.checkGreenToastInfo(this.fixtureCounterparts.toastGreen);
                //Проверяю логотип и ранее введенную информацию на странице "Контрагенты"
                //Перехожу на страницу "Контрагенты / Просмотр"
                cy.checkCounterpartList(this.testData).click()
                //Проверяю наличие хлебных крошек
                cy.get('div.breadcrumbs')
                    .should('contain', ' Контрагенты ')
                    .and('contain', ' Просмотр')
                //Проверяю логотип и ранее введенную информацию на странице "Контрагенты / Просмотр"
                cy.checkCounterpartDetails(this.testData)
                //Проверяю номер счета, город и кнопку "Заплатить"
                cy.modificationAccNumberDot(this.testData.type["Счет получателя"])
                    .then((modifiedNumber) => {
                        cy.get('div.number').should('contain', modifiedNumber);
                    });
                cy.get('div.bank-place').should('contain', this.testData.check.city)
                cy.get('div.controls').should('contain', ' Заплатить ')
                //Перехожу по хлебным крошка в меню "Контрагенты"
                cy.get('div[data-qa="1657886747803"]')
                    .click()
                    .url()
                    .should('contain', '/counterparts')
                //Удаляю контрагент через кебаб меню
                cy.contains('div.counterpart-list__item', this.testData.type["Наименование получателя или ИНН"])
                    .within(() => {
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
        })
        context('Меню шаблоны', () => {
            beforeEach('Перехожу в раздел "Шаблоны" / "Создать шаблон"', () => {
                cy.visit('/template?new=true')
                    .url()
                    .should('contain', '/template?new=true')
            })
            it('#3659. Создание контрагента + удаление через меню "Контрагенты / Просмотр"', function () {
                //Заполняю поле "Название шаблона"
                cy.contains('div.panel-form__input__placeholder', ' Название шаблона ')
                    .click()
                    .type(`Шаблон - ${this.testData.type["Наименование получателя или ИНН"]}`)
                //Нажимаю на стрелку пожле "Получатель"
                cy.contains('div[data-qa="1657803432416"]', 'Получатель').within(() => {
                    cy.get(this.fixtureCounterparts.arroyDown).click()
                })
                //Заполняю форму тестовыми данными из фикстуры
                cy.fillForm(this.testData.type)
                //Жду пока заполниться поле "Название банка получателя"
                cy.contains('label.dynamic-input', ' Название банка получателя ')
                    .find('div.dynamic-input__overlay.ng-star-inserted')
                    .children()
                    .invoke('val')
                    .should('not.be.empty')
                cy.wait(1000)
                //Проверяю тестовые данные из фикстуры
                cy.checkFormInput(this.testData)
                //Сохранить контрагента
                cy.get('button[data-qa="1663140882365"]').click()
                //Зеленый тост "Контрагент успешно сохранён!"
                cy.checkGreenToastInfo(this.fixtureCounterparts.toastGreen);
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
        })
        context('Новый платеж', () => {
            beforeEach('Перехожу в раздел "Новый платеж"', () => {
                cy.visit('/transfer-rur')
                    .url()
                    .should('contain', '/transfer-rur')
            })
            it('#3662. Создание контрагента + удаление через кебаб-меню', function () {
                //Нажимаю на стрелку пожле "Получатель"
                cy.contains('div[data-qa="1657803432416"]', 'Получатель').within(() => {
                    cy.get(this.fixtureCounterparts.arroyDown).click()
                })
                //Заполняю форму тестовыми данными из фикстуры
                cy.fillForm(this.testData.type)
                //Жду пока заполниться поле "Название банка получателя"
                cy.contains('label.dynamic-input', ' Название банка получателя ')
                    .find('div.dynamic-input__overlay.ng-star-inserted')
                    .children()
                    .invoke('val')
                    .should('not.be.empty')
                cy.wait(1000)
                //Проверяю тестовые данные из фикстуры
                cy.checkFormInput(this.testData)
                //Сохранить контрагента
                cy.get('button[data-qa="1663140882365"]').click()
                //Зеленый тост "Контрагент успешно сохранён!"
                cy.checkGreenToastInfo(this.fixtureCounterparts.toastGreen);
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
            it('#3729. Оплата через иконку карты', function () {
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
                //Проверяю автивную вкладку в разделе "Новый платеж"
                cy.get('div.transfer-rur__types__item.active')
                    .should('contain', this.testData.check.nameTransferRur)
                    .and('have.css', 'border-bottom', `3px solid ${Cypress.env('colorBlueSolid')}`)
                //Жду пока заполниться поле "Название банка получателя"
                cy.contains('label.dynamic-input', ' Название банка получателя ')
                    .find('div.dynamic-input__overlay.ng-star-inserted')
                    .children()
                    .invoke('val')
                    .should('not.be.empty')
                cy.wait(1000)
                //Проверяю тестовые данные из фикстуры
                cy.checkFormInput(this.testData)
            })
            it('#3730. Оплата через окно просмотра', function () {
                //Перехожу на страницу "Контрагенты"
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
                //Проверяю автивную вкладку в разделе "Новый платеж"
                cy.get('div.transfer-rur__types__item.active')
                    .should('contain', this.testData.check.nameTransferRur)
                    .and('have.css', 'border-bottom', `3px solid ${Cypress.env('colorBlueSolid')}`)
                //Жду пока заполниться поле "Название банка получателя"
                cy.contains('label.dynamic-input', ' Название банка получателя ')
                    .find('div.dynamic-input__overlay.ng-star-inserted')
                    .children()
                    .invoke('val')
                    .should('not.be.empty')
                cy.wait(1000)
                //Проверяю тестовые данные из фикстуры
                cy.checkFormInput(this.testData)
            })
            it('#3731. Оплата через "Новый платеж"', function () {
                //Перехожу в "Новый платеж"
                cy.visit('/transfer-rur')
                    .url()
                    .should('contain', '/transfer-rur')
                //Проверяю автивную вкладку в разделе "Новый платеж"
                cy.get('div.transfer-rur__types__item.active')
                    .should('contain', this.testData.check.nameTransferRur)
                    .and('have.css', 'border-bottom', `3px solid ${Cypress.env('colorBlueSolid')}`)
                //Ввожу в страку поиска название ранее созданного контрагента
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
                cy.checkFormInput(this.testData)
            })
        })
    })
    context('Контрагенты ИП', () => {
        beforeEach('Импортирую фикстуры для ИП', () => {
            cy.fixture('counterparts').then(function (testData) {
                this.testData = testData.IP
            })
        })
        context('Меню контрагенты', () => {
            beforeEach('Перехожу в раздел "Контрагенты" / "Добавить контрагента"', () => {
                cy.visit('/counterparts/create')
                    .url()
                    .should('contain', '/counterparts/create')
            })
            it('#1602. Создание контрагента + удаление через кебаб-меню', function () {
                //Проверяю автивную вкладку в разделе "Контрагенты"
                cy.contains('div.counterpart__types__item', this.testData.check.nameCounterpart).click()
                cy.get('div.counterpart__types__item.active')
                    .should('contain', this.testData.check.nameCounterpart)
                    .and('have.css', 'border-bottom', `3px solid ${Cypress.env('colorBlueSolid')}`)
                //Заполняю форму тестовыми данными из фикстуры
                cy.fillForm(this.testData.type)
                //Жду пока заполниться поле "Название банка получателя"
                cy.contains('label.dynamic-input', ' Название банка получателя ')
                    .find('div.dynamic-input__overlay.ng-star-inserted')
                    .children()
                    .invoke('val')
                    .should('not.be.empty')
                cy.wait(1000)
                //Проверяю тестовые данные из фикстуры
                cy.checkFormInput(this.testData)
                //Нажимаю "Сохранить"
                cy.get('app-button[data-qa="1657886705496"] > div[data-qa="1658987981978"]').click()
                //Зеленый тост "Контрагент успешно сохранён!"
                cy.checkGreenToastInfo(this.fixtureCounterparts.toastGreen);
                //Проверяю логотип и ранее введенную информацию на странице "Контрагенты"
                //Перехожу на страницу "Контрагенты / Просмотр"
                cy.checkCounterpartList(this.testData).click()
                //Проверяю наличие хлебных крошек
                cy.get('div.breadcrumbs')
                    .should('contain', ' Контрагенты ')
                    .and('contain', ' Просмотр')
                //Проверяю логотип и ранее введенную информацию на странице "Контрагенты / Просмотр"
                cy.checkCounterpartDetails(this.testData)
                //Проверяю номер счета, город и кнопку "Заплатить"
                cy.modificationAccNumberDot(this.testData.type["Счет получателя"])
                    .then((modifiedNumber) => {
                        cy.get('div.number').should('contain', modifiedNumber);
                    });
                cy.get('div.bank-place').should('contain', this.testData.check.city)
                cy.get('div.controls').should('contain', ' Заплатить ')
                //Перехожу по хлебным крошка в меню "Контрагенты"
                cy.get('div[data-qa="1657886747803"]')
                    .click()
                    .url()
                    .should('contain', '/counterparts')
                //Удаляю контрагент через кебаб меню
                cy.contains('div.counterpart-list__item', this.testData.type["Наименование получателя или ИНН"])
                    .within(() => {
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
            it('#3649. Валидация на создание дубликата контрагента', function () {
                //Создаю контрагента через API 
                cy.createCounterpartsApi(
                    this.fixtureCounterparts["Контрагент для валидации"],
                    this.testData.type["ИНН получателя"],
                    this.testData.type["КПП получателя"],
                    this.testData.type["Счет получателя"],
                    this.testData.type["БИК банка получателя"],
                    this.testData.check["corrType"]
                )
                //Проверяю автивную вкладку в разделе "Контрагенты"
                cy.contains('div.counterpart__types__item', this.testData.check.nameCounterpart).click()
                cy.get('div.counterpart__types__item.active')
                    .should('contain', this.testData.check.nameCounterpart)
                    .and('have.css', 'border-bottom', `3px solid ${Cypress.env('colorBlueSolid')}`)
                //Заполняю форму тестовыми данными из фикстуры
                cy.fillForm(this.testData.type)
                //Жду пока заполниться поле "Название банка получателя"
                cy.contains('label.dynamic-input', ' Название банка получателя ')
                    .find('div.dynamic-input__overlay.ng-star-inserted')
                    .children()
                    .invoke('val')
                    .should('not.be.empty')
                //Проверяю тестовые данные из фикстуры
                cy.checkFormInput(this.testData)
                //Нажимаю "Сохранить"
                cy.get('app-button[data-qa="1657886705496"] > div[data-qa="1658987981978"]').click()
                //Проверяю тост сообщение - красный фон и текст "Такой контрагент уже существует"
                cy.checkRedToastInfo(this.fixtureCounterparts.toastRedError);
                //Перехожу в раздел "Контрагенты"
                cy.visit('/counterparts')
                    .url()
                    .should('contain', '/counterparts')
                //Количество контрагентов = 1
                cy.get('div.counterpart-list__item').should('have.length', 1)
            })
        })
        context('Меню шаблоны', () => {
            beforeEach('Перехожу в раздел "Шаблоны" / "Создать шаблон"', () => {
                cy.visit('/template?new=true')
                    .url()
                    .should('contain', '/template?new=true')
            })
            it('#3650. Создание контрагента + удаление через меню "Контрагенты / Просмотр"', function () {
                //Заполняю поле "Название шаблона"
                cy.contains('div.panel-form__input__placeholder', ' Название шаблона ')
                    .click()
                    .type(`Шаблон - ${this.testData.type["Наименование получателя или ИНН"]}`)
                //Нажимаю на стрелку пожле "Получатель"
                cy.contains('div[data-qa="1657803432416"]', 'Получатель').within(() => {
                    cy.get(this.fixtureCounterparts.arroyDown).click()
                })
                //Заполняю форму тестовыми данными из фикстуры
                cy.fillForm(this.testData.type)
                //Жду пока заполниться поле "Название банка получателя"
                cy.contains('label.dynamic-input', ' Название банка получателя ')
                    .find('div.dynamic-input__overlay.ng-star-inserted')
                    .children()
                    .invoke('val')
                    .should('not.be.empty')
                cy.wait(1000)
                //Проверяю тестовые данные из фикстуры
                cy.checkFormInput(this.testData)
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
            it('#3652. Валидация на создание дубликата контрагента', function () {
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
                cy.fillForm(this.testData.type)
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
            it('#3653. Создание контрагента + удаление через кебаб-меню', function () {
                //Нажимаю на стрелку пожле "Получатель"
                cy.contains('div[data-qa="1657803432416"]', 'Получатель').within(() => {
                    cy.get(this.fixtureCounterparts.arroyDown).click()
                })
                //Заполняю форму тестовыми данными из фикстуры
                cy.fillForm(this.testData.type)
                //Жду пока заполниться поле "Название банка получателя"
                cy.contains('label.dynamic-input', ' Название банка получателя ')
                    .find('div.dynamic-input__overlay.ng-star-inserted')
                    .children()
                    .invoke('val')
                    .should('not.be.empty')
                cy.wait(1000)
                //Проверяю тестовые данные из фикстуры
                cy.checkFormInput(this.testData)
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
            it('#3655. Валидация на создание дубликата контрагента', function () {
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
                cy.fillForm(this.testData.type)
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
            it('#3733. Оплата через иконку карты', function () {
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
                //Проверяю автивную вкладку в разделе "Новый платеж"
                cy.get('div.transfer-rur__types__item.active')
                    .should('contain', this.testData.check.nameTransferRur)
                    .and('have.css', 'border-bottom', `3px solid ${Cypress.env('colorBlueSolid')}`)
                //Жду пока заполниться поле "Название банка получателя"
                cy.contains('label.dynamic-input', ' Название банка получателя ')
                    .find('div.dynamic-input__overlay.ng-star-inserted')
                    .children()
                    .invoke('val')
                    .should('not.be.empty')
                cy.wait(1000)
                //Проверяю тестовые данные из фикстуры
                cy.checkFormInput(this.testData)
            })
            it('#3734. Оплата через окно просмотра', function () {
                //Перехожу на страницу "Контрагенты"
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
                cy.checkFormInput(this.testData)
            })
            it('#3735. Оплата через "Новый платеж"', function () {
                //Перехожу в "Новый платеж"
                cy.visit('/transfer-rur')
                    .url()
                    .should('contain', '/transfer-rur')
                //Проверяю автивную вкладку в разделе "Новый платеж"
                cy.get('div.transfer-rur__types__item.active')
                    .should('contain', this.testData.check.nameTransferRur)
                    .and('have.css', 'border-bottom', `3px solid ${Cypress.env('colorBlueSolid')}`)
                //Ввожу в страку поиска название ранее созданного контрагента
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
                cy.checkFormInput(this.testData)
            })
        })
    })
    context('Контрагенты НАЛОГ', () => {
        beforeEach('Импортирую фикстуры для НАЛОГ', () => {
            cy.fixture('counterparts').then(function (testData) {
                this.testData = testData.NALOG
            })
        })
        context('Меню контрагенты', () => {
            beforeEach('Перехожу в раздел "Контрагенты" / "Добавить контрагента"', () => {
                cy.visit('/counterparts/create')
                    .url()
                    .should('contain', '/counterparts/create')
            })
            it('#1429. Создание контрагента + удаление через кебаб-меню', function () {
                //Проверяю автивную вкладку в разделе "Контрагенты"
                cy.contains('div.counterpart__types__item', this.testData.check.nameCounterpart).click()
                cy.get('div.counterpart__types__item.active')
                    .should('contain', this.testData.check.nameCounterpart)
                    .and('have.css', 'border-bottom', `3px solid ${Cypress.env('colorBlueSolid')}`)
                //Заполняю форму тестовыми данными из фикстуры
                cy.fillForm(this.testData.type)
                //Жду пока заполниться поле "Название банка получателя"
                cy.contains('label.dynamic-input', ' Название банка получателя ')
                    .find('div.dynamic-input__overlay.ng-star-inserted')
                    .children()
                    .invoke('val')
                    .should('not.be.empty')
                cy.wait(1000)
                //Проверяю тестовые данные из фикстуры
                cy.checkFormInput(this.testData)
                //Нажимаю "Сохранить"
                cy.get('app-button[data-qa="1657886705496"] > div[data-qa="1658987981978"]').click()
                //Зеленый тост "Контрагент успешно сохранён!"
                cy.checkGreenToastInfo(this.fixtureCounterparts.toastGreen);
                //Проверяю логотип и ранее введенную информацию на странице "Контрагенты"
                //Перехожу на страницу "Контрагенты / Просмотр"
                cy.checkCounterpartList(this.testData).click()
                //Проверяю наличие хлебных крошек
                cy.get('div.breadcrumbs')
                    .should('contain', ' Контрагенты ')
                    .and('contain', ' Просмотр')
                //Проверяю логотип и ранее введенную информацию на странице "Контрагенты / Просмотр"
                cy.checkCounterpartDetails(this.testData)
                //Проверяю номер счета, город и кнопку "Заплатить"
                cy.modificationAccNumberDot(this.testData.type["Счет получателя"])
                    .then((modifiedNumber) => {
                        cy.get('div.number').should('contain', modifiedNumber);
                    });
                cy.get('div.bank-place').should('contain', this.testData.check.city)
                cy.get('div.controls').should('contain', ' Заплатить ')
                //Перехожу по хлебным крошка в меню "Контрагенты"
                cy.get('div[data-qa="1657886747803"]')
                    .click()
                    .url()
                    .should('contain', '/counterparts')
                //Удаляю контрагент через кебаб меню
                cy.contains('div.counterpart-list__item', this.testData.type["Наименование получателя или ИНН"])
                    .within(() => {
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
            it('#3757. Валидация на создание дубликата контрагента', function () {
                //Создаю контрагента через API 
                cy.createCounterpartsApi(
                    this.fixtureCounterparts["Контрагент для валидации"],
                    this.testData.type["ИНН получателя"],
                    this.testData.type["КПП получателя"],
                    this.testData.type["Счет получателя"],
                    this.testData.type["БИК банка получателя"],
                    this.testData.check["corrType"]
                )
                //Проверяю автивную вкладку в разделе "Контрагенты"
                cy.contains('div.counterpart__types__item', this.testData.check.nameCounterpart).click()
                cy.get('div.counterpart__types__item.active')
                    .should('contain', this.testData.check.nameCounterpart)
                    .and('have.css', 'border-bottom', `3px solid ${Cypress.env('colorBlueSolid')}`)
                //Заполняю форму тестовыми данными из фикстуры
                cy.fillForm(this.testData.type)
                //Жду пока заполниться поле "Название банка получателя"
                cy.contains('label.dynamic-input', ' Название банка получателя ')
                    .find('div.dynamic-input__overlay.ng-star-inserted')
                    .children()
                    .invoke('val')
                    .should('not.be.empty')
                //Проверяю тестовые данные из фикстуры
                cy.checkFormInput(this.testData)
                //Нажимаю "Сохранить"
                cy.get('app-button[data-qa="1657886705496"] > div[data-qa="1658987981978"]').click()
                //Проверяю тост сообщение - красный фон и текст "Такой контрагент уже существует"
                cy.checkRedToastInfo(this.fixtureCounterparts.toastRedError);
                //Перехожу в раздел "Контрагенты"
                cy.visit('/counterparts')
                    .url()
                    .should('contain', '/counterparts')
                //Количество контрагентов = 1
                cy.get('div.counterpart-list__item').should('have.length', 1)
            })
        })
        context('Меню шаблоны', () => {
            /*
                Контрагент создается с неправильным типом!
                Данные кейсы решили не править, так как это слишком трудозатратно.
                Решение было принято в задаче Redmine 6599
                beforeEach('Перехожу в раздел "Шаблоны" / "Создать шаблон"', () => {
                    cy.visit('/template?new=true')
                        .url()
                        .should('contain', '/template?new=true')
                })
                it('#1723. Создание контрагента + удаление через меню "Контрагенты / Просмотр"', function () {
                    //Заполняю поле "Название шаблона"
                    cy.contains('div.panel-form__input__placeholder', ' Название шаблона ')
                        .click()
                        .type(`Шаблон - ${this.testData.type["Наименование получателя или ИНН"]}`)
                    //Нажимаю на стрелку пожле "Получатель"
                    cy.contains('div[data-qa="1657803432416"]', 'Получатель').within(() => {
                        cy.get(this.fixtureCounterparts.arroyDown).click()
                    })
                    //Заполняю форму тестовыми данными из фикстуры
                    cy.fillForm(this.testData.type)
                    //Жду пока заполниться поле "Название банка получателя"
                    cy.contains('label.dynamic-input', ' Название банка получателя ')
                        .find('div.dynamic-input__overlay.ng-star-inserted')
                        .children()
                        .invoke('val')
                        .should('not.be.empty')
                    cy.wait(1000)
                    //Проверяю тестовые данные из фикстуры
                    cy.checkFormInput(this.testData)
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
                it('#3759. Валидация на создание дубликата контрагента', function () {
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
                    cy.fillForm(this.testData.type)
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
            */
        })
        context('Новый платеж', () => {
            /*
                Контрагент создается с неправильным типом!
                Данные кейсы решили не править, так как это слишком трудозатратно.
                Решение было принято в задаче Redmine 6599
                beforeEach('Перехожу в раздел "Новый платеж"', () => {
                    cy.visit('/transfer-rur')
                        .url()
                        .should('contain', '/transfer-rur')
                })
                it('#1365. Создание контрагента + удаление через кебаб-меню', function () {
                    //Нажимаю на стрелку пожле "Получатель"
                    cy.contains('div[data-qa="1657803432416"]', 'Получатель').within(() => {
                        cy.get(this.fixtureCounterparts.arroyDown).click()
                    })
                    //Заполняю форму тестовыми данными из фикстуры
                    cy.fillForm(this.testData.type)
                    //Жду пока заполниться поле "Название банка получателя"
                    cy.contains('label.dynamic-input', ' Название банка получателя ')
                        .find('div.dynamic-input__overlay.ng-star-inserted')
                        .children()
                        .invoke('val')
                        .should('not.be.empty')
                    cy.wait(1000)
                    //Проверяю тестовые данные из фикстуры
                    cy.checkFormInput(this.testData)
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
                it('#3761. Валидация на создание дубликата контрагента', function () {
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
                    cy.fillForm(this.testData.type)
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
            */
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
            it('#3775. Оплата через иконку карты', function () {
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
                //Проверяю автивную вкладку в разделе "Новый платеж"
                cy.get('div.transfer-rur__types__item.active')
                    .should('contain', this.testData.check.nameTransferRur)
                    .and('have.css', 'border-bottom', `3px solid ${Cypress.env('colorBlueSolid')}`)
                //Жду пока заполниться поле "Название банка получателя"
                cy.contains('label.dynamic-input', ' Название банка получателя ')
                    .find('div.dynamic-input__overlay.ng-star-inserted')
                    .children()
                    .invoke('val')
                    .should('not.be.empty')
                cy.wait(1000)
                //Проверяю тестовые данные из фикстуры
                cy.checkFormInput(this.testData)
            })
            it('#3776. Оплата через окно просмотра', function () {
                //Перехожу на страницу "Контрагенты"
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
                //Проверяю автивную вкладку в разделе "Новый платеж"
                cy.get('div.transfer-rur__types__item.active')
                    .should('contain', this.testData.check.nameTransferRur)
                    .and('have.css', 'border-bottom', `3px solid ${Cypress.env('colorBlueSolid')}`)
                //Жду пока заполниться поле "Название банка получателя"
                cy.contains('label.dynamic-input', ' Название банка получателя ')
                    .find('div.dynamic-input__overlay.ng-star-inserted')
                    .children()
                    .invoke('val')
                    .should('not.be.empty')
                cy.wait(1000)
                //Проверяю тестовые данные из фикстуры
                cy.checkFormInput(this.testData)
            })
            it('#3777. Оплата через "Новый платеж"', function () {
                //Перехожу в "Новый платеж"
                cy.visit('/transfer-rur')
                    .url()
                    .should('contain', '/transfer-rur')
                //Проверяю автивную вкладку в разделе "Новый платеж"
                cy.get('div.transfer-rur__types__item.active')
                    .should('contain', this.testData.check.nameTransferRur)
                    .and('have.css', 'border-bottom', `3px solid ${Cypress.env('colorBlueSolid')}`)
                //Ввожу в страку поиска название ранее созданного контрагента
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
                cy.checkFormInput(this.testData)
            })
        })
    })
    context('Контрагенты ТАМОЖ', () => {
        beforeEach('Импортирую фикстуры для ТАМОЖ', () => {
            cy.fixture('counterparts').then(function (testData) {
                this.testData = testData.TAMOZH
            })
        })
        context('Меню контрагенты', () => {
            beforeEach('Перехожу в раздел "Контрагенты" / "Добавить контрагента"', () => {
                cy.visit('/counterparts/create')
                    .url()
                    .should('contain', '/counterparts/create')
            })
            it('#1422. Создание контрагента + удаление через кебаб-меню', function () {
                //Проверяю автивную вкладку в разделе "Контрагенты"
                cy.contains('div.counterpart__types__item', this.testData.check.nameCounterpart).click()
                cy.get('div.counterpart__types__item.active')
                    .should('contain', this.testData.check.nameCounterpart)
                    .and('have.css', 'border-bottom', `3px solid ${Cypress.env('colorBlueSolid')}`)
                //Заполняю форму тестовыми данными из фикстуры
                cy.fillForm(this.testData.type)
                //Жду пока заполниться поле "Название банка получателя"
                cy.contains('label.dynamic-input', ' Название банка получателя ')
                    .find('div.dynamic-input__overlay.ng-star-inserted')
                    .children()
                    .invoke('val')
                    .should('not.be.empty')
                cy.wait(1000)
                //Проверяю тестовые данные из фикстуры
                cy.checkFormInput(this.testData)
                //Нажимаю "Сохранить"
                cy.get('app-button[data-qa="1657886705496"] > div[data-qa="1658987981978"]').click()
                //Зеленый тост "Контрагент успешно сохранён!"
                cy.checkGreenToastInfo(this.fixtureCounterparts.toastGreen);
                //Проверяю логотип и ранее введенную информацию на странице "Контрагенты"
                //Перехожу на страницу "Контрагенты / Просмотр"
                cy.checkCounterpartList(this.testData).click()
                //Проверяю наличие хлебных крошек
                cy.get('div.breadcrumbs')
                    .should('contain', ' Контрагенты ')
                    .and('contain', ' Просмотр')
                //Проверяю логотип и ранее введенную информацию на странице "Контрагенты / Просмотр"
                cy.checkCounterpartDetails(this.testData)
                //Проверяю номер счета, город и кнопку "Заплатить"
                cy.modificationAccNumberDot(this.testData.type["Счет получателя"])
                    .then((modifiedNumber) => {
                        cy.get('div.number').should('contain', modifiedNumber);
                    });
                cy.get('div.bank-place').should('contain', this.testData.check.city)
                cy.get('div.controls').should('contain', ' Заплатить ')
                //Перехожу по хлебным крошка в меню "Контрагенты"
                cy.get('div[data-qa="1657886747803"]')
                    .click()
                    .url()
                    .should('contain', '/counterparts')
                //Удаляю контрагент через кебаб меню
                cy.contains('div.counterpart-list__item', this.testData.type["Наименование получателя или ИНН"])
                    .within(() => {
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
            it('#3762. Валидация на создание дубликата контрагента', function () {
                //Создаю контрагента через API 
                cy.createCounterpartsApi(
                    this.fixtureCounterparts["Контрагент для валидации"],
                    this.testData.type["ИНН получателя"],
                    this.testData.type["КПП получателя"],
                    this.testData.type["Счет получателя"],
                    this.testData.type["БИК банка получателя"],
                    this.testData.check["corrType"]
                )
                //Проверяю автивную вкладку в разделе "Контрагенты"
                cy.contains('div.counterpart__types__item', this.testData.check.nameCounterpart).click()
                cy.get('div.counterpart__types__item.active')
                    .should('contain', this.testData.check.nameCounterpart)
                    .and('have.css', 'border-bottom', `3px solid ${Cypress.env('colorBlueSolid')}`)
                //Заполняю форму тестовыми данными из фикстуры
                cy.fillForm(this.testData.type)
                //Жду пока заполниться поле "Название банка получателя"
                cy.contains('label.dynamic-input', ' Название банка получателя ')
                    .find('div.dynamic-input__overlay.ng-star-inserted')
                    .children()
                    .invoke('val')
                    .should('not.be.empty')
                //Проверяю тестовые данные из фикстуры
                cy.checkFormInput(this.testData)
                //Нажимаю "Сохранить"
                cy.get('app-button[data-qa="1657886705496"] > div[data-qa="1658987981978"]').click()
                //Проверяю тост сообщение - красный фон и текст "Такой контрагент уже существует"
                cy.checkRedToastInfo(this.fixtureCounterparts.toastRedError);
                //Перехожу в раздел "Контрагенты"
                cy.visit('/counterparts')
                    .url()
                    .should('contain', '/counterparts')
                //Количество контрагентов = 1
                cy.get('div.counterpart-list__item').should('have.length', 1)
            })
        })
        context('Меню шаблоны', () => {
            /*
                Контрагент создается с неправильным типом!
                Данные кейсы решили не править, так как это слишком трудозатратно.
                Решение было принято в задаче Redmine 6599
                beforeEach('Перехожу в раздел "Шаблоны" / "Создать шаблон"', () => {
                    cy.visit('/template?new=true')
                        .url()
                        .should('contain', '/template?new=true')
                })
                it('#1955. Создание контрагента + удаление через меню "Контрагенты / Просмотр"', function () {
                    //Заполняю поле "Название шаблона"
                    cy.contains('div.panel-form__input__placeholder', ' Название шаблона ')
                        .click()
                        .type(`Шаблон - ${this.testData.type["Наименование получателя или ИНН"]}`)
                    //Нажимаю на стрелку пожле "Получатель"
                    cy.contains('div[data-qa="1657803432416"]', 'Получатель').within(() => {
                        cy.get(this.fixtureCounterparts.arroyDown).click()
                    })
                    //Заполняю форму тестовыми данными из фикстуры
                    cy.fillForm(this.testData.type)
                    //Жду пока заполниться поле "Название банка получателя"
                    cy.contains('label.dynamic-input', ' Название банка получателя ')
                        .find('div.dynamic-input__overlay.ng-star-inserted')
                        .children()
                        .invoke('val')
                        .should('not.be.empty')
                    cy.wait(1000)
                    //Проверяю тестовые данные из фикстуры
                    cy.checkFormInput(this.testData)
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
                it('#3763. Валидация на создание дубликата контрагента', function () {
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
                    cy.fillForm(this.testData.type)
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
            */
        })
        context('Новый платеж', () => {
            /*
                Контрагент создается с неправильным типом!
                Данные кейсы решили не править, так как это слишком трудозатратно.
                Решение было принято в задаче Redmine 6599
                beforeEach('Перехожу в раздел "Новый платеж"', () => {
                    cy.visit('/transfer-rur')
                        .url()
                        .should('contain', '/transfer-rur')
                })
                it('#1328. Создание контрагента + удаление через кебаб-меню', function () {
                    //Нажимаю на стрелку пожле "Получатель"
                    cy.contains('div[data-qa="1657803432416"]', 'Получатель').within(() => {
                        cy.get(this.fixtureCounterparts.arroyDown).click()
                    })
                    //Заполняю форму тестовыми данными из фикстуры
                    cy.fillForm(this.testData.type)
                    //Жду пока заполниться поле "Название банка получателя"
                    cy.contains('label.dynamic-input', ' Название банка получателя ')
                        .find('div.dynamic-input__overlay.ng-star-inserted')
                        .children()
                        .invoke('val')
                        .should('not.be.empty')
                    cy.wait(1000)
                    //Проверяю тестовые данные из фикстуры
                    cy.checkFormInput(this.testData)
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
                it('#3764. Валидация на создание дубликата контрагента', function () {
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
                    cy.fillForm(this.testData.type)
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
            */
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
            it('#3778. Оплата через иконку карты', function () {
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
                //Проверяю автивную вкладку в разделе "Новый платеж"
                cy.get('div.transfer-rur__types__item.active')
                    .should('contain', this.testData.check.nameTransferRur)
                    .and('have.css', 'border-bottom', `3px solid ${Cypress.env('colorBlueSolid')}`)
                //Проверяю что выбрана вкладка "Таможенный"
                cy.get('div.transfer-rur__types__item.active')
                    .should('contain', this.testData.check.nameTransferRur)
                    .and('have.css', 'border-bottom', `3px solid ${Cypress.env('colorBlueSolid')}`)
                //Жду пока заполниться поле "Название банка получателя"
                cy.contains('label.dynamic-input', ' Название банка получателя ')
                    .find('div.dynamic-input__overlay.ng-star-inserted')
                    .children()
                    .invoke('val')
                    .should('not.be.empty')
                cy.wait(1000)
                //Проверяю тестовые данные из фикстуры
                cy.checkFormInput(this.testData)
            })
            it('#3779. Оплата через окно просмотра', function () {
                //Перехожу на страницу "Контрагенты"
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
                //Проверяю автивную вкладку в разделе "Новый платеж"
                cy.get('div.transfer-rur__types__item.active')
                    .should('contain', this.testData.check.nameTransferRur)
                    .and('have.css', 'border-bottom', `3px solid ${Cypress.env('colorBlueSolid')}`)
                //Жду пока заполниться поле "Название банка получателя"
                cy.contains('label.dynamic-input', ' Название банка получателя ')
                    .find('div.dynamic-input__overlay.ng-star-inserted')
                    .children()
                    .invoke('val')
                    .should('not.be.empty')
                cy.wait(1000)
                //Проверяю тестовые данные из фикстуры
                cy.checkFormInput(this.testData)
            })
            it('#3780. Оплата через "Новый платеж"', function () {
                //Перехожу в "Новый платеж"
                cy.visit('/transfer-rur')
                    .url()
                    .should('contain', '/transfer-rur')
                //Проверяю автивную вкладку в разделе "Новый платеж"
                cy.get('div.transfer-rur__types__item.active')
                    .should('contain', this.testData.check.nameTransferRur)
                    .and('have.css', 'border-bottom', `3px solid ${Cypress.env('colorBlueSolid')}`)
                //Ввожу в страку поиска название ранее созданного контрагента
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
                cy.checkFormInput(this.testData)
            })
        })
    })
});