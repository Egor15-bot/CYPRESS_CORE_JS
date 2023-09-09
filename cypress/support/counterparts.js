//Тут храняться команды для функционала "Контрагенты"
//
//Проверка модального окна удаление контрагента/бенефициара
Cypress.Commands.add('checkModalContainer', (fixture) => {
    cy.get('#modal-container').within(() => {
        //Проверяю наличие заголовка модального окна
        cy.get('div.page-title').should('contain', fixture.modalContainerCounterparts)
        //Проверяю наличие крестика закрытия
        cy.get('app-svg-icon.page-title__svg')
            .find('use')
            .should('have.attr', 'href', fixture.svgCross)
        //Проверяю наличие кнопки "Удалить" и "Отменить" и их цвета
        cy.get('div.delete-modal__content').should('contain', fixture.modalContainerSummery)
        cy.get('div.delete-modal__controls').within(() => {
            cy.get('div.panel-form__button.undefined')
                .should('contain', ' Удалить')
                .and('have.css', 'background', `${Cypress.env('colorBlueGradient')}`)
            cy.get('div.panel-form__button.small-bordered')
                .should('contain', ' Отменить')
                .and('have.css', 'border', `1px solid ${Cypress.env('colorBlueSolid')}`)
        })
    })
})
//
// Проверяю логотип и ранее введенную информацию на странице "Контрагенты"
Cypress.Commands.add('checkCounterpartList', (fixture) => {
    cy.contains('div.counterpart-list__item', fixture.type["Наименование получателя или ИНН"])
        .within(() => {
            cy.get('div.counterpart-list__item__type')
                .find('use')
                .should('have.attr', 'href', fixture.check.image)
            if (fixture.type["ИНН получателя"] && fixture.type["КПП получателя"]) {
                cy.get('div.counterpart-list__item__info')
                    .within(() => {
                        cy.get('div.title').should('contain', fixture.type["Наименование получателя или ИНН"])
                        cy.get('div.description').should('contain', fixture.type["ИНН получателя"])
                        cy.get('div.description').should('contain', fixture.type["КПП получателя"])
                    })
            }
        })
})
//
//Проверяю логотип и ранее введенную информацию на странице "Контрагенты / Просмотр"
Cypress.Commands.add('checkCounterpartDetails', (fixture) => {
    cy.contains('div.counterpart-details__content', fixture.type["Наименование получателя или ИНН"])
        .within(() => {
            cy.get('app-svg-icon.counterpart-details__content__icon')
                .find('use')
                .should('have.attr', 'href', fixture.check.image)
            if (fixture.type["ИНН получателя"] && fixture.type["КПП получателя"]) {
                cy.get('div.counterpart-details__content__info')
                    .within(() => {
                        cy.get('div.counterpart-details__content__info__fullname').should('contain', fixture.type["Наименование получателя или ИНН"])
                        cy.get('div.counterpart-details__content__info__requisites').should('contain', fixture.type["ИНН получателя"])
                        cy.get('div.counterpart-details__content__info__requisites').should('contain', fixture.type["КПП получателя"])
                    })
            }
        })
})