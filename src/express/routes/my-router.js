'use strict';

const {Router} = require(`express`);
const asyncHandler = require(`express-async-handler`);
const api = require(`../api`).getAPI();
const authAuthor = require(`../middlewares/auth-author`);
const {prepareErrors} = require(`../../utils/utils`);
const csrf = require(`csurf`);
const {Action} = require(`../../constants`);

const myRouter = new Router();
const csrfProtection = csrf();

myRouter.use(authAuthor);

myRouter.get(`/`, asyncHandler(async (req, res) => {
  const {user} = req.session;
  const {currentArticles} = await api.getArticles();
  res.render(`my`, {currentArticles, user});
}));

myRouter.get(`/comments`, asyncHandler(async (req, res) => {
  const {user} = req.session;
  const comments = await api.getComments();
  res.render(`comments`, {comments, user});
}));

myRouter.get(`/categories`, csrfProtection, asyncHandler(async (req, res) => {
  const {user} = req.session;
  const categories = await api.getCategories();
  const categoryData = {
    name: ``
  };
  res.render(`all-categories`, {categories, user, categoryData, csrfToken: req.csrfToken()});
}));

myRouter.get(`/articles/:id`, asyncHandler(async (req, res) => {
  const {id} = req.params;

  try {
    await api.removeArticle(id);
    res.redirect(`/my`);
  } catch (errors) {
    res.status(errors.response.status).send(errors.response.statusText);
  }
}));

myRouter.get(`/comments/:commentId`, asyncHandler(async (req, res) => {
  const {commentId} = req.params;

  try {
    await api.removeComment(commentId);

    const io = req.app.locals.socketio;
    io.emit(`comment:update`);

    res.redirect(`/my/comments`);
  } catch (errors) {
    res.status(errors.response.status).send(errors.response.statusText);
  }
}));

myRouter.post(`/category/add`, csrfProtection, asyncHandler(async (req, res) => {
  const {user} = req.session;
  const {body} = req;
  const categoryData = {
    name: body[`add-category`]
  };

  try {
    await api.createCategory(categoryData);
    res.redirect(`/my/categories`);
  } catch (errors) {
    const categories = await api.getCategories();
    const validationMessages = prepareErrors(errors);
    res.render(`all-categories`, {categories, validationMessages, user, categoryData, csrfToken: req.csrfToken()});
  }
}));

myRouter.post(`/categories/:categoryId`, csrfProtection, asyncHandler(async (req, res) => {
  const {user} = req.session;
  const {categoryId} = req.params;
  const {body} = req;

  const categoryData = {
    name: ``
  };

  try {
    if (body.action === Action.EDIT) {
      const categoryEditData = {
        name: body[`category-${categoryId}`]
      };
      await api.editCategory(categoryId, categoryEditData);
    } else {
      await api.removeCategory(categoryId);
    }
    res.redirect(`/my/categories`);
  } catch (errors) {
    const categories = await api.getCategories();
    const validationMessages = prepareErrors(errors);
    res.render(`all-categories`, {categories, validationMessages, user, categoryData, csrfToken: req.csrfToken()});
  }
}));

module.exports = myRouter;
