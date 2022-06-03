'use strict';

const {Router} = require(`express`);
const category = require(`../api/category`);
const article = require(`../api/article`);
const search = require(`../api/search`);
const comment = require(`../api/comment`);
const user = require(`../api/user`);

const {
  CategoryService,
  SearchService,
  ArticleService,
  CommentService,
  UserService
} = require(`../data-service`);

const defineModels = require(`../models`);

const createApp = (sequelize) => {
  const app = new Router();

  defineModels(sequelize);

  (() => {
    category(app, new CategoryService(sequelize));
    search(app, new SearchService(sequelize));
    article(app, new ArticleService(sequelize), new CommentService(sequelize));
    comment(app, new CommentService(sequelize));
    user(app, new UserService(sequelize));
  })();

  return app;
};

module.exports = createApp;
