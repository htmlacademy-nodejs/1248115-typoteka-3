'use strict';

const {Router} = require(`express`);
const {HttpCode} = require(`../../constants`);
const articleValidator = require(`../middlewares/article-validator`);
const articleExist = require(`../middlewares/article-exists`);
const commentValidator = require(`../middlewares/comment-validator`);
const routeParamsValidator = require(`../middlewares/route-params-validator`);
const asyncHandler = require(`express-async-handler`);

module.exports = (app, articleService, commentService) => {
  const route = new Router();

  app.use(`/articles`, route);

  route.get(`/`, asyncHandler(async (req, res) => {
    const {offset, limit, comments} = req.query;
    let result;
    if (limit || offset) {
      result = await articleService.findPage({limit, offset, comments});
    } else {
      result = await articleService.findAll(comments);
    }
    res.status(HttpCode.OK).json(result);
  }));

  route.get(`/:articleId`, [routeParamsValidator, articleExist(articleService)], asyncHandler(async (req, res) => {
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

  route.put(`/:articleId`, [articleValidator.validator, routeParamsValidator, articleExist(articleService)], asyncHandler(async (req, res) => {
    const {articleId} = req.params;
    const updated = await articleService.update(articleId, req.body);

    if (!updated) {
      return res.status(HttpCode.NOT_FOUND)
        .send(`Not found with ${articleId}`);
    }

    return res.status(HttpCode.OK)
        .send(`Updated`);
  }));

  route.delete(`/:articleId`, routeParamsValidator, asyncHandler(async (req, res) => {
    const {articleId} = req.params;
    const article = await articleService.drop(articleId);

    if (!article) {
      return res.status(HttpCode.NOT_FOUND)
        .send(`Not found`);
    }

    return res.status(HttpCode.OK)
      .json(article);
  }));

  route.get(`/:articleId/comments`, [routeParamsValidator, articleExist(articleService)], asyncHandler(async (req, res) => {
    const {articleId} = req.params;
    const comments = await commentService.findAll(articleId);

    res.status(HttpCode.OK)
      .json(comments);

  }));

  route.delete(`/:articleId/comments/:commentId`, [routeParamsValidator, articleExist(articleService)], asyncHandler(async (req, res) => {
    const {commentId} = req.params;
    const deleted = await commentService.drop(commentId);

    if (!deleted) {
      return res.status(HttpCode.NOT_FOUND)
        .send(`Not found`);
    }

    return res.status(HttpCode.OK)
      .json(deleted);
  }));

  route.post(`/:articleId/comments`, [routeParamsValidator, articleExist(articleService), commentValidator.validator], asyncHandler(async (req, res) => {
    const {articleId} = req.params;
    const comment = await commentService.create(articleId, req.body);

    return res.status(HttpCode.CREATED)
      .json(comment);
  }));
};
