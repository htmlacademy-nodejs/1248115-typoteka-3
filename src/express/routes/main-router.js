"use strict";

const {Router} = require(`express`);

const mainRouter = new Router();

const api = require(`../api`).getAPI();

mainRouter.get(`/`, async (req, res) => {
  const articles = await api.getArticles();
  res.render(`main`, {articles});
});

mainRouter.get(`/register`, (req, res) => res.render(`sign-up`));
mainRouter.get(`/login`, (req, res) => res.render(`login`));
mainRouter.get(`/search-page`, (req, res) => res.render(`search`, {results: [], search: ``}));
mainRouter.get(`/search`, async (req, res) => {
  try {
    const {search} = req.query;
    console.log(search);
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
