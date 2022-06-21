'use strict';

const KeyValidator = require(`./key-validator`);
const AsyncKeyValidator = require(`./async-key-validator`);

const getRandomInt = (min, max) => {
  min = Math.ceil(min);
  max = Math.floor(max);
  return Math.floor(Math.random() * (max - min + 1)) + min;
};

const shuffle = (someArray) => {
  const newSomeArray = someArray.slice();
  for (let i = newSomeArray.length - 1; i > 0; i--) {
    const randomPosition = Math.floor(Math.random() * i);
    [newSomeArray[i], newSomeArray[randomPosition]] = [newSomeArray[randomPosition], newSomeArray[i]];
  }

  return newSomeArray;
};

const getNewArray = (array, numberLength) => {
  return shuffle(array).slice(0, getRandomInt(1, numberLength));
};

const ensureArray = (value) => value ? Object.keys(value) : [];

const prepareErrors = (errors) => errors.response.data.split(`\n`);

module.exports = {
  getRandomInt,
  getNewArray,
  shuffle,
  ensureArray,
  prepareErrors,
  KeyValidator,
  AsyncKeyValidator,
};
