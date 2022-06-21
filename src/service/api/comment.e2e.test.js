'use strict';

const express = require(`express`);
const http = require(`http`);//
const socket = require(`../lib/socket`);//
const request = require(`supertest`);
const Sequelize = require(`sequelize`);

const initDB = require(`../lib/init-db`);
const passwordUtils = require(`../lib/password`);
const comment = require(`./comment`);
const DataService = require(`../data-service/comment`);

const {HttpCode} = require(`../../constants`);

const mockCategories = [
  `Деревья`,
  `За жизнь`,
  `Без рамки`,
  `Разное`,
  `IT`,
  `Музыка`,
  `Кино`,
  `Программирование`,
  `Железо`,
  `Авто`,
  `Игрушки`,
  `Мебель`
];

const mockUsers = [
  {
    firstName: `Иван`,
    lastName: `Иванов`,
    email: `ivanov@example.com`,
    passwordHash: passwordUtils.hashSync(`ivanov`),
    avatar: `avatar01.jpg`
  },
  {
    firstName: `Пётр`,
    lastName: `Петров`,
    email: `petrov@example.com`,
    passwordHash: passwordUtils.hashSync(`petrov`),
    avatar: `avatar02.jpg`
  }
];

const mockArticles = [
  {
    user: `ivanov@example.com`,
    title: `Как перестать беспокоиться и начать жить. Золотое сечение — соотношение двух величин`,
    picture: `sea.jpg`,
    announce: `Золотое сечение — соотношение двух величин, гармоническая пропорция. Он написал больше 30 хитов.`,
    fullText: `Он написал больше 30 хитов. Ёлки — это не просто красивое дерево. Это прочная древесина. Функция принимает на вход имя файла, из которого требуется прочитать информацию. Это один из лучших рок-музыкантов. Результатом функции должен быть массив, считанных строк. Программировать не настолько сложно, как об этом говорят. Помните, небольшое количество ежедневных упражнений лучше, чем один раз, но много. Золотое сечение — соотношение двух величин, гармоническая пропорция. Освоить вёрстку несложно. Возьмите книгу новую книгу и закрепите все упражнения на практике. Первая большая ёлка была установлена только в 1938 году. Из под его пера вышло 8 платиновых альбомов. Бороться с прокрастинацией несложно. Просто действуйте. Маленькими шагами. Как начать действовать? Для начала просто соберитесь. Собрать камни бесконечности легко, если вы прирожденный герой. Этот смартфон — настоящая находка.`,
    categories: [`Мебель`],
    comments: [
      {
        user: `petrov@example.com`,
        text: `Плюсую, но слишком много буквы! Планируете записать видосик на эту тему? Это где ж такие красоты?`
      },
      {
        user: `ivanov@example.com`,
        text: `Мне кажется или я уже читал это где-то? Хочу такую же футболку :-) Плюсую, но слишком много !`
      }
    ]
  },
  {
    user: `ivanov@example.com`,
    title: `Ёлки. История деревьев. Ёлки. История деревьев`,
    picture: ``,
    announce: `Собрать камни бесконечности легко, если вы прирожденный герой. Вы можете достичь всего. Стоит только немного постараться и запастись книгами. Освоить вёрстку несложно. Возьмите книгу новую книгу и закрепите все упражнения на практике.`,
    fullText: `Это один из лучших рок-музыкантов. Игры и программирование разные вещи. Не стоит идти в программисты, если вам нравятся только игры. Золотое сечение — соотношение двух величин, гармоническая пропорция. Он написал больше 30 хитов. Рок-музыка всегда ассоциировалась с протестами. Так ли это на самом деле? Освоить вёрстку несложно. Возьмите книгу новую книгу и закрепите все упражнения на практике. Результатом функции должен быть массив, считанных строк. Этот смартфон — настоящая находка. Большой и яркий экран, мощнейший процессор — всё это в небольшом гаджете.`,
    categories: [`Игрушки`, `Музыка`, `Программирование`, `За жизнь`, `Без рамки`],
    comments: [
      {
        user: `petrov@example.com`,
        text: `Хочу такую же футболку :-) Давно не пользуюсь стационарными компьютерами. Ноутбуки победили.`
      }
    ]
  },
  {
    user: `ivanov@example.com`,
    title: `Как выучить JS. Лучшие языки программирования`,
    picture: `sea123.jpg`,
    announce: `Собрать камни бесконечности легко, если вы прирожденный герой. Это один из лучших рок-музыкантов. Программировать не настолько сложно, как об этом говорят. Как начать действовать? Для начала просто соберитесь.`,
    fullText: `Напишите функцию для чтения информации из файлов. Из под его пера вышло 8 платиновых альбомов. Простые ежедневные упражнения помогут достичь успеха. Функция принимает на вход имя файла, из которого требуется прочитать информацию. Освоить вёрстку несложно. Возьмите книгу новую книгу и закрепите все упражнения на практике. Он написал больше 30 хитов. Ёлки — это не просто красивое дерево. Это прочная древесина. Рок-музыка всегда ассоциировалась с протестами. Так ли это на самом деле? Как начать действовать? Для начала просто соберитесь. Этот смартфон — настоящая находка. Большой и яркий экран, мощнейший процессор — всё это в небольшом гаджете. Процессор заслуживает особого внимания. Он обязательно понравится геймерам со стажем. Вы можете достичь всего. Стоит только немного постараться и запастись книгами. Альбом стал настоящим открытием года. Мощные гитарные рифы и скоростные соло-партии не дадут заскучать.`,
    categories: [`Игрушки`, `Программирование`, `Музыка`],
    comments: [
      {
        user: `petrov@example.com`,
        text: `Мне не нравится ваш стиль. Ощущение, что вы меня поучаете. Планируете записать видосик?`
      },
      {
        user: `ivanov@example.com`,
        text: `Согласен с автором! Мне не нравится ваш стиль. Ощущение, что вы меня поучаете. `
      },
      {
        user: `petrov@example.com`,
        text: `Планируете записать видосик на эту тему?`
      }
    ]
  },
  {
    user: `ivanov@example.com`,
    title: `Лучшие языки программирования. Лучшие языки программирования`,
    picture: ``,
    announce: `Как начать действовать? Для начала просто соберитесь. Золотое сечение — соотношение двух величин, гармоническая пропорция. Этот смартфон — настоящая находка. Большой и яркий экран, мощнейший процессор — всё это в небольшом гаджете.`,
    fullText: `Программировать не настолько сложно, как об этом говорят. Золотое сечение — соотношение двух величин, гармоническая пропорция. Достичь успеха помогут ежедневные повторения. Освоить вёрстку несложно. Возьмите книгу новую книгу и закрепите все упражнения на практике. Вы можете достичь всего. Стоит только немного постараться и запастись книгами. Помните, небольшое количество ежедневных упражнений лучше, чем один раз, но много. Функция принимает на вход имя файла, из которого требуется прочитать информацию. Ёлки — это не просто красивое дерево. Это прочная древесина. Альбом стал настоящим открытием года. Мощные гитарные рифы и скоростные соло-партии не дадут заскучать. Как начать действовать? Для начала просто соберитесь. Бороться с прокрастинацией несложно. Просто действуйте. Маленькими шагами. Результатом функции должен быть массив, считанных строк. Рок-музыка всегда ассоциировалась с протестами.`,
    categories: [`Кино`, `Игрушки`, `Железо`, `Авто`, `Разное`, `Программирование`, `Без рамки`],
    comments: [
      {
        user: `petrov@example.com`,
        text: `Мне не нравится ваш стиль. Ощущение, что вы меня поучаете.`
      },
      {
        user: `ivanov@example.com`,
        text: `Давно не пользуюсь стационарными компьютерами. Ноутбуки победили. Хочу такую`
      },
      {
        user: `petrov@example.com`,
        text: `Хочу такую же футболку :-)`
      }
    ]
  },
  {
    user: `ivanov@example.com`,
    title: `Учим HTML и CSS. Учим HTML и CSS.`,
    picture: `seaerwet.jpg`,
    announce: `Функция принимает на вход имя файла, из которого требуется прочитать информацию.`,
    fullText: `Освоить вёрстку несложно. Возьмите книгу новую книгу и закрепите все упражнения на практике. Программировать не настолько сложно, как об этом говорят. Функция принимает на вход имя файла, из которого требуется прочитать информацию. Первая большая ёлка была установлена только в 1938 году. Из под его пера вышло 8 платиновых альбомов. Ёлки — это не просто красивое дерево. Это прочная древесина. Простые ежедневные упражнения помогут достичь успеха. Игры и программирование разные вещи. Не стоит идти в программисты, если вам нравятся только игры. Он написал больше 30 хитов. Помните, небольшое количество ежедневных упражнений лучше, чем один раз, но много. Вы можете достичь всего. Стоит только немного постараться и запастись книгами. Как начать действовать? Для начала просто соберитесь. Это один из лучших рок-музыкантов. Альбом стал настоящим открытием года. Мощные гитарные рифы и скоростные соло-партии не дадут заскучать.`,
    categories: [`Разное`, `Музыка`, `Игрушки`, `Железо`, `За жизнь`, `Программирование`, `Мебель`, `Деревья`, `Без рамки`, `Кино`, `Авто`],
    comments: [
      {
        user: `ivanov@example.com`,
        text: `Планируете записать видосик на эту тему? Давно не пользуюсь стационарными`
      },
      {
        user: `petrov@example.com`,
        text: `Мне кажется или я уже читал это где-то?`
      },
      {
        user: `ivanov@example.com`,
        text: `Мне кажется или я уже читал это где-то? Давно не пользуюсь .`
      },
      {
        user: `petrov@example.com`,
        text: `Давно не пользуюсь стационарными компьютерами. Ноутбуки победили.!`
      }
    ]
  }
];

const mockDB = new Sequelize(`sqlite::memory:`, {logging: false});

const app = express();
const server = http.createServer(app);//
const io = socket(server);//
app.locals.socketio = io;//
app.use(express.json());

beforeAll(async () => {
  await initDB(mockDB, {categories: mockCategories, articles: mockArticles, users: mockUsers});
  comment(app, new DataService(mockDB));
});

describe(`API returns comment list`, () => {

  let response;

  beforeAll(async () => {
    response = await request(app)
      .get(`/comments`);
  });

  test(`Status code 200`, () => expect(response.statusCode).toBe(HttpCode.OK));

  test(`Returns list of 13 comments`, () => expect(response.body.length).toBe(13));

});


describe(`API correctly deletes a comment`, () => {

  let response;

  beforeAll(async () => {
    response = await request(app)
      .delete(`/comments/1`);
  });

  test(`Status code 200`, () => expect(response.statusCode).toBe(HttpCode.OK));

  test(`Comments count is 12 now`, () => request(app)
    .get(`/comments`)
    .expect((res) => expect(res.body.length).toBe(12))
  );

});

test(`API refuses to delete non-existent comment`, async () => {
  return request(app)
    .delete(`/comments/100`)
    .expect(HttpCode.NOT_FOUND);

});
