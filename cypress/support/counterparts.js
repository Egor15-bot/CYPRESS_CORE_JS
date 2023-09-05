//Тут храняться команды для функционала "Контрагенты"
//
//Проверка модального окна удаление контрагента/бенефициара
Cypress.Commands.add('checkModalContainer', (fixture) => {
    cy.get('#modal-container').within(() => {
        //Проверяю наличие заголовка модального окна
        cy.get('.page-title').should('contain', fixture.modalContainerCounterparts)
        //Проверяю наличие крестика закрытия
        cy.get('.page-title__svg')
            .find('use')
            .should('have.attr', 'href', fixture.svgCross)
        //Проверяю наличие кнопки "Удалить" и "Отменить" и их цвета
        cy.get('.delete-modal__content').should('contain', fixture.modalContainerSummery)
        cy.get('.delete-modal__controls').within(() => {
            cy.get('.panel-form__button.undefined')
                .should('contain', ' Удалить')
                .and('have.css', 'background', `${Cypress.env('colorBlueGradient')}`)
            cy.get('.panel-form__button.small-bordered')
                .should('contain', ' Отменить')
                .and('have.css', 'border', `1px solid ${Cypress.env('colorBlueSolid')}`)
        })
    })
})
//
// Проверяю логотип и ранее введенную информацию на странице "Контрагенты"
Cypress.Commands.add('checkCounterpartList', (fixture) => {
    cy.contains('.counterpart-list__item', fixture.type["Наименование получателя или ИНН"])
        .within(() => {
            cy.get('.counterpart-list__item__type')
                .find('use')
                .should('have.attr', 'href', fixture.check.image)
            cy.get('.counterpart-list__item__info')
                .within(() => {
                    cy.get('.title').should('contain', fixture.type["Наименование получателя или ИНН"])
                    cy.get('.description').should('contain', fixture.type["ИНН получателя"])
                    cy.get('.description').should('contain', fixture.type["КПП получателя"])
                })
        })
})
//
//Проверяю логотип и ранее введенную информацию на странице "Контрагенты / Просмотр"
Cypress.Commands.add('checkCounterpartDetails', (fixture) => {
cy.contains('.counterpart-details__content', fixture.type["Наименование получателя или ИНН"])
    .within(() => {
        cy.get('.counterpart-details__content__icon')
            .find('use')
            .should('have.attr', 'href', fixture.check.image)
        cy.get('.counterpart-details__content__info')
            .within(() => {
                cy.get('.counterpart-details__content__info__fullname').should('contain', fixture.type["Наименование получателя или ИНН"])
                cy.get('.counterpart-details__content__info__requisites').should('contain', fixture.type["ИНН получателя"])
                cy.get('.counterpart-details__content__info__requisites').should('contain', fixture.type["КПП получателя"])
            })
    })
})