'use strict';

const {HttpCode} = require(`./constants`);

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

const getFormatStringDate = (ms) => {
  const date = new Date(ms);
  const piecesDate = [
    `${date.getMonth() + 1}`.padStart(2, `0`),
    `${date.getDate()}`.padStart(2, `0`),
    `${date.getHours()}`.padStart(2, `0`),
    `${date.getMinutes()}`.padStart(2, `0`),
    `${date.getSeconds()}`.padStart(2, `0`),
  ];

  return `${date.getFullYear()}-${piecesDate[0]}-${piecesDate[1]} ${piecesDate[2]}:${piecesDate[3]}:${piecesDate[4]}`;
};

const getNewArray = (array, numberLength) => {
  return shuffle(array).slice(0, getRandomInt(1, numberLength));
};

class KeyValidator {
  constructor(keys) {
    this._keys = keys;
    this.validator = this.validator.bind(this);
  }

  validator(req, res, next) {
    const newObject = req.body;
    const keys = Object.keys(newObject);
    const keysExists = this._keys.every((key) => keys.includes(key));

    if (!keysExists) {
      res.status(HttpCode.BAD_REQUEST)
        .send(`Bad request`);
    }

    next();
  }
}

module.exports = {
  getRandomInt,
  getFormatStringDate,
  getNewArray,
  shuffle,
  KeyValidator,
};
