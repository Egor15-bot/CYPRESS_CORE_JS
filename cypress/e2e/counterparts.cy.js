describe('Контрагенты', () => {
    beforeEach(() => {
        //Авторизация + создание сессии
        cy.loginStand()
        //Импортирую фикстуры
        cy.fixture('counterparts').then(function (testData) {
            this.testData = testData
        })
        // //Удаление всех контрагентов
        // cy.deleteAllCounterparts()
        // //Смена компании на АО "ВМЗ"
        cy.changeCompanyApi('6905198')
        //Переход на главную страницу
        cy.visit("/")
    });
    
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
            cy.get('.page-path')
                .should('contain', 'Контрагенты')
            //Проверяю описание
            cy.get('.page-title__text')
                .should('contain', ' Справочник контрагентов ')
            //Проверяю кнопку
            cy.get('[data-qa="1657885995577"] > [data-qa="1658987981978"]')
                .as('btnAddCounterparts')
                .should('contain', ' Добавить контрагента')
                .should('have.css', 'background-image', 'linear-gradient(251.59deg, rgb(47, 84, 235) 0%, rgb(14, 131, 223) 99.45%)');
            //Проверяю цвет кнопки "Рублевые"
            cy.get('[data-qa="16599638895420"]')
                .should('have.css', 'background-image', 'linear-gradient(251.59deg, rgb(47, 84, 235) 0%, rgb(14, 131, 223) 99.45%)');
        })
    })
    // context('Контрагенты ЮЛ', () => {
    //     it('Создаю контрагента ЮЛ', function () {
    //         //Перехожу в раздел "Контрагенты"
    //         cy.visit(`${Cypress.config('baseUrl')}counterparts`)
    //         //Нажимаю кнопку "Добавить контрагента"
    //         cy.get('[data-qa="1657885995577"] > [data-qa="1658987981978"]')
    //             .click()
    //         cy.url()
    //             .should('eq', `${Cypress.config('baseUrl')}counterparts/create`)
    //         //Заполняю форму тестовыми данными из фикстуры
    //         cy.typeForm(this.testData.UL.type)
    //         cy.get('.loader')
    //             .should('not.exist')
    //         //Проверяю тестовые данные из фикстуры
    //         cy.checkFormСounterparts(this.testData.UL)
    //         //Нажимаю "Сохранить"
    //         cy.get('[data-qa="1657886705496"] > [data-qa="1658987981978"]').click()
    //         //Проверяю тост сообщение
    //         cy.checkGreenToastInfo(this.testData.toastGreen);
    //     })
    // })
    context('Контрагенты ФЛ', () => {
        it('Создаю контрагента ФЛ', function () {
        })
    })
});