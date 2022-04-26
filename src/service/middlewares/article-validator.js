'use strict';

const {KeyValidator} = require(`../../utils`);

const articleKeys = [`category`, `title`, `announce`, `createdDate`];

module.exports = new KeyValidator(articleKeys);
