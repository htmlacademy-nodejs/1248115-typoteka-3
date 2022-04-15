'use strict';

const {KeyValidator} = require(`../../utils`);

const commentKeys = [`text`];

module.exports = new KeyValidator(commentKeys);
