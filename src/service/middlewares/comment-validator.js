'use strict';

const Joi = require(`joi`);
const {KeyValidator} = require(`../../utils/utils`);
const {RequestObject} = require(`../../constants`);

const ErrorMessage = {
  TEXT_MIN: `Комментарий содержит меньше 20 символов`,
  TEXT_MAX: `Комментарий содержит больше 250 символов`,
  USER_ID: `Некорректный идентификатор пользователя`
};

const schema = Joi.object({
  text: Joi.string().min(20).max(250).required().messages({
    'string.min': ErrorMessage.TEXT_MIN,
    'string.max': ErrorMessage.TEXT_MAX,
  }),
  userId: Joi.number().integer().positive().required().messages({
    'number.base': ErrorMessage.USER_ID
  })
});

module.exports = new KeyValidator(schema, RequestObject.BODY);
