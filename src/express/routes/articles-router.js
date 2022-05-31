'use strict';

const {Router} = require(`express`);
const api = require(`../api`).getAPI();
const multer = require(`multer`);
const path = require(`path`);
const {nanoid} = require(`nanoid`);
const {ensureArray, prepareErrors} = require(`../../utils`);
const asyncHandler = require(`express-async-handler`);
const {Action} = require(`../../constants`);

const MAX_COMMENT_STRING = 100;

const cutLongString = (string, maxlength) => {
  return string.length > maxlength ? `${string.slice(0, maxlength - 1)}…` : string;
};

const UPLOAD_DIR = `../upload/img/`;
const uploadDirAbsolute = path.resolve(__dirname, UPLOAD_DIR);

const articlesRouter = new Router();

const storage = multer.diskStorage({
  destination: uploadDirAbsolute,
  filename: (req, file, cb) => {
    const uniqueName = nanoid(10);
    const extension = file.originalname.split(`.`).pop();
    cb(null, `${uniqueName}.${extension}`);
  }
});

const upload = multer({storage});

articlesRouter.post(`/add`, upload.single(`upload`), asyncHandler(async (req, res) => {
  const {body, file} = req;
  const article = {
    picture: file ? file.filename : body[`old-image`],
    announce: body.announcement,
    fullText: body[`full-text`],
    title: body.title,
    categories: ensureArray(body.category),
  };

  try {
    await api.createArticle(article);
    res.redirect(`/my`);
  } catch (errors) {
    const categories = await api.getCategories();
    article.categories = article.categories.map((item) => ({id: +item}));
    const validationMessages = prepareErrors(errors);
    const action = Action.ADD;
    res.render(`post`, {article, categories, validationMessages, action});
  }
}));

articlesRouter.post(`/edit/:id`, upload.single(`upload`), asyncHandler(async (req, res) => {
  const {id} = req.params;
  const {body, file} = req;
  const article = {
    picture: file ? file.filename : body[`old-image`],
    announce: body.announcement,
    fullText: body[`full-text`],
    title: body.title,
    categories: ensureArray(body.category),
  };

  try {
    await api.editArticle(id, article);
    res.redirect(`/my`);
  } catch (errors) {
    const categories = await api.getCategories();
    article.categories = article.categories.map((item) => ({id: +item}));
    const validationMessages = prepareErrors(errors);
    const action = `${Action.EDIT}/${id}`;
    res.render(`post`, {article, categories, validationMessages, action});
  }
}));

articlesRouter.get(`/category/:id`, (req, res) => res.render(`articles-by-category`));

articlesRouter.get(`/add`, asyncHandler(async (req, res) => {
  const article = {
    picture: ``,
    announce: ``,
    fullText: ``,
    title: ``,
    categories: [],
  };
  const action = Action.ADD;
  const categories = await api.getCategories();
  res.render(`post`, {article, categories, action});
}));

articlesRouter.get(`/edit/:id`, asyncHandler(async (req, res) => {
  const {id} = req.params;
  const [article, categories] = await Promise.all([
    api.getArticle(id),
    api.getCategories()
  ]);
  const action = `${Action.EDIT}/${id}`;
  res.render(`post`, {id, article, categories, action});
}));

articlesRouter.get(`/:id`, asyncHandler(async (req, res) => {
  const {id} = req.params;
  const [article, categories] = await Promise.all([
    api.getArticle(id, true),
    api.getCategories(true)
  ]);
  res.render(`post-detail`, {id, article, categories});
}));

articlesRouter.post(`/:id/comments`, upload.single(`message`), asyncHandler(async (req, res) => {
  const {id} = req.params;
  const {message} = req.body;

  try {
    await api.createComment(id, {text: cutLongString(message, MAX_COMMENT_STRING)});
    res.redirect(`/articles/${id}`);
  } catch (errors) {
    const validationMessages = prepareErrors(errors);
    const [article, categories] = await Promise.all([
      api.getArticle(id, true),
      api.getCategories(true)
    ]);
    res.render(`post-detail`, {id, article, categories, message, validationMessages});
  }
}));

module.exports = articlesRouter;
