'use strict';

const {Router} = require(`express`);
const asyncHandler = require(`express-async-handler`);
const api = require(`../api`).getAPI();
const upload = require(`../middlewares/upload`);
const {prepareErrors} = require(`../../utils/utils`);

const mainRouter = new Router();

const ARTICLES_PER_PAGE = 8;
const ARTICLES_PER_SECTION = 4;

mainRouter.get(`/`, asyncHandler(async (req, res) => {
  const {user} = req.session;
  let {page = 1} = req.query;
  page = +page;

  const limitPage = ARTICLES_PER_PAGE;
  const limitSection = ARTICLES_PER_SECTION;
  const offset = (page - 1) * ARTICLES_PER_PAGE;

  const [
    {
      current: {count, articles},
      commented
    },
    categories,
    comments
  ] = await Promise.all([
    api.getArticles({limitPage, offset, comments: true, limitSection}),
    api.getCategories(true),
    api.getComments(limitSection)
  ]);

  const totalPages = Math.ceil(count / ARTICLES_PER_PAGE);

  res.render(`main`, {articles, commented, page, totalPages, categories, comments, user});
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
