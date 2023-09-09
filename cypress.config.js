const { defineConfig } = require("cypress");

module.exports = defineConfig({
  projectId: 'qc56ne',
  env: {
    //Синий цвет для кнопок в ДБО и девайдеров, красный цвет для валидации полей
    colorBlueSolid: 'rgb(47, 84, 235)',
    colorBlueGradient: 'linear-gradient(251.59deg, rgb(47, 84, 235) 0%, rgb(14, 131, 223) 99.45%)',
    colorRed: 'rgb(68, 68, 68)'
  },
  e2e: {
    viewportWidth: "1920",
    viewportHeight: "1080",
    baseUrl: "https://pred-ul.metib.online/",
    supportFile: 'cypress/support/e2e.{js,jsx,ts,tsx}',
    specPattern: 'cypress/e2e/**/**/*.{js,jsx,ts,tsx}',
    retries: 1,
    video: false,
    defaultCommandTimeout: 45000, //Общий Таймаут
    viewportWidth: 1920,
    viewportHeight: 1080,
    setupNodeEvents(on, config) {
      require('@cypress/grep/src/plugin')(config);
      return config;
    },
  },
});
