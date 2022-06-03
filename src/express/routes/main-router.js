'use strict';

const {Router} = require(`express`);
const asyncHandler = require(`express-async-handler`);
const api = require(`../api`).getAPI();
const upload = require(`../middlewares/upload`);
const {prepareErrors} = require(`../../utils`);

const mainRouter = new Router();

const OFFERS_PER_PAGE = 8;

/*
  let user = {
    id: 1,
    firstName: 'Иван',
    lastName: `Иванов`,
    email: 'ivanov@example.com',
    avatar: 'avatar-1.png',
    createdAt: '2022-06-01T15:24:24.461Z',
    updatedAt: '2022-06-01T15:24:24.461Z'
  }
  */
/*
  let user = {
    id: 2,
    firstName: 'Петр',
    lastName: `Петров`,
    email: 'petrov@example.com',
    avatar: 'avatar-2.png',
    createdAt: '2022-06-01T15:24:24.461Z',
    updatedAt: '2022-06-01T15:24:24.461Z'
  }
  */
let user = null;

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

  res.render(`main`, {articles, page, totalPages, categories, user});
}));

mainRouter.get(`/register`, (req, res) => {
  const userData = {
    avatar: ``,
    firstName: ``,
    lastName: ``,
    email: ``,
  };

  res.render(`sign-up`, {userData, user});
});

mainRouter.get(`/login`, (req, res) => {
  res.render(`login`, {user});
});

mainRouter.get(`/search-page`, (req, res) => {
  res.render(`search`, {results: [], search: ``, user});
});

mainRouter.get(`/search`, asyncHandler(async (req, res) => {
  try {
    const {search} = req.query;
    const results = await api.search(search);
    res.render(`search`, {
      results,
      search,
      user
    });
  } catch (error) {
    const {search} = req.query;
    res.render(`search`, {
      results: [],
      search,
      user
    });
  }
}));

mainRouter.post(`/register`, upload.single(`upload`), asyncHandler(async (req, res) => {
  const {body, file} = req;
  const userData = {
    avatar: file ? file.filename : body[`old-image`],
    firstName: body[`name`],
    lastName: body[`surname`],
    email: body[`email`],
    password: body[`password`],
    passwordRepeated: body[`repeat-password`]
  };

  try {
    await api.createUser(userData);
    res.redirect(`/login`);
  } catch (errors) {

    const validationMessages = prepareErrors(errors);
    res.render(`sign-up`, {userData, validationMessages});
  }
}));

mainRouter.get(`/logout`, (req, res) => {
  user = null;

  res.redirect(`/`);
});

module.exports = mainRouter;
