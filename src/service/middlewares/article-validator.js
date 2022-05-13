'use strict';

const {KeyValidator} = require(`../../utils`);

const articleKeys = [`categories`, `title`, `announce`];

module.exports = new KeyValidator(articleKeys);
