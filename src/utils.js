'use strict';

const {HttpCode, RequestObject} = require(`./constants`);

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

class KeyValidator {
  constructor(schema, reqObject) {
    this._schema = schema;
    this._reqObject = reqObject;
    this.validator = this.validator.bind(this);
  }

  validator(req, res, next) {

    const validateObject = (this._reqObject === RequestObject.BODY ? req.body : req.params);
    const {error} = this._schema.validate(validateObject, {abortEarly: false});

    if (error) {
      return res.status(HttpCode.BAD_REQUEST)
        .send(error.details.map((err) => err.message).join(`\n`));
    }

    return next();
  }
}

class AsyncKeyValidator {
  constructor(schema, duplicate) {
    this._schema = schema;
    this._duplicate = duplicate;
    this.validator = this.validator.bind(this);
  }

  validator(service) {
    return (
      async (req, res, next) => {

        const validateObject = req.body;
        const {error} = this._schema.validate(validateObject, {abortEarly: false});

        const stringMessage = `Значение ${this._duplicate[1]} уже используется`;

        if (error) {
          return res.status(HttpCode.BAD_REQUEST)
              .send(error.details.map((err) => err.message).join(`\n`));
        }

        const duplicateObject = await service.findCompareObject(req.body[this._duplicate[0]]);

        if (duplicateObject) {
          return res.status(HttpCode.BAD_REQUEST)
              .send(stringMessage);
        }

        return next();
      }
    );
  }
}

const ensureArray = (value) => value ? Object.keys(value) : [];

const prepareErrors = (errors) => errors.response.data.split(`\n`);

module.exports = {
  getRandomInt,
  getNewArray,
  shuffle,
  ensureArray,
  KeyValidator,
  AsyncKeyValidator,
  prepareErrors,
};
