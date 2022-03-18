'use strict';

const getRandomInt = (min, max) => {
  min = Math.ceil(min);
  max = Math.floor(max);
  return Math.floor(Math.random() * (max - min + 1)) + min;
};

const shuffle = (someArray) => {
  for (let i = someArray.length - 1; i > 0; i--) {
    const randomPosition = Math.floor(Math.random() * i);
    [someArray[i], someArray[randomPosition]] = [someArray[randomPosition], someArray[i]];
  }

  return someArray;
};

const getFormatStringDate = (ms) => {
  const date = new Date(ms);
  const pieceDate = [
    `0${date.getMonth() + 1}`,
    `0${date.getDate()}`,
    `0${date.getHours()}`,
    `0${date.getMinutes()}`,
    `0${date.getSeconds()}`,
  ].map((item) => item.slice(-2));

  return `${date.getFullYear()}-${pieceDate[0]}-${pieceDate[1]} ${pieceDate[2]}:${pieceDate[3]}:${pieceDate[4]}`;
};

const getNewArray = (array, numberLength) => {
  const newArray = shuffle(array.slice());
  newArray.length = getRandomInt(1, numberLength);

  return newArray;
};

module.exports = {
  getRandomInt,
  getFormatStringDate,
  getNewArray,
  shuffle,
};
