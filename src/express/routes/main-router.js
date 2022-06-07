'use strict';

const {Router} = require(`express`);
const asyncHandler = require(`express-async-handler`);
const api = require(`../api`).getAPI();
const upload = require(`../middlewares/upload`);
const {prepareErrors} = require(`../../utils`);

const mainRouter = new Router();

const OFFERS_PER_PAGE = 8;

mainRouter.get(`/`, asyncHandler(async (req, res) => {
  const {user} = req.session;
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

  res.render(`sign-up`, {userData});
});

mainRouter.get(`/login`, (req, res) => {
  const userData = {
    email: ``
  };
  res.render(`login`, {userData});
});

mainRouter.get(`/search-page`, (req, res) => {
  const {user} = req.session;
  res.render(`search`, {results: [], search: ``, user});
});

mainRouter.get(`/search`, asyncHandler(async (req, res) => {
  const {user} = req.session;
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

mainRouter.post(`/login`, asyncHandler(async (req, res) => {
  const email = req.body[`email`];
  const password = req.body[`password`];

  try {
    const user = await api.auth(email, password);
    req.session.user = user;
    req.session.save(() => {
      res.redirect(`/`);
    });
  } catch (errors) {
    const userData = {
      email: req.body[`email`]
    };
    const validationMessages = prepareErrors(errors);
    res.render(`login`, {userData, validationMessages});
  }
}));

mainRouter.get(`/logout`, (req, res) => {
  delete req.session.user;
  req.session.save(() => {
    res.redirect(`/`);
  });
});


module.exports = mainRouter;
