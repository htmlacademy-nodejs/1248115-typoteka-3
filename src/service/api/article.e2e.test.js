'use strict';

const express = require(`express`);
const request = require(`supertest`);
const Sequelize = require(`sequelize`);

const initDB = require(`../lib/init-db`);
const article = require(`./article`);
const DataService = require(`../data-service/article`);
const CommentService = require(`../data-service/comment`);

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

const mockArticles = [
  {
    title: `Как перестать беспокоиться и начать жить. Золотое сечение — соотношение двух величин`,
    picture: `sea.jpg`,
    announce: `Золотое сечение — соотношение двух величин, гармоническая пропорция. Он написал больше 30 хитов.`,
    fullText: `Он написал больше 30 хитов. Ёлки — это не просто красивое дерево. Это прочная древесина. Функция принимает на вход имя файла, из которого требуется прочитать информацию. Это один из лучших рок-музыкантов. Результатом функции должен быть массив, считанных строк. Программировать не настолько сложно, как об этом говорят. Помните, небольшое количество ежедневных упражнений лучше, чем один раз, но много. Золотое сечение — соотношение двух величин, гармоническая пропорция. Освоить вёрстку несложно. Возьмите книгу новую книгу и закрепите все упражнения на практике. Первая большая ёлка была установлена только в 1938 году. Из под его пера вышло 8 платиновых альбомов. Бороться с прокрастинацией несложно. Просто действуйте. Маленькими шагами. Как начать действовать? Для начала просто соберитесь. Собрать камни бесконечности легко, если вы прирожденный герой. Этот смартфон — настоящая находка.`,
    categories: [`Мебель`],
    comments: [
      {
        text: `Плюсую, но слишком много буквы! Планируете записать видосик на эту тему? Это где ж такие красоты?`
      },
      {
        text: `Мне кажется или я уже читал это где-то? Хочу такую же футболку :-) Плюсую, но слишком много !`
      }
    ]
  },
  {
    title: `Ёлки. История деревьев. Ёлки. История деревьев`,
    picture: ``,
    announce: `Собрать камни бесконечности легко, если вы прирожденный герой. Вы можете достичь всего. Стоит только немного постараться и запастись книгами. Освоить вёрстку несложно. Возьмите книгу новую книгу и закрепите все упражнения на практике.`,
    fullText: `Это один из лучших рок-музыкантов. Игры и программирование разные вещи. Не стоит идти в программисты, если вам нравятся только игры. Золотое сечение — соотношение двух величин, гармоническая пропорция. Он написал больше 30 хитов. Рок-музыка всегда ассоциировалась с протестами. Так ли это на самом деле? Освоить вёрстку несложно. Возьмите книгу новую книгу и закрепите все упражнения на практике. Результатом функции должен быть массив, считанных строк. Этот смартфон — настоящая находка. Большой и яркий экран, мощнейший процессор — всё это в небольшом гаджете.`,
    categories: [`Игрушки`, `Музыка`, `Программирование`, `За жизнь`, `Без рамки`],
    comments: [
      {
        text: `Хочу такую же футболку :-) Давно не пользуюсь стационарными компьютерами. Ноутбуки победили.`
      }
    ]
  },
  {
    title: `Как выучить JS. Лучшие языки программирования`,
    picture: `sea123.jpg`,
    announce: `Собрать камни бесконечности легко, если вы прирожденный герой. Это один из лучших рок-музыкантов. Программировать не настолько сложно, как об этом говорят. Как начать действовать? Для начала просто соберитесь.`,
    fullText: `Напишите функцию для чтения информации из файлов. Из под его пера вышло 8 платиновых альбомов. Простые ежедневные упражнения помогут достичь успеха. Функция принимает на вход имя файла, из которого требуется прочитать информацию. Освоить вёрстку несложно. Возьмите книгу новую книгу и закрепите все упражнения на практике. Он написал больше 30 хитов. Ёлки — это не просто красивое дерево. Это прочная древесина. Рок-музыка всегда ассоциировалась с протестами. Так ли это на самом деле? Как начать действовать? Для начала просто соберитесь. Этот смартфон — настоящая находка. Большой и яркий экран, мощнейший процессор — всё это в небольшом гаджете. Процессор заслуживает особого внимания. Он обязательно понравится геймерам со стажем. Вы можете достичь всего. Стоит только немного постараться и запастись книгами. Альбом стал настоящим открытием года. Мощные гитарные рифы и скоростные соло-партии не дадут заскучать.`,
    categories: [`Игрушки`, `Программирование`, `Музыка`],
    comments: [
      {
        text: `Мне не нравится ваш стиль. Ощущение, что вы меня поучаете. Планируете записать видосик?`
      },
      {
        text: `Согласен с автором! Мне не нравится ваш стиль. Ощущение, что вы меня поучаете. `
      },
      {
        text: `Планируете записать видосик на эту тему?`
      }
    ]
  },
  {
    title: `Лучшие языки программирования. Лучшие языки программирования`,
    picture: ``,
    announce: `Как начать действовать? Для начала просто соберитесь. Золотое сечение — соотношение двух величин, гармоническая пропорция. Этот смартфон — настоящая находка. Большой и яркий экран, мощнейший процессор — всё это в небольшом гаджете.`,
    fullText: `Программировать не настолько сложно, как об этом говорят. Золотое сечение — соотношение двух величин, гармоническая пропорция. Достичь успеха помогут ежедневные повторения. Освоить вёрстку несложно. Возьмите книгу новую книгу и закрепите все упражнения на практике. Вы можете достичь всего. Стоит только немного постараться и запастись книгами. Помните, небольшое количество ежедневных упражнений лучше, чем один раз, но много. Функция принимает на вход имя файла, из которого требуется прочитать информацию. Ёлки — это не просто красивое дерево. Это прочная древесина. Альбом стал настоящим открытием года. Мощные гитарные рифы и скоростные соло-партии не дадут заскучать. Как начать действовать? Для начала просто соберитесь. Бороться с прокрастинацией несложно. Просто действуйте. Маленькими шагами. Результатом функции должен быть массив, считанных строк. Рок-музыка всегда ассоциировалась с протестами.`,
    categories: [`Кино`, `Игрушки`, `Железо`, `Авто`, `Разное`, `Программирование`, `Без рамки`],
    comments: [
      {
        text: `Мне не нравится ваш стиль. Ощущение, что вы меня поучаете.`
      },
      {
        text: `Давно не пользуюсь стационарными компьютерами. Ноутбуки победили. Хочу такую`
      },
      {
        text: `Хочу такую же футболку :-)`
      }
    ]
  },
  {
    title: `Учим HTML и CSS. Учим HTML и CSS.`,
    picture: `seaerwet.jpg`,
    announce: `Функция принимает на вход имя файла, из которого требуется прочитать информацию.`,
    fullText: `Освоить вёрстку несложно. Возьмите книгу новую книгу и закрепите все упражнения на практике. Программировать не настолько сложно, как об этом говорят. Функция принимает на вход имя файла, из которого требуется прочитать информацию. Первая большая ёлка была установлена только в 1938 году. Из под его пера вышло 8 платиновых альбомов. Ёлки — это не просто красивое дерево. Это прочная древесина. Простые ежедневные упражнения помогут достичь успеха. Игры и программирование разные вещи. Не стоит идти в программисты, если вам нравятся только игры. Он написал больше 30 хитов. Помните, небольшое количество ежедневных упражнений лучше, чем один раз, но много. Вы можете достичь всего. Стоит только немного постараться и запастись книгами. Как начать действовать? Для начала просто соберитесь. Это один из лучших рок-музыкантов. Альбом стал настоящим открытием года. Мощные гитарные рифы и скоростные соло-партии не дадут заскучать.`,
    categories: [`Разное`, `Музыка`, `Игрушки`, `Железо`, `За жизнь`, `Программирование`, `Мебель`, `Деревья`, `Без рамки`, `Кино`, `Авто`],
    comments: [
      {
        text: `Планируете записать видосик на эту тему? Давно не пользуюсь стационарными`
      },
      {
        text: `Мне кажется или я уже читал это где-то?`
      },
      {
        text: `Мне кажется или я уже читал это где-то? Давно не пользуюсь .`
      },
      {
        text: `Давно не пользуюсь стационарными компьютерами. Ноутбуки победили.!`
      }
    ]
  }
];

const createAPI = async () => {
  const mockDB = new Sequelize(`sqlite::memory:`, {logging: false});
  await initDB(mockDB, {categories: mockCategories, articles: mockArticles});
  const app = express();
  app.use(express.json());
  article(app, new DataService(mockDB), new CommentService(mockDB));
  return app;
};

describe(`API returns a list of all articles`, () => {

  let response;

  beforeAll(async () => {
    const app = await createAPI();
    response = await request(app)
      .get(`/articles`);
  });

  test(`Status code 200`, () => expect(response.statusCode).toBe(HttpCode.OK));

  test(`Returns a list of 5 articles`, () => expect(response.body.length).toBe(5));

  test(`Last article's title equals "Как перестать беспокоиться и начать жить. Золотое сечение — соотношение двух величин"`, () => expect(response.body[4].title).toBe(`Как перестать беспокоиться и начать жить. Золотое сечение — соотношение двух величин`));

});

describe(`API returns an article with given id`, () => {

  let response;

  beforeAll(async () => {
    const app = await createAPI();
    response = await request(app)
      .get(`/articles/1`);
  });

  test(`Status code 200`, () => expect(response.statusCode).toBe(HttpCode.OK));

  test(`Article's title is "Как перестать беспокоиться и начать жить. Золотое сечение — соотношение двух величин"`, () => expect(response.body.title).toBe(`Как перестать беспокоиться и начать жить. Золотое сечение — соотношение двух величин`));

});

describe(`API creates an article if data is valid`, () => {

  const newArticle = {
    categories: [1, 2],
    picture: ``,
    title: `Дам погладить котика, очень хороший котик, церного цвета `,
    fullText: `Дам погладить котика. Дорого. Не гербалайф. К лотку приучен.`,
    announce: `Дам погладить котика. Бесплатно. Отдам вхорошие руки`
  };

  let app; let response;

  beforeAll(async () => {
    app = await createAPI();
    response = await request(app)
      .post(`/articles`)
      .send(newArticle);
  });

  test(`Status code 201`, () => expect(response.statusCode).toBe(HttpCode.CREATED));

  test(`Articles count is changed`, () => request(app)
    .get(`/articles`)
    .expect((res) => expect(res.body.length).toBe(6))
  );

});

describe(`API refuses to create an article if data is invalid`, () => {

  const newArticle = {
    categories: [1, 2],
    title: `Дам погладить котика`,
    fullText: `Дам погладить котика. Дорого. Не гербалайф. К лотку приучен.`,
    announce: `Дам погладить котика. Бесплатно.`
  };

  let app;

  beforeAll(async () => {
    app = await createAPI();
  });

  test(`Without any required property response code is 400`, async () => {
    for (const key of Object.keys(newArticle)) {
      const badArticle = {...newArticle};
      if (key === `fullText`) {
        continue;
      }
      delete badArticle[key];
      await request(app)
        .post(`/articles`)
        .send(badArticle)
        .expect(HttpCode.BAD_REQUEST);
    }
  });

  test(`When field type is wrong response code is 400`, async () => {
    const badArticles = [
      {...newArticle, announce: true},
      {...newArticle, picture: 12345},
      {...newArticle, categories: `Котики`}
    ];
    for (const badArticle of badArticles) {
      await request(app)
        .post(`/articles`)
        .send(badArticle)
        .expect(HttpCode.BAD_REQUEST);
    }
  });

  test(`When field value is wrong response code is 400`, async () => {
    const badArticles = [
      {...newArticle, picture: `sea.gif`},
      {...newArticle, title: `too short`},
      {...newArticle, categories: []}
    ];
    for (const badArticle of badArticles) {
      await request(app)
        .post(`/articles`)
        .send(badArticle)
        .expect(HttpCode.BAD_REQUEST);
    }
  });
});

describe(`API changes existent article`, () => {
  const newArticle = {
    categories: [3, 4],
    picture: `sea123.jpg`,
    title: `Дам погладить песика. Дам погладить песика. Дам погладить песика`,
    fullText: `Дам погладить котика. Дорого. Не гербалайф. К лотку приучен.`,
    announce: `Дам погладить котика. Бесплатно. Дам погладить котика. Бесплатно.`
  };

  let app; let response;

  beforeAll(async () => {
    app = await createAPI();
    response = await request(app)
      .put(`/articles/2`)
      .send(newArticle);
  });

  test(`Status code 200`, () => expect(response.statusCode).toBe(HttpCode.OK));

  test(`article is really changed`, () => request(app)
    .get(`/articles/2`)
    .expect((res) => expect(res.body.title).toBe(`Дам погладить песика. Дам погладить песика. Дам погладить песика`))
  );

});

test(`API returns status code 404 when trying to change non-existent article`, async () => {

  const app = await createAPI();

  const validArticle = {
    categories: [3, 4],
    picture: `sea.jpg`,
    title: `Это вполне валидный объект. Это вполне валидный объект`,
    fullText: `однако поскольку такоой статьи в базе нет`,
    announce: `мы получим 404, мы получим 404, мы получим 404, мы получим 404`
  };

  return request(app)
    .put(`/articles/20`)
    .send(validArticle)
    .expect(HttpCode.NOT_FOUND);
});

test(`API returns status code 400 when trying to change an article with invalid data`, async () => {

  const app = await createAPI();

  const invalidArticle = {
    categories: [1, 2],
    title: `Это невалидный`,
    description: 123,
    picture: `объявления`,
  };

  return request(app)
    .put(`/articles/20`)
    .send(invalidArticle)
    .expect(HttpCode.BAD_REQUEST);
});

describe(`API correctly deletes an article`, () => {

  let app; let response;

  beforeAll(async () => {
    app = await createAPI();
    response = await request(app)
      .delete(`/articles/1`);
  });

  test(`Status code 200`, () => expect(response.statusCode).toBe(HttpCode.OK));

  test(`article count is 4 now`, () => request(app)
    .get(`/articles`)
    .expect((res) => expect(res.body.length).toBe(4))
  );

});

test(`API refuses to delete non-existent article`, async () => {

  const app = await createAPI();

  return request(app)
    .delete(`/articles/20`)
    .expect(HttpCode.NOT_FOUND);

});

describe(`API returns a list of comments to given article`, () => {

  let response;

  beforeAll(async () => {
    const app = await createAPI();
    response = await request(app)
      .get(`/articles/2/comments`);
  });

  test(`Status code 200`, () => expect(response.statusCode).toBe(HttpCode.OK));

  test(`Returns list of 1 comments`, () => expect(response.body.length).toBe(1));

  test(`First comment's text is "Хочу такую же футболку :-) Давно не пользуюсь стационарными компьютерами. Ноутбуки победили."`,
      () => expect(response.body[0].text).toBe(`Хочу такую же футболку :-) Давно не пользуюсь стационарными компьютерами. Ноутбуки победили.`));

});

describe(`API creates a comment if data is valid`, () => {

  const newComment = {
    text: `Валидному комментарию достаточно этих полей`,
  };

  let app; let response;

  beforeAll(async () => {
    app = await createAPI();
    response = await request(app)
      .post(`/articles/2/comments`)
      .send(newComment);
  });


  test(`Status code 201`, () => expect(response.statusCode).toBe(HttpCode.CREATED));

  test(`Comments count is changed`, () => request(app)
    .get(`/articles/2/comments`)
    .expect((res) => expect(res.body.length).toBe(2))
  );

});

test(`API refuses to create a comment to non-existent article and returns status code 404`, async () => {

  const app = await createAPI();

  return request(app)
    .post(`/articles/20/comments`)
    .send({
      text: `Неважно`
    })
    .expect(HttpCode.NOT_FOUND);

});

test(`API refuses to create a comment when data is invalid, and returns status code 400`, async () => {

  const invalidComment = {

  };

  const app = await createAPI();

  return request(app)
    .post(`/articles/2/comments`)
    .send(invalidComment)
    .expect(HttpCode.BAD_REQUEST);

});

describe(`API correctly deletes a comment`, () => {

  let app; let response;

  beforeAll(async () => {
    app = await createAPI();
    response = await request(app)
      .delete(`/articles/1/comments/1`);
  });

  test(`Status code 200`, () => expect(response.statusCode).toBe(HttpCode.OK));

  test(`Comments count is 1 now`, () => request(app)
    .get(`/articles/1/comments`)
    .expect((res) => expect(res.body.length).toBe(1))
  );

});

test(`API refuses to delete non-existent comment`, async () => {

  const app = await createAPI();

  return request(app)
    .delete(`/articles/4/comments/100`)
    .expect(HttpCode.NOT_FOUND);

});

test(`API refuses to delete a comment to non-existent article`, async () => {

  const app = await createAPI();

  return request(app)
    .delete(`/articles/20/comments/1`)
    .expect(HttpCode.NOT_FOUND);

});
