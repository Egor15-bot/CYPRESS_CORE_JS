<h1>  Проект автотестов на JS для МЕТИБ </h1>

### Содержание
- [🚀 О проекте ](#-о-проекте-)
- [🗂️ Схема проекта ](#️-схема-проекта-)
- [🔗 Преимущества нашего проекта ](#-преимущества-нашего-проекта-)
    - [♿ Параллелизация (многопоточность) в Cypress ](#-параллелизация-многопоточность-в-cypress-)
    - [⚡ Использование сохранения сессии при тестировании ](#-использование-сохранения-сессии-при-тестировании-)
    - [📍 Использование API ](#-использование-api-)
    - [🛩️ CI ](#️-ci-)
    - [👮 Установка утилиты as-a для хранения sensetive data ](#-установка-утилиты-as-a-для-хранения-sensetive-data-)
    - [🛠️ Использование fixture ](#️-использование-fixture-)
- [🔥 Реализованные методы ](#-реализованные-методы-)

<br>

# 🚀 О проекте <a name="about"></a>

В основу нашего проекта мы заложили **две** простых идей:

1. Уменьшить время, которое тратиться на регрессионное тестирование. Наш проект изначально строиться вокруг идеи внедрения многопоточного запуска, который позволит в разы съекономить время прогона
2. Увеличить стабильность работы автотестов. Стабильность достигается за счет продуманной структуры проекта: управление всем проектом осуществляется всего из нескольких мест. Благодаря архитектуре сайпресс мы не используем подход Page Object, благораря чему нам не приходится лишний раз думать об экспортах и импортах. Проект имеет простую структуру и удобен для масштабирования и самое главное для **рефакторинга**.

<br>

# 🗂️ Схема проекта <a name="project_structure"></a>
 
![Схема проекта](/image/project_scheme.png)
<br>
<br>
Чтобы открыть ссылку в новой вкладке: нажми правую кнопку мыши и выберите "Открыть ссылку в новой вкладке" или используйся сочетание клавиш Ctrl (или Cmd на Mac) + клик на ссылке  👉 👉 👉 
<a href="https://viewer.diagrams.net/?tags=%7B%7D&highlight=0000ff&edit=_blank&layers=1&nav=1&page-id=OWta5GxuuiPdCltbNN6N&title=%D0%A1%D1%85%D0%B5%D0%BC%D0%B0%20%D0%BF%D1%80%D0%BE%D0%B5%D0%BA%D1%82%D0%B0.drawio#Uhttps%3A%2F%2Fdrive.google.com%2Fuc%3Fid%3D1Sj6149Xae9TR1FkboT1Qys64w8LzFRA4%26export%3Ddownload" target="_blank" rel="noopener noreferrer">Кликни на меня :)</a>

<br>

# 🔗 Преимущества нашего проекта <a name="feature"></a>

### ♿ Параллелизация (многопоточность) в Cypress <a name="parallel"></a>
<a href="https://www.npmjs.com/package/cypress-parallel?activeTab=readme">npm-parallel</a>
 При подключении CI в файле в раширением `.yml` есть возможность прописать следующий код: 
```
strategy:
    fail-fast: false 
    matrix:
      containers: [1,2,3,4,5]
``` 
- fail-fast отвечает за то, чтобы вся матрица прописанная для параллелизации не падала если упадет хоть один из контейнеров.

- далее описываем суть срабатывания самой матрицы, в ней мы передаем слово "containers" и в литере массива прописывае через запятую то количество контейнеров, которое нам необходимо, после чего в наши настройки необходимо добавить parallel: true 
```
parallel: true # Runs test in parallel using settings above
```

Теперь при запуске нашего CI будет срабатывать файл с раширением `.yml` и внутри будет отрабатывать то количество контейнеров которое мы укажем *(в нашем случае 5)*.
<br>
<br>

### ⚡ Использование сохранения сессии при тестировании <a name="session"></a>

В файле `Commands.js` мы создаем общие команды, которые потом можно вызывать по коду в любом месте через `cy.` без лишних импортов в файл с тестами.

Одной из таких команд является `cy.visit` позволяющая нам перейти по нужному адресу. В процессе написания тестов мы постоянно используем ее для доступа к ресурсу и не смотря на то, что мы можем вынести ее в хук `beforeEach` и по факту иметь одну общую строку кода на весь тестовый файл, Сypress все равно будет логиниться перед каждым тестов по новому, таким образов `cy.session` поможет нам при первом логине очистить, а затем создать новую сессию и при запуске следующих тестов мы не будем повторно логиниться на UI а будем обращаться к сессии. Это позволит нам сэкономить от 5 до 10 секунда при на авторизации. Сейчас в регрессе используется более `1000 тест кейсов` и благодаря нашему подходу, только на авторизации мы будем экономить от `1,5 до 2,5 часов`.

<br>

### 📍 Использование API <a name="api"></a>

Периодически при выполнении тест кейса требуется либо создать какие-то тестовые данные, либо же, самое простое - сменить компанию. Данная процедура также может занимать от 5 до 10 секунд, что на дистанции в 1000 кейсов дает нам этомонию еще + `1,5-2,5 часа`. Про экономию времени на создание каких-либо документов думаю даже говорить не стоит.

<br>

### 🛩️ CI <a name="ci"></a>

В качестве CI был использован GitHub actions, данно решение легко подключается к cypress через Cloud.cypress.io, где автоматически генерируется файл `.yml`, в которые лишь необходимо добавить нужные настройки(например parallel).

Так же суть применения в связке с Cloud.cypress в том, что мы можем отойти от привязки к генерации отчетов через сторонний сервис и использоваться встроенный, данный сервис позволяет отслеживать время прогонов, результаты по каждой машине,А так же аналитику по всем тестам вместе.

<br>

### 👮 Установка утилиты as-a для хранения sensetive data <a name="as-a"></a>

1. Установить утилиту as-a, используя команду npm i -g as-a
2. В корне проекта создать файл с названием .as-a.ini
3. Внутри файла прописать нужную нам секцию, например:
```
[spec]
CYPRESS_username=your-password
CYPRESS_password=your-login
[другая секция]
CYPRESS_username=your-password
CYPRESS_password=your-login
```
4. Добавить файл в `.gitignore`
5. При запуске cypress передать команду npx as-a spec npx cypress open,
Где: spec - Название нужной секции, с теми данными которые мы в ней храним - передадутся только они.(Лучше добавить в отдельный скрипт внутри cypres.config.js и дергать из консоли более простой скрипт)
6. При открытии интерфейса cypress, перейти в левом блок во вкладку Settings
7. Далее открыть 
8. Проматать вниз до отображения объектов и найти объект с название "env" 
9. Удостовериться, что данные передались корректно и сохранены как перменные окружения 

<br>

### 🛠️ Использование fixture <a name="fixture"></a>

1. Первым делом внутри хука(beforeEach) Получаем доступ к файлу example.json, находящегося внутри папки 'fixture/' 
```
beforeEach('Авторизация на стенде Препрод', () => {
    cy.fixture('example').*as('name')*
  })
  ```
1. Далее по тесту внутри it используем слово function вместо стрелочной функции, так как вторая выполняется асинхронно и данные которые мы хотим получить еще не успевают подгрузиться, а мы их уже пытаемся использовать
```
it('#2238 - Страница входа. Проверка редиректа на боевой сайт', *function()* {
    cy.log(*this.name*)
  })

it('#2239 - Страница входа. Проверка отображения номера телефона', *function()* {
    cy.log(*this.name)
  })
```
<br>

# 🔥 Реализованные методы <a name="methods"></a>

Тут описаны уже реализованные методы, которые мы используем
| Готовность | Раздел ДБО  | Название метода              | Описание                                                      |
| :--------: | ----------- | ---------------------------- | ------------------------------------------------------------- |
|     ✅      | Общий метод | `getByDataQa`                | Метод поиска по data-qa                                       |
|     ✅      | Общий метод | `getByClass`                 | Метод поиска по классу                                        |
|     ✅      | Общий метод | `getLocalStorageValue`       | Метод поиска ключа в localStorage                             |
|     ✅      | Общий метод | `loginStand`                 | Авторизация с сохранением сессии                              |
|     ✅      | Общий метод | `loginApi`                   | Авторизация через API                                         |
|     ✅      | Общий метод | `changeCompanyApi`           | Смена компании используя API                                  |
|     ✅      | Общий метод | `openHeaderTab`              | Выбор любого элемента из хедера на главном меню               |
|     ✅      | Общий метод | `openBurgerTab`              | Переход в раздел через бургер меню                            |
|     ✅      | Общий метод | `waitingLoadPage`            | Ожидание загрузки страницы                                    |
|     ✅      | Общий метод | `waitingLoader`              | Ожидание пока лоадер пропадет со страницы                     |
|     ✅      | Общий метод | `checkGreenToastInfo`        | Метод для работы с зеленым тостом                             |
|     ✅      | Общий метод | `checkToastInfo`             | Метод для работы с красным тостом                             |
|     ✅      | Общий метод | `checkRedToastInfo`          | Заполнение формы тестовыми данными                            |
|     ✅      | Общий метод | `checkForm`                  | Проверка заполненых полей в форме                             |
|     ✅      | Контрагенты | `deleteAllCounterpart`       | Удаление всех созданных контрагентов через API                |
|     ✅      | Контрагенты | `modificationAccNumberSpace` | Метод приводит номер счета в формат "00000 000 0 00000000000" |
|     ✅      | Контрагенты | `modificationAccNumberDot`   | Метод приводит номер счета в формат "00000.000.0.00000000000" |
|     ⬜️      |             |                              |                                                               |
|     ⬜️      |             |                              |                                                               |


## Работа с ветками
1. Код в master ветке должен быть не поломанным и готовым к развертыванию в любое время (то есть нельзя туда положить код, который помешает собрать проект и развернуть его на сервере).
2. Когда планируется работа над новой функциональностью, необходимо создать новую ветку (feature ветку) на основе master ветки и дать ей понятное имя. Коммитить свой код локально и регулярно пушить свои изменения на эту же ветку в удаленный репозиторий.
3. Открыть Pull-Request (что такое pull-request, можно почитать здесь), когда есть четкое ощущение, что работа готова и может быть смерджена в master ветку (или если уверенности нет, но хочется получить отзывы о проделанной работе).
4. После того, как новую фичу в пул-реквесте заапрувили, ее можно смерджить в master ветку.
5. Когда изменения смерджены в master ветку, их нужно развернуть на сервере немедленно.
По GitHub Flow получается, что прежде чем начать работу над чем-то новым, будь то исправление или новая фича, нужно создать новую ветку на основе master’а и дать ей подходящее имя.

Далее, начинается работа над реализацией. Нужно постоянно отправлять коммиты на удаленный сервер с тем же именем. Когда приходит понимание, что все готово, нужно создать пул-реквест в master ветку. Потом хотя бы один, а лучше — два человека должны посмотреть этот код и нажать Approve. Обычно обязательно должен посмотреть тимлид проекта и кто-то еще, и тогда уже можно завершать пул-реквест.
Делаем ветки с тремя названиями
1. Test ветка - используем, когда работаем над написанием нового тестового набора: test-counterparts
2. Fix ветка - используем, когда вносим правки в уже написанный функционал: fix-counterparts
В мейн напрямую не пушим, создаем ветку, либо если мелкая доработка сливаем ее через текущую рабочую ветку

## Работа с несколькими вкладками
суть описания работы по ссылке https://github.com/cypress-io/cypress-example-recipes/blob/master/examples/testing-dom__tab-handling-links/cypress/e2e/tab_handling_anchor_links_spec.cy.js

Основными способами тестирования нескольких вкладок:
1. Первый способ не переходить по ссылке, а просто убедиться в том что присутствует аттрибут href и в нем храниться нужная нам ссылка
2. Второй способ это удалить аттрибут target, который отвечает за то, в какой вкладке мы открываем страницу(новой или текущей)
cy.get('#users').invoke('removeAttr', 'target').click() - здесь мы удаляем аттрибут и переходим по ссылке
cy.url().should('include', 'users.html') а здесь проверяем текущий урл
3. Трейтий способ это перехват значения внутри аттрибута href и переход по нему отдельно
 cy.get('#users').then(function ($a) {
        const href = $a.prop('href') -сохраняем в константу значение аттрибута href
        cy.visit(href) - переходим по этому адресу
        cy.url().should('include', 'users.html') и проверяем что действительно адрес корректныый и он хранится внутри аттрибута
      })
      

## Избыточное использование команд Cypress
В Cypress часто нет необходимости использовать .should('%command_name') после определенных команд, потому что Cypress автоматически ожидает появления, существование(и т.д) элементов в DOM перед выполнением действий с ними. Cypress использует собственный механизм ожидания, чтобы убедиться, что элемент присутствует и готов для взаимодействия.
Когда вы используете cy.get(), Cypress внутренне ожидает появления элемента в DOM и его готовности для взаимодействия. Это исключает необходимость явного ожидания или проверки на существование элементов с использованием .should('exist') should('be.visible')

Например:
// Cypress автоматически ожидает появления этого элемента
cy.get('.my-element').click(); // Здесь нет необходимости использовать .should('exist')

// Используя только cy.get() и .click()
cy.get('.my-button').click();
// Можно избежать should('be.visible'), так как .click() сам ожидает видимости элемента

// Используя только cy.get() и .type()
cy.get('.my-input').type('Some text');
// Можно избежать should('be.visible'), так как .type() сам ожидает видимости элемента

// Используя только cy.contains()
cy.contains('Some element with text');
// Можно избежать should('be.visible'), так как cy.contains() сам ожидает видимости элемента      