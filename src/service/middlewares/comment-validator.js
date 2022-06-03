'use strict';

const Joi = require(`joi`);
const {KeyValidator} = require(`../../utils`);
const {RequestObject} = require(`../../constants`);

const ErrorMessage = {
  TEXT: `Комментарий содержит меньше 20 символов`,
  USER_ID: `Некорректный идентификатор пользователя`
};

const schema = Joi.object({
  text: Joi.string().min(20).required().messages({
    'string.min': ErrorMessage.TEXT
  }),
  userId: Joi.number().integer().positive().required().messages({
    'number.base': ErrorMessage.USER_ID
  })
});

module.exports = new KeyValidator(schema, RequestObject.BODY);
