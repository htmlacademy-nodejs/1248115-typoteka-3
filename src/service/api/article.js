'use strict';

const {Router} = require(`express`);
const {HttpCode, ALLOWED_DOMAIN} = require(`../../constants`);
const articleValidator = require(`../middlewares/article-validator`);
const articleExist = require(`../middlewares/article-exists`);
const commentValidator = require(`../middlewares/comment-validator`);
const routeParamsValidator = require(`../middlewares/route-params-validator`);
const asyncHandler = require(`express-async-handler`);

module.exports = (app, articleService, commentService) => {
  const route = new Router();

  app.use(`/articles`, route);

  route.get(`/`, asyncHandler(async (req, res) => {

    if (req.headers[`origin`] === ALLOWED_DOMAIN) {
      res.set({
        'Content-Type': `application/json`,
        'Access-Control-Allow-Origin': `*`,
      });
    }

    const {offset, limitPage, comments, limitSection} = req.query;
    let articles = {};

    if (limitPage || offset) {
      articles.current = await articleService.findPage(limitPage, offset, comments);
    } else {
      articles.current = await articleService.findAll(comments);
    }

    articles.commented = await articleService.findLimit(limitSection, comments);

    res.status(HttpCode.OK).json(articles);
  }));

  route.get(`/:articleId`, [routeParamsValidator.validator, articleExist(articleService)], asyncHandler(async (req, res) => {
    const {articleId} = req.params;
    const {comments} = req.query;
    const article = await articleService.findOne(articleId, comments);

    if (!article) {
      return res.status(HttpCode.NOT_FOUND)
        .send(`Not found with ${articleId}`);
    }

    return res.status(HttpCode.OK)
      .json(article);
  }));

  route.post(`/`, articleValidator.validator, asyncHandler(async (req, res) => {
    const article = await articleService.create(req.body);

    return res.status(HttpCode.CREATED)
      .json(article);
  }));

  route.put(`/:articleId`, [articleValidator.validator, routeParamsValidator.validator, articleExist(articleService)], asyncHandler(async (req, res) => {
    const {articleId} = req.params;
    const updated = await articleService.update(articleId, req.body);

    if (!updated) {
      return res.status(HttpCode.NOT_FOUND)
        .send(`Not found with ${articleId}`);
    }

    return res.status(HttpCode.OK)
      .send(`Updated`);
  }));

  route.delete(`/:articleId`, routeParamsValidator.validator, asyncHandler(async (req, res) => {
    const {articleId} = req.params;

    const article = await articleService.drop(articleId);

    if (!article) {
      return res.status(HttpCode.NOT_FOUND)
        .send(`Not found`);
    }

    return res.status(HttpCode.OK)
      .json(article);
  }));

  route.get(`/:articleId/comments`, [routeParamsValidator.validator, articleExist(articleService)], asyncHandler(async (req, res) => {
    const {articleId} = req.params;
    const comments = await commentService.findAll(articleId);

    res.status(HttpCode.OK)
      .json(comments);

  }));

  route.post(`/:articleId/comments`, [routeParamsValidator.validator, articleExist(articleService), commentValidator.validator], asyncHandler(async (req, res) => {
    const {articleId} = req.params;
    const comment = await commentService.create(articleId, req.body);

    const io = req.app.locals.socketio;
    io.emit(`comment:update`);

    return res.status(HttpCode.CREATED)
      .json(comment);
  }));
};
