'use strict';

const chalk = require(`chalk`);
const fs = require(`fs`).promises;

const {
  getRandomInt,
  getNewArray,
} = require(`../../utils/utils`);

const {
  ExitCode,
} = require(`../../constants`);

const DEFAULT_COUNT = 1;
const MAX_COMMENTS = 4;
const FILE_NAME = `fill-db.sql`;
const MAX_COUNT_ARTICALS = 1000;

const CountGeneration = {
  IMAGE: 3,
  SENTENCE: 5,
  COMMENT: 3
};

const MaxLengthString = {
  COLUMN: 249,
  FULLTEXT: 999,
  COMMENT: 99
};

const FILE_SENTENCES_PATH = `./data/sentences.txt`;
const FILE_TITLES_PATH = `./data/titles.txt`;
const FILE_CATEGORIES_PATH = `./data/categories.txt`;
const FILE_COMMENTS_PATH = `./data/comments.txt`;

const IMAGES = [`skyscraper@1x.jpg`, `forest@1x.jpg`, `sea@1x.jpg`, ``];

const readContent = async (filePath) => {
  try {
    const content = await fs.readFile(filePath, `utf8`);
    return content.trim().split(`\n`);
  } catch (err) {
    console.error(chalk.red(err));
    return [];
  }
};

const generateComments = (count, userCount, comments) => (
  Array.from({length: count}, (() => ({
    userId: getRandomInt(1, userCount),
    text: getNewArray(comments, CountGeneration.COMMENT).join(` `).slice(0, MaxLengthString.COMMENT),
  })))
);

const generateArticles = (count, titles, categories, userCount, sentences, comments) => (
  Array.from({length: count}, (() => ({
    userId: getRandomInt(1, userCount),
    title: titles[getRandomInt(0, titles.length - 1)].slice(0, MaxLengthString.COLUMN),
    announce: getNewArray(sentences, CountGeneration.SENTENCE).join(` `).slice(0, MaxLengthString.COLUMN),
    fullText: getNewArray(sentences, sentences.length).join(` `).slice(0, MaxLengthString.FULLTEXT),
    picture: IMAGES[getRandomInt(0, CountGeneration.IMAGE)],
    comments: generateComments(getRandomInt(1, MAX_COMMENTS), userCount, comments),
    category: getNewArray(categories, categories.length),
  })))
);

const users = [
  {
    email: `ivanov@example.com`,
    passwordHash: `5f4dcc3b5aa765d61d8327deb882cf99`,
    firstName: `Иван`,
    lastName: `Иванов`,
    avatar: `avatar1.jpg`
  },
  {
    email: `petrov@example.com`,
    passwordHash: `5f4dcc3b5aa765d61d8327deb882cf99`,
    firstName: `Пётр`,
    lastName: `Петров`,
    avatar: `avatar2.jpg`
  }
];

module.exports = {
  name: `--fill`,
  async run(args) {
    const sentences = await readContent(FILE_SENTENCES_PATH);
    const titles = await readContent(FILE_TITLES_PATH);
    const categories = await readContent(FILE_CATEGORIES_PATH);
    const commentSentences = await readContent(FILE_COMMENTS_PATH);

    const [count] = args;
    const countArticle = Number.parseInt(count, 10) || DEFAULT_COUNT;

    if (countArticle > MAX_COUNT_ARTICALS) {
      console.log(`Не больше 1000 публикаций`);
      process.exit(ExitCode.ERROR);
    }

    const articles = generateArticles(countArticle, titles, categories, users.length, sentences, commentSentences);

    const comments = articles.flatMap((article, index) => {
      article.comments.map((articleComment) => {
        articleComment[`articleId`] = index + 1;
        return articleComment[`articleId`];
      });
      return article.comments;
    });

    const articleCategories = articles.flatMap((article, index) =>
      article.category.map((categoryItem) => ({articleId: index + 1, categoryId: categories.indexOf(categoryItem) + 1}))
    );

    const userValues = users.map(
        ({email, passwordHash, firstName, lastName, avatar}) =>
          `('${email}', '${passwordHash}', '${firstName}', '${lastName}', '${avatar}')`
    ).join(`,\n`);

    const categoryValues = categories.map((name) => `('${name}')`).join(`,\n`);

    const articleValues = articles.map(
        ({title, announce, fullText, picture, userId}) =>
          `('${title}', '${announce}', '${fullText}', '${picture}', ${userId})`
    ).join(`,\n`);

    const articleCategoryValues = articleCategories.map(
        ({articleId, categoryId}) =>
          `(${articleId}, ${categoryId})`
    ).join(`,\n`);

    const commentValues = comments.map(
        ({text, userId, articleId}) =>
          `('${text}', ${userId}, ${articleId})`
    ).join(`,\n`);

    const content = `
INSERT INTO users(email, password_hash, first_name, last_name, avatar) VALUES
${userValues};
INSERT INTO categories(name) VALUES
${categoryValues};
ALTER TABLE articles DISABLE TRIGGER ALL;
INSERT INTO articles(title, announce, full_text, picture, user_id) VALUES
${articleValues};
ALTER TABLE articles ENABLE TRIGGER ALL;
ALTER TABLE article_categories DISABLE TRIGGER ALL;
INSERT INTO article_categories(article_id, category_id) VALUES
${articleCategoryValues};
ALTER TABLE article_categories ENABLE TRIGGER ALL;
ALTER TABLE comments DISABLE TRIGGER ALL;
INSERT INTO COMMENTS(text_comment, user_id, article_id) VALUES
${commentValues};
ALTER TABLE comments ENABLE TRIGGER ALL;`;

    try {
      await fs.writeFile(FILE_NAME, content);
      console.log(chalk.green(`Operation success. File created.`));
    } catch (err) {
      console.error(chalk.red(`Can't write data to file...`));
      process.exit(ExitCode.ERROR);
    }
  }
};
