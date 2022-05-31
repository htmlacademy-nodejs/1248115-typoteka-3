'use strict';

const Joi = require(`joi`);
const {KeyValidator} = require(`../../utils`);

const ErrorMessage = {
  CATEGORIES: `Не выбрана ни одна категория объявления`,
  TITLE_MIN: `Заголовок содержит меньше 30 символов`,
  TITLE_MAX: `Заголовок не может содержать более 250 символов`,
  TITLE_EMPTY: `Заголовок не должен быть пустым`,
  ANNOUNCE_MIN: `Анонс содержит меньше 30 символов`,
  ANNOUNCE_MAX: `Анонс не может содержать более 250 символов`,
  ANNOUNCE_EMPTY: `Анонс не должен быть пустым`,
  FULLTEXT_MAX: `Полный текст не может содержать более 1000 символов`,
  PICTURE_TYPE: `Tип изображения не поддерживается`,
  PICTURE_MAX: `Название файла не должно превышать 50 символов`,
};

const schema = Joi.object({
  categories: Joi.array().items(
      Joi.number().integer().positive()).min(1).messages({'array.min': ErrorMessage.CATEGORIES}).required(),
  title: Joi.string().min(30).max(250).required().messages({
    'string.min': ErrorMessage.TITLE_MIN,
    'string.max': ErrorMessage.TITLE_MAX,
    'string.empty': ErrorMessage.TITLE_EMPTY,
  }),
  announce: Joi.string().min(30).max(250).required().messages({
    'string.min': ErrorMessage.ANNOUNCE_MIN,
    'string.max': ErrorMessage.ANNOUNCE_MAX,
    'string.empty': ErrorMessage.ANNOUNCE_EMPTY,
  }),
  fullText: Joi.string().allow(``).max(1000).messages({
    'string.max': ErrorMessage.FULLTEXT_MAX
  }),
  picture: Joi.string().allow(``).max(50).pattern(/\S+(\.jpg|\.jpeg|\.png)$/).messages({
    'string.pattern.base': ErrorMessage.PICTURE_TYPE,
    'string.max': ErrorMessage.PICTURE_MAX,
  }),
});

module.exports = new KeyValidator(schema);
