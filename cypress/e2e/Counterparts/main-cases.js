describe('Общие кейсы', () => {
    beforeEach(() => {
        //Авторизация + создание сессии
        cy.loginApi('TOKEN')
        //Импортирую обние настройки по фикстурам
        cy.fixture('counterparts').then(function (testData) {
            this.testData = testData
        })
    })
    context('Кейсы, где не нужно создавать тестовые данные', () => {
        beforeEach(() => {
            //Смена компании на "Захарова Яна Николаевна"
            cy.changeCompanyApi('3448774')
        })
        it('#Переход в меню "Контрагенты" через меню бургер', function () {
            cy.visit('/')
            cy.openBurgerTab('Контрагенты')
                .url()
                .should('contain', '/counterparts')
        })
        it('#Верстка', function () {
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
            //Проверяю кнопку "Добавить контрагента"
            cy.get('app-button[data-qa="1657885995577"] > div[data-qa="1658987981978"]')
                .should('contain', ' Добавить контрагента')
                .and('have.css', 'background-image', Cypress.env('colorBlueGradient'));
            //Проверяю кнопку "Рублевые"
            cy.get('div[data-qa="16599638895420"]')
                .should('contain', ' Рублевые ')
                .should('have.css', 'background-image', Cypress.env('colorBlueGradient'));
            //Проверяю кнопку "Валютные"
            cy.get('div[data-qa="16599638895421"]')
                .should('contain', ' Валютные ')
        })
    })
    context('Кейсы, где нужно создавать несколько контрагентов', function () {
        beforeEach(function () {
            //Смена компании на "Захарова Яна Николаевна"
            cy.changeCompanyApi('3448774')
            //Удаление всех контрагентов через API
            cy.deleteAllCounterparts()
            //Создаю контрагента через API
            cy.createCounterpartsApi(this.testData.UL)
            cy.createCounterpartsApi(this.testData.FL_With_INN)
            cy.createCounterpartsApi(this.testData.FL_Without_INN)
            cy.createCounterpartsApi(this.testData.IP)
            cy.createCounterpartsApi(this.testData.NALOG)
            cy.createCounterpartsApi(this.testData.TAMOZH)
            //Перехожу в раздел "Контрагенты"
            cy.visit('/counterparts')
                .url()
                .should('contain', '/counterparts')
        })
        it('#1366. Фильтрация. Рублевые. Строка поиска', function () {
            //Ввожу в строку поиска слово "ЮЛ"
            cy.get('[data-qa="1658988187497"]').type("ЮЛ")
            //Проверяю, что в списке контрагентов отображается 1 элемент
            cy.get('.counterpart-list__item')
                .should('have.length', 1)

            //Отчищаю строку поиска и ввожу слово "ФЛ"
            cy.get('[data-qa="1658988187497"]')
                .clear()
                .type("ФЛ")
            //Проверяю, что в списке контрагентов отображается 2 элемента
            cy.get('.counterpart-list__item')
                .should('have.length', 2)

            //Отчищаю строку поиска и ввожу слово "ИП"
            cy.get('[data-qa="1658988187497"]')
                .clear()
                .type("ИП")
            //Проверяю, что в списке контрагентов отображается 1 элемент
            cy.get('.counterpart-list__item')
                .should('have.length', 1)

            //Отчищаю строку поиска и ввожу слово "НАЛОГ"
            cy.get('[data-qa="1658988187497"]')
                .clear()
                .type("НАЛОГ")
            //Проверяю, что в списке контрагентов отображается 1 элемент
            cy.get('.counterpart-list__item')
                .should('have.length', 1)

            //Отчищаю строку поиска и ввожу слово "ТАМОЖ"
            cy.get('[data-qa="1658988187497"]')
                .clear()
                .type("ТАМОЖ")
            //Проверяю, что в списке контрагентов отображается 1 элемент
            cy.get('.counterpart-list__item')
                .should('have.length', 1)
        })
        it('#1873. Фильтрация. Рублевые. Фильтрация по типам', function () {
            // //Нажимаю на выпадающий списк "Все типы"
            cy.get('.multi-select').click()

            //Убираю все чекбоксы - нажимаю на "Все типы"
            cy.contains('.checkbox', 'Все типы').parent().click()
            //Проверяю текст в выпадающем списке
            cy.get('.multi-select__title')
                .should('contain', ' Ничего не выбрано ')
            //Проверяю, что контрагент удалился и пропал из списка
            cy.get('.counterparts-list')
                .find('.counterparts-list__empty')
                .should('contain', ' Контрагенты не найдены ')

            //Ставлю чекбокс "Юридическое лицо"
            cy.contains('.checkbox', 'Юридическое лицо').parent().click()
            //Проверяю текст в выпадающем списке
            cy.get('.multi-select__title')
                .should('contain', ' Юридическое лицо ')
            //Проверяю, что в списке контрагентов отображается 1 элемент
            cy.get('.counterpart-list__item')
                .should('have.length', 1)

            //Ставлю чекбокс "Физическое лицо"
            cy.contains('.checkbox', 'Физическое лицо').parent().click()
            //Проверяю текст в выпадающем списке
            cy.get('.multi-select__title')
                .should('contain', ' Юридическое лицо, Физическое лицо ')
            //Проверяю, что в списке контрагентов отображается 3 элемента
            cy.get('.counterpart-list__item')
                .should('have.length', 3)

            //Ставлю чекбокс "ИП"
            cy.contains('.checkbox', 'ИП').parent().click()
            //Проверяю текст в выпадающем списке
            cy.get('.multi-select__title')
                .should('contain', ' Юридическое лицо, Физическое лицо, ИП ')
            //Проверяю, что в списке контрагентов отображается 4 элемента
            cy.get('.counterpart-list__item')
                .should('have.length', 4)

            //Ставлю чекбокс "Налоговый/Бюджетный"
            cy.contains('.checkbox', 'Налоговый/Бюджетный').parent().click()
            //Проверяю текст в выпадающем списке
            cy.get('.multi-select__title')
                .should('contain', ' Юридическое лицо, Физическое лицо, ИП, Налоговый/Бюджетный ')
            //Проверяю, что в списке контрагентов отображается 5 элементов
            cy.get('.counterpart-list__item')
                .should('have.length', 5)

            //Ставлю чекбокс "Таможенный"
            cy.contains('.checkbox', 'Таможенный').parent().click()
            //Проверяю текст в выпадающем списке
            cy.get('.multi-select__title')
                .should('contain', ' Все типы ')
            //Проверяю, что в списке контрагентов отображается 6 элементов
            cy.get('.counterpart-list__item')
                .should('have.length', 6)

            //Убираю все чекбоксы - нажимаю на "Все типы"
            cy.contains('.checkbox', 'Все типы').parent().click()
            //Проверяю текст в выпадающем списке
            cy.get('.multi-select__title')
                .should('contain', ' Ничего не выбрано ')
            //Проверяю, что контрагент удалился и пропал из списка
            cy.get('.counterparts-list')
                .find('.counterparts-list__empty')
                .should('contain', ' Контрагенты не найдены ')
        })
        context('Меню действий "Изменить" - раздел "Контрагенты"', function () {
            it('#1971. Контрагент ЮЛ', function () {
                //Ввожу ИНН ранее созданного контрагента в строку поиска
                cy.get('[data-qa="1658988187497"]')
                    .clear()
                    .type(this.testData.UL.type["Наименование получателя или ИНН"])
                //Нажимаю кебаб-меню / Изменить
                cy.clickKebabMenuСounterpart("Изменить")

                //Проверяю, что выбрана нужная вкладка
                cy.get('[data-qa="1657886535621"]')
                    .should('have.class', 'active')
                    .should('contain', ' Юридическое лицо ')

                //Проверяю поле "Наименование" контрагента
                cy.contains('.dynamic-input', ' Наименование ')
                    .find('[placeholder="Введите данные"]')
                    .invoke('val')
                    .then(sometext => expect(sometext).to.equal(this.testData.UL.type["Наименование получателя или ИНН"]));

                //Проверяю поле "ИНН" контрагента
                cy.contains('.dynamic-input', ' ИНН ')
                    .find('[placeholder="Введите данные"]')
                    .invoke('val')
                    .then(sometext => expect(sometext).to.equal(this.testData.UL.type["ИНН получателя"]));

                //Проверяю поле "КПП" контрагента
                cy.contains('.dynamic-input', ' КПП ')
                    .find('[placeholder="Введите данные"]')
                    .invoke('val')
                    .then(sometext => expect(sometext).to.equal(this.testData.UL.type["КПП получателя"]));

                //Проверяю поле "БИК банка получателя" контрагента
                cy.contains('.dynamic-input', ' БИК банка получателя ')
                    .find('[placeholder="Введите данные"]')
                    .invoke('val')
                    .then(sometext => expect(sometext).to.equal(this.testData.UL.type["БИК банка получателя"]));

                //Проверяю поле "Счет получателя"
                cy.modificationAccNumberSpace(this.testData.UL.type["Счет получателя"])
                    .then((modifiedNumber) => {
                        cy.contains('.dynamic-input', ' Номер счета ')
                            .find('[placeholder="Введите данные"]')
                            .invoke('val')
                            .then(sometext => expect(sometext).to.equal(modifiedNumber));
                    });
                //ВВОЖУ НОВЫЕ ДАННЫЕ В ПОЛЯ
                //Ищем поле "Наименование" контрагента
                cy.contains('.dynamic-input', ' Наименование ')
                    .find('[placeholder="Введите данные"]')
                    .click()
                    .clear()
                    .type(this.testData.UL.type["Наименование получателя или ИНН"].slice(0, -1) + 2)

                //Ищем поле "ИНН" контрагента
                cy.contains('.dynamic-input', ' ИНН ')
                    .find('[placeholder="Введите данные"]')
                    .click()
                    .clear()
                    .type(this.testData.UL.type["ИНН получателя"].slice(0, -1) + 2)

                //Ищем поле "КПП" контрагента
                cy.contains('.dynamic-input', ' КПП ')
                    .find('[placeholder="Введите данные"]')
                    .click()
                    .clear()
                    .type(this.testData.UL.type["КПП получателя"].slice(0, -1) + 2)

                //Ищем поле "Счет получателя"
                cy.contains('.dynamic-input', ' Номер счета ')
                    .find('[placeholder="Введите данные"]')
                    .click()
                    .clear()
                    .type(this.testData.UL.type["Счет получателя"].slice(0, -1) + 2)

                //Нажимаю кнопку "Сохранить"
                cy.contains('[data-qa="1658987981978"]', ' Сохранить').click()

                //Жду пока пропадет лоадер со страницы
                cy.get('.loader').should('not.exist')

                //ПРОВЕРЯЮ СОХРАНЕННЫЕ ДАННЫЕ
                //Ввожу ИНН ранее созданного контрагента в строку поиска
                cy.get('[data-qa="1658988187497"]')
                    .clear()
                    .type(this.testData.UL.type["Наименование получателя или ИНН"].slice(0, -1) + 2)
                //Нажимаю кебаб-меню / Изменить
                cy.clickKebabMenuСounterpart("Изменить")

                //Проверяю, что выбрана нужная вкладка
                cy.get('[data-qa="1657886535621"]')
                    .should('have.class', 'active')
                    .should('contain', ' Юридическое лицо ')

                cy.wait(500)

                //Проверяю поле "Наименование" контрагента
                cy.contains('.dynamic-input', ' Наименование ')
                    .find('[placeholder="Введите данные"]')
                    .invoke('val')
                    .then(sometext => expect(sometext).to.equal(this.testData.UL.type["Наименование получателя или ИНН"].slice(0, -1) + 2));

                //Проверяю поле "ИНН" контрагента
                cy.contains('.dynamic-input', ' ИНН ')
                    .find('[placeholder="Введите данные"]')
                    .invoke('val')
                    .then(sometext => expect(sometext).to.equal(this.testData.UL.type["ИНН получателя"].slice(0, -1) + 2));

                //Проверяю поле "КПП" контрагента
                cy.contains('.dynamic-input', ' КПП ')
                    .find('[placeholder="Введите данные"]')
                    .invoke('val')
                    .then(sometext => expect(sometext).to.equal(this.testData.UL.type["КПП получателя"].slice(0, -1) + 2));

                cy.wait(500)

                //Проверяю поле "Счет получателя"
                cy.modificationAccNumberSpace(this.testData.UL.type["Счет получателя"].slice(0, -1) + 2)
                    .then((modifiedNumber) => {
                        cy.contains('.dynamic-input', ' Номер счета ')
                            .find('[placeholder="Введите данные"]')
                            .invoke('val')
                            .then(sometext => expect(sometext).to.equal(modifiedNumber));
                    });
            })
            it('#3797. Контрагент ФЛ с ИНН', function () {
                //Ввожу ИНН ранее созданного контрагента в строку поиска
                cy.get('[data-qa="1658988187497"]')
                    .clear()
                    .type(this.testData.FL_With_INN.type["Наименование получателя или ИНН"])
                //Перехожу "Контрагенты/Просмотр"
                cy.get('[data-qa="16578861119580"]').click()
                //Нажимаю кебаб-меню / Изменить
                cy.clickKebabMenuDetails("Изменить")
                //Проверяю, что выбрана нужная вкладка
                cy.get('[data-qa="1657886538322"]')
                    .should('have.class', 'active')
                    .should('contain', ' Физическое лицо ')

                //Проверяю поле "Наименование" контрагента
                cy.contains('.dynamic-input', ' Наименование ')
                    .find('[placeholder="Введите данные"]')
                    .invoke('val')
                    .then(sometext => expect(sometext).to.equal(this.testData.FL_With_INN.type["Наименование получателя или ИНН"]));

                //Проверяю поле "ИНН" контрагента
                cy.contains('.dynamic-input', ' ИНН ')
                    .find('[placeholder="Введите данные"]')
                    .invoke('val')
                    .then(sometext => expect(sometext).to.equal(this.testData.FL_With_INN.type["ИНН получателя"]));

                // //Проверяю поле "КПП" контрагента
                // cy.contains('.dynamic-input', ' КПП ')
                //     .find('[placeholder="Введите данные"]')
                //     .invoke('val')
                //     .then(sometext => expect(sometext).to.equal(this.testData.FL_With_INN.type["КПП получателя"]));

                //Проверяю поле "БИК банка получателя" контрагента
                cy.contains('.dynamic-input', ' БИК банка получателя ')
                    .find('[placeholder="Введите данные"]')
                    .invoke('val')
                    .then(sometext => expect(sometext).to.equal(this.testData.FL_With_INN.type["БИК банка получателя"]));

                //Проверяю поле "Счет получателя"
                cy.modificationAccNumberSpace(this.testData.FL_With_INN.type["Счет получателя"])
                    .then((modifiedNumber) => {
                        cy.contains('.dynamic-input', ' Номер счета ')
                            .find('[placeholder="Введите данные"]')
                            .invoke('val')
                            .then(sometext => expect(sometext).to.equal(modifiedNumber));
                    });
                //ВВОЖУ НОВЫЕ ДАННЫЕ В ПОЛЯ
                //Ищем поле "Наименование" контрагента
                cy.contains('.dynamic-input', ' Наименование ')
                    .find('[placeholder="Введите данные"]')
                    .click()
                    .clear()
                    .type(this.testData.FL_With_INN.type["Наименование получателя или ИНН"].slice(0, -1) + 2)

                //Ищем поле "ИНН" контрагента
                cy.contains('.dynamic-input', ' ИНН ')
                    .find('[placeholder="Введите данные"]')
                    .click()
                    .clear()
                    .type(this.testData.FL_With_INN.type["ИНН получателя"].slice(0, -1) + 2)

                // //Ищем поле "КПП" контрагента
                // cy.contains('.dynamic-input', ' КПП ')
                //     .find('[placeholder="Введите данные"]')
                //     .click()
                //     .clear()
                //     .type(this.testData.FL_With_INN.type["КПП получателя"].slice(0, -1) + 2)

                //Ищем поле "Счет получателя"
                cy.contains('.dynamic-input', ' Номер счета ')
                    .find('[placeholder="Введите данные"]')
                    .click()
                    .clear()
                    .type(this.testData.FL_With_INN.type["Счет получателя"].slice(0, -1) + 2)

                //Нажимаю кнопку "Сохранить"
                cy.contains('[data-qa="1658987981978"]', ' Сохранить').click()

                //Жду пока пропадет лоадер со страницы
                cy.get('.loader').should('not.exist')

                //ПРОВЕРЯЮ СОХРАНЕННЫЕ ДАННЫЕ
                //Ввожу ИНН ранее созданного контрагента в строку поиска
                cy.get('[data-qa="1658988187497"]')
                    .clear()
                    .type(this.testData.FL_With_INN.type["Наименование получателя или ИНН"].slice(0, -1) + 2)
                //Нажимаю кебаб-меню / Изменить
                cy.clickKebabMenuСounterpart("Изменить")

                //Проверяю, что выбрана нужная вкладка
                cy.get('[data-qa="1657886538322"]')
                    .should('have.class', 'active')
                    .should('contain', ' Физическое лицо ')

                cy.wait(500)

                //Проверяю поле "Наименование" контрагента
                cy.contains('.dynamic-input', ' Наименование ')
                    .find('[placeholder="Введите данные"]')
                    .invoke('val')
                    .then(sometext => expect(sometext).to.equal(this.testData.FL_With_INN.type["Наименование получателя или ИНН"].slice(0, -1) + 2));

                //Проверяю поле "ИНН" контрагента
                cy.contains('.dynamic-input', ' ИНН ')
                    .find('[placeholder="Введите данные"]')
                    .invoke('val')
                    .then(sometext => expect(sometext).to.equal(this.testData.FL_With_INN.type["ИНН получателя"].slice(0, -1) + 2));

                // //Проверяю поле "КПП" контрагента
                // cy.contains('.dynamic-input', ' КПП ')
                //     .find('[placeholder="Введите данные"]')
                //     .invoke('val')
                //     .then(sometext => expect(sometext).to.equal(this.testData.FL_With_INN.type["КПП получателя"].slice(0, -1) + 2));

                cy.wait(500)

                //Проверяю поле "Счет получателя"
                cy.modificationAccNumberSpace(this.testData.FL_With_INN.type["Счет получателя"].slice(0, -1) + 2)
                    .then((modifiedNumber) => {
                        cy.contains('.dynamic-input', ' Номер счета ')
                            .find('[placeholder="Введите данные"]')
                            .invoke('val')
                            .then(sometext => expect(sometext).to.equal(modifiedNumber));
                    });
            })
            it('#3798. Контрагент ФЛ без ИНН', function () {
                //Ввожу ИНН ранее созданного контрагента в строку поиска
                cy.get('[data-qa="1658988187497"]')
                    .clear()
                    .type(this.testData.FL_Without_INN.type["Наименование получателя или ИНН"])
                //Нажимаю кебаб-меню / Изменить
                cy.clickKebabMenuСounterpart("Изменить")

                //Проверяю, что выбрана нужная вкладка
                cy.get('[data-qa="1657886538322"]')
                    .should('have.class', 'active')
                    .should('contain', ' Физическое лицо ')

                //Проверяю поле "Наименование" контрагента
                cy.contains('.dynamic-input', ' Наименование ')
                    .find('[placeholder="Введите данные"]')
                    .invoke('val')
                    .then(sometext => expect(sometext).to.equal(this.testData.FL_Without_INN.type["Наименование получателя или ИНН"]));

                // //Проверяю поле "ИНН" контрагента
                // cy.contains('.dynamic-input', ' ИНН ')
                //     .find('[placeholder="Введите данные"]')
                //     .invoke('val')
                //     .then(sometext => expect(sometext).to.equal(this.testData.FL_Without_INN.type["ИНН получателя"]));

                // //Проверяю поле "КПП" контрагента
                // cy.contains('.dynamic-input', ' КПП ')
                //     .find('[placeholder="Введите данные"]')
                //     .invoke('val')
                //     .then(sometext => expect(sometext).to.equal(this.testData.FL_With_INN.type["КПП получателя"]));

                //Проверяю поле "БИК банка получателя" контрагента
                cy.contains('.dynamic-input', ' БИК банка получателя ')
                    .find('[placeholder="Введите данные"]')
                    .invoke('val')
                    .then(sometext => expect(sometext).to.equal(this.testData.FL_Without_INN.type["БИК банка получателя"]));

                //Проверяю поле "Счет получателя"
                cy.modificationAccNumberSpace(this.testData.FL_Without_INN.type["Счет получателя"])
                    .then((modifiedNumber) => {
                        cy.contains('.dynamic-input', ' Номер счета ')
                            .find('[placeholder="Введите данные"]')
                            .invoke('val')
                            .then(sometext => expect(sometext).to.equal(modifiedNumber));
                    });
                //ВВОЖУ НОВЫЕ ДАННЫЕ В ПОЛЯ
                //Ищем поле "Наименование" контрагента
                cy.contains('.dynamic-input', ' Наименование ')
                    .find('[placeholder="Введите данные"]')
                    .click()
                    .clear()
                    .type(this.testData.FL_Without_INN.type["Наименование получателя или ИНН"].slice(0, -1) + 2)

                // //Ищем поле "ИНН" контрагента
                // cy.contains('.dynamic-input', ' ИНН ')
                //     .find('[placeholder="Введите данные"]')
                //     .click()
                //     .clear()
                //     .type(this.testData.FL_Without_INN.type["ИНН получателя"].slice(0, -1) + 2)

                // //Ищем поле "КПП" контрагента
                // cy.contains('.dynamic-input', ' КПП ')
                //     .find('[placeholder="Введите данные"]')
                //     .click()
                //     .clear()
                //     .type(this.testData.FL_With_INN.type["КПП получателя"].slice(0, -1) + 2)

                //Ищем поле "Счет получателя"
                cy.contains('.dynamic-input', ' Номер счета ')
                    .find('[placeholder="Введите данные"]')
                    .click()
                    .clear()
                    .type(this.testData.FL_Without_INN.type["Счет получателя"].slice(0, -1) + 2)

                //Нажимаю кнопку "Сохранить"
                cy.contains('[data-qa="1658987981978"]', ' Сохранить').click()

                //Жду пока пропадет лоадер со страницы
                cy.get('.loader').should('not.exist')

                //ПРОВЕРЯЮ СОХРАНЕННЫЕ ДАННЫЕ
                //Ввожу ИНН ранее созданного контрагента в строку поиска
                cy.get('[data-qa="1658988187497"]')
                    .clear()
                    .type(this.testData.FL_Without_INN.type["Наименование получателя или ИНН"].slice(0, -1) + 2)
                //Нажимаю кебаб-меню / Изменить
                cy.clickKebabMenuСounterpart("Изменить")

                //Проверяю, что выбрана нужная вкладка
                cy.get('[data-qa="1657886538322"]')
                    .should('have.class', 'active')
                    .should('contain', ' Физическое лицо ')

                cy.wait(500)

                //Проверяю поле "Наименование" контрагента
                cy.contains('.dynamic-input', ' Наименование ')
                    .find('[placeholder="Введите данные"]')
                    .invoke('val')
                    .then(sometext => expect(sometext).to.equal(this.testData.FL_Without_INN.type["Наименование получателя или ИНН"].slice(0, -1) + 2));

                // //Проверяю поле "ИНН" контрагента
                // cy.contains('.dynamic-input', ' ИНН ')
                //     .find('[placeholder="Введите данные"]')
                //     .invoke('val')
                //     .then(sometext => expect(sometext).to.equal(this.testData.FL_Without_INN.type["ИНН получателя"].slice(0, -1) + 2));

                // //Проверяю поле "КПП" контрагента
                // cy.contains('.dynamic-input', ' КПП ')
                //     .find('[placeholder="Введите данные"]')
                //     .invoke('val')
                //     .then(sometext => expect(sometext).to.equal(this.testData.FL_With_INN.type["КПП получателя"].slice(0, -1) + 2));

                cy.wait(500)

                //Проверяю поле "Счет получателя"
                cy.modificationAccNumberSpace(this.testData.FL_Without_INN.type["Счет получателя"].slice(0, -1) + 2)
                    .then((modifiedNumber) => {
                        cy.contains('.dynamic-input', ' Номер счета ')
                            .find('[placeholder="Введите данные"]')
                            .invoke('val')
                            .then(sometext => expect(sometext).to.equal(modifiedNumber));
                    });
            })
            it('#3799. Контрагент ИП', function () {
                //Ввожу ИНН ранее созданного контрагента в строку поиска
                cy.get('[data-qa="1658988187497"]')
                    .clear()
                    .type(this.testData.IP.type["Наименование получателя или ИНН"])
                //Нажимаю кебаб-меню / Изменить
                cy.clickKebabMenuСounterpart("Изменить")

                //Проверяю, что выбрана нужная вкладка
                cy.get('[data-qa="1657886543298"]')
                    .should('have.class', 'active')
                    .should('contain', ' ИП ')

                //Проверяю поле "Наименование" контрагента
                cy.contains('.dynamic-input', ' Наименование ')
                    .find('[placeholder="Введите данные"]')
                    .invoke('val')
                    .then(sometext => expect(sometext).to.equal(this.testData.IP.type["Наименование получателя или ИНН"]));

                //Проверяю поле "ИНН" контрагента
                cy.contains('.dynamic-input', ' ИНН ')
                    .find('[placeholder="Введите данные"]')
                    .invoke('val')
                    .then(sometext => expect(sometext).to.equal(this.testData.IP.type["ИНН получателя"]));

                // //Проверяю поле "КПП" контрагента
                // cy.contains('.dynamic-input', ' КПП ')
                //     .find('[placeholder="Введите данные"]')
                //     .invoke('val')
                //     .then(sometext => expect(sometext).to.equal(this.testData.IP.type["КПП получателя"]));

                //Проверяю поле "БИК банка получателя" контрагента
                cy.contains('.dynamic-input', ' БИК банка получателя ')
                    .find('[placeholder="Введите данные"]')
                    .invoke('val')
                    .then(sometext => expect(sometext).to.equal(this.testData.IP.type["БИК банка получателя"]));

                //Проверяю поле "Счет получателя"
                cy.modificationAccNumberSpace(this.testData.IP.type["Счет получателя"])
                    .then((modifiedNumber) => {
                        cy.contains('.dynamic-input', ' Номер счета ')
                            .find('[placeholder="Введите данные"]')
                            .invoke('val')
                            .then(sometext => expect(sometext).to.equal(modifiedNumber));
                    });
                //ВВОЖУ НОВЫЕ ДАННЫЕ В ПОЛЯ
                //Ищем поле "Наименование" контрагента
                cy.contains('.dynamic-input', ' Наименование ')
                    .find('[placeholder="Введите данные"]')
                    .click()
                    .clear()
                    .type(this.testData.IP.type["Наименование получателя или ИНН"].slice(0, -1) + 2)

                //Ищем поле "ИНН" контрагента
                cy.contains('.dynamic-input', ' ИНН ')
                    .find('[placeholder="Введите данные"]')
                    .click()
                    .clear()
                    .type(this.testData.IP.type["ИНН получателя"].slice(0, -1) + 2)

                // //Ищем поле "КПП" контрагента
                // cy.contains('.dynamic-input', ' КПП ')
                //     .find('[placeholder="Введите данные"]')
                //     .click()
                //     .clear()
                //     .type(this.testData.IP.type["КПП получателя"].slice(0, -1) + 2)

                //Ищем поле "Счет получателя"
                cy.contains('.dynamic-input', ' Номер счета ')
                    .find('[placeholder="Введите данные"]')
                    .click()
                    .clear()
                    .type(this.testData.IP.type["Счет получателя"].slice(0, -1) + 2)

                //Нажимаю кнопку "Сохранить"
                cy.contains('[data-qa="1658987981978"]', ' Сохранить').click()

                //Жду пока пропадет лоадер со страницы
                cy.get('.loader').should('not.exist')

                //ПРОВЕРЯЮ СОХРАНЕННЫЕ ДАННЫЕ
                //Ввожу ИНН ранее созданного контрагента в строку поиска
                cy.get('[data-qa="1658988187497"]')
                    .clear()
                    .type(this.testData.IP.type["Наименование получателя или ИНН"].slice(0, -1) + 2)
                //Нажимаю кебаб-меню / Изменить
                cy.clickKebabMenuСounterpart("Изменить")

                //Проверяю, что выбрана нужная вкладка
                cy.get('[data-qa="1657886543298"]')
                    .should('have.class', 'active')
                    .should('contain', ' ИП ')

                cy.wait(500)

                //Проверяю поле "Наименование" контрагента
                cy.contains('.dynamic-input', ' Наименование ')
                    .find('[placeholder="Введите данные"]')
                    .invoke('val')
                    .then(sometext => expect(sometext).to.equal(this.testData.IP.type["Наименование получателя или ИНН"].slice(0, -1) + 2));

                //Проверяю поле "ИНН" контрагента
                cy.contains('.dynamic-input', ' ИНН ')
                    .find('[placeholder="Введите данные"]')
                    .invoke('val')
                    .then(sometext => expect(sometext).to.equal(this.testData.IP.type["ИНН получателя"].slice(0, -1) + 2));

                // //Проверяю поле "КПП" контрагента
                // cy.contains('.dynamic-input', ' КПП ')
                //     .find('[placeholder="Введите данные"]')
                //     .invoke('val')
                //     .then(sometext => expect(sometext).to.equal(this.testData.IP.type["КПП получателя"].slice(0, -1) + 2));

                cy.wait(500)

                //Проверяю поле "Счет получателя"
                cy.modificationAccNumberSpace(this.testData.IP.type["Счет получателя"].slice(0, -1) + 2)
                    .then((modifiedNumber) => {
                        cy.contains('.dynamic-input', ' Номер счета ')
                            .find('[placeholder="Введите данные"]')
                            .invoke('val')
                            .then(sometext => expect(sometext).to.equal(modifiedNumber));
                    });
            })
            it('#3800. Контрагент НАЛОГ', function () {
                //Ввожу ИНН ранее созданного контрагента в строку поиска
                cy.get('[data-qa="1658988187497"]')
                    .clear()
                    .type(this.testData.NALOG.type["Наименование получателя или ИНН"])
                //Нажимаю кебаб-меню / Изменить
                cy.clickKebabMenuСounterpart("Изменить")

                //Проверяю, что выбрана нужная вкладка
                cy.get('[data-qa="1657886546830"]')
                    .should('have.class', 'active')
                    .should('contain', ' Налоговый/Бюджетный ')

                //Проверяю поле "Наименование" контрагента
                cy.contains('.dynamic-input', ' Наименование ')
                    .find('[placeholder="Введите данные"]')
                    .invoke('val')
                    .then(sometext => expect(sometext).to.equal(this.testData.NALOG.type["Наименование получателя или ИНН"]));

                //Проверяю поле "ИНН" контрагента
                cy.contains('.dynamic-input', ' ИНН ')
                    .find('[placeholder="Введите данные"]')
                    .invoke('val')
                    .then(sometext => expect(sometext).to.equal(this.testData.NALOG.type["ИНН получателя"]));

                //Проверяю поле "КПП" контрагента
                cy.contains('.dynamic-input', ' КПП ')
                    .find('[placeholder="Введите данные"]')
                    .invoke('val')
                    .then(sometext => expect(sometext).to.equal(this.testData.NALOG.type["КПП получателя"]));

                //Проверяю поле "БИК банка получателя" контрагента
                cy.contains('.dynamic-input', ' БИК банка получателя ')
                    .find('[placeholder="Введите данные"]')
                    .invoke('val')
                    .then(sometext => expect(sometext).to.equal(this.testData.NALOG.type["БИК банка получателя"]));

                //Проверяю поле "Счет получателя"
                cy.modificationAccNumberSpace(this.testData.NALOG.type["Счет получателя"])
                    .then((modifiedNumber) => {
                        cy.contains('.dynamic-input', ' Номер счета ')
                            .find('[placeholder="Введите данные"]')
                            .invoke('val')
                            .then(sometext => expect(sometext).to.equal(modifiedNumber));
                    });
                //ВВОЖУ НОВЫЕ ДАННЫЕ В ПОЛЯ
                //Ищем поле "Наименование" контрагента
                cy.contains('.dynamic-input', ' Наименование ')
                    .find('[placeholder="Введите данные"]')
                    .click()
                    .clear()
                    .type(this.testData.NALOG.type["Наименование получателя или ИНН"].slice(0, -1) + 2)

                //Ищем поле "ИНН" контрагента
                cy.contains('.dynamic-input', ' ИНН ')
                    .find('[placeholder="Введите данные"]')
                    .click()
                    .clear()
                    .type(this.testData.NALOG.type["ИНН получателя"].slice(0, -1) + 2)

                //Ищем поле "КПП" контрагента
                cy.contains('.dynamic-input', ' КПП ')
                    .find('[placeholder="Введите данные"]')
                    .click()
                    .clear()
                    .type(this.testData.NALOG.type["КПП получателя"].slice(0, -1) + 2)

                //Ищем поле "Счет получателя"
                cy.contains('.dynamic-input', ' Номер счета ')
                    .find('[placeholder="Введите данные"]')
                    .click()
                    .clear()
                    .type(this.testData.NALOG.type["Счет получателя"].slice(0, -1) + 2)

                //Нажимаю кнопку "Сохранить"
                cy.contains('[data-qa="1658987981978"]', ' Сохранить').click()

                //Жду пока пропадет лоадер со страницы
                cy.get('.loader').should('not.exist')

                //ПРОВЕРЯЮ СОХРАНЕННЫЕ ДАННЫЕ
                //Ввожу ИНН ранее созданного контрагента в строку поиска
                cy.get('[data-qa="1658988187497"]')
                    .clear()
                    .type(this.testData.NALOG.type["Наименование получателя или ИНН"].slice(0, -1) + 2)
                //Нажимаю кебаб-меню / Изменить
                cy.clickKebabMenuСounterpart("Изменить")

                //Проверяю, что выбрана нужная вкладка
                cy.get('[data-qa="1657886546830"]')
                    .should('have.class', 'active')
                    .should('contain', ' Налоговый/Бюджетный ')

                cy.wait(500)

                //Проверяю поле "Наименование" контрагента
                cy.contains('.dynamic-input', ' Наименование ')
                    .find('[placeholder="Введите данные"]')
                    .invoke('val')
                    .then(sometext => expect(sometext).to.equal(this.testData.NALOG.type["Наименование получателя или ИНН"].slice(0, -1) + 2));

                //Проверяю поле "ИНН" контрагента
                cy.contains('.dynamic-input', ' ИНН ')
                    .find('[placeholder="Введите данные"]')
                    .invoke('val')
                    .then(sometext => expect(sometext).to.equal(this.testData.NALOG.type["ИНН получателя"].slice(0, -1) + 2));

                //Проверяю поле "КПП" контрагента
                cy.contains('.dynamic-input', ' КПП ')
                    .find('[placeholder="Введите данные"]')
                    .invoke('val')
                    .then(sometext => expect(sometext).to.equal(this.testData.NALOG.type["КПП получателя"].slice(0, -1) + 2));

                cy.wait(500)

                //Проверяю поле "Счет получателя"
                cy.modificationAccNumberSpace(this.testData.NALOG.type["Счет получателя"].slice(0, -1) + 2)
                    .then((modifiedNumber) => {
                        cy.contains('.dynamic-input', ' Номер счета ')
                            .find('[placeholder="Введите данные"]')
                            .invoke('val')
                            .then(sometext => expect(sometext).to.equal(modifiedNumber));
                    });
            })
            it('#3801. Контрагент ТАМОЖ', function () {
                //Ввожу ИНН ранее созданного контрагента в строку поиска
                cy.get('[data-qa="1658988187497"]')
                    .clear()
                    .type(this.testData.TAMOZH.type["Наименование получателя или ИНН"])
                //Нажимаю кебаб-меню / Изменить
                cy.clickKebabMenuСounterpart("Изменить")

                //Проверяю, что выбрана нужная вкладка
                cy.get('[data-qa="1657886550146"]')
                    .should('have.class', 'active')
                    .should('contain', ' Таможенный ')

                //Проверяю поле "Наименование" контрагента
                cy.contains('.dynamic-input', ' Наименование ')
                    .find('[placeholder="Введите данные"]')
                    .invoke('val')
                    .then(sometext => expect(sometext).to.equal(this.testData.TAMOZH.type["Наименование получателя или ИНН"]));

                //Проверяю поле "ИНН" контрагента
                cy.contains('.dynamic-input', ' ИНН ')
                    .find('[placeholder="Введите данные"]')
                    .invoke('val')
                    .then(sometext => expect(sometext).to.equal(this.testData.TAMOZH.type["ИНН получателя"]));

                //Проверяю поле "КПП" контрагента
                cy.contains('.dynamic-input', ' КПП ')
                    .find('[placeholder="Введите данные"]')
                    .invoke('val')
                    .then(sometext => expect(sometext).to.equal(this.testData.TAMOZH.type["КПП получателя"]));

                //Проверяю поле "БИК банка получателя" контрагента
                cy.contains('.dynamic-input', ' БИК банка получателя ')
                    .find('[placeholder="Введите данные"]')
                    .invoke('val')
                    .then(sometext => expect(sometext).to.equal(this.testData.TAMOZH.type["БИК банка получателя"]));

                //Проверяю поле "Счет получателя"
                cy.modificationAccNumberSpace(this.testData.TAMOZH.type["Счет получателя"])
                    .then((modifiedNumber) => {
                        cy.contains('.dynamic-input', ' Номер счета ')
                            .find('[placeholder="Введите данные"]')
                            .invoke('val')
                            .then(sometext => expect(sometext).to.equal(modifiedNumber));
                    });
                //ВВОЖУ НОВЫЕ ДАННЫЕ В ПОЛЯ
                //Ищем поле "Наименование" контрагента
                cy.contains('.dynamic-input', ' Наименование ')
                    .find('[placeholder="Введите данные"]')
                    .click()
                    .clear()
                    .type(this.testData.TAMOZH.type["Наименование получателя или ИНН"].slice(0, -1) + 2)

                //Ищем поле "ИНН" контрагента
                cy.contains('.dynamic-input', ' ИНН ')
                    .find('[placeholder="Введите данные"]')
                    .click()
                    .clear()
                    .type(this.testData.TAMOZH.type["ИНН получателя"].slice(0, -1) + 2)

                //Ищем поле "КПП" контрагента
                cy.contains('.dynamic-input', ' КПП ')
                    .find('[placeholder="Введите данные"]')
                    .click()
                    .clear()
                    .type(this.testData.TAMOZH.type["КПП получателя"].slice(0, -1) + 2)

                //Ищем поле "Счет получателя"
                cy.contains('.dynamic-input', ' Номер счета ')
                    .find('[placeholder="Введите данные"]')
                    .click()
                    .clear()
                    .type(this.testData.TAMOZH.type["Счет получателя"].slice(0, -1) + 2)

                //Нажимаю кнопку "Сохранить"
                cy.contains('[data-qa="1658987981978"]', ' Сохранить').click()

                //Жду пока пропадет лоадер со страницы
                cy.get('.loader').should('not.exist')

                //ПРОВЕРЯЮ СОХРАНЕННЫЕ ДАННЫЕ
                //Ввожу ИНН ранее созданного контрагента в строку поиска
                cy.get('[data-qa="1658988187497"]')
                    .clear()
                    .type(this.testData.TAMOZH.type["Наименование получателя или ИНН"].slice(0, -1) + 2)
                //Нажимаю кебаб-меню / Изменить
                cy.clickKebabMenuСounterpart("Изменить")

                //Проверяю, что выбрана нужная вкладка
                cy.get('[data-qa="1657886550146"]')
                    .should('have.class', 'active')
                    .should('contain', ' Таможенный ')

                cy.wait(500)

                //Проверяю поле "Наименование" контрагента
                cy.contains('.dynamic-input', ' Наименование ')
                    .find('[placeholder="Введите данные"]')
                    .invoke('val')
                    .then(sometext => expect(sometext).to.equal(this.testData.TAMOZH.type["Наименование получателя или ИНН"].slice(0, -1) + 2));

                //Проверяю поле "ИНН" контрагента
                cy.contains('.dynamic-input', ' ИНН ')
                    .find('[placeholder="Введите данные"]')
                    .invoke('val')
                    .then(sometext => expect(sometext).to.equal(this.testData.TAMOZH.type["ИНН получателя"].slice(0, -1) + 2));

                //Проверяю поле "КПП" контрагента
                cy.contains('.dynamic-input', ' КПП ')
                    .find('[placeholder="Введите данные"]')
                    .invoke('val')
                    .then(sometext => expect(sometext).to.equal(this.testData.TAMOZH.type["КПП получателя"].slice(0, -1) + 2));

                cy.wait(500)

                //Проверяю поле "Счет получателя"
                cy.modificationAccNumberSpace(this.testData.TAMOZH.type["Счет получателя"].slice(0, -1) + 2)
                    .then((modifiedNumber) => {
                        cy.contains('.dynamic-input', ' Номер счета ')
                            .find('[placeholder="Введите данные"]')
                            .invoke('val')
                            .then(sometext => expect(sometext).to.equal(modifiedNumber));
                    });
            })
        })
        context('Меню действий "Изменить" - раздел "Контрагенты / Просмотр"', function () {
            it('#3810. Контрагент ЮЛ', function () {
                //Ввожу ИНН ранее созданного контрагента в строку поиска
                cy.get('[data-qa="1658988187497"]')
                    .clear()
                    .type(this.testData.UL.type["Наименование получателя или ИНН"])
                //Перехожу "Контрагенты/Просмотр"
                cy.get('[data-qa="16578861119580"]').click()
                //Нажимаю кебаб-меню / Изменить
                cy.clickKebabMenuDetails("Изменить")
                //Проверяю, что выбрана нужная вкладка
                cy.get('[data-qa="1657886535621"]')
                    .should('have.class', 'active')
                    .should('contain', ' Юридическое лицо ')

                //Проверяю поле "Наименование" контрагента
                cy.contains('.dynamic-input', ' Наименование ')
                    .find('[placeholder="Введите данные"]')
                    .invoke('val')
                    .then(sometext => expect(sometext).to.equal(this.testData.UL.type["Наименование получателя или ИНН"]));

                //Проверяю поле "ИНН" контрагента
                cy.contains('.dynamic-input', ' ИНН ')
                    .find('[placeholder="Введите данные"]')
                    .invoke('val')
                    .then(sometext => expect(sometext).to.equal(this.testData.UL.type["ИНН получателя"]));

                //Проверяю поле "КПП" контрагента
                cy.contains('.dynamic-input', ' КПП ')
                    .find('[placeholder="Введите данные"]')
                    .invoke('val')
                    .then(sometext => expect(sometext).to.equal(this.testData.UL.type["КПП получателя"]));

                //Проверяю поле "БИК банка получателя" контрагента
                cy.contains('.dynamic-input', ' БИК банка получателя ')
                    .find('[placeholder="Введите данные"]')
                    .invoke('val')
                    .then(sometext => expect(sometext).to.equal(this.testData.UL.type["БИК банка получателя"]));

                //Проверяю поле "Счет получателя"
                cy.modificationAccNumberSpace(this.testData.UL.type["Счет получателя"])
                    .then((modifiedNumber) => {
                        cy.contains('.dynamic-input', ' Номер счета ')
                            .find('[placeholder="Введите данные"]')
                            .invoke('val')
                            .then(sometext => expect(sometext).to.equal(modifiedNumber));
                    });
                //ВВОЖУ НОВЫЕ ДАННЫЕ В ПОЛЯ
                //Ищем поле "Наименование" контрагента
                cy.contains('.dynamic-input', ' Наименование ')
                    .find('[placeholder="Введите данные"]')
                    .click()
                    .clear()
                    .type(this.testData.UL.type["Наименование получателя или ИНН"].slice(0, -1) + 2)

                //Ищем поле "ИНН" контрагента
                cy.contains('.dynamic-input', ' ИНН ')
                    .find('[placeholder="Введите данные"]')
                    .click()
                    .clear()
                    .type(this.testData.UL.type["ИНН получателя"].slice(0, -1) + 2)

                //Ищем поле "КПП" контрагента
                cy.contains('.dynamic-input', ' КПП ')
                    .find('[placeholder="Введите данные"]')
                    .click()
                    .clear()
                    .type(this.testData.UL.type["КПП получателя"].slice(0, -1) + 2)

                //Ищем поле "Счет получателя"
                cy.contains('.dynamic-input', ' Номер счета ')
                    .find('[placeholder="Введите данные"]')
                    .click()
                    .clear()
                    .type(this.testData.UL.type["Счет получателя"].slice(0, -1) + 2)

                //Нажимаю кнопку "Сохранить"
                cy.contains('[data-qa="1658987981978"]', ' Сохранить').click()

                //Жду пока пропадет лоадер со страницы
                cy.get('.loader').should('not.exist')

                //ПРОВЕРЯЮ СОХРАНЕННЫЕ ДАННЫЕ
                //Ввожу ИНН ранее созданного контрагента в строку поиска
                cy.get('[data-qa="1658988187497"]')
                    .clear()
                    .type(this.testData.UL.type["Наименование получателя или ИНН"].slice(0, -1) + 2)
                //Нажимаю кебаб-меню / Изменить
                cy.clickKebabMenuСounterpart("Изменить")

                //Проверяю, что выбрана нужная вкладка
                cy.get('[data-qa="1657886535621"]')
                    .should('have.class', 'active')
                    .should('contain', ' Юридическое лицо ')

                cy.wait(500)

                //Проверяю поле "Наименование" контрагента
                cy.contains('.dynamic-input', ' Наименование ')
                    .find('[placeholder="Введите данные"]')
                    .invoke('val')
                    .then(sometext => expect(sometext).to.equal(this.testData.UL.type["Наименование получателя или ИНН"].slice(0, -1) + 2));

                //Проверяю поле "ИНН" контрагента
                cy.contains('.dynamic-input', ' ИНН ')
                    .find('[placeholder="Введите данные"]')
                    .invoke('val')
                    .then(sometext => expect(sometext).to.equal(this.testData.UL.type["ИНН получателя"].slice(0, -1) + 2));

                //Проверяю поле "КПП" контрагента
                cy.contains('.dynamic-input', ' КПП ')
                    .find('[placeholder="Введите данные"]')
                    .invoke('val')
                    .then(sometext => expect(sometext).to.equal(this.testData.UL.type["КПП получателя"].slice(0, -1) + 2));

                cy.wait(500)

                //Проверяю поле "Счет получателя"
                cy.modificationAccNumberSpace(this.testData.UL.type["Счет получателя"].slice(0, -1) + 2)
                    .then((modifiedNumber) => {
                        cy.contains('.dynamic-input', ' Номер счета ')
                            .find('[placeholder="Введите данные"]')
                            .invoke('val')
                            .then(sometext => expect(sometext).to.equal(modifiedNumber));
                    });
            })
            it('#3811. Контрагент ФЛ с ИНН', function () {
                //Ввожу ИНН ранее созданного контрагента в строку поиска
                cy.get('[data-qa="1658988187497"]')
                    .clear()
                    .type(this.testData.FL_With_INN.type["Наименование получателя или ИНН"])
                //Нажимаю кебаб-меню / Изменить
                cy.clickKebabMenuСounterpart("Изменить")

                //Проверяю, что выбрана нужная вкладка
                cy.get('[data-qa="1657886538322"]')
                    .should('have.class', 'active')
                    .should('contain', ' Физическое лицо ')

                //Проверяю поле "Наименование" контрагента
                cy.contains('.dynamic-input', ' Наименование ')
                    .find('[placeholder="Введите данные"]')
                    .invoke('val')
                    .then(sometext => expect(sometext).to.equal(this.testData.FL_With_INN.type["Наименование получателя или ИНН"]));

                //Проверяю поле "ИНН" контрагента
                cy.contains('.dynamic-input', ' ИНН ')
                    .find('[placeholder="Введите данные"]')
                    .invoke('val')
                    .then(sometext => expect(sometext).to.equal(this.testData.FL_With_INN.type["ИНН получателя"]));

                // //Проверяю поле "КПП" контрагента
                // cy.contains('.dynamic-input', ' КПП ')
                //     .find('[placeholder="Введите данные"]')
                //     .invoke('val')
                //     .then(sometext => expect(sometext).to.equal(this.testData.FL_With_INN.type["КПП получателя"]));

                //Проверяю поле "БИК банка получателя" контрагента
                cy.contains('.dynamic-input', ' БИК банка получателя ')
                    .find('[placeholder="Введите данные"]')
                    .invoke('val')
                    .then(sometext => expect(sometext).to.equal(this.testData.FL_With_INN.type["БИК банка получателя"]));

                //Проверяю поле "Счет получателя"
                cy.modificationAccNumberSpace(this.testData.FL_With_INN.type["Счет получателя"])
                    .then((modifiedNumber) => {
                        cy.contains('.dynamic-input', ' Номер счета ')
                            .find('[placeholder="Введите данные"]')
                            .invoke('val')
                            .then(sometext => expect(sometext).to.equal(modifiedNumber));
                    });
                //ВВОЖУ НОВЫЕ ДАННЫЕ В ПОЛЯ
                //Ищем поле "Наименование" контрагента
                cy.contains('.dynamic-input', ' Наименование ')
                    .find('[placeholder="Введите данные"]')
                    .click()
                    .clear()
                    .type(this.testData.FL_With_INN.type["Наименование получателя или ИНН"].slice(0, -1) + 2)

                //Ищем поле "ИНН" контрагента
                cy.contains('.dynamic-input', ' ИНН ')
                    .find('[placeholder="Введите данные"]')
                    .click()
                    .clear()
                    .type(this.testData.FL_With_INN.type["ИНН получателя"].slice(0, -1) + 2)

                // //Ищем поле "КПП" контрагента
                // cy.contains('.dynamic-input', ' КПП ')
                //     .find('[placeholder="Введите данные"]')
                //     .click()
                //     .clear()
                //     .type(this.testData.FL_With_INN.type["КПП получателя"].slice(0, -1) + 2)

                //Ищем поле "Счет получателя"
                cy.contains('.dynamic-input', ' Номер счета ')
                    .find('[placeholder="Введите данные"]')
                    .click()
                    .clear()
                    .type(this.testData.FL_With_INN.type["Счет получателя"].slice(0, -1) + 2)

                //Нажимаю кнопку "Сохранить"
                cy.contains('[data-qa="1658987981978"]', ' Сохранить').click()

                //Жду пока пропадет лоадер со страницы
                cy.get('.loader').should('not.exist')

                //ПРОВЕРЯЮ СОХРАНЕННЫЕ ДАННЫЕ
                //Ввожу ИНН ранее созданного контрагента в строку поиска
                cy.get('[data-qa="1658988187497"]')
                    .clear()
                    .type(this.testData.FL_With_INN.type["Наименование получателя или ИНН"].slice(0, -1) + 2)
                //Нажимаю кебаб-меню / Изменить
                cy.clickKebabMenuСounterpart("Изменить")

                //Проверяю, что выбрана нужная вкладка
                cy.get('[data-qa="1657886538322"]')
                    .should('have.class', 'active')
                    .should('contain', ' Физическое лицо ')

                cy.wait(500)

                //Проверяю поле "Наименование" контрагента
                cy.contains('.dynamic-input', ' Наименование ')
                    .find('[placeholder="Введите данные"]')
                    .invoke('val')
                    .then(sometext => expect(sometext).to.equal(this.testData.FL_With_INN.type["Наименование получателя или ИНН"].slice(0, -1) + 2));

                //Проверяю поле "ИНН" контрагента
                cy.contains('.dynamic-input', ' ИНН ')
                    .find('[placeholder="Введите данные"]')
                    .invoke('val')
                    .then(sometext => expect(sometext).to.equal(this.testData.FL_With_INN.type["ИНН получателя"].slice(0, -1) + 2));

                // //Проверяю поле "КПП" контрагента
                // cy.contains('.dynamic-input', ' КПП ')
                //     .find('[placeholder="Введите данные"]')
                //     .invoke('val')
                //     .then(sometext => expect(sometext).to.equal(this.testData.FL_With_INN.type["КПП получателя"].slice(0, -1) + 2));

                cy.wait(500)

                //Проверяю поле "Счет получателя"
                cy.modificationAccNumberSpace(this.testData.FL_With_INN.type["Счет получателя"].slice(0, -1) + 2)
                    .then((modifiedNumber) => {
                        cy.contains('.dynamic-input', ' Номер счета ')
                            .find('[placeholder="Введите данные"]')
                            .invoke('val')
                            .then(sometext => expect(sometext).to.equal(modifiedNumber));
                    });
            })
            it('#3812. Контрагент ФЛ без ИНН', function () {
                //Ввожу ИНН ранее созданного контрагента в строку поиска
                cy.get('[data-qa="1658988187497"]')
                    .clear()
                    .type(this.testData.FL_Without_INN.type["Наименование получателя или ИНН"])
                //Перехожу "Контрагенты/Просмотр"
                cy.get('[data-qa="16578861119580"]').click()
                //Нажимаю кебаб-меню / Изменить
                cy.clickKebabMenuDetails("Изменить")
                //Проверяю, что выбрана нужная вкладка
                cy.get('[data-qa="1657886538322"]')
                    .should('have.class', 'active')
                    .should('contain', ' Физическое лицо ')

                //Проверяю поле "Наименование" контрагента
                cy.contains('.dynamic-input', ' Наименование ')
                    .find('[placeholder="Введите данные"]')
                    .invoke('val')
                    .then(sometext => expect(sometext).to.equal(this.testData.FL_Without_INN.type["Наименование получателя или ИНН"]));

                // //Проверяю поле "ИНН" контрагента
                // cy.contains('.dynamic-input', ' ИНН ')
                //     .find('[placeholder="Введите данные"]')
                //     .invoke('val')
                //     .then(sometext => expect(sometext).to.equal(this.testData.FL_Without_INN.type["ИНН получателя"]));

                // //Проверяю поле "КПП" контрагента
                // cy.contains('.dynamic-input', ' КПП ')
                //     .find('[placeholder="Введите данные"]')
                //     .invoke('val')
                //     .then(sometext => expect(sometext).to.equal(this.testData.FL_With_INN.type["КПП получателя"]));

                //Проверяю поле "БИК банка получателя" контрагента
                cy.contains('.dynamic-input', ' БИК банка получателя ')
                    .find('[placeholder="Введите данные"]')
                    .invoke('val')
                    .then(sometext => expect(sometext).to.equal(this.testData.FL_Without_INN.type["БИК банка получателя"]));

                //Проверяю поле "Счет получателя"
                cy.modificationAccNumberSpace(this.testData.FL_Without_INN.type["Счет получателя"])
                    .then((modifiedNumber) => {
                        cy.contains('.dynamic-input', ' Номер счета ')
                            .find('[placeholder="Введите данные"]')
                            .invoke('val')
                            .then(sometext => expect(sometext).to.equal(modifiedNumber));
                    });
                //ВВОЖУ НОВЫЕ ДАННЫЕ В ПОЛЯ
                //Ищем поле "Наименование" контрагента
                cy.contains('.dynamic-input', ' Наименование ')
                    .find('[placeholder="Введите данные"]')
                    .click()
                    .clear()
                    .type(this.testData.FL_Without_INN.type["Наименование получателя или ИНН"].slice(0, -1) + 2)

                // //Ищем поле "ИНН" контрагента
                // cy.contains('.dynamic-input', ' ИНН ')
                //     .find('[placeholder="Введите данные"]')
                //     .click()
                //     .clear()
                //     .type(this.testData.FL_Without_INN.type["ИНН получателя"].slice(0, -1) + 2)

                // //Ищем поле "КПП" контрагента
                // cy.contains('.dynamic-input', ' КПП ')
                //     .find('[placeholder="Введите данные"]')
                //     .click()
                //     .clear()
                //     .type(this.testData.FL_With_INN.type["КПП получателя"].slice(0, -1) + 2)

                //Ищем поле "Счет получателя"
                cy.contains('.dynamic-input', ' Номер счета ')
                    .find('[placeholder="Введите данные"]')
                    .click()
                    .clear()
                    .type(this.testData.FL_Without_INN.type["Счет получателя"].slice(0, -1) + 2)

                //Нажимаю кнопку "Сохранить"
                cy.contains('[data-qa="1658987981978"]', ' Сохранить').click()

                //Жду пока пропадет лоадер со страницы
                cy.get('.loader').should('not.exist')

                //ПРОВЕРЯЮ СОХРАНЕННЫЕ ДАННЫЕ
                //Ввожу ИНН ранее созданного контрагента в строку поиска
                cy.get('[data-qa="1658988187497"]')
                    .clear()
                    .type(this.testData.FL_Without_INN.type["Наименование получателя или ИНН"].slice(0, -1) + 2)
                //Нажимаю кебаб-меню / Изменить
                cy.clickKebabMenuСounterpart("Изменить")

                //Проверяю, что выбрана нужная вкладка
                cy.get('[data-qa="1657886538322"]')
                    .should('have.class', 'active')
                    .should('contain', ' Физическое лицо ')

                cy.wait(500)

                //Проверяю поле "Наименование" контрагента
                cy.contains('.dynamic-input', ' Наименование ')
                    .find('[placeholder="Введите данные"]')
                    .invoke('val')
                    .then(sometext => expect(sometext).to.equal(this.testData.FL_Without_INN.type["Наименование получателя или ИНН"].slice(0, -1) + 2));

                // //Проверяю поле "ИНН" контрагента
                // cy.contains('.dynamic-input', ' ИНН ')
                //     .find('[placeholder="Введите данные"]')
                //     .invoke('val')
                //     .then(sometext => expect(sometext).to.equal(this.testData.FL_Without_INN.type["ИНН получателя"].slice(0, -1) + 2));

                // //Проверяю поле "КПП" контрагента
                // cy.contains('.dynamic-input', ' КПП ')
                //     .find('[placeholder="Введите данные"]')
                //     .invoke('val')
                //     .then(sometext => expect(sometext).to.equal(this.testData.FL_With_INN.type["КПП получателя"].slice(0, -1) + 2));

                cy.wait(500)

                //Проверяю поле "Счет получателя"
                cy.modificationAccNumberSpace(this.testData.FL_Without_INN.type["Счет получателя"].slice(0, -1) + 2)
                    .then((modifiedNumber) => {
                        cy.contains('.dynamic-input', ' Номер счета ')
                            .find('[placeholder="Введите данные"]')
                            .invoke('val')
                            .then(sometext => expect(sometext).to.equal(modifiedNumber));
                    });
            })
            it('#3813. Контрагент ИП', function () {
                //Ввожу ИНН ранее созданного контрагента в строку поиска
                cy.get('[data-qa="1658988187497"]')
                    .clear()
                    .type(this.testData.IP.type["Наименование получателя или ИНН"])
                //Перехожу "Контрагенты/Просмотр"
                cy.get('[data-qa="16578861119580"]').click()
                //Нажимаю кебаб-меню / Изменить
                cy.clickKebabMenuDetails("Изменить")
                //Проверяю, что выбрана нужная вкладка
                cy.get('[data-qa="1657886543298"]')
                    .should('have.class', 'active')
                    .should('contain', ' ИП ')

                //Проверяю поле "Наименование" контрагента
                cy.contains('.dynamic-input', ' Наименование ')
                    .find('[placeholder="Введите данные"]')
                    .invoke('val')
                    .then(sometext => expect(sometext).to.equal(this.testData.IP.type["Наименование получателя или ИНН"]));

                //Проверяю поле "ИНН" контрагента
                cy.contains('.dynamic-input', ' ИНН ')
                    .find('[placeholder="Введите данные"]')
                    .invoke('val')
                    .then(sometext => expect(sometext).to.equal(this.testData.IP.type["ИНН получателя"]));

                // //Проверяю поле "КПП" контрагента
                // cy.contains('.dynamic-input', ' КПП ')
                //     .find('[placeholder="Введите данные"]')
                //     .invoke('val')
                //     .then(sometext => expect(sometext).to.equal(this.testData.IP.type["КПП получателя"]));

                //Проверяю поле "БИК банка получателя" контрагента
                cy.contains('.dynamic-input', ' БИК банка получателя ')
                    .find('[placeholder="Введите данные"]')
                    .invoke('val')
                    .then(sometext => expect(sometext).to.equal(this.testData.IP.type["БИК банка получателя"]));

                //Проверяю поле "Счет получателя"
                cy.modificationAccNumberSpace(this.testData.IP.type["Счет получателя"])
                    .then((modifiedNumber) => {
                        cy.contains('.dynamic-input', ' Номер счета ')
                            .find('[placeholder="Введите данные"]')
                            .invoke('val')
                            .then(sometext => expect(sometext).to.equal(modifiedNumber));
                    });
                //ВВОЖУ НОВЫЕ ДАННЫЕ В ПОЛЯ
                //Ищем поле "Наименование" контрагента
                cy.contains('.dynamic-input', ' Наименование ')
                    .find('[placeholder="Введите данные"]')
                    .click()
                    .clear()
                    .type(this.testData.IP.type["Наименование получателя или ИНН"].slice(0, -1) + 2)

                //Ищем поле "ИНН" контрагента
                cy.contains('.dynamic-input', ' ИНН ')
                    .find('[placeholder="Введите данные"]')
                    .click()
                    .clear()
                    .type(this.testData.IP.type["ИНН получателя"].slice(0, -1) + 2)

                // //Ищем поле "КПП" контрагента
                // cy.contains('.dynamic-input', ' КПП ')
                //     .find('[placeholder="Введите данные"]')
                //     .click()
                //     .clear()
                //     .type(this.testData.IP.type["КПП получателя"].slice(0, -1) + 2)

                //Ищем поле "Счет получателя"
                cy.contains('.dynamic-input', ' Номер счета ')
                    .find('[placeholder="Введите данные"]')
                    .click()
                    .clear()
                    .type(this.testData.IP.type["Счет получателя"].slice(0, -1) + 2)

                //Нажимаю кнопку "Сохранить"
                cy.contains('[data-qa="1658987981978"]', ' Сохранить').click()

                //Жду пока пропадет лоадер со страницы
                cy.get('.loader').should('not.exist')

                //ПРОВЕРЯЮ СОХРАНЕННЫЕ ДАННЫЕ
                //Ввожу ИНН ранее созданного контрагента в строку поиска
                cy.get('[data-qa="1658988187497"]')
                    .clear()
                    .type(this.testData.IP.type["Наименование получателя или ИНН"].slice(0, -1) + 2)
                //Нажимаю кебаб-меню / Изменить
                cy.clickKebabMenuСounterpart("Изменить")

                //Проверяю, что выбрана нужная вкладка
                cy.get('[data-qa="1657886543298"]')
                    .should('have.class', 'active')
                    .should('contain', ' ИП ')

                cy.wait(500)

                //Проверяю поле "Наименование" контрагента
                cy.contains('.dynamic-input', ' Наименование ')
                    .find('[placeholder="Введите данные"]')
                    .invoke('val')
                    .then(sometext => expect(sometext).to.equal(this.testData.IP.type["Наименование получателя или ИНН"].slice(0, -1) + 2));

                //Проверяю поле "ИНН" контрагента
                cy.contains('.dynamic-input', ' ИНН ')
                    .find('[placeholder="Введите данные"]')
                    .invoke('val')
                    .then(sometext => expect(sometext).to.equal(this.testData.IP.type["ИНН получателя"].slice(0, -1) + 2));

                // //Проверяю поле "КПП" контрагента
                // cy.contains('.dynamic-input', ' КПП ')
                //     .find('[placeholder="Введите данные"]')
                //     .invoke('val')
                //     .then(sometext => expect(sometext).to.equal(this.testData.IP.type["КПП получателя"].slice(0, -1) + 2));

                cy.wait(500)

                //Проверяю поле "Счет получателя"
                cy.modificationAccNumberSpace(this.testData.IP.type["Счет получателя"].slice(0, -1) + 2)
                    .then((modifiedNumber) => {
                        cy.contains('.dynamic-input', ' Номер счета ')
                            .find('[placeholder="Введите данные"]')
                            .invoke('val')
                            .then(sometext => expect(sometext).to.equal(modifiedNumber));
                    });
            })
            it('#3814. Контрагент НАЛОГ', function () {
                //Ввожу ИНН ранее созданного контрагента в строку поиска
                cy.get('[data-qa="1658988187497"]')
                    .clear()
                    .type(this.testData.NALOG.type["Наименование получателя или ИНН"])
                //Перехожу "Контрагенты/Просмотр"
                cy.get('[data-qa="16578861119580"]').click()
                //Нажимаю кебаб-меню / Изменить
                cy.clickKebabMenuDetails("Изменить")
                //Проверяю, что выбрана нужная вкладка
                cy.get('[data-qa="1657886546830"]')
                    .should('have.class', 'active')
                    .should('contain', ' Налоговый/Бюджетный ')

                //Проверяю поле "Наименование" контрагента
                cy.contains('.dynamic-input', ' Наименование ')
                    .find('[placeholder="Введите данные"]')
                    .invoke('val')
                    .then(sometext => expect(sometext).to.equal(this.testData.NALOG.type["Наименование получателя или ИНН"]));

                //Проверяю поле "ИНН" контрагента
                cy.contains('.dynamic-input', ' ИНН ')
                    .find('[placeholder="Введите данные"]')
                    .invoke('val')
                    .then(sometext => expect(sometext).to.equal(this.testData.NALOG.type["ИНН получателя"]));

                //Проверяю поле "КПП" контрагента
                cy.contains('.dynamic-input', ' КПП ')
                    .find('[placeholder="Введите данные"]')
                    .invoke('val')
                    .then(sometext => expect(sometext).to.equal(this.testData.NALOG.type["КПП получателя"]));

                //Проверяю поле "БИК банка получателя" контрагента
                cy.contains('.dynamic-input', ' БИК банка получателя ')
                    .find('[placeholder="Введите данные"]')
                    .invoke('val')
                    .then(sometext => expect(sometext).to.equal(this.testData.NALOG.type["БИК банка получателя"]));

                //Проверяю поле "Счет получателя"
                cy.modificationAccNumberSpace(this.testData.NALOG.type["Счет получателя"])
                    .then((modifiedNumber) => {
                        cy.contains('.dynamic-input', ' Номер счета ')
                            .find('[placeholder="Введите данные"]')
                            .invoke('val')
                            .then(sometext => expect(sometext).to.equal(modifiedNumber));
                    });
                //ВВОЖУ НОВЫЕ ДАННЫЕ В ПОЛЯ
                //Ищем поле "Наименование" контрагента
                cy.contains('.dynamic-input', ' Наименование ')
                    .find('[placeholder="Введите данные"]')
                    .click()
                    .clear()
                    .type(this.testData.NALOG.type["Наименование получателя или ИНН"].slice(0, -1) + 2)

                //Ищем поле "ИНН" контрагента
                cy.contains('.dynamic-input', ' ИНН ')
                    .find('[placeholder="Введите данные"]')
                    .click()
                    .clear()
                    .type(this.testData.NALOG.type["ИНН получателя"].slice(0, -1) + 2)

                //Ищем поле "КПП" контрагента
                cy.contains('.dynamic-input', ' КПП ')
                    .find('[placeholder="Введите данные"]')
                    .click()
                    .clear()
                    .type(this.testData.NALOG.type["КПП получателя"].slice(0, -1) + 2)

                //Ищем поле "Счет получателя"
                cy.contains('.dynamic-input', ' Номер счета ')
                    .find('[placeholder="Введите данные"]')
                    .click()
                    .clear()
                    .type(this.testData.NALOG.type["Счет получателя"].slice(0, -1) + 2)

                //Нажимаю кнопку "Сохранить"
                cy.contains('[data-qa="1658987981978"]', ' Сохранить').click()

                //Жду пока пропадет лоадер со страницы
                cy.get('.loader').should('not.exist')

                //ПРОВЕРЯЮ СОХРАНЕННЫЕ ДАННЫЕ
                //Ввожу ИНН ранее созданного контрагента в строку поиска
                cy.get('[data-qa="1658988187497"]')
                    .clear()
                    .type(this.testData.NALOG.type["Наименование получателя или ИНН"].slice(0, -1) + 2)
                //Нажимаю кебаб-меню / Изменить
                cy.clickKebabMenuСounterpart("Изменить")

                //Проверяю, что выбрана нужная вкладка
                cy.get('[data-qa="1657886546830"]')
                    .should('have.class', 'active')
                    .should('contain', ' Налоговый/Бюджетный ')

                cy.wait(500)

                //Проверяю поле "Наименование" контрагента
                cy.contains('.dynamic-input', ' Наименование ')
                    .find('[placeholder="Введите данные"]')
                    .invoke('val')
                    .then(sometext => expect(sometext).to.equal(this.testData.NALOG.type["Наименование получателя или ИНН"].slice(0, -1) + 2));

                //Проверяю поле "ИНН" контрагента
                cy.contains('.dynamic-input', ' ИНН ')
                    .find('[placeholder="Введите данные"]')
                    .invoke('val')
                    .then(sometext => expect(sometext).to.equal(this.testData.NALOG.type["ИНН получателя"].slice(0, -1) + 2));

                //Проверяю поле "КПП" контрагента
                cy.contains('.dynamic-input', ' КПП ')
                    .find('[placeholder="Введите данные"]')
                    .invoke('val')
                    .then(sometext => expect(sometext).to.equal(this.testData.NALOG.type["КПП получателя"].slice(0, -1) + 2));

                cy.wait(500)

                //Проверяю поле "Счет получателя"
                cy.modificationAccNumberSpace(this.testData.NALOG.type["Счет получателя"].slice(0, -1) + 2)
                    .then((modifiedNumber) => {
                        cy.contains('.dynamic-input', ' Номер счета ')
                            .find('[placeholder="Введите данные"]')
                            .invoke('val')
                            .then(sometext => expect(sometext).to.equal(modifiedNumber));
                    });
            })
            it('#3815. Контрагент ТАМОЖ', function () {
                //Ввожу ИНН ранее созданного контрагента в строку поиска
                cy.get('[data-qa="1658988187497"]')
                    .clear()
                    .type(this.testData.TAMOZH.type["Наименование получателя или ИНН"])
                //Перехожу "Контрагенты/Просмотр"
                cy.get('[data-qa="16578861119580"]').click()
                //Нажимаю кебаб-меню / Изменить
                cy.clickKebabMenuDetails("Изменить")
                //Проверяю, что выбрана нужная вкладка
                cy.get('[data-qa="1657886550146"]')
                    .should('have.class', 'active')
                    .should('contain', ' Таможенный ')

                //Проверяю поле "Наименование" контрагента
                cy.contains('.dynamic-input', ' Наименование ')
                    .find('[placeholder="Введите данные"]')
                    .invoke('val')
                    .then(sometext => expect(sometext).to.equal(this.testData.TAMOZH.type["Наименование получателя или ИНН"]));

                //Проверяю поле "ИНН" контрагента
                cy.contains('.dynamic-input', ' ИНН ')
                    .find('[placeholder="Введите данные"]')
                    .invoke('val')
                    .then(sometext => expect(sometext).to.equal(this.testData.TAMOZH.type["ИНН получателя"]));

                //Проверяю поле "КПП" контрагента
                cy.contains('.dynamic-input', ' КПП ')
                    .find('[placeholder="Введите данные"]')
                    .invoke('val')
                    .then(sometext => expect(sometext).to.equal(this.testData.TAMOZH.type["КПП получателя"]));

                //Проверяю поле "БИК банка получателя" контрагента
                cy.contains('.dynamic-input', ' БИК банка получателя ')
                    .find('[placeholder="Введите данные"]')
                    .invoke('val')
                    .then(sometext => expect(sometext).to.equal(this.testData.TAMOZH.type["БИК банка получателя"]));

                //Проверяю поле "Счет получателя"
                cy.modificationAccNumberSpace(this.testData.TAMOZH.type["Счет получателя"])
                    .then((modifiedNumber) => {
                        cy.contains('.dynamic-input', ' Номер счета ')
                            .find('[placeholder="Введите данные"]')
                            .invoke('val')
                            .then(sometext => expect(sometext).to.equal(modifiedNumber));
                    });
                //ВВОЖУ НОВЫЕ ДАННЫЕ В ПОЛЯ
                //Ищем поле "Наименование" контрагента
                cy.contains('.dynamic-input', ' Наименование ')
                    .find('[placeholder="Введите данные"]')
                    .click()
                    .clear()
                    .type(this.testData.TAMOZH.type["Наименование получателя или ИНН"].slice(0, -1) + 2)

                //Ищем поле "ИНН" контрагента
                cy.contains('.dynamic-input', ' ИНН ')
                    .find('[placeholder="Введите данные"]')
                    .click()
                    .clear()
                    .type(this.testData.TAMOZH.type["ИНН получателя"].slice(0, -1) + 2)

                //Ищем поле "КПП" контрагента
                cy.contains('.dynamic-input', ' КПП ')
                    .find('[placeholder="Введите данные"]')
                    .click()
                    .clear()
                    .type(this.testData.TAMOZH.type["КПП получателя"].slice(0, -1) + 2)

                //Ищем поле "Счет получателя"
                cy.contains('.dynamic-input', ' Номер счета ')
                    .find('[placeholder="Введите данные"]')
                    .click()
                    .clear()
                    .type(this.testData.TAMOZH.type["Счет получателя"].slice(0, -1) + 2)

                //Нажимаю кнопку "Сохранить"
                cy.contains('[data-qa="1658987981978"]', ' Сохранить').click()

                //Жду пока пропадет лоадер со страницы
                cy.get('.loader').should('not.exist')

                //ПРОВЕРЯЮ СОХРАНЕННЫЕ ДАННЫЕ
                //Ввожу ИНН ранее созданного контрагента в строку поиска
                cy.get('[data-qa="1658988187497"]')
                    .clear()
                    .type(this.testData.TAMOZH.type["Наименование получателя или ИНН"].slice(0, -1) + 2)
                //Нажимаю кебаб-меню / Изменить
                cy.clickKebabMenuСounterpart("Изменить")

                //Проверяю, что выбрана нужная вкладка
                cy.get('[data-qa="1657886550146"]')
                    .should('have.class', 'active')
                    .should('contain', ' Таможенный ')

                cy.wait(500)

                //Проверяю поле "Наименование" контрагента
                cy.contains('.dynamic-input', ' Наименование ')
                    .find('[placeholder="Введите данные"]')
                    .invoke('val')
                    .then(sometext => expect(sometext).to.equal(this.testData.TAMOZH.type["Наименование получателя или ИНН"].slice(0, -1) + 2));

                //Проверяю поле "ИНН" контрагента
                cy.contains('.dynamic-input', ' ИНН ')
                    .find('[placeholder="Введите данные"]')
                    .invoke('val')
                    .then(sometext => expect(sometext).to.equal(this.testData.TAMOZH.type["ИНН получателя"].slice(0, -1) + 2));

                //Проверяю поле "КПП" контрагента
                cy.contains('.dynamic-input', ' КПП ')
                    .find('[placeholder="Введите данные"]')
                    .invoke('val')
                    .then(sometext => expect(sometext).to.equal(this.testData.TAMOZH.type["КПП получателя"].slice(0, -1) + 2));

                cy.wait(500)

                //Проверяю поле "Счет получателя"
                cy.modificationAccNumberSpace(this.testData.TAMOZH.type["Счет получателя"].slice(0, -1) + 2)
                    .then((modifiedNumber) => {
                        cy.contains('.dynamic-input', ' Номер счета ')
                            .find('[placeholder="Введите данные"]')
                            .invoke('val')
                            .then(sometext => expect(sometext).to.equal(modifiedNumber));
                    });
            })
        })
        after('Удаление всех контрагентов через API', () => {
            cy.deleteAllCounterparts()
        })
    })
    context('Кейсы, где нужно создавать 100 контрагентов', () => {
        beforeEach(function () {
            //Смена компании на "Захарова Яна Николаевна"
            cy.changeCompanyApi('3448774')
        })
        it('#1359. Проверка пагинации', function () {
            //Удаление всех контрагентов через API
            cy.deleteAllCounterparts()

            //Создаю 100 контрагентов через API (это не в before, так как this.testData.UL не срабатывает не, если находится не в блоке it)
            cy.createSomeCounterpartsApi(100, this.testData.UL)

            //Перехожу в раздел "Контрагенты"
            cy.visit('/counterparts')
                .url()
                .should('contain', '/counterparts')
            //Проверяю пагинацию при 10 элементах на странице
            cy.get('.select-value').should('contain', '10')
            cy.get('.current-page').should('contain', 'Страница 1 из 10')
            cy.get('[data-qa="1657885988801"]')
                .find('.counterpart-list__item')
                .should('have.length', 10)

            //Кликаю на "Показать по"
            cy.get('.select-value').click()
            //Выбираю значение 25
            cy.contains('.item-dropdown', '25').click()
            //Проверяю пагинацию при 25 элементах на странице
            cy.get('.select-value').should('contain', '25')
            cy.get('.current-page').should('contain', 'Страница 1 из 4')
            cy.get('[data-qa="1657885988801"]')
                .find('.counterpart-list__item')
                .should('have.length', 25)

            //Кликаю на "Показать по"
            cy.get('.select-value').click()
            //Выбираю значение 100
            cy.contains('.item-dropdown', '100').click()
            //Проверяю пагинацию при 100 элементах на странице
            cy.get('.select-value').should('contain', '100')
            cy.get('.current-page').should('contain', 'Страница 1 из 1')
            cy.get('[data-qa="1657885988801"]')
                .find('.counterpart-list__item')
                .should('have.length', 100)
        })
        it('#1372. Проверка скорости загрузки страницы "Контрагенты"', function () {
            //Проверяю, что создались 100 контрагентов
            cy.request({
                method: 'GET',
                url: `${Cypress.config('baseUrl')}rest/stateful/corp/dic/corr/list?kontur_focus=true`,
            }).then((response) => {
                console.log(response.body); //Вывести ответ в консоль для отладки
                expect(response.status).to.equal(200);
                expect(response.body.corrDicElementUl).to.have.lengthOf(100); //Количество контрагентов = 100
            });
            //Перехожу в раздел "Контрагенты"
            cy.visit('/counterparts')
                .url()
                .should('contain', '/counterparts')
            //Проверяю, что рест загрузился за время defaultCommandTimeout (cypress.config.js)
            cy.get('.counterpart-list__items')
                .should('be.visible')
        })
        after('Удаление всех контрагентов через API', () => {
            cy.deleteAllCounterparts()
        })
    })
    context('Услуга "Светофор"', function () {
        it('#3602. Услуга "Светофор" включена - АО "ВМЗ"', function () {
            //Смена компании на АО "ВМЗ"
            cy.changeCompanyApi('6905198')
            //Удаление всех контрагентов через API
            cy.deleteAllCounterparts()
            //Создаю контрагента через API 
            cy.createCounterpartsApi(this.testData.UL)
            cy.createCounterpartsApi(this.testData.FL_With_INN)
            cy.createCounterpartsApi(this.testData.FL_Without_INN)
            cy.createCounterpartsApi(this.testData.IP)
            cy.createCounterpartsApi(this.testData.NALOG)
            cy.createCounterpartsApi(this.testData.TAMOZH)

            cy.visit('/counterparts')
                .url()
                .should('contain', '/counterparts')
            //Жду пока пропадет лоадер со страницы
            cy.get('.loader').should('not.exist')

            //ПРОВЕРЯЮ ЮЛ
            //Ввожу ИНН ранее созданного контрагента в строку поиска
            cy.get('[data-qa="1658988187497"]')
                .type(this.testData.UL.type["Наименование получателя или ИНН"])
            //Проверяю наличие иконки Светофора
            cy.get('[data-qa="16578861119580"]')
                .find('.counterpart-list__item__controls')
                .children()
                .should('have.class', 'svetofor')

            //ПРОВЕРЯЮ ФЛ
            //Ввожу ИНН ранее созданного контрагента в строку поиска
            cy.get('[data-qa="1658988187497"]')
                .clear()
                .type(this.testData.FL_With_INN.type["Наименование получателя или ИНН"])
            //Проверяю наличие иконки Светофора
            cy.get('[data-qa="16578861119580"]')
                .find('.counterpart-list__item__controls')
                .children()
                .should('have.class', 'svetofor')

            //ПРОВЕРЯЮ ФЛ без ИНН
            //Ввожу ИНН ранее созданного контрагента в строку поиска
            cy.get('[data-qa="1658988187497"]')
                .clear()
                .type(this.testData.FL_Without_INN.type["Наименование получателя или ИНН"])
            //Проверяю наличие иконки Светофора
            cy.get('[data-qa="16578861119580"]')
                .find('.counterpart-list__item__controls')
                .children()
                .should('have.class', 'svetofor')

            //ПРОВЕРЯЮ ИП
            //Ввожу ИНН ранее созданного контрагента в строку поиска
            cy.get('[data-qa="1658988187497"]')
                .clear()
                .type(this.testData.IP.type["Наименование получателя или ИНН"])
            //Проверяю наличие иконки Светофора
            cy.get('[data-qa="16578861119580"]')
                .find('.counterpart-list__item__controls')
                .children()
                .should('have.class', 'svetofor')

            //ПРОВЕРЯЮ НАЛОГ/БЮДЖЕТ
            //Ввожу ИНН ранее созданного контрагента в строку поиска
            cy.get('[data-qa="1658988187497"]')
                .clear()
                .type(this.testData.NALOG.type["Наименование получателя или ИНН"])
            //Проверяю наличие иконки Светофора
            cy.get('[data-qa="16578861119580"]')
                .find('.counterpart-list__item__controls')
                .children()
                .should('not.have.class', 'svetofor')

            //ПРОВЕРЯЮ ТАМОЖ
            //Ввожу ИНН ранее созданного контрагента в строку поиска
            cy.get('[data-qa="1658988187497"]')
                .clear()
                .type(this.testData.TAMOZH.type["Наименование получателя или ИНН"])
            //Проверяю наличие иконки Светофора
            cy.get('[data-qa="16578861119580"]')
                .find('.counterpart-list__item__controls')
                .children()
                .should('not.have.class', 'svetofor')
        })
        it('#3796. Услуга "Светофор" выключена - ООО "БРАИР"', function () {
            //Смена компании на ООО "БРАИР"
            cy.changeCompanyApi('7954638')
            //Удаление всех контрагентов через API
            cy.deleteAllCounterparts()
            //Создаю контрагента через API 
            cy.createCounterpartsApi(this.testData.UL)
            cy.createCounterpartsApi(this.testData.FL_With_INN)
            cy.createCounterpartsApi(this.testData.FL_Without_INN)
            cy.createCounterpartsApi(this.testData.IP)
            cy.createCounterpartsApi(this.testData.NALOG)
            cy.createCounterpartsApi(this.testData.TAMOZH)

            cy.visit('/counterparts')
                .url()
                .should('contain', '/counterparts')
            //Жду пока пропадет лоадер со страницы
            cy.get('.loader').should('not.exist')

            //ПРОВЕРЯЮ ЮЛ
            //Ввожу ИНН ранее созданного контрагента в строку поиска
            cy.get('[data-qa="1658988187497"]')
                .clear()
                .type(this.testData.UL.type["Наименование получателя или ИНН"])
            //Проверяю наличие иконки Светофора
            cy.get('[data-qa="16578861119580"]')
                .find('.counterpart-list__item__controls')
                .children()
                .should('not.have.class', 'svetofor')

            //ПРОВЕРЯЮ ФЛ
            //Ввожу ИНН ранее созданного контрагента в строку поиска
            cy.get('[data-qa="1658988187497"]')
                .clear()
                .type(this.testData.FL_With_INN.type["Наименование получателя или ИНН"])
            //Проверяю наличие иконки Светофора
            cy.get('[data-qa="16578861119580"]')
                .find('.counterpart-list__item__controls')
                .children()
                .should('not.have.class', 'svetofor')

            //ПРОВЕРЯЮ ФЛ без ИНН
            //Ввожу ИНН ранее созданного контрагента в строку поиска
            cy.get('[data-qa="1658988187497"]')
                .clear()
                .type(this.testData.FL_Without_INN.type["Наименование получателя или ИНН"])
            //Проверяю наличие иконки Светофора
            cy.get('[data-qa="16578861119580"]')
                .find('.counterpart-list__item__controls')
                .children()
                .should('not.have.class', 'svetofor')

            //ПРОВЕРЯЮ ИП
            //Ввожу ИНН ранее созданного контрагента в строку поиска
            cy.get('[data-qa="1658988187497"]')
                .clear()
                .type(this.testData.IP.type["Наименование получателя или ИНН"])
            //Проверяю наличие иконки Светофора
            cy.get('[data-qa="16578861119580"]')
                .find('.counterpart-list__item__controls')
                .children()
                .should('not.have.class', 'svetofor')

            //ПРОВЕРЯЮ НАЛОГ/БЮДЖЕТ
            //Ввожу ИНН ранее созданного контрагента в строку поиска
            cy.get('[data-qa="1658988187497"]')
                .clear()
                .type(this.testData.NALOG.type["Наименование получателя или ИНН"])
            //Проверяю наличие иконки Светофора
            cy.get('[data-qa="16578861119580"]')
                .find('.counterpart-list__item__controls')
                .children()
                .should('not.have.class', 'svetofor')

            //ПРОВЕРЯЮ ТАМОЖ
            //Ввожу ИНН ранее созданного контрагента в строку поиска
            cy.get('[data-qa="1658988187497"]')
                .clear()
                .type(this.testData.TAMOZH.type["Наименование получателя или ИНН"])
            //Проверяю наличие иконки Светофора
            cy.get('[data-qa="16578861119580"]')
                .find('.counterpart-list__item__controls')
                .children()
                .should('not.have.class', 'svetofor')
        })
        after('Удаление всех контрагентов через API', () => {
            cy.deleteAllCounterparts()
        })
    })
})