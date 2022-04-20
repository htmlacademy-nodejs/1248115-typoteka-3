"use strict";

const express = require(`express`);
const request = require(`supertest`);

const article = require(`./article`);
const DataService = require(`../data-service/article`);
const CommentService = require(`../data-service/comment`);

const {HttpCode} = require(`../../constants`);

const mockData = [
  {
    id: `8syPXX`,
    title: `Обзор новейшего смартфона`,
    announce: `Достичь успеха помогут ежедневные повторения.`,
    fullText: `Результатом функции должен быть массив, считанных строк. Вы можете достичь всего. Стоит только немного постараться и запастись книгами. Альбом стал настоящим открытием года. Мощные гитарные рифы и скоростные соло-партии не дадут заскучать. Из под его пера вышло 8 платиновых альбомов. Напишите функцию для чтения информации из файлов. Золотое сечение — соотношение двух величин, гармоническая пропорция. Простые ежедневные упражнения помогут достичь успеха. Собрать камни бесконечности легко, если вы прирожденный герой. Этот смартфон — настоящая находка. Большой и яркий экран, мощнейший процессор — всё это в небольшом гаджете.`,
    createdDate: `2022-02-23 20:07:13`,
    category: [`Разное`, `Программирование`, `Авто`, `Железо`, `Игрушки`, `Без рамки`, `За жизнь`],
    comments: [
      {
        id: `lTLvVp`,
        text: `Давно не пользуюсь стационарными компьютерами. Ноутбуки победили. Согласен с автором!`
      }
    ]
  },
  {
    id: `5vHcs4`,
    title: `Как начать программировать`,
    announce: `Золотое сечение — соотношение двух величин, гармоническая пропорция. Как начать действовать? Для начала просто соберитесь. Этот смартфон — настоящая находка. Большой и яркий экран, мощнейший процессор — всё это в небольшом гаджете.`,
    fullText: `Результатом функции должен быть массив, считанных строк. Это один из лучших рок-музыкантов. Бороться с прокрастинацией несложно. Просто действуйте. Маленькими шагами. Ёлки — это не просто красивое дерево. Это прочная древесина. Программировать не настолько сложно, как об этом говорят. Он написал больше 30 хитов. Вы можете достичь всего. Стоит только немного постараться и запастись книгами. Этот смартфон — настоящая находка. Большой и яркий экран, мощнейший процессор — всё это в небольшом гаджете. Собрать камни бесконечности легко, если вы прирожденный герой. Золотое сечение — соотношение двух величин, гармоническая пропорция. Рок-музыка всегда ассоциировалась с протестами. Так ли это на самом деле? Функция принимает на вход имя файла, из которого требуется прочитать информацию. Освоить вёрстку несложно. Возьмите книгу новую книгу и закрепите все упражнения на практике. Помните, небольшое количество ежедневных упражнений лучше, чем один раз, но много. Игры и программирование разные вещи. Не стоит идти в программисты, если вам нравятся только игры. Напишите функцию для чтения информации из файлов. Альбом стал настоящим открытием года. Мощные гитарные рифы и скоростные соло-партии не дадут заскучать. Процессор заслуживает особого внимания. Он обязательно понравится геймерам со стажем. Простые ежедневные упражнения помогут достичь успеха. Первая большая ёлка была установлена только в 1938 году. Из под его пера вышло 8 платиновых альбомов. Достичь успеха помогут ежедневные повторения. Как начать действовать? Для начала просто соберитесь.`,
    createdDate: `2022-03-02 21:42:16`,
    category: [`IT`, `Без рамки`, `Железо`, `Кино`, `Программирование`, `Деревья`, `Игрушки`, `За жизнь`, `Мебель`, `Музыка`, `Авто`],
    comments: [
      {
        id: `T-Lnpc`,
        text: `Давно не пользуюсь стационарными компьютерами. Ноутбуки победили. Мне не нравится ваш стиль. Ощущение, что вы меня поучаете.`
      }
    ]
  },
  {
    id: `XQRDdW`,
    title: `Ёлки. История деревьев`,
    announce: `Как начать действовать? Для начала просто соберитесь. Ёлки — это не просто красивое дерево. Это прочная древесина. Первая большая ёлка была установлена только в 1938 году. Он написал больше 30 хитов.`,
    fullText: `Из под его пера вышло 8 платиновых альбомов. Игры и программирование разные вещи. Не стоит идти в программисты, если вам нравятся только игры. Ёлки — это не просто красивое дерево. Это прочная древесина. Альбом стал настоящим открытием года. Мощные гитарные рифы и скоростные соло-партии не дадут заскучать. Напишите функцию для чтения информации из файлов. Этот смартфон — настоящая находка. Большой и яркий экран, мощнейший процессор — всё это в небольшом гаджете. Вы можете достичь всего. Стоит только немного постараться и запастись книгами. Освоить вёрстку несложно. Возьмите книгу новую книгу и закрепите все упражнения на практике. Собрать камни бесконечности легко, если вы прирожденный герой. Достичь успеха помогут ежедневные повторения. Функция принимает на вход имя файла, из которого требуется прочитать информацию. Результатом функции должен быть массив, считанных строк.`,
    createdDate: `2022-03-17 18:11:55`,
    category: [`Кино`],
    comments: [
      {
        id: `E_IC1p`,
        text: `Согласен с автором! Давно не пользуюсь стационарными компьютерами. Ноутбуки победили.`
      },
      {
        id: `J-K1hq`,
        text: `Плюсую, но слишком много буквы! Мне не нравится ваш стиль. Ощущение, что вы меня поучаете.`
      },
      {
        id: `t_Fgio`,
        text: `Согласен с автором! Мне кажется или я уже читал это где-то? Плюсую, но слишком много буквы!`
      }
    ]
  },
  {
    id: `J6smQY`,
    title: `Ёлки. История деревьев`,
    announce: `Первая большая ёлка была установлена только в 1938 году. Вы можете достичь всего. Стоит только немного постараться и запастись книгами. Золотое сечение — соотношение двух величин, гармоническая пропорция. Бороться с прокрастинацией несложно. Просто действуйте. Маленькими шагами.`,
    fullText: `Он написал больше 30 хитов. Альбом стал настоящим открытием года. Мощные гитарные рифы и скоростные соло-партии не дадут заскучать. Ёлки — это не просто красивое дерево. Это прочная древесина. Это один из лучших рок-музыкантов. Вы можете достичь всего. Стоит только немного постараться и запастись книгами. Помните, небольшое количество ежедневных упражнений лучше, чем один раз, но много. Собрать камни бесконечности легко, если вы прирожденный герой. Достичь успеха помогут ежедневные повторения. Как начать действовать? Для начала просто соберитесь. Бороться с прокрастинацией несложно. Просто действуйте. Маленькими шагами. Процессор заслуживает особого внимания. Он обязательно понравится геймерам со стажем. Программировать не настолько сложно, как об этом говорят. Первая большая ёлка была установлена только в 1938 году. Напишите функцию для чтения информации из файлов. Из под его пера вышло 8 платиновых альбомов. Результатом функции должен быть массив, считанных строк. Игры и программирование разные вещи. Не стоит идти в программисты, если вам нравятся только игры. Простые ежедневные упражнения помогут достичь успеха. Золотое сечение — соотношение двух величин, гармоническая пропорция. Функция принимает на вход имя файла, из которого требуется прочитать информацию. Освоить вёрстку несложно. Возьмите книгу новую книгу и закрепите все упражнения на практике.`,
    createdDate: `2022-03-26 00:06:48`,
    category: [`Разное`, `Программирование`, `Деревья`, `Авто`, `Музыка`, `Игрушки`, `Без рамки`],
    comments: [
      {
        id: `gP1xd6`,
        text: `Хочу такую же футболку :-) Это где ж такие красоты?`
      },
      {
        id: `H-1uyq`,
        text: `Давно не пользуюсь стационарными компьютерами. Ноутбуки победили.`
      },
      {
        id: `xWpz98`,
        text: `Давно не пользуюсь стационарными компьютерами. Ноутбуки победили. Мне кажется или я уже читал это где-то?`
      },
      {
        id: `qUMINp`,
        text: `Планируете записать видосик на эту тему? Согласен с автором! Мне кажется или я уже читал это где-то?`
      }
    ]
  },
  {
    id: `UyB4FZ`,
    title: `Как начать программировать`,
    announce: `Функция принимает на вход имя файла, из которого требуется прочитать информацию. Бороться с прокрастинацией несложно. Просто действуйте. Маленькими шагами. Как начать действовать? Для начала просто соберитесь. Достичь успеха помогут ежедневные повторения.`,
    fullText: `Освоить вёрстку несложно. Возьмите книгу новую книгу и закрепите все упражнения на практике. Золотое сечение — соотношение двух величин, гармоническая пропорция. Как начать действовать? Для начала просто соберитесь. Процессор заслуживает особого внимания. Он обязательно понравится геймерам со стажем. Собрать камни бесконечности легко, если вы прирожденный герой. Это один из лучших рок-музыкантов. Из под его пера вышло 8 платиновых альбомов. Альбом стал настоящим открытием года. Мощные гитарные рифы и скоростные соло-партии не дадут заскучать. Он написал больше 30 хитов. Вы можете достичь всего. Стоит только немного постараться и запастись книгами. Достичь успеха помогут ежедневные повторения. Бороться с прокрастинацией несложно. Просто действуйте. Маленькими шагами. Простые ежедневные упражнения помогут достичь успеха. Первая большая ёлка была установлена только в 1938 году. Помните, небольшое количество ежедневных упражнений лучше, чем один раз, но много.`,
    createdDate: `2022-03-07 19:49:53`,
    category: [`Мебель`, `Деревья`, `За жизнь`, `Кино`, `Без рамки`, `Игрушки`, `Музыка`, `Разное`],
    comments: [
      {
        id: `KrkeZL`,
        text: `Хочу такую же футболку :-)`
      },
      {
        id: `0gU3yT`,
        text: `Плюсую, но слишком много буквы! Это где ж такие красоты?`
      },
      {
        id: `TCowL_`,
        text: `Мне кажется или я уже читал это где-то? Хочу такую же футболку :-)`
      },
      {
        id: `NdDTXv`,
        text: `Совсем немного... Согласен с автором! Давно не пользуюсь стационарными компьютерами. Ноутбуки победили.`
      }
    ]
  }
];

const createAPI = () => {
  const app = express();
  const cloneData = JSON.parse(JSON.stringify(mockData));
  app.use(express.json());
  article(app, new DataService(cloneData), new CommentService());
  return app;
};

describe(`API returns a list of all articles`, () => {

  let response;

  beforeAll(async () => {
    const app = createAPI();
    response = await request(app)
      .get(`/articles`);
  });

  test(`Status code 200`, () => expect(response.statusCode).toBe(HttpCode.OK));

  test(`Returns a list of 5 articles`, () => expect(response.body.length).toBe(5));

  test(`First article's id equals "8syPXX"`, () => expect(response.body[0].id).toBe(`8syPXX`));

});

describe(`API returns an article with given id`, () => {

  let response;

  beforeAll(async () => {
    const app = createAPI();
    response = await request(app)
      .get(`/articles/8syPXX`);
  });

  test(`Status code 200`, () => expect(response.statusCode).toBe(HttpCode.OK));

  test(`Article's title is "Обзор новейшего смартфона"`, () => expect(response.body.title).toBe(`Обзор новейшего смартфона`));

});

describe(`API creates an article if data is valid`, () => {

  const newArticle = {
    category: [`Авто`, `Железо`, `Игрушки`],
    title: `Как начать программировать`,
    fullText: `Он написал больше 30 хитов. Функция принимает на вход имя файла, из которого требуется прочитать информацию.`,
    createdDate: `2022-03-23 20:00:00`,
    announce: `Он написал больше 30 хитов.`,
  };

  const app = createAPI();

  let response;

  beforeAll(async () => {
    response = await request(app)
      .post(`/articles`)
      .send(newArticle);
  });


  test(`Status code 201`, () => expect(response.statusCode).toBe(HttpCode.CREATED));

  test(`Returns article created`, () => expect(response.body).toEqual(expect.objectContaining(newArticle)));

  test(`Articles count is changed`, () => request(app)
    .get(`/articles`)
    .expect((res) => expect(res.body.length).toBe(6))
  );

});

describe(`API refuses to create an article if data is invalid`, () => {

  const newArticle = {
    category: [`Авто`, `Железо`, `Игрушки`],
    title: `Как начать программировать`,
    fullText: `Он написал больше 30 хитов. Функция принимает на вход имя файла, из которого требуется прочитать информацию.`,
    createdDate: `2022-03-23 20:00:00`,
    sum: 100500
  };

  const app = createAPI();

  test(`Without any required property response code is 400`, async () => {
    for (const key of Object.keys(newArticle)) {
      const badArticle = {...newArticle};
      delete badArticle[key];
      await request(app)
        .post(`/articles`)
        .send(badArticle)
        .expect(HttpCode.BAD_REQUEST);
    }
  });

});

describe(`API changes existent article`, () => {

  const newArticle = {
    category: [`Авто`, `Железо`, `Игрушки`],
    title: `Что такое золотое сечение`,
    fullText: `Функция принимает на вход имя файла, из которого требуется прочитать информацию.`,
    createdDate: `2022-02-20 22:00:00`,
    announce: `Он написал больше 30 хитов.`,
  };

  const app = createAPI();

  let response;

  beforeAll(async () => {
    response = await request(app)
      .put(`/articles/8syPXX`)
      .send(newArticle);
  });

  test(`Status code 200`, () => expect(response.statusCode).toBe(HttpCode.OK));

  test(`Returns changed article`, () => expect(response.body).toEqual(expect.objectContaining(newArticle)));

  test(`article is really changed`, () => request(app)
    .get(`/articles/8syPXX`)
    .expect((res) => expect(res.body.title).toBe(`Что такое золотое сечение`))
  );

});

test(`API returns status code 404 when trying to change non-existent article`, () => {

  const app = createAPI();

  const validArticle = {
    category: [`Авто`, `Железо`, `Игрушки`],
    title: `ывапвпа пнпн пнпнпргнр`,
    fullText: `Функция принимает на вход имя файла, из которого требуется прочитать информацию.`,
    createdDate: `2022-02-20 22:00:00`,
    announce: `terrtrrrr.`,
  };

  return request(app)
    .put(`/articles/NOEXST`)
    .send(validArticle)
    .expect(HttpCode.NOT_FOUND);
});

test(`API returns status code 400 when trying to change an article with invalid data`, () => {

  const app = createAPI();

  const invalidArticle = {
    category: [`Авто`, `Железо`, `Игрушки`],
    title: `ывапвпа пнпн пнпнпргнр`,
    fullText: `Функция принимает на вход имя файла, из которого требуется прочитать информацию.`,
    createdDate: `2022-02-20 22:00:00`,
    type: `terrtrrrr.`,
  };

  return request(app)
    .put(`/articles/NOEXST`)
    .send(invalidArticle)
    .expect(HttpCode.BAD_REQUEST);
});

describe(`API correctly deletes an article`, () => {

  const app = createAPI();

  let response;

  beforeAll(async () => {
    response = await request(app)
      .delete(`/articles/8syPXX`);
  });

  test(`Status code 200`, () => expect(response.statusCode).toBe(HttpCode.OK));

  test(`Returns deleted article`, () => expect(response.body.id).toBe(`8syPXX`));

  test(`article count is 4 now`, () => request(app)
    .get(`/articles`)
    .expect((res) => expect(res.body.length).toBe(4))
  );

});

test(`API refuses to delete non-existent article`, () => {

  const app = createAPI();

  return request(app)
    .delete(`/articles/NOEXST`)
    .expect(HttpCode.NOT_FOUND);

});

describe(`API returns a list of comments to given article`, () => {

  let response;

  beforeAll(async () => {
    const app = createAPI();
    response = await request(app)
      .get(`/articles/XQRDdW/comments`);
  });

  test(`Status code 200`, () => expect(response.statusCode).toBe(HttpCode.OK));

  test(`Returns list of 3 comments`, () => expect(response.body.length).toBe(3));

  test(`First comment's id is "E_IC1p"`, () => expect(response.body[0].id).toBe(`E_IC1p`));

});


describe(`API creates a comment if data is valid`, () => {

  const newComment = {
    text: `Валидному комментарию достаточно этого поля`
  };

  const app = createAPI();

  let response;

  beforeAll(async () => {
    response = await request(app)
      .post(`/articles/XQRDdW/comments`)
      .send(newComment);
  });


  test(`Status code 201`, () => expect(response.statusCode).toBe(HttpCode.CREATED));

  test(`Returns comment created`, () => expect(response.body).toEqual(expect.objectContaining(newComment)));

  test(`Comments count is changed`, () => request(app)
    .get(`/articles/XQRDdW/comments`)
    .expect((res) => expect(res.body.length).toBe(4))
  );

});

test(`API refuses to create a comment to non-existent article and returns status code 404`, () => {

  const app = createAPI();

  return request(app)
    .post(`/articles/NOEXST/comments`)
    .send({
      text: `Неважно`
    })
    .expect(HttpCode.NOT_FOUND);
});

test(`API refuses to create a comment when data is invalid, and returns status code 400`, () => {

  const app = createAPI();

  return request(app)
    .post(`/articles/XQRDdW/comments`)
    .send({})
    .expect(HttpCode.BAD_REQUEST);
});

describe(`API correctly deletes a comment`, () => {

  const app = createAPI();

  let response;

  beforeAll(async () => {
    response = await request(app)
      .delete(`/articles/XQRDdW/comments/E_IC1p`);
  });

  test(`Status code 200`, () => expect(response.statusCode).toBe(HttpCode.OK));

  test(`Returns comment deleted`, () => expect(response.body.id).toBe(`E_IC1p`));

  test(`Comments count is 2 now`, () => request(app)
    .get(`/articles/XQRDdW/comments`)
    .expect((res) => expect(res.body.length).toBe(2))
  );

});

test(`API refuses to delete non-existent comment`, () => {

  const app = createAPI();

  return request(app)
    .delete(`/articles/XQRDdW/comments/NOEXST`)
    .expect(HttpCode.NOT_FOUND);
});

test(`API refuses to delete a comment to non-existent article`, () => {

  const app = createAPI();

  return request(app)
    .delete(`/articles/NOEXST/comments/E_IC1p`)
    .expect(HttpCode.NOT_FOUND);
});
