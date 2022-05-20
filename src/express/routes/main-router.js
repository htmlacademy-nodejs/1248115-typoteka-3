'use strict';

const {Router} = require(`express`);
const asyncHandler = require(`express-async-handler`);
const api = require(`../api`).getAPI();

const mainRouter = new Router();

const OFFERS_PER_PAGE = 8;

mainRouter.get(`/`, asyncHandler(async (req, res) => {
  let {page = 1} = req.query;
  page = +page;

  const limit = OFFERS_PER_PAGE;
  const offset = (page - 1) * OFFERS_PER_PAGE;
  const [
    {count, articles},
    categories
  ] = await Promise.all([
    api.getArticles({limit, offset, comments: true}),
    api.getCategories(true)
  ]);

  const totalPages = Math.ceil(count / OFFERS_PER_PAGE);

  res.render(`main`, {articles, page, totalPages, categories});
}));

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
