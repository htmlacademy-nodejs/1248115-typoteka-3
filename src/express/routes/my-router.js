'use strict';

const {Router} = require(`express`);
const asyncHandler = require(`express-async-handler`);
const api = require(`../api`).getAPI();
const authAuthor = require(`../middlewares/auth-author`);

const myRouter = new Router();

myRouter.use(authAuthor);

myRouter.get(`/`, asyncHandler(async (req, res) => {
  const {user} = req.session;
  const articles = await api.getArticles();
  res.render(`my`, {articles, user});
}));

myRouter.get(`/comments`, asyncHandler(async (req, res) => {
  const {user} = req.session;
  const comments = await api.getComments();
  res.render(`comments`, {comments, user});
}));

myRouter.get(`/categories`, asyncHandler(async (req, res) => {
  const {user} = req.session;
  const categories = await api.getCategories();
  res.render(`all-categories`, {categories, user});
}));

module.exports = myRouter;
