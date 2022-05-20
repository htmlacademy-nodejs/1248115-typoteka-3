'use strict';

const {Router} = require(`express`);
const {HttpCode} = require(`../../constants`);
const asyncHandler = require(`express-async-handler`);

const route = new Router();

module.exports = (app, service) => {
  app.use(`/comments`, route);

  route.get(`/`, asyncHandler(async (req, res) => {
    const comments = await service.findTotal();
    res.status(HttpCode.OK)
      .json(comments);
  }));
};
