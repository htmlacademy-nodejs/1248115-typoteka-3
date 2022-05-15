'use strict';

const fs = require(`fs`).promises;

const {
  getRandomInt,
  getNewArray,
} = require(`../../utils`);

const {
  ExitCode,
} = require(`../../constants`);

const {getLogger} = require(`../lib/logger`);
const createSequelize = require(`../lib/sequelize`);
const initDatabase = require(`../lib/init-db`);

const DEFAULT_COUNT = 1;
const MAX_COMMENTS = 4;

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

const generateComments = (count, comments) => (
  Array.from({length: count}, (() => ({
    text: getNewArray(comments, 3).join(` `).slice(0, 99),
  })))
);

const generateArticles = (count, titles, categories, sentences, comments) => (
  Array.from({length: count}, (() => ({
    title: titles[getRandomInt(0, titles.length - 1)].slice(0, 249),
    announce: getNewArray(sentences, 5).join(` `).slice(0, 249),
    fullText: getNewArray(sentences, sentences.length).join(` `).slice(0, 999),
    picture: IMAGES[getRandomInt(0, 3)],
    comments: generateComments(getRandomInt(1, MAX_COMMENTS), comments),
    categories: getNewArray(categories, categories.length),
  })))
);

module.exports = {
  name: `--filldb`,
  async run(args) {
    const sequelize = createSequelize();

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

    const [count] = args;
    const countArticle = Number.parseInt(count, 10) || DEFAULT_COUNT;

    if (countArticle > 1000) {
      console.log(`Не больше 1000 публикаций`);
      process.exit(ExitCode.ERROR);
    }

    const articles = generateArticles(countArticle, titles, categories, sentences, comments);

    return initDatabase(sequelize, {articles, categories});
  }
};
