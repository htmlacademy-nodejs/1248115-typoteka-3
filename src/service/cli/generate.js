'use strict';

const {nanoid} = require(`nanoid`);
const chalk = require(`chalk`);
const fs = require(`fs`).promises;

const {
  getRandomInt,
  getNewArray,
} = require(`../../utils/utils`);

const {
  ExitCode,
  MAX_ID_LENGTH,
} = require(`../../constants`);

const DEFAULT_COUNT = 1;
const MAX_COMMENTS = 4;
const FILE_NAME = `mocks.json`;
const MAX_COUNT_ARTICALS = 1000;

const CountGeneration = {
  IMAGE: 3,
  SENTENCE: 5,
  COMMENT: 3
};

const FILE_SENTENCES_PATH = `./data/sentences.txt`;
const FILE_TITLES_PATH = `./data/titles.txt`;
const FILE_CATEGORIES_PATH = `./data/categories.txt`;
const FILE_COMMENTS_PATH = `./data/comments.txt`;

const MS_IN_MONTHS = 3 * 30 * 24 * 3600 * 1000;

const CreateDate = {
  DATE_MIN: new Date().getTime() - MS_IN_MONTHS,
  DATE_MAX: new Date().getTime(),
};

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

const getFormatStringDate = (dateString) => {
  const date = new Date(dateString);
  const piecesDate = [
    `${date.getDate()}`.padStart(2, `0`),
    `${date.getMonth() + 1}`.padStart(2, `0`),
    `${date.getHours()}`.padStart(2, `0`),
    `${date.getMinutes()}`.padStart(2, `0`),
  ];

  return `${piecesDate[0]}.${piecesDate[1]}.${date.getFullYear()}, ${piecesDate[2]}:${piecesDate[3]}`;
};

const generateComments = (count, comments) => (
  Array.from({length: count}, (() => ({
    id: nanoid(MAX_ID_LENGTH),
    text: getNewArray(comments, CountGeneration.COMMENT).join(` `),
  })))
);

const generateArticles = (count, titles, categories, sentences, comments) => (
  Array.from({length: count}, (() => ({
    id: nanoid(MAX_ID_LENGTH),
    title: titles[getRandomInt(0, titles.length - 1)],
    announce: getNewArray(sentences, CountGeneration.SENTENCE).join(` `),
    fullText: getNewArray(sentences, sentences.length).join(` `),
    createdDate: getFormatStringDate(getRandomInt(CreateDate.DATE_MIN, CreateDate.DATE_MAX)),
    category: getNewArray(categories, categories.length),
    comments: generateComments(getRandomInt(1, MAX_COMMENTS), comments),
    picture: IMAGES[getRandomInt(0, CountGeneration.IMAGE)],
  })))
);

module.exports = {
  name: `--generate`,
  async run(args) {
    const sentences = await readContent(FILE_SENTENCES_PATH);
    const titles = await readContent(FILE_TITLES_PATH);
    const categories = await readContent(FILE_CATEGORIES_PATH);
    const comments = await readContent(FILE_COMMENTS_PATH);

    const [count] = args;
    const countArticle = Number.parseInt(count, 10) || DEFAULT_COUNT;

    if (countArticle > MAX_COUNT_ARTICALS) {
      console.log(`Не больше 1000 публикаций`);
      process.exit(ExitCode.ERROR);
    }

    const content = JSON.stringify(generateArticles(countArticle, titles, categories, sentences, comments));

    try {
      await fs.writeFile(FILE_NAME, content);
      console.log(chalk.green(`Operation success. File created.`));
    } catch (err) {
      console.error(chalk.red(`Can't write data to file...`));
      process.exit(ExitCode.ERROR);
    }

  }
};
