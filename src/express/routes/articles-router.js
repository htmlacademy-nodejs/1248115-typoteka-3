"use strict";

const {Router} = require(`express`);
const api = require(`../api`).getAPI();
const multer = require(`multer`);
const path = require(`path`);
const {nanoid} = require(`nanoid`);

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

articlesRouter.post(`/add`, upload.single(`upload`), async (req, res) => {
  const {body, file} = req;
  const ArticleData = {
    picture: file ? file.filename : ``,
    createdDate: body.date,
    announce: body.announcement,
    fullText: body[`full-text`],
    title: body.title,
    category: Object.keys(body.category),
  };
  try {
    await api.createArticle(ArticleData);
    res.redirect(`/my`);
  } catch (error) {
    res.redirect(`/articles/add`);
  }
});

articlesRouter.get(`/category/:id`, (req, res) => res.render(`articles-by-category`));
//articlesRouter.get(`/add`, (req, res) => res.render(`post`));
articlesRouter.get(`/add`, async (req, res) => {
  const article = {
    createdDate: ``,
    announce: ``,
    fullText: ``,
    title: ``,
    category: [],
  };
  const categories = await api.getCategories();
  res.render(`post`, {article, categories});
});

articlesRouter.get(`/edit/:id`, async (req, res) => {
  const {id} = req.params;
  const [article, categories] = await Promise.all([
    api.getArticle(id),
    api.getCategories()
  ]);
  //const article = await api.getArticle(id);
  res.render(`post`, {article, categories});
});

articlesRouter.get(`/:id`, async (req, res) => {
  const {id} = req.params;
  //const [article, categories] = await Promise.all([
  //  api.getArticle(id),
  //  api.getCategories()
  //]);
  const article = await api.getArticle(id);
  res.render(`post-detail`, {article});
});

//-articlesRouter.get(`/edit/:id`, (req, res) => res.render(`post-detail`));
//-articlesRouter.get(`/:id`, (req, res) => res.render(`post-detail`));

module.exports = articlesRouter;
