describe('', () => {
    beforeEach(() => {
        cy.loginStand()
        cy.changeCompanyApi('7978104')
        cy.visit('/tarif')
    })
    it('Активный > Комплексный ', () => {
    cy.openTarifTab('Тарифы и пакеты')
    cy.changeTarifByName('Тариф Комплексный','Подключить')
    cy.signTarifAndPackage(' Белоусова_Подпись ')
    cy.checkTarifCaption('Заявка отправлена в банк')
    cy.checkTarifText(' Тариф начнет действовать ')
    cy.checkTarifStatus('В обработке')
    cy.openTarifTab('Тарифы и пакеты')
    cy.changeTarifByName('Тариф Комплексный','Отменить')
    cy.signTarifAndPackage(' Белоусова_Подпись ')
    cy.checkTarifText('Заявка на отзыв отправлена в банк')
    cy.checkTarifStatus('Отозван')
    })

    it('Активный > Расчетный', () => {
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
    it('Пакет услуг "30 платежей"',() =>{
        cy.openTarifTab('Тарифы и пакеты')
        cy.openPackageTab()
        cy.chooseAccType('Расчетный')
        cy.addPackageByName('Пакет услуг "30 платежей"')
        cy.signTarifAndPackage(' Белоусова_Подпись ')
        cy.get('div.package-content-body__text')
            .should('have.text',' Заявка на подключение отправлена \nв банк ')
        cy.checkTarifStatus('Заявление на смену пакета услуг','В обработке')
    })
    it('Пакет услуг "60 платежей"',() =>{
        cy.openTarifTab('Тарифы и пакеты')
        cy.openPackageTab()
        cy.chooseAccType('Расчетный')
        cy.addPackageByName('Пакет услуг "60 платежей"')
        cy.signTarifAndPackage(' Белоусова_Подпись ')
        cy.get('div.package-content-body__text')
            .should('have.text',' Заявка на подключение отправлена \nв банк ')
        cy.checkTarifStatus('Заявление на смену пакета услуг','В обработке')
    })
    it('Пакет услуг "90 платежей"',() =>{
        cy.openTarifTab('Тарифы и пакеты')
        cy.openPackageTab()
        cy.chooseAccType('Расчетный')
        cy.addPackageByName('Пакет услуг "90 платежей"')
        cy.signTarifAndPackage(' Белоусова_Подпись ')
        cy.get('div.package-content-body__text')
            .should('have.text',' Заявка на подключение отправлена \nв банк ')
        cy.checkTarifStatus('Заявление на смену пакета услуг','В обработке')
    })
    it('Пакет услуг "платежи безлимитно"',() =>{
        cy.openTarifTab('Тарифы и пакеты')
        cy.openPackageTab()
        cy.chooseAccType('Расчетный')
        cy.addPackageByName('Пакет услуг "платежи безлимитно"')
        cy.signTarifAndPackage(' Белоусова_Подпись ')
        cy.get('div.package-content-body__text')
            .should('have.text',' Заявка на подключение отправлена \nв банк ')
        cy.checkTarifStatus('Заявление на смену пакета услуг','В обработке')
    })

    it('Основные положения Расчетный',() =>{
        cy.get('article.tariff-details-header').within(()=>{
            cy.get('.tariff-details-header__title').should('contain','Тариф ‎Активный ВЭД‎')
            cy.get('[data-qa="16577851384090"] > app-tariff-description-item > .card-content-item > .value').should('contain','25 ₽ за платеж. В адрес ФЛ + доп.комиссия ')
            cy.get('[data-qa="16577851384091"] > app-tariff-description-item > .card-content-item > .label').should('contain','Переводы в адрес ФЛ')
            cy.get('[data-qa="16577851384091"] > app-tariff-description-item > .card-content-item > .value').should('contain','от 0,2% до 6% от суммы платежа ')
            cy.get('[data-qa="16577851384092"] > app-tariff-description-item > .card-content-item > .label').should('contain','Снятие наличных с карты')
            cy.get('[data-qa="16577851384092"] > app-tariff-description-item > .card-content-item > .value').should('contain','до 100 000 ₽ (включительно) - бесплатно. Далее - 1,5 % ')
            cy.get('[data-qa="16577851384093"] > app-tariff-description-item > .card-content-item > .label').should('contain','Платежи в валюте')
            cy.get('[data-qa="16577851384093"] > app-tariff-description-item > .card-content-item > .value').should('contain','min 25 USD, max 70 USD и min 30 EUR, max 70 EUR')

            cy.get('[data-qa="1657785266292"] > .card-content-item > .label').should('contain','Тариф действует с')
            cy.get('[data-qa="1657785266292"] > .card-content-item > .value').should('contain','12.07.2022')
            cy.get('[data-qa="1657785189071"] > .card-content-item > .label').should('contain','Плата за ведение расчётного счета')
            cy.get('[data-qa="1657785189071"] > .card-content-item > .value').should('contain','2 месяца бесплатно, далее 2 900 ₽')
            cy.get('[data-qa="1657787192111"]').should('contain',' Описание тарифа ').and('have.attr','href','https://metib.online/docs/Единый%20Сборник%20Тарифов%20с%2005.07.2023г.pdf')
            cy.get('[data-qa="1663074395452"] > span i').should('contain','Сменить ')
        })
    })

    it('Градусники расчетный',() =>{
        cy.get('section.tariff-details-container').within(() =>{
            cy.get('.tariff-details-container__header-title').should('contain','Переводы денежных средств')
            cy.get('[data-qa="16577853554320"] > .tariff-details-item > :nth-child(1) > .tariff-details-item__header').should('contain',' Счет: ')
                .find('span').should('contain','  Расчетный счет 40702810200990004093 ')
            cy.get('[data-qa="16577853554320"] > .tariff-details-item > .tariff-details-item__option-wrapper > .tariff-details-item__option-description').should('contain',' Переводы в другие банки на счета юридических лиц, ИП и ФЛ ')
            cy.get('[data-qa="16577853554320"] > .tariff-details-item > :nth-child(3) > .tariff-details-item__header').should('contain',' 25 ₽ за платеж ')
            cy.get('[data-qa="16577853554320"] > .tariff-details-item > app-metib-progress-bar > .metib-progress-bar__background').should('have.css','background-color')
            cy.get('[data-qa="16577853554320"] > .tariff-details-item > .tariff-details-item__progress-wrapper > span').should('contain',' 1 шт ')
            cy.get('[data-qa="16577853554321"] > .tariff-details-item > :nth-child(1) > .tariff-details-item__header').should('contain',' Счет: ')
                .find('span').should('contain','  Расчетный счет 40702810200990004093 ')       
            cy.get('[data-qa="16577853554321"] > .tariff-details-item > .tariff-details-item__option-wrapper > .tariff-details-item__option-description') .should('contain',' Переводы на счета физических лиц ')          
            cy.get('[data-qa="16577853554321"] > .tariff-details-item > :nth-child(3) > .tariff-details-item__header').should('contain',' 0.2% ')
            cy.get('[data-qa="16577853554321"] > .tariff-details-item > app-metib-progress-bar > .metib-progress-bar__background').should('have.css','background-color')
            cy.get('[data-qa="16577853554321"] > .tariff-details-item > .tariff-details-item__progress-wrapper > span').should('contain',' 0.00 из 99 999,99 ₽ ')
            cy.get('[data-qa="16577853554320"] > .tariff-details-item > .tariff-details-item__info-wrapper > .tariff-details-item__info').trigger('mouseenter')
            cy.get('[data-qa="16577853554321"] > .tariff-details-item > .tariff-details-item__info-wrapper > .tariff-details-item__info').trigger('mouseenter')
        })
    })        
})
