'use strict';

const {Router} = require(`express`);
const api = require(`../api`).getAPI();
const multer = require(`multer`);
const path = require(`path`);
const {nanoid} = require(`nanoid`);
const {ensureArray, prepareErrors} = require(`../../utils`);
const asyncHandler = require(`express-async-handler`);
const {Action} = require(`../../constants`);
const auth = require(`../middlewares/auth`);
const authAuthor = require(`../middlewares/auth-author`);
const csrf = require(`csurf`);

const MAX_COMMENT_STRING = 100;

const cutLongString = (string, maxlength) => {
  return string.length > maxlength ? `${string.slice(0, maxlength - 1)}…` : string;
};

const UPLOAD_DIR = `../upload/img/`;
const uploadDirAbsolute = path.resolve(__dirname, UPLOAD_DIR);

const articlesRouter = new Router();
const csrfProtection = csrf();

const storage = multer.diskStorage({
  destination: uploadDirAbsolute,
  filename: (req, file, cb) => {
    const uniqueName = nanoid(10);
    const extension = file.originalname.split(`.`).pop();
    cb(null, `${uniqueName}.${extension}`);
  }
});

const upload = multer({storage});

articlesRouter.post(`/add`, authAuthor, upload.single(`upload`), csrfProtection, asyncHandler(async (req, res) => {
  const {user} = req.session;
  const {body, file} = req;
  const article = {
    picture: file ? file.filename : body[`old-image`],
    announce: body.announcement,
    fullText: body[`full-text`],
    title: body.title,
    categories: ensureArray(body.category),
    userId: user.id
  };

  try {
    await api.createArticle(article);
    res.redirect(`/my`);
  } catch (errors) {
    const categories = await api.getCategories();
    article.categories = article.categories.map((item) => ({id: +item}));
    const validationMessages = prepareErrors(errors);
    const action = Action.ADD;
    res.render(`post`, {article, categories, validationMessages, action, user, csrfToken: req.csrfToken()});
  }
}));

articlesRouter.post(`/edit/:id`, authAuthor, upload.single(`upload`), csrfProtection, asyncHandler(async (req, res) => {
  const {user} = req.session;
  const {id} = req.params;
  const {body, file} = req;
  const article = {
    picture: file ? file.filename : body[`old-image`],
    announce: body.announcement,
    fullText: body[`full-text`],
    title: body.title,
    categories: ensureArray(body.category),
    userId: user.id
  };

  try {
    await api.editArticle(id, article);
    res.redirect(`/my`);
  } catch (errors) {
    const categories = await api.getCategories();
    article.categories = article.categories.map((item) => ({id: +item}));
    const validationMessages = prepareErrors(errors);
    const action = `${Action.EDIT}/${id}`;
    res.render(`post`, {article, categories, validationMessages, action, user, csrfToken: req.csrfToken()});
  }
}));

articlesRouter.get(`/category/:id`, (req, res) => {
  const {user} = req.session;
  res.render(`articles-by-category`, {user});
});

articlesRouter.get(`/add`, authAuthor, csrfProtection, asyncHandler(async (req, res) => {
  const {user} = req.session;
  const article = {
    picture: ``,
    announce: ``,
    fullText: ``,
    title: ``,
    categories: [],
  };
  const action = Action.ADD;
  const categories = await api.getCategories();
  res.render(`post`, {article, categories, action, user, csrfToken: req.csrfToken()});
}));

articlesRouter.get(`/edit/:id`, authAuthor, csrfProtection, asyncHandler(async (req, res) => {
  const {user} = req.session;
  const {id} = req.params;
  const [article, categories] = await Promise.all([
    api.getArticle(id),
    api.getCategories()
  ]);
  const action = `${Action.EDIT}/${id}`;
  res.render(`post`, {id, article, categories, action, user, csrfToken: req.csrfToken()});
}));

articlesRouter.get(`/:id`, csrfProtection, asyncHandler(async (req, res) => {
  const {user} = req.session;
  const {id} = req.params;
  const [article, categories] = await Promise.all([
    api.getArticle(id, true),
    api.getCategories(true)
  ]);
  res.render(`post-detail`, {id, article, categories, user, csrfToken: req.csrfToken()});
}));

articlesRouter.post(`/:id/comments`, auth, upload.single(`message`), csrfProtection, asyncHandler(async (req, res) => {
  const {user} = req.session;
  const {id} = req.params;
  const {message} = req.body;

  const commentData = {
    userId: user.id,
    text: cutLongString(message, MAX_COMMENT_STRING)
  };

  try {
    await api.createComment(id, commentData);
    res.redirect(`/articles/${id}`);
  } catch (errors) {
    const validationMessages = prepareErrors(errors);
    const [article, categories] = await Promise.all([
      api.getArticle(id, true),
      api.getCategories(true)
    ]);
    res.render(`post-detail`, {id, article, categories, message, validationMessages, user, csrfToken: req.csrfToken()});
  }
}));

module.exports = articlesRouter;
