// 24 кейса
// Прописать и пройтись по каждому кейсу отдельно и 74 кейса будут готовы
//  Решить проблему со статусами и их обновлением
// Решить проблему с удалением всех тарифов перед тестированием(статус Cancel)

describe('', () => {
    beforeEach(() => {
        cy.loginStand()
        cy.changeCompanyApi('298642')
        cy.visit('/tarif')
    })
it('#3201 - Основные положения',()=>{})
it('#3238 - Тариф подпись',()=>{
    cy.openTarifTab('Тарифы и пакеты')
    cy.changeTarifByName('Тариф Расчетный','Подключить')
    cy.signTarifAndPackage(' Белоусова_Подпись ')
    cy.checkTarifCaption('Заявка отправлена в банк')
    cy.checkTarifText(' Тариф начнет действовать ')
    cy.checkTarifStatus('В обработке')
})
it('#3239 - Тариф подпись частичная',()=>{
    cy.openTarifTab('Тарифы и пакеты')
    cy.changeTarifByName('Тариф Расчетный','Подключить')
    cy.signTarifAndPackage(' Белоусова_Подпись1 ')
    cy.checkTarifCaption('Заявка частично подписана')
    cy.checkTarifText('Необходимо поставить вторую подпись')
    cy.changeTarifByName('Тариф Расчетный','Подписать')
    cy.signTarifAndPackage(' Белоусова_Подпись2 ')
    cy.checkTarifCaption('Заявка отправлена в банк')
    cy.checkTarifStatus('В обработке')
})
it('#3351 - Отмена заявки на тариф',()=>{
    cy.openTarifTab('Тарифы и пакеты')
    cy.changeTarifByName('Тариф Расчетный','Подключить')
    cy.signTarifAndPackage(' Белоусова_Подпись ')
    cy.checkTarifCaption('Заявка отправлена в банк')
    cy.checkTarifText(' Тариф начнет действовать ')
    cy.checkTarifStatus('В обработке')
    cy.openTarifTab('Тарифы и пакеты')
    cy.changeTarifByName('Тариф Расчетный','Отменить')
    cy.signTarifAndPackage(' Белоусова_Подпись ')
    cy.checkTarifText('Заявка на отзыв отправлена в банк')
    cy.checkTarifStatus('Отозван')
})
it('#3202 - Отображение активных тарифов',()=>{
    cy.openTarifTab('Тарифы и пакеты')
    cy.get('div.tariff-card ')
        .should('have.length','2')
        .and('be.visible')
})
it('#3203 - Проверка заявления на тариф или пакет',()=>{
    cy.openTarifTab('Тарифы и пакеты')
    cy.changeTarifByName('Тариф Расчетный','Подключить')
    cy.signTarifAndPackage(' Белоусова_Подпись ')
    cy.checkTarifCaption('Заявка отправлена в банк')
    cy.checkTarifText(' Тариф начнет действовать ')
    cy.checkTarifStatus('В обработке')
})
it('#3115 - Отсутствует тариф',()=>{
    cy.get('app-empty-stub div.empty-stub p').should('contain','Нет информации для отображения.')
})
it('#3128 - Смена тарифа, кнопка "Сменить',()=>{
    cy.openTarifTab('Тарифы и пакеты')
    cy.get('.tariff-details-header__title-wrapper .arrow-toggle__arrow').click()
    cy.get('[data-qa="1663074395452"] > span i').should('contain','Сменить ').click()
    cy.get('div.page-title__text').should('contain','Тарифы и пакеты')
    cy.get('div.tariff-card').should('have.length','2')
    cy.get('div.tariff-card .caption').contains('Комплексный')
    cy.get('div.tariff-card .caption').contains('Тариф ‎Активный ВЭД‎')
})
it.skip('#3205 - Подпись. Токен',()=>{})
it.skip('#3503 - Подпись частичная Токен',()=>{})
it.only('#3522 Смена тарифа при активной заявке ',()=>{
    cy.openTarifTab('Тарифы и пакеты')
    cy.changeTarifByName('Тариф Комплексный','Подключить')
    cy.signTarifAndPackage(' Белоусова_Подпись ')
    cy.checkTarifCaption('Заявка отправлена в банк')
    cy.checkTarifText(' Тариф начнет действовать ')
    cy.changeTarifByName('Тариф ‎Активный ВЭД‎','Подключить')
    cy.checkRedToastInfo('У вас уже есть заявка на подключение тарифа "Тариф Комплексный". Для перехода на другой тариф, отмените текущую заявку')
})
it('',()=>{})
it('',()=>{})
it('',()=>{})
it('',()=>{})
it('',()=>{})
it('',()=>{})
it('',()=>{})
it('',()=>{})
it('',()=>{})
it('',()=>{})
it('',()=>{})
it('',()=>{})
it('',()=>{})

})