const { defineConfig } = require("cypress");

module.exports = defineConfig({
  projectId: 'dj569a',
  env: {

  },
  e2e: {  
    baseUrl: "https://pred-ul.metib.online/",
    supportFile: 'cypress/support/e2e.{js,jsx,ts,tsx}',
    specPattern: 'cypress/e2e/**/**/*.{js,jsx,ts,tsx}',
    retries: 1,
    video: false,
    defaultCommandTimeout: 60000, //Таймаут
    viewportWidth: 1920,
    viewportHeight: 1080,
    setupNodeEvents(on, config) {
      on("after:run",(results)=>{
        if(results){
          console.log(
            results.totalPassed
            ,
            'out of',
            results.totalTests,
            'passed'
            )
        }
      })
    },
  },
});
