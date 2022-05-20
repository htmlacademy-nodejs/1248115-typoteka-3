'use strict';

const {Router} = require(`express`);
const asyncHandler = require(`express-async-handler`);
const api = require(`../api`).getAPI();

const myRouter = new Router();

myRouter.get(`/`, asyncHandler(async (req, res) => {
  const articles = await api.getArticles();
  res.render(`my`, {articles});
}));

myRouter.get(`/comments`, asyncHandler(async (req, res) => {
  const comments = await api.getComments();
  res.render(`comments`, {comments});
}));

myRouter.get(`/categories`, asyncHandler(async (req, res) => {
  const categories = await api.getCategories();
  res.render(`all-categories`, {categories});
}));

module.exports = myRouter;
