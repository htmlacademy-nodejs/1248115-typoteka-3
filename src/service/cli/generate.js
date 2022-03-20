'use strict';

const chalk = require(`chalk`);
const fs = require(`fs`).promises;

const {
  getRandomInt,
  getFormatStringDate,
  getNewArray,
} = require(`../../utils`);

const {
  ExitCode
} = require(`../../constants`);

const DEFAULT_COUNT = 1;
const FILE_NAME = `mocks.json`;

const FILE_SENTENCES_PATH = `./data/sentences.txt`;
const FILE_TITLES_PATH = `./data/titles.txt`;
const FILE_CATEGORIES_PATH = `./data/categories.txt`;

const CreateDate = {
  DATE_MIN: new Date().getTime() - 3 * 30 * 24 * 3600 * 1000,
  DATE_MAX: new Date().getTime(),
};

const readContent = async (filePath) => {
  try {
    const content = await fs.readFile(filePath, `utf8`);
    return content.trim().split(`\n`);
  } catch (err) {
    console.error(chalk.red(err));
    return [];
  }
};

const generateOffers = (count, titles, categories, sentences) => (
  Array.from({length:count}, (() => ({
    title: titles[getRandomInt(0, titles.length - 1)],
    announce: getNewArray(sentences, 5).join(` `),
    fullText: getNewArray(sentences, sentences.length).join(` `),
    createdDate: getFormatStringDate(getRandomInt(CreateDate.DATE_MIN, CreateDate.DATE_MAX)),
    category: getNewArray(categories, categories.length),
  })))
);

module.exports = {
  name: `--generate`,
  async run(args) {
    const sentences = await readContent(FILE_SENTENCES_PATH);
    const titles = await readContent(FILE_TITLES_PATH);
    const categories = await readContent(FILE_CATEGORIES_PATH);

    const [count] = args;
    const countOffer = Number.parseInt(count, 10) || DEFAULT_COUNT;

    if (countOffer > 1000) {
      console.log(`Не больше 1000 публикаций`);
      process.exit(ExitCode.ERROR);
    }

    const content = JSON.stringify(generateOffers(countOffer, titles, categories, sentences));

    try {
      await fs.writeFile(FILE_NAME, content);
      console.log(chalk.green(`Operation success. File created.`));
      return;
    } catch (err) {
      console.error(chalk.red(`Can't write data to file...`));
      process.exit(ExitCode.ERROR);
    }

  }
};
