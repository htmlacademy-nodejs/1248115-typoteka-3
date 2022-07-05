'use strict';

const fs = require(`fs`).promises;

const {
  getRandomInt,
  getNewArray,
} = require(`../../utils/utils`);

const {
  ExitCode,
} = require(`../../constants`);

const {getLogger} = require(`../lib/logger`);
const createConnectionDB = require(`../lib/sequelize`);
const initDatabase = require(`../lib/init-db`);
const passwordUtils = require(`../lib/password`);

const DEFAULT_COUNT = 1;
const MAX_COMMENTS = 4;
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

const logger = getLogger({});

const readContent = async (filePath) => {
  try {
    const content = await fs.readFile(filePath, `utf8`);
    return content.trim().split(`\n`);
  } catch (err) {
    logger.error(`Error when reading file: ${err.message}`);
    return [];
  }
};

const generateComments = (count, comments, users) => (
  Array.from({length: count}, (() => ({
    text: getNewArray(comments, CountGeneration.COMMENT).join(` `).slice(0, MaxLengthString.COMMENT),
    user: users[getRandomInt(0, users.length - 1)].email,
  })))
);

const generateArticles = (count, titles, categories, sentences, comments, users) => (
  Array.from({length: count}, (() => ({
    user: users[getRandomInt(0, users.length - 1)].email,
    title: titles[getRandomInt(0, titles.length - 1)].slice(0, MaxLengthString.COLUMN),
    announce: getNewArray(sentences, CountGeneration.SENTENCE).join(` `).slice(0, MaxLengthString.COLUMN),
    fullText: getNewArray(sentences, sentences.length).join(` `).slice(0, MaxLengthString.FULLTEXT),
    picture: IMAGES[getRandomInt(0, CountGeneration.IMAGE)],
    comments: generateComments(getRandomInt(1, MAX_COMMENTS), comments, users),
    categories: getNewArray(categories, categories.length),
  })))
);

module.exports = {
  name: `--filldb`,
  async run(args) {
    const sequelize = createConnectionDB();

    try {
      logger.info(`Trying to connect to database...`);
      await sequelize.authenticate();
    } catch (err) {
      logger.error(`An error occured: ${err.message}`);
      process.exit(ExitCode.ERROR);
    }
    logger.info(`Connection to database established`);

    const sentences = await readContent(FILE_SENTENCES_PATH);
    const titles = await readContent(FILE_TITLES_PATH);
    const categories = await readContent(FILE_CATEGORIES_PATH);
    const comments = await readContent(FILE_COMMENTS_PATH);

    const users = [
      {
        firstName: `Иван`,
        lastName: `Иванов`,
        email: `ivanov@example.com`,
        passwordHash: await passwordUtils.hash(`ivanov`),
        avatar: `avatar-1.png`
      },
      {
        firstName: `Пётр`,
        lastName: `Петров`,
        email: `petrov@example.com`,
        passwordHash: await passwordUtils.hash(`petrov`),
        avatar: `avatar-2.png`
      }
    ];

    const [count] = args;
    const countArticle = Number.parseInt(count, 10) || DEFAULT_COUNT;

    if (countArticle > MAX_COUNT_ARTICALS) {
      console.log(`Не больше 1000 публикаций`);
      process.exit(ExitCode.ERROR);
    }

    const articles = generateArticles(countArticle, titles, categories, sentences, comments, users);

    return initDatabase(sequelize, {articles, categories, users});
  }
};
