"use strict";

const {Router} = require(`express`);

const mainRouter = new Router();

const api = require(`../api`).getAPI();

const OFFERS_PER_PAGE = 8;
/*
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
*/

mainRouter.get(`/`, async (req, res) => {
  // получаем номер страницы
  let {page = 1} = req.query;
  page = +page;

  // количество запрашиваемых объявлений равно количеству объявлений на странице
  const limit = OFFERS_PER_PAGE;

  // количество объявлений, которое нам нужно пропустить - это количество объявлений на предыдущих страницах
  const offset = (page - 1) * OFFERS_PER_PAGE;
  const [
    {count, articles},
    categories
  ] = await Promise.all([
    api.getArticles({limit, offset, comments: true}),
    api.getCategories(true)
  ]);

  // количество страниц — это общее количество объявлений, поделённое на количество объявлений на странице (с округлением вверх)
  const totalPages = Math.ceil(count / OFFERS_PER_PAGE);

  // передадим все эти данные в шаблон
  res.render(`main`, {articles, page, totalPages, categories});
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
