'use strict';

const {Router} = require(`express`);
const api = require(`../api`).getAPI();
const multer = require(`multer`);
const path = require(`path`);
const {nanoid} = require(`nanoid`);
const {ensureArray} = require(`../../utils`);
const asyncHandler = require(`express-async-handler`);

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
    picture: file ? file.filename : ``,
    announce: body.announcement,
    fullText: body[`full-text`],
    title: body.title,
    categories: ensureArray(body.category),
  };
  try {
    await api.createArticle(article);
    res.redirect(`/my`);
  } catch (error) {
    const categories = await api.getCategories();
    article.categories = article.categories.map((item) => ({id: +item}));
    res.render(`post`, {article, categories});
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
  const categories = await api.getCategories();
  res.render(`post`, {article, categories});
}));

articlesRouter.get(`/edit/:id`, asyncHandler(async (req, res) => {
  const {id} = req.params;
  const [article, categories] = await Promise.all([
    api.getArticle(id),
    api.getCategories()
  ]);
  res.render(`post`, {article, categories});
}));

articlesRouter.get(`/:id`, asyncHandler(async (req, res) => {
  const {id} = req.params;
  const [article, categories] = await Promise.all([
    api.getArticle(id, true),
    api.getCategories(true)
  ]);
  res.render(`post-detail`, {article, categories});
}));

module.exports = articlesRouter;
