//ТУТ ХРАНЯТЬСЯ ВСЕ API МЕТОДЫ

//Метод логина на Препрод
Cypress.Commands.add('loginApi', () => {
    cy.session('Создание сессии авторизации через API', () => {
        cy.request({
            method: 'POST',
            url: `${Cypress.config('baseUrl')}/rest/stateful/corp/login`,
            headers: {
                'Authorization': 'Basic cWFfZHJ1ZG5pa19kY2I6MTIzNDU2Nzg=',
            },
            body: {}
        }).then((response) => {
            expect(response.status).to.equal(200);
        });
    })
})
//Метод логина на Тест
Cypress.Commands.add('loginTestApi', () => {
    cy.request({
        method: 'POST',
        url: 'https://test-ul.metib.online/rest/stateful/corp/login',
        headers: {
            "Authorization": "Basic cWFfZXlib25kYXJfdWw6UXExMjM0NTY3OA=="
        },
        body: {}
    }).then((response) => {
        expect(response.status).to.equal(200);
    });
})
//Смена компании через API
Cypress.Commands.add('changeCompanyApi', (idCompany) => {
    cy.request("PUT", `${Cypress.config('baseUrl')}/rest/stateful/corp/company/change_active/${idCompany}`);
    cy.reload()
})
//
//КОНТРАГЕНТЫ
//
//Создаю контрагента через API
Cypress.Commands.add('createCounterpartsApi', (fullname, inn, kpp, accNumber, bankBik, corrType) => {
    cy.request('POST', `${Cypress.config('baseUrl')}rest/stateful/corp/dic/corr/v2`, {
        "fullname": fullname,
        "inn": inn,
        "kpp": kpp,
        "accList": [
            {
                "accNumber": accNumber,
                "bankBik": bankBik
            }
        ],
        "corrType": corrType
    })
})
//
//Удаляю все контрагенты через API
Cypress.Commands.add('deleteAllCounterparts', () => {
    function getArray(restResult) {
        let result = [];
        const resultType = getTypeOf(restResult);
        switch (resultType) {
            case 'Array':
                result = restResult.slice();
                break;
            case 'Object':
                result = Object.keys(resultType).length ? [restResult] : [];
                break;
            case 'String':
            case 'Number':
                result = Array.of(restResult);
                break;
            default:
                break;
        }
        return result;
    }
    function getTypeOf(obj) {
        return {}.toString.call(obj).slice(8, -1);
    }
    let counterpartsList = [];
    //Получаю список контрагентов
    cy.request('GET', `${Cypress.config('baseUrl')}/rest/stateful/corp/dic/corr/list?kontur_focus=false`).then((response) => {
        //Загоняю респонс в переменную
        counterpartsList = getArray(response.body?.corrDicElementUl)
        //Удаляю контрагенты
        counterpartsList.forEach(item => {
            cy.request({ method: 'DELETE', url: `/rest/stateful/corp/delete/document/${item.id}` })
        })
    })
})