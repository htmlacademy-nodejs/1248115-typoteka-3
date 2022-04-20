'use strict';

const {Router} = require(`express`);

const myRouter = new Router();

const api = require(`../api`).getAPI();

myRouter.get(`/`, async (req, res) => {
  const articles = await api.getArticles();
  res.render(`my`, {articles});
});

myRouter.get(`/comments`, async (req, res) => {
  const articles = await api.getArticles();
  const allComments = articles.reduce((acc, article) => acc.concat(article.comments), []);

  res.render(`comments`, {articles, allComments});
});

myRouter.get(`/categories`, async (req, res) => {
  const categories = await api.getCategories();
  res.render(`all-categories`, {categories});
});

module.exports = myRouter;
