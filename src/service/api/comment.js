'use strict';

const {Router} = require(`express`);
const {HttpCode, ALLOWED_DOMAIN} = require(`../../constants`);
const asyncHandler = require(`express-async-handler`);
const routeParamsValidator = require(`../middlewares/route-params-validator`);

const route = new Router();

module.exports = (app, service) => {
  app.use(`/comments`, route);

  route.get(`/`, asyncHandler(async (req, res) => {
    if (req.headers[`origin`] === ALLOWED_DOMAIN) {
      res.set({
        'Content-Type': `application/json`,
        'Access-Control-Allow-Origin': `*`,
      });
    }

    const {limit} = req.query;
    const comments = await service.findTotal(limit);
    res.status(HttpCode.OK)
      .json(comments);
  }));


  route.delete(`/:commentId`, routeParamsValidator.validator, async (req, res) => {
    const {commentId} = req.params;

    const deletedComment = await service.drop(commentId);

    if (!deletedComment) {
      return res.status(HttpCode.NOT_FOUND)
        .send(`Not found`);
    }

    const io = req.app.locals.socketio;
    io.emit(`comment:update`);

    return res.status(HttpCode.OK)
      .json(deletedComment);
  });
};
