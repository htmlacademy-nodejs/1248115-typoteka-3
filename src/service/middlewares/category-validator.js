'use strict';

const Joi = require(`joi`);
const {DuplicateParams} = require(`../../constants`);
const {AsyncKeyValidator} = require(`../../utils`);

const ErrorMessage = {
  NAME_MIN: `Заголовок содержит меньше 5 символов`,
  NAME_MAX: `Заголовок не может содержать более 30 символов`,
};

const schema = Joi.object({
  name: Joi.string().min(5).max(30).required().messages({
    'string.min': ErrorMessage.NAME_MIN,
    'string.max': ErrorMessage.NAME_MAX,
  }),
});

module.exports = new AsyncKeyValidator(schema, DuplicateParams.NAME);
