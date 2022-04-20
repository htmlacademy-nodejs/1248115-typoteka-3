"use strict";

const express = require(`express`);
const request = require(`supertest`);
const search = require(`./search`);
const DataService = require(`../data-service/search`);
const {HttpCode} = require(`../../constants`);

const mockData = [
  {
    id: `QE75BS`,
    title: `Как перестать беспокоиться и начать жить`,
    announce: `Программировать не настолько сложно, как об этом говорят. Помните, небольшое количество ежедневных упражнений лучше, чем один раз, но много. Он написал больше 30 хитов.`,
    fullText: `Собрать камни бесконечности легко, если вы прирожденный герой. Это один из лучших рок-музыкантов. Игры и программирование разные вещи. Не стоит идти в программисты, если вам нравятся только игры. Альбом стал настоящим открытием года. Мощные гитарные рифы и скоростные соло-партии не дадут заскучать. Программировать не настолько сложно, как об этом говорят. Помните, небольшое количество ежедневных упражнений лучше, чем один раз, но много. Первая большая ёлка была установлена только в 1938 году. Из под его пера вышло 8 платиновых альбомов. Освоить вёрстку несложно. Возьмите книгу новую книгу и закрепите все упражнения на практике. Процессор заслуживает особого внимания. Он обязательно понравится геймерам со стажем. Рок-музыка всегда ассоциировалась с протестами. Так ли это на самом деле?`,
    createdDate: `2022-03-01 14:32:03`,
    category: [`Программирование`, `Разное`, `За жизнь`, `Мебель`, `Авто`, `Деревья`, `IT`, `Железо`, `Кино`, `Игрушки`, `Без рамки`],
    comments: [
      {
        id: `V-8eWn`,
        text: `Давно не пользуюсь стационарными компьютерами. Ноутбуки победили. Мне кажется или я уже читал это где-то? Плюсую, но слишком много буквы!`
      },
      {
        id: `xdno-7`,
        text: `Давно не пользуюсь стационарными компьютерами. Ноутбуки победили.`
      },
      {
        id: `C4t2G2`,
        text: `Мне кажется или я уже читал это где-то? Давно не пользуюсь стационарными компьютерами. Ноутбуки победили. Совсем немного...`
      },
      {
        id: `05ibsq`,
        text: `Согласен с автором!`
      }
    ]
  },
  {
    id: `VuwyCz`,
    title: `Рок — это протест`,
    announce: `Освоить вёрстку несложно. Возьмите книгу новую книгу и закрепите все упражнения на практике. Достичь успеха помогут ежедневные повторения. Этот смартфон — настоящая находка. Большой и яркий экран, мощнейший процессор — всё это в небольшом гаджете.`,
    fullText: `Этот смартфон — настоящая находка. Большой и яркий экран, мощнейший процессор — всё это в небольшом гаджете. Альбом стал настоящим открытием года. Мощные гитарные рифы и скоростные соло-партии не дадут заскучать. Как начать действовать? Для начала просто соберитесь. Из под его пера вышло 8 платиновых альбомов. Игры и программирование разные вещи. Не стоит идти в программисты, если вам нравятся только игры. Золотое сечение — соотношение двух величин, гармоническая пропорция. Это один из лучших рок-музыкантов. Первая большая ёлка была установлена только в 1938 году. Рок-музыка всегда ассоциировалась с протестами. Так ли это на самом деле? Ёлки — это не просто красивое дерево. Это прочная древесина. Бороться с прокрастинацией несложно. Просто действуйте. Маленькими шагами.`,
    createdDate: `2022-02-11 20:42:43`,
    category: [`Разное`, `IT`, `Мебель`, `Программирование`, `Авто`, `Железо`, `Без рамки`, `Музыка`, `Кино`, `Игрушки`, `Деревья`, `За жизнь`],
    comments: [
      {
        id: `i2H-gY`,
        text: `Мне не нравится ваш стиль. Ощущение, что вы меня поучаете. Мне кажется или я уже читал это где-то?`
      }
    ]
  },
  {
    id: `rdXnpR`,
    title: `Самый лучший музыкальный альбом этого года`,
    announce: `Достичь успеха помогут ежедневные повторения. Ёлки — это не просто красивое дерево. Это прочная древесина. Этот смартфон — настоящая находка. Большой и яркий экран, мощнейший процессор — всё это в небольшом гаджете.`,
    fullText: `Напишите функцию для чтения информации из файлов. Помните, небольшое количество ежедневных упражнений лучше, чем один раз, но много. Рок-музыка всегда ассоциировалась с протестами. Так ли это на самом деле? Функция принимает на вход имя файла, из которого требуется прочитать информацию. Простые ежедневные упражнения помогут достичь успеха. Игры и программирование разные вещи. Не стоит идти в программисты, если вам нравятся только игры. Ёлки — это не просто красивое дерево. Это прочная древесина. Он написал больше 30 хитов. Достичь успеха помогут ежедневные повторения. Из под его пера вышло 8 платиновых альбомов.`,
    createdDate: `2022-01-24 00:27:25`,
    category: [`Кино`, `Железо`, `Разное`],
    comments: [
      {
        id: `oO184d`,
        text: `Мне кажется или я уже читал это где-то? Согласен с автором!`
      },
      {
        id: `8P9VR4`,
        text: `Давно не пользуюсь стационарными компьютерами. Ноутбуки победили.`
      }
    ]
  },
  {
    id: `9Vjnln`,
    title: `Как выучить JS`,
    announce: `Напишите функцию для чтения информации из файлов. Золотое сечение — соотношение двух величин, гармоническая пропорция.`,
    fullText: `Помните, небольшое количество ежедневных упражнений лучше, чем один раз, но много. Альбом стал настоящим открытием года. Мощные гитарные рифы и скоростные соло-партии не дадут заскучать. Золотое сечение — соотношение двух величин, гармоническая пропорция. Собрать камни бесконечности легко, если вы прирожденный герой. Освоить вёрстку несложно. Возьмите книгу новую книгу и закрепите все упражнения на практике. Это один из лучших рок-музыкантов. Результатом функции должен быть массив, считанных строк. Простые ежедневные упражнения помогут достичь успеха. Напишите функцию для чтения информации из файлов. Он написал больше 30 хитов. Рок-музыка всегда ассоциировалась с протестами. Так ли это на самом деле? Ёлки — это не просто красивое дерево. Это прочная древесина. Как начать действовать? Для начала просто соберитесь. Достичь успеха помогут ежедневные повторения. Процессор заслуживает особого внимания. Он обязательно понравится геймерам со стажем. Вы можете достичь всего. Стоит только немного постараться и запастись книгами. Игры и программирование разные вещи. Не стоит идти в программисты, если вам нравятся только игры. Функция принимает на вход имя файла, из которого требуется прочитать информацию. Программировать не настолько сложно, как об этом говорят. Бороться с прокрастинацией несложно. Просто действуйте. Маленькими шагами. Из под его пера вышло 8 платиновых альбомов. Этот смартфон — настоящая находка. Большой и яркий экран, мощнейший процессор — всё это в небольшом гаджете. Первая большая ёлка была установлена только в 1938 году.`,
    createdDate: `2022-02-08 14:22:15`,
    category: [`Разное`],
    comments: [
      {
        id: `1e3scR`,
        text: `Хочу такую же футболку :-) Давно не пользуюсь стационарными компьютерами. Ноутбуки победили. Это где ж такие красоты?`
      },
      {
        id: `8GCQb3`,
        text: `Совсем немного...`
      },
      {
        id: `n0tbPK`,
        text: `Мне кажется или я уже читал это где-то? Планируете записать видосик на эту тему?`
      },
      {
        id: `mDzAKh`,
        text: `Совсем немного... Согласен с автором!`
      }
    ]
  },
  {
    id: `AxSXlZ`,
    title: `Обзор новейшего смартфона`,
    announce: `Игры и программирование разные вещи. Не стоит идти в программисты, если вам нравятся только игры. Ёлки — это не просто красивое дерево. Это прочная древесина. Простые ежедневные упражнения помогут достичь успеха. Результатом функции должен быть массив, считанных строк. Собрать камни бесконечности легко, если вы прирожденный герой.`,
    fullText: `Освоить вёрстку несложно. Возьмите книгу новую книгу и закрепите все упражнения на практике. Собрать камни бесконечности легко, если вы прирожденный герой. Бороться с прокрастинацией несложно. Просто действуйте. Маленькими шагами. Достичь успеха помогут ежедневные повторения. Игры и программирование разные вещи. Не стоит идти в программисты, если вам нравятся только игры. Программировать не настолько сложно, как об этом говорят. Рок-музыка всегда ассоциировалась с протестами. Так ли это на самом деле? Как начать действовать? Для начала просто соберитесь. Это один из лучших рок-музыкантов. Он написал больше 30 хитов.`,
    createdDate: `2022-04-07 05:23:51`,
    category: [`Музыка`, `Мебель`, `Разное`],
    comments: [
      {
        id: `8LeI8X`,
        text: `Планируете записать видосик на эту тему? Давно не пользуюсь стационарными компьютерами. Ноутбуки победили. Мне кажется или я уже читал это где-то?`
      },
      {
        id: `jvvM2C`,
        text: `Мне кажется или я уже читал это где-то? Планируете записать видосик на эту тему? Плюсую, но слишком много буквы!`
      },
      {
        id: `3m3WY0`,
        text: `Мне кажется или я уже читал это где-то? Давно не пользуюсь стационарными компьютерами. Ноутбуки победили. Мне не нравится ваш стиль. Ощущение, что вы меня поучаете.`
      }
    ]
  }
];

const app = express();
app.use(express.json());
search(app, new DataService(mockData));

describe(`API returns offer based on search query`, () => {

  let response;

  beforeAll(async () => {
    response = await request(app)
      .get(`/search`)
      .query({
        query: `начать жить`
      });
  });

  test(`Status code 200`, () => expect(response.statusCode).toBe(HttpCode.OK));

  test(`1 or more offer found`, () => expect(response.body.length).toBeGreaterThan(0));

  test(`Offer has correct id`, () => expect(response.body[0].id).toBe(`QE75BS`));
});

test(`API returns code 404 if nothing is found`,
    () => request(app)
      .get(`/search`)
      .query({
        query: `Продам свою душу`
      })
      .expect(HttpCode.NOT_FOUND)
);

test(`API returns 400 when query string is absent`,
    () => request(app)
      .get(`/search`)
      .expect(HttpCode.BAD_REQUEST)
);