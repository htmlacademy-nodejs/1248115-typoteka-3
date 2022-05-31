'use strict';

const Joi = require(`joi`);
const {KeyValidator} = require(`../../utils`);

const ErrorMessage = {
  TEXT: `Комментарий содержит меньше 20 символов`,
};

const schema = Joi.object({
  text: Joi.string().min(20).required().messages({
    'string.min': ErrorMessage.TEXT
  }),
});

module.exports = new KeyValidator(schema);
