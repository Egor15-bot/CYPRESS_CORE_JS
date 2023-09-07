
describe('Управление тарифами', () => {
    beforeEach(() => {
        cy.loginApi()
        cy.changeCompanyApi('ООО ПСТ')
        cy.openBurgerTab('Управление тарифами').url().should('contain','/tarif')
    })
    context('Общие кейсы', () => {
        it('Верстка тарифы', () => {
            it('Верстка тарифы', () => {
                //СНачала проверяем заголовок
                cy.get('div.page-title__text.title-new').should('contain',' Обслуживание по тарифу за сентябрь 2023 г. ')
                cy.get('[data-qa="1657805226006"]').should('be.visible')
                //После чего находим блок header и внутри него проверяем все отображаемые элементы, потом кликаем на стрелку,чтобы развернуть остальные и проверяем их
                cy.get('section[data-qa="1657787211892"] header.ng-star-inserted').within( () => {
                    cy.get().should('contain','')
                    cy.get().should('contain','')               
                    cy.get().should('contain','')
                    cy.get().should('contain','')
                    cy.get().should('contain','')
                    cy.get().should('contain','')
                    cy.get().should('contain','')
                    cy.get().should('contain','')
                    cy.get().should('contain','')
                    cy.get().should('contain','')
                    cy.get().should('contain','')
                    cy.get().should('contain','')
                    cy.get().should('contain','')
                    cy.get().should('contain','')
                    cy.get('button[data-qa="1663074395452"]')
                    .should('contain','Сменить')
                    .click()
                    .url.should('contain','')
                })
                cy.get('section[data-qa="1657787211892"] main.ng-star-inserted').within(() => {
                    cy.get().should('contain','')
                    cy.get().should('contain','')               
                    cy.get().should('contain','')
                    cy.get().should('contain','')
                    cy.get().should('contain','')
                    cy.get().should('contain','')
                    cy.get().should('contain','')
                    cy.get().should('contain','')
                    cy.get().should('contain','')
                    cy.get().should('contain','')
                    cy.get().should('contain','')
                    cy.get().should('contain','')
                    cy.get().should('contain','')
                    cy.get().should('contain','')
                })
                //Особенно обратить внимание на открывающиеся ссылки, например описание тарифа и кнопка сменить(добавить проверку на переход в другую вкладку, так как Endpoint не меняется)
                //Далее находим блок Main и проверяем все элементы внутри него, текст и еще цвет там где есть номера счетов 
                // так же необходимо добавить отображение блоков при наведении на значки вопроса справа сбоку   
                // click arrow
            })
        })
    })
    context('Приветственный тариф', () => {
        it('Основные параметры',  () => {
            cy.get('article[data-qa="1657785210535"]').should('have.css','background','rgba(222,222,222,.5)').within(()=>{
                cy.get('h3.tariff-details-header__title').should('contain','Тариф Расчетный')
                cy.get('li:nth-child(1)  div > div.label').should('contain','Переводы в другие банки на счета ЮЛ, ИП и ФЛ ')
                cy.get('li:nth-child(1)  div > div.value').should('contain','25 ₽ за платеж. В адрес ФЛ + доп.комиссия ')
                cy.get().should('contain','Тариф действует с')
                cy.get().should('contain','09.10.2020')
                cy.get('div.tariff-details-header__content-visible > app-tariff-description-item div.label')
                cy.get('div.arrow-toggle').click().then(() => {
                    cy.get().should('contain','Переводы в адрес ФЛ')
                    cy.get().should('contain','от 0,2% до 6% от суммы платежа')
                    cy.get().should('contain','Снятие наличных с карты')
                    cy.get().should('contain','до 100 000 ₽ (включительно) - бесплатно. Далее - 1,5 % ')
                    cy.get().should('contain','Начисление % на остаток')
                    cy.get().should('contain','не начисляется')
                    cy.get().should('contain','Плата за ведение расчётного счета')
                    cy.get().should('contain','2 месяца бесплатно, далее 1 900 ₽')
                    cy.get().should('contain',' Описание тарифа ').click().url().should('eq','https://metib.online/docs/Единый%20Сборник%20Тарифов%20с%2005.07.2023г.pdf')
                })
                cy.get('section[data-qa="1657787211892"] main.ng-star-inserted').within(() =>{ 
                    cy.get('h4').should('contain','Переводы денежных средств')
                    cy.get('').should('contain',' Счет: ')
                    cy.get('').should('contain','  Расчетный счет 40802810200990000023 ')
                    cy.get('').should('contain',' 25 ₽ за платеж ')
                    cy.get('').should('contain',' 0 шт ')
                })
                cy.get('article.tariff-details-item ').
            })
        })
        it('Градусники', () => {

        })
        it('Смена на тариф Корпоративный', () => {

        })
        it('Смена на тариф Оптимальный', () => {

        })
    })
    context('Расчетный тариф', () => {
        
    })
    context('Активный Вэд тариф', () => {
        it('', () => {

        })
    })
    context('Комплексный тариф', () => {
        it('', () => {

        })
    })
    context('Специальный тариф', () => {
        it('', () => {

        })
    })
    context('Стартовый тариф', () => {
        it('', () => {

        })
    })
    context('Оптимальный тариф', () => {
        it('', () => {

        })
    })
    context('Корпоративный тариф', () => {
        it('', () => {

        })
    })

})