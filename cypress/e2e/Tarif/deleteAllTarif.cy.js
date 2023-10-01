describe('Use Document IDs in Request Body', () => {
    const extractedDataArray = [];

    beforeEach(() => {
        cy.loginStand()
        cy.changeCompanyApi('7978049')
        cy.visit('/tarif')
    })
    it('Should retrieve document IDs', () => {
          cy.request({
            method: 'POST',
            url: 'https://pred-ul.metib.online/rest/stateful/corp/last_documents/doc_types?number_of_entries=10&list_of_statuses=new;sign_in_bank;for_send;send;decline;end;processed_vk;accept;draft;for_send_abs;cancel_from_renew;cancel;wait_decline',
            headers: {
                'Content-Type': 'application/json;charset=UTF-8'
              }  
        })
          .then((response) => {
            expect(response.status).to.equal(200);
            const documents = response.body.lastDocument
            expect(documents.length).to.be.greaterThan(0);
              documents.forEach((document) => {
                const extractedData = {
                    id: document.id,
                    status: document.systemStatus
                  };
                  extractedDataArray.push(extractedData);
            });
            cy.log(extractedDataArray)
          });
        });
      
        it('Should use document IDs in request body', () => {
            cy.wrap(extractedDataArray).each((id, status) => {
                if(!status === "cancel"){
                cy.request({
                    method: 'POST',
                    url: `https://pred-ul.metib.online/rest/stateful/corp/request/process/ul_request_cancel/`,
                    body: {
                        docDate: '2023-10-01',
                        cancelDocId: id,
                        cause: 'Отзыв по инициативе клиента',
                      },
                })
            }
        });
    });        
});
      