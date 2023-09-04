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