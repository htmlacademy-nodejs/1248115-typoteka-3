"use strict";

const {Router} = require(`express`);

const mainRouter = new Router();

const api = require(`../api`).getAPI();

mainRouter.get(`/`, async (req, res) => {
  const [
    articles,
    categories
  ] = await Promise.all([
    api.getArticles({comments: true}),
    api.getCategories(true)
  ]);

  res.render(`main`, {articles, categories});
});

mainRouter.get(`/register`, (req, res) => res.render(`sign-up`));
mainRouter.get(`/login`, (req, res) => res.render(`login`));
mainRouter.get(`/search-page`, (req, res) => res.render(`search`, {results: [], search: ``}));
mainRouter.get(`/search`, async (req, res) => {
  try {
    const {search} = req.query;
    const results = await api.search(search);
    res.render(`search`, {
      results,
      search
    });
  } catch (error) {
    const {search} = req.query;
    res.render(`search`, {
      results: [],
      search
    });
  }
});

module.exports = mainRouter;
