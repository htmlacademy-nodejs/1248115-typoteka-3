'use strict';

const {KeyValidator} = require(`../../utils`);

const articleKeys = [`category`, `title`, `announce`, `fullText`, `createdDate`];

module.exports = new KeyValidator(articleKeys);
