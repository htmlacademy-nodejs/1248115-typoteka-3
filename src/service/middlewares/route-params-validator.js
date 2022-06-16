'use strict';

const Joi = require(`joi`);
const {KeyValidator} = require(`../../utils`);
const {RequestObject} = require(`../../constants`);

const schema = Joi.object({
  articleId: Joi.number().integer().min(1),
  commentId: Joi.number().integer().min(1),
  categoryId: Joi.number().integer().min(1),
});

module.exports = new KeyValidator(schema, RequestObject.PARAMS);
